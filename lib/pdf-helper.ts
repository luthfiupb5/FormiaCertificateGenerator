export async function renderPdfToImage(file: File): Promise<{ url: string; width: number; height: number; originalWidth: number; originalHeight: number }> {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // Dynamic import to avoid SSR issues
        const pdfjsModule = await import('pdfjs-dist');
        // Handle different export shapes (ESM vs CJS)
        const pdfjsLib = pdfjsModule.default || pdfjsModule;

        // Ensure version is clean for CDN
        const version = pdfjsLib.version;
        const workerSrc = `//unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;

        if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        }

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Render first page only

        // Scale: 3 for high quality (standard PDF is 72dpi, 3x is 216dpi which is decent for screen)
        // We can adjust based on performance.
        const scale = 2.0;
        const viewport = page.getViewport({ scale });

        // Original dimensions (unscaled)
        const originalViewport = page.getViewport({ scale: 1.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Canvas context could not be created');
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport: viewport,
        } as any).promise;

        // Export to Blob URL (efficient) or Data URL
        // Data URL is easier for Fabric.js usually
        const url = canvas.toDataURL('image/png');

        return {
            url,
            width: viewport.width,
            height: viewport.height,
            originalWidth: originalViewport.width,
            originalHeight: originalViewport.height
        };
    } catch (error) {
        console.error("Error rendering PDF:", error);
        throw error;
    }
}
