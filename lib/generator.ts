
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import fontkit from '@pdf-lib/fontkit';

import { fetchFontBuffer } from '@/lib/fonts';

interface GenerationConfig {
    templateUrl: string;
    data: any[];
    mappings: Record<string, string>; // holderId -> columnName
    objects: any[]; // Fabric objects to get coordinates
    canvasWidth: number;
    canvasHeight: number;
    exportFormat?: 'pdf' | 'jpg';
    exportStructure?: 'individual' | 'merged';
}


export async function generateCertificates({
    templateUrl,
    data,
    mappings,
    objects,
    canvasWidth,
    canvasHeight,
    exportFormat = 'pdf',
    exportStructure = 'individual'
}: GenerationConfig) {
    const zip = new JSZip();

    // Load the template (PDF or Image)
    const templateBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());

    // Check if it's a PDF (Magic number: %PDF)
    const isPdf = String.fromCharCode(...new Uint8Array(templateBytes.slice(0, 4))) === '%PDF';

    let pdfDoc: PDFDocument;

    // We need to prepare the "base" document structure depending on input
    if (isPdf) {
        // It's a PDF, we will load it for each row (or load once and copy, but copying enables edits)
        // Optimization: Load once, then copyPages for each row? 
        // For now, to ensure isolation, we can assume we load the base.
        // Actually, we need to load it fresh or modify a copy.
        // Let's stick to the current loop structure but handle the image case.
    }

    // 1. Identify Unique Fonts
    const usedFonts = new Set<string>();
    objects.forEach(obj => {
        if ((obj.type === 'i-text' || obj.type === 'text') && obj.fontFamily) {
            usedFonts.add(obj.fontFamily);
        }
    });

    // 2. Fetch Font Buffers
    const fontBuffers: Record<string, ArrayBuffer> = {};
    for (const fontFamily of usedFonts) {
        if (fontFamily !== 'Helvetica' && fontFamily !== 'Times New Roman' && fontFamily !== 'Courier') {
            const buffer = await fetchFontBuffer(fontFamily);
            if (buffer) {
                fontBuffers[fontFamily] = buffer;
            }
        }
    }

    // --- NEW LOGIC START ---

    let mergedPdfDoc: PDFDocument | null = null;
    if (exportFormat === 'pdf' && exportStructure === 'merged') {
        mergedPdfDoc = await PDFDocument.create();
        mergedPdfDoc.registerFontkit(fontkit);
    }

    // We'll iterate through each data row
    for (let i = 0; i < data.length; i++) {
        const row = data[i];

        // For individual mode, we create a fresh doc each time.
        // For merged mode, we create a temp doc to render the page, then copy it to the merged doc.
        // Why temp doc? Because we might need to load the template PDF each time if it's a PDF template.

        let currentDoc: PDFDocument;
        if (isPdf) {
            currentDoc = await PDFDocument.load(templateBytes);
        } else {
            currentDoc = await PDFDocument.create();
            // Embed Image
            let image;
            try {
                image = await currentDoc.embedPng(templateBytes);
            } catch {
                image = await currentDoc.embedJpg(templateBytes);
            }
            const page = currentDoc.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }

        currentDoc.registerFontkit(fontkit);

        // Embed Fonts (Optimization: In merged mode, we could embed once, but pdf-lib copyPages handles this)
        const embeddedFonts: Record<string, any> = {};
        embeddedFonts['Helvetica'] = await currentDoc.embedFont(StandardFonts.Helvetica);

        for (const [family, buffer] of Object.entries(fontBuffers)) {
            try {
                embeddedFonts[family] = await currentDoc.embedFont(buffer);
            } catch (e) {
                console.warn(`Failed to embed font ${family}`, e);
                embeddedFonts[family] = embeddedFonts['Helvetica'];
            }
        }

        const page = currentDoc.getPages()[0];
        const { width, height } = page.getSize();
        const scaleX = width / canvasWidth;
        const scaleY = height / canvasHeight;

        // Draw Text
        for (const obj of objects) {
            if ((obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') && obj.mappedColumn) {
                const textValue = row[obj.mappedColumn] || '';
                if (!textValue) continue;

                const fontFamily = obj.fontFamily || 'Helvetica';
                const font = embeddedFonts[fontFamily] || embeddedFonts['Helvetica'];

                let x = obj.x !== undefined ? obj.x : obj.left;
                let y = obj.y !== undefined ? obj.y : obj.top;

                // Legacy Fabric Origin
                if (obj.originX === 'center') x -= (obj.width || 0) / 2;
                if (obj.originY === 'center') y -= (obj.height || 0) / 2;

                let pdfX = x * scaleX;
                const boxWidth = (obj.width || 0) * scaleX;
                const fontSize = (obj.fontSize || 20) * scaleY;
                const pdfY = height - (y * scaleY) - (fontSize * 0.8);

                const colorHex = obj.fill as string || '#000000';
                let r = 0, g = 0, b = 0;
                if (colorHex.startsWith('#')) {
                    r = parseInt(colorHex.slice(1, 3), 16) / 255;
                    g = parseInt(colorHex.slice(3, 5), 16) / 255;
                    b = parseInt(colorHex.slice(5, 7), 16) / 255;
                }

                let textWidth = 0;
                try {
                    textWidth = font.widthOfTextAtSize(textValue, fontSize);
                    console.log(`[Generator] Text: ${textValue}, Font: ${fontFamily}, Size: ${fontSize}, Width: ${textWidth}`);
                } catch (e) {
                    console.error("[Generator] Error measuring text width:", e);
                }

                console.log(`[Generator] Align: ${obj.align}, X: ${x} -> PDFX: ${pdfX}, BoxW: ${boxWidth}`);

                if (obj.align === 'center') {
                    const offset = (boxWidth - textWidth) / 2;
                    console.log(`[Generator] Centering Offset: ${offset}`);
                    pdfX += offset;
                } else if (obj.align === 'right') {
                    pdfX += boxWidth - textWidth;
                }

                page.drawText(textValue, {
                    x: pdfX,
                    y: pdfY,
                    size: fontSize,
                    font: font,
                    color: rgb(r, g, b)
                });
            }
        }

        // --- SAVE / MERGE LOGIC ---

        if (exportFormat === 'pdf' && exportStructure === 'merged') {
            // Copy page to merged doc
            const [copiedPage] = await mergedPdfDoc!.copyPages(currentDoc, [0]);
            mergedPdfDoc!.addPage(copiedPage);
        } else if (exportFormat === 'pdf') {
            // Individual PDF
            const pdfBytes = await currentDoc.save();
            zip.file(`Certificate-${i + 1}-${row.Name || 'user'}.pdf`, pdfBytes);
        } else if (exportFormat === 'jpg') {
            // JPG Export
            // Since pdf-lib can't export to JPG, we actually save the PDF bytes here
            // and relying on the FACT that we can't do this purely server-side (headless) easily without canvas.
            // BUT, wait, we are client-side in the browser executing this.
            // We can use pdfjs-dist to render THIS `pdfBytes` to a canvas and get a blob.

            const pdfBytes = await currentDoc.save();

            // We need to render this PDF page to an image.
            // Dynamic import pdfjs
            try {
                // Dynamically load to avoid SSR issues if any
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

                const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);

                // Render to canvas
                const viewport = page.getViewport({ scale: 2 }); // 2x scale for better quality
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport: viewport } as any).promise;

                    // Canvas to Blob
                    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
                    if (blob) {
                        zip.file(`Certificate-${i + 1}-${row.Name || 'user'}.jpg`, blob);
                    }
                }
            } catch (e) {
                console.error("JPG Conversion failed", e);
                // Fallback to PDF if JPG fails? Or valid zip with error log?
                zip.file(`Certificate-${i + 1}-ERROR.txt`, "Failed to convert to JPG: " + e);
            }
        }
    }

    // Finalize
    if (exportFormat === 'pdf' && exportStructure === 'merged' && mergedPdfDoc) {
        const mergedBytes = await mergedPdfDoc.save();
        saveAs(new Blob([mergedBytes as any], { type: 'application/pdf' }), 'certificates-merged.pdf');
    } else {
        // Individual PDFs or JPGs -> ZIP
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `certificates-${exportFormat}.zip`);
    }
}
