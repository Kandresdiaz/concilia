import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Robust currency parser for Latin American and US formats.
 * Correctly handles dots and commas as thousands or decimal separators.
 */
export function parseCurrency(value: any): number {
    if (typeof value === "number") return value;
    if (!value) return 0;

    // Remove symbols and keep only relevant characters
    let clean = String(value).replace(/[^\d,.-]/g, "");

    // Handle both , and . (e.g., 1.234,56 or 1,234.56)
    if (clean.includes(",") && clean.includes(".")) {
        const lastComma = clean.lastIndexOf(",");
        const lastDot = clean.lastIndexOf(".");

        if (lastComma > lastDot) {
            // Latam style: 1.234,56 -> 1234.56
            return parseFloat(clean.replace(/\./g, "").replace(",", "."));
        } else {
            // US style: 1,234.56 -> 1234.56
            return parseFloat(clean.replace(/,/g, ""));
        }
    }

    // Only one type of separator
    if (clean.includes(",")) {
        // If there's only one comma and it's followed by 2 digits, it's decimal (e.g., 100,50)
        // Except if there's only 1 comma and it's like 10,000 (US style but using comma wrongly? No, that's Latam thousands)
        // Heuristic: if it's N,XXX it's thousands. If it's N,XX it's decimal.
        const parts = clean.split(",");
        if (parts[parts.length - 1].length === 2) {
            return parseFloat(clean.replace(",", "."));
        }
        return parseFloat(clean.replace(/,/g, ""));
    }

    if (clean.includes(".")) {
        const parts = clean.split(".");
        // If multiple dots, it's thousands (e.g., 1.250.000)
        if (parts.length > 2) {
            return parseFloat(clean.replace(/\./g, ""));
        }
        // One dot. If followed by 3 digits, high probability it's thousands in accounting (e.g., 1.250)
        // Especially in Colombia/Spain.
        if (parts[parts.length - 1].length === 3) {
            return parseFloat(clean.replace(/\./g, ""));
        }
        // Otherwise assume decimal (e.g., 100.50)
        return parseFloat(clean);
    }

    return parseFloat(clean) || 0;
}
