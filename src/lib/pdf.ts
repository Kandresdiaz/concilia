export async function extractTextFromPdf(data: ArrayBuffer, password?: string): Promise<string> {
    try {
        // Dynamic import to avoid SSR issues
        const pdfjsModule = await import('pdfjs-dist');

        // Handle different export formats (ESM vs CJS)
        const pdfjs: any = (pdfjsModule as any).default || pdfjsModule;

        // Use a fixed stable worker from JSDelivr or Ungkg
        const version = pdfjs.version || '5.4.624';
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

        const loadingTask = pdfjs.getDocument({
            data,
            password,
            useWorkerFetch: true,
            isEvalSupported: false, // Disable eval for better compatibility
        });

        const pdf = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Filter and sort items safely
            const items = (textContent.items as any[]).filter(item => item.str !== undefined && item.transform);

            items.sort((a, b) => {
                const ay = a.transform[5];
                const by = b.transform[5];
                if (Math.abs(ay - by) < 5) {
                    return a.transform[4] - b.transform[4];
                }
                return by - ay;
            });

            let lastY = -1;
            let pageText = "";
            for (const item of items) {
                const currentY = item.transform[5];
                if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
                    pageText += "\n";
                } else if (lastY !== -1) {
                    pageText += " | ";
                }
                pageText += item.str;
                lastY = currentY;
            }

            fullText += `--- PÁGINA ${i} ---\n${pageText}\n\n`;
        }

        return fullText.trim();
    } catch (error: any) {
        console.error("Critical Error in extractTextFromPdf:", error);
        throw new Error(error.message || "No se pudo extraer el texto del PDF. Revisa si el archivo está protegido o dañado.");
    }
}
