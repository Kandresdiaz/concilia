import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
    try {
        const { content, type } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "No content provided" }, { status: 400 });
        }

        console.log(`[CSV-Extractor] Intentando extracción $0. Tipo sugerido: ${type}`);

        // Limit to 100 rows to enforce free tier rules but keeping logic fast for pro too (client decides chunking)
        let parsedRows: any[] = [];
        let skippedRows = 0;
        
        // Ejecutar PapaParse de manera sincrónica para Vercel Functions
        const results = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
        });

        if (results.errors.length > 0) {
            console.warn(`[CSV-Extractor] Warnings en parseo:`, results.errors[0]);
        }

        const rawData = results.data as any[];
        
        // Filtramos filas vacías
        for (const row of rawData) {
            if (Object.keys(row).length < 2) {
                skippedRows++;
            } else {
                parsedRows.push(row);
                if (parsedRows.length > 5000) break; // Hard limit de seguridad
            }
        }

        console.log(`[CSV-Extractor] Parsed ${parsedRows.length} rows, skipped ${skippedRows}`);

        // Basic detection logic (0 cost)
        let transactions = [];
        const isStripe = parsedRows.some(r => r.id?.startsWith("po_") || r.id?.startsWith("ch_") || r.description?.toLowerCase().includes("stripe"));
        const isLemonSqueezy = parsedRows.some(r => r["Order ID"] || r["Refund amount"]);
        
        if (isStripe) {
            transactions = parsedRows.map(r => ({
                id: r.id || crypto.randomUUID(),
                date: r.created || r.available_on || r.Created || new Date().toISOString(),
                description: r.description || "Stripe Payout",
                amount: parseFloat(r.net || r.amount || r.Amount || "0"),
                type: (parseFloat(r.net || r.amount || r.Amount || "0") > 0) ? "INCOME" : "EXPENSE",
                reference: r.id
            })).filter(t => !isNaN(t.amount));
        } else if (isLemonSqueezy) {
            transactions = parsedRows.map(r => {
                const total = parseFloat(r.Total || r["Order Total"] || "0");
                const refund = parseFloat(r["Refund amount"] || "0");
                return {
                    id: r["Order ID"] || crypto.randomUUID(),
                    date: r["Created At"] || r.Date || new Date().toISOString(),
                    description: `LemonSqueezy Order ${r["Order ID"]}`,
                    amount: refund > 0 ? -refund : total,
                    type: refund > 0 ? "EXPENSE" : "INCOME",
                    reference: r["Order ID"]
                };
            }).filter(t => !isNaN(t.amount));
        } else {
             // Fallback to AI for unknown structures
             return NextResponse.json({ 
                 useAi: true, 
                 message: "Formato desconocido, requiere IA" 
             });
        }

        return NextResponse.json({
            transactions,
            isDirectExtraction: true,
            processedRows: transactions.length
        });

    } catch (error: any) {
        console.error("CSV Extractor Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
