import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates a professional PDF "Acta Final"
 */
export function generatePDF(bankData: any, bookData: any, matchedData: any, netDifference: number, companyName: string, tier: "FREE" | "PRO" | "ENTERPRISE" | "LIFETIME") {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header Minimalista
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(companyName || "AUDITORÍA INTERNA", 20, 25);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("ACTA DE CONCILIACIÓN CERTIFICADA", 20, 32);

    doc.setDrawColor(241, 245, 249); // slate-100
    doc.line(20, 40, pageWidth - 20, 40);

    // 2. Info Bar
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`BANCO: ${bankData?.banco || "BANCARIO"}`, 20, 48);
    doc.text(`FECHA: ${new Date().toLocaleDateString()}`, pageWidth - 20, 48, { align: "right" });

    // 3. Status Minimalista
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(20, 55, pageWidth - 40, 20, 4, 4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text("DIFERENCIA NETA", 30, 67);

    doc.setFontSize(14);
    if (netDifference === 0) {
        doc.setTextColor(16, 185, 129); // emerald-500
    } else {
        doc.setTextColor(244, 63, 94); // rose-500
    }
    doc.text(`$ ${netDifference.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, pageWidth - 30, 67, { align: "right" });

    // 3.1 Resumen Detallado
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const bankTotal = bankData?.verified_totals?.net || 0;
    const bookTotal = bookData?.verified_totals?.net || 0;
    doc.text(`TOTAL BANCO: $ ${bankTotal.toLocaleString()}`, 30, 72);
    doc.text(`TOTAL LIBROS: $ ${bookTotal.toLocaleString()}`, pageWidth - 30, 72, { align: "right" });


    // 4. Tables with matching UI style
    const tableStyles = {
        theme: 'plain' as const,
        headStyles: {
            fillColor: [255, 255, 255] as [number, number, number],
            textColor: [15, 23, 42] as [number, number, number],
            fontSize: 7,
            fontStyle: 'bold' as const,
            cellPadding: 4
        },
        bodyStyles: {
            fontSize: 7,
            textColor: [71, 85, 105] as [number, number, number],
            cellPadding: 4
        },
        alternateRowStyles: { fillColor: [250, 251, 252] as [number, number, number] },
        margin: { left: 20, right: 20 }
    };

    // Calculations
    const totalPendingBank = matchedData.pendingBank.reduce((acc: number, t: any) => acc + (t.amount || 0), 0);
    const totalPendingBook = matchedData.pendingBook.reduce((acc: number, t: any) => acc + (t.amount || 0), 0);

    // 4. Tables with matching UI style
    // ... (tableStyles defined above)

    // A. Matches Table (CONCILIADOS)
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("MOVIMIENTOS CONCILIADOS (CRUZADOS CON ÉXITO)", 20, 85);

    autoTable(doc, {
        ...tableStyles,
        startY: 90,
        head: [['CONCEPTO', 'FECHA', 'MONTO', 'TIPO']],
        body: [
            ...matchedData.matches.map((m: any) => [
                m.bank.description.toUpperCase(),
                m.bank.date,
                `$ ${(m.bank.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                (m.type || 'perfecto').toUpperCase()
            ]),
        ],
    });

    // B. Bank Table
    const bankTableY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("PENDIENTES BANCO (DÉBITOS EXTRACTO)", 20, bankTableY);

    autoTable(doc, {
        ...tableStyles,
        startY: bankTableY + 5,
        head: [['CONCEPTO', 'FECHA', 'MONTO']],
        body: [
            ...matchedData.pendingBank.map((t: any) => [
                t.description.toUpperCase(),
                t.date,
                `$ ${(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            ]),
            [{ content: 'TOTAL PENDIENTES BANCO', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold' } },
            { content: `$ ${totalPendingBank.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, styles: { fontStyle: 'bold' } }]
        ],
    });

    // Book Table
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("PENDIENTES LIBRO (AJUSTES AUXILIAR)", 20, finalY);

    autoTable(doc, {
        ...tableStyles,
        startY: finalY + 5,
        head: [['CONCEPTO', 'FECHA', 'MONTO']],
        body: [
            ...matchedData.pendingBook.map((t: any) => [
                t.description.toUpperCase(),
                t.date,
                `$ ${(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            ]),
            [{ content: 'TOTAL PENDIENTES LIBRO', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold' } },
            { content: `$ ${totalPendingBook.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, styles: { fontStyle: 'bold' } }]
        ],
    });

    // 5. Signature Section
    const checkY = (doc as any).lastAutoTable.finalY + 30;
    const pageHeight = doc.internal.pageSize.getHeight();

    // Ensure signature isn't cut off
    const signatureY = checkY > pageHeight - 50 ? pageHeight - 50 : checkY;

    doc.setDrawColor(203, 213, 225); // slate-300
    doc.line(20, signatureY, 90, signatureY);
    doc.line(pageWidth - 90, signatureY, pageWidth - 20, signatureY);

    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("FIRMA RESPONSABLE / AUDITOR", 20, signatureY + 5);
    doc.text("REVISADO / GERENCIA", pageWidth - 20, signatureY + 5, { align: "right" });

    // 6. Footer Professional with Tier Logic
    const bottomY = pageHeight - 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    if (tier === "FREE") {
        // Marca de agua diagonal
        doc.setFontSize(40);
        doc.setTextColor(241, 245, 249); // slate-100 (muy sutil)
        doc.setFont("helvetica", "bold");
        doc.text("CONCILIAI GRATIS", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });

        // Aviso inferior prominente
        doc.setFontSize(8);
        doc.setTextColor(79, 70, 229); // indigo-600
        doc.text("ESTE REPORTE FUE GENERADO CON LA VERSIÓN GRATUITA DE CONCILIAI", pageWidth / 2, bottomY, { align: "center" });
        doc.text("PARA ELIMINAR ESTA MARCA Y PERSONALIZAR EMPRESA, ACTUALICE A PRO EN CONCILIA.AI", pageWidth / 2, bottomY + 5, { align: "center" });
    } else {
        doc.text("Este documento es una representación digital de la auditoría realizada mediante ConciliAI Professional.", pageWidth / 2, bottomY, { align: "center" });
        const certId = `ID CERTIFICACIÓN: ${Math.random().toString(36).substring(2).toUpperCase()} - FECHA: ${new Date().toLocaleString()}`;
        doc.text(certId, pageWidth / 2, bottomY + 5, { align: "center" });
    }

    doc.save(`Auditoria_${companyName.replace(/\s+/g, "_") || "ConciliAI"}.pdf`);
}

/**
 * Generates a clean CSV grouped by comparison
 */
export function generateCSV(bankData: any, bookData: any, matchedData: any, companyName: string, tier: "FREE" | "PRO" | "ENTERPRISE" | "LIFETIME") {
    const bom = "\uFEFF";
    const d = ","; // Universal delimiter
    
    // Universal headers and metadata
    let csv = `${bom}`;
    csv += `"PROYECTO"${d}"CONCILIAI (AUDIT)"\n`;
    csv += `"EMPRESA"${d}"${(companyName || "S/N").replace(/"/g, '""')}"\n`;
    csv += `"FECHA EXPORT"${d}"${new Date().toISOString()}"\n`;
    csv += `"PLAN"${d}"${tier}"\n\n`;
    
    const bankTotal = bankData?.verified_totals?.net || 0;
    const bookTotal = bookData?.verified_totals?.net || 0;
    const netDifference = bankTotal - bookTotal;
    
    // Resumen para humanos (niño de 10 años)
    csv += `"RESUMEN DE TU DINERO"\n`;
    csv += `"DINERO EN BANCO"${d}${(bankTotal || 0).toFixed(2)}${d}"SALDO"\n`;
    csv += `"CONTABILIDAD (LIBROS)"${d}${(bookTotal || 0).toFixed(2)}${d}"SALDO"\n`;
    
    const diff = bankTotal - bookTotal;
    csv += `"RESULTADO FINAL"${d}${diff.toFixed(2)}${d}"${Math.abs(diff) < 0.01 ? "¡TODO CUADRA! ✅" : "HAY UN DESCUADRE ⚠"}"\n\n`;
    
    csv += `"¿QUÉ PASÓ?"${d}"¿DÓNDE?"${d}"CUÁNDO"${d}"CONCEPTO"${d}"CUÁNTO"${d}"REFERENCIA"\n`;
    
    // 1. Matches (Conciliados)
    matchedData.matches.forEach((m: any) => {
        const descBank = (m.bank.description || "").replace(/"/g, '""');
        const descBook = (m.book.description || "").replace(/"/g, '""');
        csv += `"¡TODO CUADRA!"${d}"BANCO"${d}"${m.bank.date}"${d}"${descBank}"${d}${m.bank.amount}${d}"${m.bank.reference || ""}"\n`;
        csv += `"¡TODO CUADRA!"${d}"LIBRO"${d}"${m.book.date}"${d}"${descBook}"${d}${m.book.amount}${d}"${m.book.reference || ""}"\n`;
    });

    // 2. Pending Bank
    matchedData.pendingBank.forEach((t: any) => {
        const desc = (t.description || "").replace(/"/g, '""');
        csv += `"PENDIENTE"${d}"BANCO"${d}"${t.date}"${d}"${desc}"${d}${t.amount}${d}"${t.reference || ""}"\n`;
    });

    // 3. Pending Book
    matchedData.pendingBook.forEach((t: any) => {
        const desc = (t.description || "").replace(/"/g, '""');
        csv += `"PENDIENTE"${d}"LIBRO"${d}"${t.date}"${d}"${desc}"${d}${t.amount}${d}"${t.reference || ""}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Export_${companyName.replace(/\s+/g, "_") || "ConciliAI"}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Generates an export file specifically formatted for accounting software
 */
export function generateSoftwareExport(
    software: string,
    bankData: any,
    bookData: any,
    matchedData: any,
    companyName: string
) {
    const bom = "\uFEFF";
    let csv = `${bom}`;
    let filename = `Export_${software}_${companyName.replace(/\s+/g, "_")}.csv`;
    const d = ",";

    // Common data mapping
    const allTransactions = [
        ...matchedData.matches.map((m: any) => ({ ...m.bank, status: 'CONCILIADO' })),
        ...matchedData.pendingBank.map((t: any) => ({ ...t, status: 'PENDIENTE_BANCO' })),
        ...matchedData.pendingBook.map((t: any) => ({ ...t, status: 'PENDIENTE_LIBRO' }))
    ];

    switch (software) {
        case "SIIGO":
            // Siigo standard format
            csv += `"Fecha"${d}"Tipo"${d}"Número"${d}"Nit"${d}"Cuenta"${d}"Descripción"${d}"Débito"${d}"Crédito"\n`;
            allTransactions.forEach(t => {
                const amount = Number(t.amount) || 0;
                const debito = amount > 0 ? amount : 0;
                const credito = amount < 0 ? Math.abs(amount) : 0;
                csv += `"${t.date}"${d}"CC"${d}"1"${d}"800000000-1"${d}"111005"${d}"${(t.description || "").replace(/"/g, '""')}"${d}${debito}${d}${credito}\n`;
            });
            break;

        case "CONTPAQI":
            // CONTPAQi format (Mexico)
            csv += `"Fecha"${d}"Referencia"${d}"Concepto"${d}"Cargo"${d}"Abono"\n`;
            allTransactions.forEach(t => {
                const amount = Number(t.amount) || 0;
                const cargo = amount > 0 ? amount : 0;
                const abono = amount < 0 ? Math.abs(amount) : 0;
                csv += `"${t.date}"${d}"${(t.reference || "S/R")}"${d}"${(t.description || "").replace(/"/g, '""')}"${d}${cargo}${d}${abono}\n`;
            });
            break;

        case "QUICKBOOKS":
            // QuickBooks Online standard CSV
            csv += `"Date"${d}"Description"${d}"Amount"\n`;
            allTransactions.forEach(t => {
                csv += `"${t.date}"${d}"${(t.description || "").replace(/"/g, '""')}"${d}${t.amount}\n`;
            });
            break;

        case "SOFTLAND":
            // Softland (Chile) typical format
            csv += `"Fecha"${d}"Glosa"${d}"Monto"${d}"Tipo"\n`;
            allTransactions.forEach(t => {
                csv += `"${t.date}"${d}"${(t.description || "").replace(/"/g, '""')}"${d}${t.amount}${d}"${t.status}"\n`;
            });
            break;

        case "HELISA":
            // Helisa (Colombia)
            csv += `"FECHA"${d}"DOCUMENTO"${d}"DESCRIPCION"${d}"DEBITO"${d}"CREDITO"\n`;
            allTransactions.forEach(t => {
                const amount = Number(t.amount) || 0;
                csv += `"${t.date}"${d}"1"${d}"${(t.description || "").replace(/"/g, '""')}"${d}${amount > 0 ? amount : 0}${d}${amount < 0 ? Math.abs(amount) : 0}\n`;
            });
            break;

        default:
            // Fallback to universal CSV
            return generateCSV(bankData, bookData, matchedData, companyName, "PRO");
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.click();
}
