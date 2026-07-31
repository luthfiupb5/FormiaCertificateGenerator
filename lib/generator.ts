import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import fontkit from '@pdf-lib/fontkit';
import { fetchFontBuffer } from '@/lib/fonts';

interface GenerationConfig {
    templateUrl: string;
    data: any[];
    mappings: Record<string, string>;
    objects: any[];
    canvasWidth: number;
    canvasHeight: number;
    exportFormat?: 'pdf' | 'jpg';
    exportStructure?: 'individual' | 'merged';
    onProgress?: (percent: number) => void;
}

// Convert SVG Data URL or remote URL to clean ArrayBuffer ONCE
async function prepareTemplateBytes(templateUrl: string): Promise<{ bytes: ArrayBuffer; isPdf: boolean }> {
    if (templateUrl.startsWith('data:image/svg+xml')) {
        const img = new Image();
        img.src = templateUrl;
        await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width || 1200;
        canvas.height = img.height || 850;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
        }
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
        if (blob) {
            const buf = await blob.arrayBuffer();
            return { bytes: buf, isPdf: false };
        }
    }

    const res = await fetch(templateUrl);
    const bytes = await res.arrayBuffer();
    const isPdf = String.fromCharCode(...new Uint8Array(bytes.slice(0, 4))) === '%PDF';
    return { bytes, isPdf };
}

export async function generateCertificates({
    templateUrl,
    data,
    objects,
    canvasWidth,
    canvasHeight,
    exportFormat = 'pdf',
    exportStructure = 'individual',
    onProgress
}: GenerationConfig) {
    if (onProgress) onProgress(5);

    const zip = new JSZip();
    const rows = data.length > 0 ? data : [{}];

    // ── 1. PRE-LOAD TEMPLATE ONCE ──
    const { bytes: templateBytes, isPdf } = await prepareTemplateBytes(templateUrl);
    if (onProgress) onProgress(15);

    // ── 2. PRE-FETCH FONTS ONCE ──
    const usedFonts = new Set<string>();
    objects.forEach(obj => {
        if ((obj.type === 'i-text' || obj.type === 'text') && obj.fontFamily) {
            usedFonts.add(obj.fontFamily);
        }
    });

    const fontBuffers: Record<string, ArrayBuffer> = {};
    for (const fontFamily of usedFonts) {
        if (fontFamily !== 'Helvetica' && fontFamily !== 'Times New Roman' && fontFamily !== 'Courier') {
            const buffer = await fetchFontBuffer(fontFamily);
            if (buffer) {
                fontBuffers[fontFamily] = buffer;
            }
        }
    }
    if (onProgress) onProgress(25);

    // ── 3. PRE-BUILD MASTER PDF TEMPLATE & EMBED FONTS ONCE ──
    const masterDoc = await PDFDocument.create();
    masterDoc.registerFontkit(fontkit);

    const masterFonts: Record<string, any> = {};
    masterFonts['Helvetica'] = await masterDoc.embedFont(StandardFonts.Helvetica);

    for (const [family, buffer] of Object.entries(fontBuffers)) {
        try {
            masterFonts[family] = await masterDoc.embedFont(buffer);
        } catch {
            masterFonts[family] = masterFonts['Helvetica'];
        }
    }

    let masterTemplateDoc: PDFDocument;
    if (isPdf) {
        masterTemplateDoc = await PDFDocument.load(templateBytes);
    } else {
        masterTemplateDoc = await PDFDocument.create();
        let image;
        try {
            image = await masterTemplateDoc.embedPng(templateBytes);
        } catch {
            image = await masterTemplateDoc.embedJpg(templateBytes);
        }
        const p = masterTemplateDoc.addPage([image.width, image.height]);
        p.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    if (onProgress) onProgress(35);

    // ── 4. ULTRA-FAST BATCH GENERATION ──
    let mergedPdfDoc: PDFDocument | null = null;
    if (exportFormat === 'pdf' && exportStructure === 'merged') {
        mergedPdfDoc = await PDFDocument.create();
        mergedPdfDoc.registerFontkit(fontkit);
    }

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        // Yield control every 10 items so UI updates live
        if (i % 10 === 0) {
            const pct = 35 + Math.round(((i + 1) / rows.length) * 55);
            if (onProgress) onProgress(pct);
            await new Promise(r => setTimeout(r, 0));
        }

        // Clone base template page
        const currentDoc = await PDFDocument.create();
        currentDoc.registerFontkit(fontkit);

        const [copiedBasePage] = await currentDoc.copyPages(masterTemplateDoc, [0]);
        const page = currentDoc.addPage(copiedBasePage);

        // Embed pre-cached fonts for this doc instance
        const embeddedFonts: Record<string, any> = {};
        embeddedFonts['Helvetica'] = await currentDoc.embedFont(StandardFonts.Helvetica);
        for (const [family, buffer] of Object.entries(fontBuffers)) {
            try {
                embeddedFonts[family] = await currentDoc.embedFont(buffer);
            } catch {
                embeddedFonts[family] = embeddedFonts['Helvetica'];
            }
        }

        const { width, height } = page.getSize();
        const scaleX = width / canvasWidth;
        const scaleY = height / canvasHeight;

        // Draw Text Fields
        for (const obj of objects) {
            if ((obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') && obj.mappedColumn) {
                const textValue = String(row[obj.mappedColumn] || '');
                if (!textValue) continue;

                const fontFamily = obj.fontFamily || 'Helvetica';
                const font = embeddedFonts[fontFamily] || embeddedFonts['Helvetica'];

                let x = obj.x !== undefined ? obj.x : obj.left;
                let y = obj.y !== undefined ? obj.y : obj.top;

                if (obj.originX === 'center') x -= (obj.width || 0) / 2;
                if (obj.originY === 'center') y -= (obj.height || 0) / 2;

                let pdfX = x * scaleX;
                const boxWidth = (obj.width || 0) * scaleX;
                const fontSize = (obj.fontSize || 20) * scaleY;
                const pdfY = height - (y * scaleY) - (fontSize * 0.8);

                const colorHex = (obj.fill as string) || '#000000';
                let r = 0, g = 0, b = 0;
                if (colorHex.startsWith('#')) {
                    r = parseInt(colorHex.slice(1, 3), 16) / 255;
                    g = parseInt(colorHex.slice(3, 5), 16) / 255;
                    b = parseInt(colorHex.slice(5, 7), 16) / 255;
                }

                let textWidth = 0;
                try {
                    textWidth = font.widthOfTextAtSize(textValue, fontSize);
                } catch {
                    textWidth = 0;
                }

                if (obj.align === 'center') {
                    pdfX += (boxWidth - textWidth) / 2;
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

        // Save into merged PDF or ZIP archive
        if (exportFormat === 'pdf' && exportStructure === 'merged') {
            const [copiedPage] = await mergedPdfDoc!.copyPages(currentDoc, [0]);
            mergedPdfDoc!.addPage(copiedPage);
        } else if (exportFormat === 'pdf') {
            const pdfBytes = await currentDoc.save();
            const nameVal = row.Name || row.First_Name || row[Object.keys(row)[0]] || `Row-${i + 1}`;
            zip.file(`Certificate-${i + 1}-${String(nameVal).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`, pdfBytes);
        }
    }

    if (onProgress) onProgress(95);

    // ── 5. FINALIZE & DOWNLOAD ──
    if (exportFormat === 'pdf' && exportStructure === 'merged' && mergedPdfDoc) {
        const mergedBytes = await mergedPdfDoc.save();
        saveAs(new Blob([mergedBytes as any], { type: 'application/pdf' }), 'certificates-merged.pdf');
    } else {
        const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 4 } });
        saveAs(content, `certificates-${exportFormat}.zip`);
    }

    if (onProgress) onProgress(100);
}
