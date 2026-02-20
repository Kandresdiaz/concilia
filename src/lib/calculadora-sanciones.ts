export interface PenaltyResult {
    totalPenalty: number;
    monthsDelay: number;
    baseCalculation: number;
    isMinimum: boolean;
    minimumApplied: number;
}

export function calculateExtemporaneousPenalty(
    dueDate: Date,
    filingDate: Date,
    taxAmount: number,
    uvtValue: number = 49786
): PenaltyResult {
    if (filingDate <= dueDate) {
        return {
            totalPenalty: 0,
            monthsDelay: 0,
            baseCalculation: 0,
            isMinimum: false,
            minimumApplied: 0
        };
    }

    // Calcular meses o fracción de mes
    const diffTime = Math.abs(filingDate.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Un mes contable suele contarse por fechas
    let months = (filingDate.getFullYear() - dueDate.getFullYear()) * 12;
    months -= dueDate.getMonth();
    months += filingDate.getMonth();

    // Si el día de presentación es mayor al de vencimiento, es fracción de mes adicional
    if (filingDate.getDate() > dueDate.getDate()) {
        months += 1;
    }

    // Caso especial: si están en el mismo mes pero días distintos
    if (months === 0 && filingDate > dueDate) {
        months = 1;
    }

    // 5% por mes o fracción
    const percentage = months * 0.05;
    let baseCalculation = taxAmount * percentage;

    // Límite del 100% del impuesto
    if (baseCalculation > taxAmount) {
        baseCalculation = taxAmount;
    }

    // Sanción mínima (10 UVT)
    const minimumPenalty = uvtValue * 10;
    const isMinimum = baseCalculation < minimumPenalty;
    const totalPenalty = isMinimum ? minimumPenalty : baseCalculation;

    return {
        totalPenalty,
        monthsDelay: months,
        baseCalculation,
        isMinimum,
        minimumApplied: minimumPenalty
    };
}
