
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

    // We'll iterate through each data row
    for (let i = 0; i < data.length; i++) {
        const row = data[i];

        if (isPdf) {
            pdfDoc = await PDFDocument.load(templateBytes);
        } else {
            // Create new PDF for Image Template
            pdfDoc = await PDFDocument.create();

            // Embed Image first to get dimensions
            let image;
            try {
                image = await pdfDoc.embedPng(templateBytes);
            } catch {
                image = await pdfDoc.embedJpg(templateBytes);
            }

            // Create page with matching image dimensions
            const page = pdfDoc.addPage([image.width, image.height]);

            // Draw Image as Background
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height
            });
        }

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

        // Get first page
        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();

        // Calculate scale factor
        // If it was an image we created with canvasWidth/Height, scale is 1.
        // If it was a PDF, we scale to match.
        const scaleX = width / canvasWidth;
        const scaleY = height / canvasHeight;

        // Iterate through objects to find text mappings
        for (const obj of objects) {
            // Support both old Fabric 'i-text'/'textbox' and new Konva 'text'
            // Konva objects from store should have mappedColumn directly
            if ((obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') && obj.mappedColumn) {
                const columnName = obj.mappedColumn;
                const textValue = row[columnName] || '';

                if (!textValue) continue;

                // Determine Font
                const fontFamily = obj.fontFamily || 'Helvetica';
                const font = embeddedFonts[fontFamily] || embeddedFonts['Helvetica'];

                // Calculate PDF Coordinates
                // Konva uses x/y as top-left by default for Text
                let x = obj.x !== undefined ? obj.x : obj.left;
                let y = obj.y !== undefined ? obj.y : obj.top;

                // Legacy Fabric Origin Adjustment
                if (obj.originX === 'center') x -= (obj.width || 0) / 2;
                if (obj.originY === 'center') y -= (obj.height || 0) / 2;

                let pdfX = x * scaleX;
                const boxWidth = (obj.width || 0) * scaleX;

                // PDF Y is from bottom-left. Canvas is from top-left.
                const fontSize = (obj.fontSize || 20) * scaleY;
                const pdfY = height - (y * scaleY) - (fontSize * 0.8);

                const colorHex = obj.fill as string || '#000000';
                let r = 0, g = 0, b = 0;
                if (colorHex.startsWith('#')) {
                    r = parseInt(colorHex.slice(1, 3), 16) / 255;
                    g = parseInt(colorHex.slice(3, 5), 16) / 255;
                    b = parseInt(colorHex.slice(5, 7), 16) / 255;
                }

                // Handle Alignment (Center/Right)
                // pdf-lib draws from left X. We need to offset X based on text width.
                let textWidth = 0;
                try {
                    textWidth = font.widthOfTextAtSize(textValue, fontSize);
                } catch (e) {
                    console.warn("Could not measure text width", e);
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

        // Save
        const pdfBytes = await pdfDoc.save();
        const fileName = `Certificate-${i + 1}.pdf`;

        zip.file(fileName, pdfBytes);
    }

    // Generate ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'certificates.zip');
}
