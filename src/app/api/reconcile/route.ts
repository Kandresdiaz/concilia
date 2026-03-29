import { generateAICompletion } from "@/lib/ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ReconcileRequestSchema = z.object({
    text: z.string().optional(),
    image: z.string().optional(),
    country: z.string().optional(),
    shop: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, image, country, shop } = ReconcileRequestSchema.parse(body);

        // --- Marc Lou Optimization: Paywall & Auth Check ---
        const supabase = await createClient();
        let { data: { user } } = await supabase.auth.getUser();

        let profile: any = null;

        if (user) {
            const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            profile = p;
        } else if (shop) {
             // Shopify context: Find profile using admin client (to bypass RLS for non-Supabase auth users)
             const supabaseAdmin = await createClient(true);
             
             // 1. Verify that this shop actually exists and has an active session
             const { data: session } = await supabaseAdmin
                .from("shopify_sessions")
                .select("id")
                .eq("shop", shop)
                .maybeSingle();

             if (session) {
                // 2. Find the profile linked to this shop
                const { data: p } = await supabaseAdmin.from("profiles").select("*").eq("shopify_shop", shop).single();
                profile = p;

                if (profile) {
                    user = { id: profile.id } as any;
                }
             }
        }

        if (!user || !profile) {
            return NextResponse.json({ 
                error: "Debes iniciar sesión para usar la IA.",
                debug: { 
                    shop_received: shop || 'null', 
                    has_user: !!user, 
                    profile_found: !!profile 
                }
            }, { status: 401 });
        }

        let currentUsage = profile?.usage_count || 0;

        // --- 3-Tier Limit Logic ---
        let limit = 3; // Default Gratis (3 Trial)
        if (profile?.tier === "PRO") limit = 50;
        if (profile?.tier === "ENTERPRISE") limit = 300;
        if (profile?.tier === "LIFETIME") limit = 9999;
        if (profile?.plans_usage_limit) limit = profile.plans_usage_limit; // Override if explicitly set in DB

        const isAdmin = profile?.role === "admin" || profile?.role === "superadmin";

        // 1. Lazy Reset: If period expired, reset usage for the new month
        const now = new Date();
        const periodEnd = profile?.current_period_end ? new Date(profile.current_period_end) : new Date(0);

        if (now > periodEnd) {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            await supabase.from("profiles").update({
                usage_count: 0,
                current_period_end: nextMonth.toISOString()
            }).eq("id", user.id);

            currentUsage = 0; // Reset local variable for check below
        }

        // 2. Strict Limit Check (Bypass for Admins)
        if (!isAdmin && currentUsage >= limit) {
            return NextResponse.json({
                error: `Has alcanzado tu límite de ${limit} conciliaciones este mes. Actualiza a PRO para más.`,
                is_limited: true
            }, { status: 402 });
        }

        let messages: any[] = [
            {
                role: "system",
                content: `Eres un experto contable especializado en conciliaciones financieras en Latinoamérica. Tu tarea es extraer datos de extractos bancarios o auxiliares contables con precisión quirúrgica.
          
          Contexto geográfico: El documento es de ${country || "Colombia"}.
          
          Reglas de Extracción (Nivel Auditoría 99.9%):
          1. Formato de Números: Normaliza todos los montos a 'float' estándar. Detecta si usa '.' o ',' para decimales según el país y el documento.
          2. Identificación: Detecta el "banco" y "tipo_documento".
          3. SIGNOS Y COLUMNAS (CRÍTICO):
             - Extracto Bancario: Abono/Crédito (+) | Cargo/Débito (-).
             - Auxiliar Contable (Banco): Débito (+) | Crédito (-).
          4. RESUMEN Y TOTALES (NO CONFUNDIR):
             - Identifica claramente el "saldo_inicial" (inicio del periodo) y el "saldo_actual" (final del periodo).
             - Extrae "total_abonos" (suma de ingresos) y "total_cargos" (suma de egresos).
          5. TRANSACCIONES (SÓLO MOVIMIENTOS):
             - PROHIBIDO incluir el "Saldo Inicial", "Saldo Anterior" o "Saldo del Día Anterior" como una transacción.
             - Si una página empieza con un "Saldo", IGNÓRALO como transacción; solo usa los movimientos reales.
             - description: Limpia (ej: "Traslado a Nequi Raul").
             - amount: Float con signo correcto según la regla 3.
          
          RESPONDE EXCLUSIVAMENTE CON UN JSON VÁLIDO. 
          Estructura: {"banco", "tipo_documento", "empresa", "summary": {"saldo_inicial", "total_abonos", "total_cargos", "saldo_actual"}, "precision_score", "transactions": [{"date", "description", "amount", "reference"}]}.`,
            }
        ];

        if (image) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: "Analiza este documento financiero. Extrae todas las transacciones visibles y los totales de balance. Si hay varias páginas, enfócate en la consistencia." },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
                ],
            });
        } else {
            messages.push({
                role: "user",
                content: text,
            });
        }

        const { content, provider, model } = await generateAICompletion(messages, image);
        console.log(`[Reconcile] Procesado por ${provider} (${model})`);

        const rawData = JSON.parse(content);
        let transactions = rawData.transactions || [];
        const summary = rawData.summary || {};

        // --- Marc Lou Optimization: Anti-Hallucination Filter ---
        const saldoInicial = Math.abs(parseFloat(String(summary.saldo_inicial || 0).replace(/[^0-9.-]/g, "")));

        transactions = transactions.filter((t: any) => {
            const desc = (t.description || "").toLowerCase();
            const amt = Math.abs(typeof t.amount === 'string' ? parseFloat(t.amount.replace(/[^0-9.-]/g, "")) : Number(t.amount || 0));

            // Fuerte exclusión de términos de saldo
            if (desc.includes("saldo") || desc.includes("anterior") || desc.includes("balance inicial") || desc.includes("apertura")) {
                return false;
            }

            // Excluir heurísticamente si el monto es IDÉNTICO al saldo inicial y la descripción es genérica
            if (amt === saldoInicial && amt !== 0 && (desc.length < 5 || desc.includes("transferencia") && !desc.includes("desde") && !desc.includes("a"))) {
                return false;
            }

            return true;
        }).map((t: any) => ({
            ...t,
            amount: typeof t.amount === 'string'
                ? parseFloat(t.amount.replace(/[^0-9.-]/g, ""))
                : Number(t.amount || 0)
        }));

        const total_in = transactions
            .filter((t: any) => t.amount > 0)
            .reduce((sum: number, t: any) => sum + t.amount, 0);

        const total_out = transactions
            .filter((t: any) => t.amount < 0)
            .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

        const calculated_net = total_in - total_out;

        // Validar si el cuadre reportado por la IA coincide con los items extraídos
        const summary_in = Math.abs(Number(summary.total_abonos || 0));
        const summary_out = Math.abs(Number(summary.total_cargos || 0));

        // Tolerancia de 5 centavos
        const is_verified = Math.abs(total_in - summary_in) < 0.05 && Math.abs(total_out - summary_out) < 0.05;

        // --- Marc Lou Optimization: Instant Usage Increment ---
        // Increment usage count immediately. Do not wait for client save.
        await supabase.from("profiles").update({
            usage_count: (profile?.usage_count || 0) + 1
        }).eq("id", user.id);

        return NextResponse.json({
            transactions,
            summary,
            empresa: profile?.tier === "FREE" ? "Usuario ConciliAI" : rawData.empresa,
            banco: rawData.banco,
            tipo_documento: rawData.tipo_documento,
            precision_score: is_verified ? 100 : Math.round(Number(rawData.precision_score || 0) > 1 ? Number(rawData.precision_score) : Number(rawData.precision_score || 0) * 100),
            verified_totals: {
                total_in: Number(total_in.toFixed(2)),
                total_out: Number(total_out.toFixed(2)),
                net: Number(calculated_net.toFixed(2)),
                is_verified
            },
        });
    } catch (error: any) {
        console.error("Reconciliation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process reconciliation" },
            { status: 500 }
        );
    }
}
