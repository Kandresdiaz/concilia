export async function extractTextFromPdf(data: ArrayBuffer): Promise<string> {
    // Dynamic import to avoid SSR issues
    const pdfjs = await import('pdfjs-dist');

    // Set worker path using JSDelivr (More reliable for ESM)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const loadingTask = pdfjs.getDocument({
        data,
        useWorkerFetch: true,
        isEvalSupported: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => (item as any).str || "")
            .join(" ");
        fullText += pageText + "\n";
    }

    return fullText.trim();
}
