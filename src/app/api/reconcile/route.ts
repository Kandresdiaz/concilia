import { groq } from "@/lib/groq";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ReconcileRequestSchema = z.object({
    text: z.string().optional(),
    image: z.string().optional(), // Base64 image
    country: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, image, country } = ReconcileRequestSchema.parse(body);

        // --- Marc Lou Optimization: Paywall & Auth Check ---
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Debes iniciar sesión para usar la IA." }, { status: 401 });
        }

        // Fetch profile to verify tier and usage
        const { data: profile } = await supabase
            .from("profiles")
            .select("tier, usage_count")
            .eq("id", user.id)
            .single();

        if (profile?.tier === "FREE" && (profile?.usage_count || 0) >= 5) {
            return NextResponse.json({
                error: "Límite de plan gratuito alcanzado. Actualiza a PRO para conciliaciones ilimitadas.",
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

        const models = image
            ? ["llama-3.2-90b-vision-preview", "llama-3.2-11b-vision-preview"]
            : ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.1-8b-instant"];

        let completion;
        let lastError;

        for (const model of models) {
            try {
                console.log(`Intentando con modelo: ${model}`);
                completion = await groq.chat.completions.create({
                    messages,
                    model,
                    response_format: { type: "json_object" },
                });
                if (completion) break;
            } catch (err: any) {
                lastError = err;
                if (err.status === 429 || err.status === 503) {
                    console.warn(`Límite alcanzado para ${model}. Intentando siguiente...`);
                    continue;
                }
                throw err; // Otros errores (401, etc) se lanzan inmediato
            }
        }

        if (!completion) {
            throw lastError || new Error("No se pudo obtener respuesta de ningún modelo de IA");
        }

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response from AI");
        }

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

        return NextResponse.json({
            transactions,
            summary,
            empresa: rawData.empresa,
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
