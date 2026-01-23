
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
}


export async function generateCertificates({
    templateUrl,
    data,
    mappings,
    objects,
    canvasWidth,
    canvasHeight,
}: GenerationConfig) {
    const zip = new JSZip();

    // Load the template PDF (once)
    const existingPdfBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());

    // 1. Identify Unique Fonts
    const usedFonts = new Set<string>();
    objects.forEach(obj => {
        if (obj.type === 'i-text' && obj.fontFamily) {
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

    // We'll iterate through each data row
    for (let i = 0; i < data.length; i++) {
        const row = data[i];

        // Load PDF
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);

        // Embed Fonts for this document instance
        const embeddedFonts: Record<string, any> = {};

        // Standard Fonts
        embeddedFonts['Helvetica'] = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Custom Fonts
        for (const [family, buffer] of Object.entries(fontBuffers)) {
            try {
                embeddedFonts[family] = await pdfDoc.embedFont(buffer);
            } catch (e) {
                console.warn(`Failed to embed font ${family}`, e);
                // Fallback
                embeddedFonts[family] = embeddedFonts['Helvetica'];
            }
        }

        // Get first page (assuming single page cert for now)
        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();

        // Calculate scale factor (Fabric Canvas -> PDF Page)
        const scaleX = width / canvasWidth;
        const scaleY = height / canvasHeight;

        // Iterate through objects to find text mappings
        for (const obj of objects) {
            if (obj.type === 'i-text' && obj.mappedColumn) {
                const columnName = obj.mappedColumn;
                const textValue = row[columnName] || '';

                if (!textValue) continue;

                // Determine Font
                const fontFamily = obj.fontFamily || 'Helvetica';
                const font = embeddedFonts[fontFamily] || embeddedFonts['Helvetica'];

                // Calculate PDF Coordinates
                let x = obj.left;
                let y = obj.top;

                // Adjust for Origin
                if (obj.originX === 'center') x -= obj.width / 2;
                if (obj.originY === 'center') y -= obj.height / 2;

                // Scale
                const pdfX = x * scaleX;
                const pdfY = height - (y * scaleY) - (obj.height * scaleY); // Flip Y

                // Draw Text
                const fontSize = (obj.fontSize || 20) * scaleY;
                const colorHex = obj.fill as string;
                const r = parseInt(colorHex.slice(1, 3), 16) / 255;
                const g = parseInt(colorHex.slice(3, 5), 16) / 255;
                const b = parseInt(colorHex.slice(5, 7), 16) / 255;

                page.drawText(textValue, {
                    x: pdfX,
                    y: pdfY + (obj.height * scaleY * 0.8), // Baseline adjustment rough approx
                    size: fontSize,
                    font: font,
                    color: rgb(r, g, b)
                });
            }
        }

        // Save
        const pdfBytes = await pdfDoc.save();
        const fileName = `Certificate-${i + 1}.pdf`;

        zip.file(fileName, pdfBytes);
    }

    // Generate ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'certificates.zip');
}
