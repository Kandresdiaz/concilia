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

    // Convert to string and remove all whitespace and currency symbols
    let clean = String(value).trim().replace(/[^\d,.-]/g, "");

    if (!clean) return 0;

    // Detect if the string has both comma and dot
    const hasComma = clean.includes(",");
    const hasDot = clean.includes(".");

    if (hasComma && hasDot) {
        const lastComma = clean.lastIndexOf(",");
        const lastDot = clean.lastIndexOf(".");

        // The last one is likely the decimal separator
        if (lastComma > lastDot) {
            // Latam style: 1.250.000,00 or 1.250,00
            // Remove all dots (thousands), replace comma with dot (decimal)
            return parseFloat(clean.replace(/\./g, "").replace(",", "."));
        } else {
            // US style: 1,250,000.00 or 1,250.00
            // Remove all commas (thousands)
            return parseFloat(clean.replace(/,/g, ""));
        }
    }

    // Only one type of separator
    if (hasComma) {
        const parts = clean.split(",");
        // If there are multiple commas, they are thousands: 1,250,000
        if (parts.length > 2) {
            return parseFloat(clean.replace(/,/g, ""));
        }
        // One comma. If followed by 2 digits, it's decimal: 100,50
        // Or if it's followed by 3 digits, it's thousands: 1,250 (common in some formats)
        // Check decimals:
        const decimalPart = parts[parts.length - 1];
        if (decimalPart.length === 2) {
            return parseFloat(clean.replace(",", "."));
        }
        // Default to thousands if length is 3 or other
        return parseFloat(clean.replace(/,/g, ""));
    }

    if (hasDot) {
        const parts = clean.split(".");
        // Multiple dots: 1.250.000
        if (parts.length > 2) {
            return parseFloat(clean.replace(/\./g, ""));
        }
        // One dot. heuristic:
        const decimalPart = parts[parts.length - 1];
        // If followed by 2 digits, highly likely decimal: 100.50
        if (decimalPart.length === 2) {
            return parseFloat(clean);
        }
        // If followed by 3 digits, highly likely thousands: 1.250
        if (decimalPart.length === 3) {
            return parseFloat(clean.replace(/\./g, ""));
        }
        // Otherwise use standard parseFloat
        return parseFloat(clean);
    }

    return parseFloat(clean) || 0;
}
