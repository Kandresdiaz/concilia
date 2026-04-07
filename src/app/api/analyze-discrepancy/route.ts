import { generateAICompletion } from "@/lib/ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { pendingBank, pendingBook, companyName } = await req.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const messages = [
            {
                role: "system",
                content: `Eres un Auditor Senior de Contabilidad. Tu objetivo es analizar DE CUIDADOSAMENTE dos listas de transacciones que NO cruzaron (descuadres) y dar una explicación lógica y contable de por qué existe el descuadre.
                
                Busca patrones como:
                1. Comisiones: ¿El banco tiene montos ligeramente menores que el libro? (Ej: $95 vs $100).
                2. Errores de Digitación: ¿Hay un $1.250.000 en un lado y un $1.250 en el otro? (Fallo de miles).
                3. Desfase de fechas: ¿Transacciones de fin de mes que entran en el siguiente?
                4. Omisiones: ¿Facturas en Shopify que no aparecen pagas en el banco?
                
                Instrucciones: 
                - Sé directo y profesional. 
                - Da recomendaciones de ajuste contable.
                - Responde en formato de viñetas claras.
                - No menciones el JSON, habla como si estuvieras viendo el reporte.`
            },
            {
                role: "user",
                content: `Empresa: ${companyName || 'Cliente ConciliAI'}
                
                Transacciones Sobrantes en BANCO (Sin registro en Libro):
                ${JSON.stringify(pendingBank.slice(0, 15))}
                
                Transacciones Sobrantes en LIBRO/SHOPIFY (Sin registro en Banco):
                ${JSON.stringify(pendingBook.slice(0, 15))}
                
                Dime exactamente qué está pasando y qué ajustes debo hacer.`
            }
        ];

        const { content } = await generateAICompletion(messages);

        return NextResponse.json({ insight: content });

    } catch (error: any) {
        console.error("Insight Analysis Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
