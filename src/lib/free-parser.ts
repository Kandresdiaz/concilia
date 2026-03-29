/**
 * Parser de transacciones basado en código (Hheurístico)
 * Este parser no gasta créditos de IA y funciona para extractos digitales (no escaneados).
 */

import { parseCurrency } from "./utils";

export interface Transaction {
    date: string;
    description: string;
    amount: number;
    reference?: string;
}

export function parseTransactionsFromText(text: string): Transaction[] {
    const transactions: Transaction[] = [];
    const lines = text.split('\n');

    // Regex básica para detectar fechas (DD/MM/AAAA, DD-MM-AA, etc.)
    const dateRegex = /(\d{2}[/-]\d{2}[/-]\d{2,4})/;

    // Regex para detectar montos (números con puntos y comas)
    // Intentamos capturar el último número de la línea que suele ser el saldo o el monto
    const amountRegex = /([-+]?[\d.,]+)/g;

    for (const line of lines) {
        const dateMatch = line.match(dateRegex);
        if (!dateMatch) continue;

        const date = dateMatch[0];

        // Limpiamos la línea para extraer la descripción
        // Quitamos la fecha de la línea
        let remaining = line.replace(date, '').trim();

        // Buscamos montos en el resto de la línea
        const amounts = remaining.match(amountRegex);

        if (amounts && amounts.length >= 1) {
            // Normalmente en un extracto, el monto de la transacción es uno de los últimos valores
            // pero esto varía por banco. Heurística: buscamos el valor que no sea el saldo final de la línea.
            // Para un convertidor genérico "free", tomaremos el último valor numérico como candidato.

            const lastAmountStr = amounts[amounts.length - 1];
            const amount = parseCurrency(lastAmountStr);

            // La descripción es lo que queda quitando los montos
            let description = remaining;
            amounts.forEach(amt => {
                description = description.replace(amt, '');
            });

            description = description.replace(/\|/g, '').trim();

            if (Math.abs(amount) > 0 && description.length > 3) {
                transactions.push({
                    date,
                    description: description.substring(0, 100),
                    amount
                });
            }
        }
    }

    return transactions;
}

