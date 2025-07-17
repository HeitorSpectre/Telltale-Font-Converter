

import * as opentype from 'opentype.js';
import { SelectedCharsets } from '../types';
import { CHAR_SET_NAMES, CHAR_SETS } from '../constants';

const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const generateFntAndPng = async (
  font: opentype.Font,
  projectName: string,
  fontSize: number,
  selectedCharsets: SelectedCharsets,
  atlasWidth: number = 1024,
  atlasHeight: number = 1024,
  spacing: number = 2 // Spacing between glyphs on the atlas
): Promise<void> => {
    let charsToRender = "";
    CHAR_SET_NAMES.forEach(name => {
        if (selectedCharsets[name]) {
            charsToRender += CHAR_SETS[name];
        }
    });
    const uniqueChars = Array.from(new Set(charsToRender.split(''))).sort();

    const pages: { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }[] = [];
    let currentPageIndex = -1;
    let atlasCtx: CanvasRenderingContext2D;

    const addNewPage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = atlasWidth;
        canvas.height = atlasHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Cannot create canvas context for a new atlas page.');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, atlasWidth, atlasHeight);
        pages.push({ canvas, ctx });
        currentPageIndex++;
        atlasCtx = ctx;
    };
    
    addNewPage();

    const fntCharsData: any[] = [];
    let currentX = spacing;
    let currentY = spacing;
    let maxYInRow = 0;

    const scale = fontSize / font.unitsPerEm;
    const safeAscender = font.ascender || 0;
    const safeDescender = font.descender || 0;
    const safeLineGap = font.lineGap || 0;

    const ascender = font.tables.os2?.usWinAscent ?? safeAscender;
    const descender = -(font.tables.os2?.usWinDescent ?? Math.abs(safeDescender));
    const lineGap = font.tables.os2?.sTypoLineGap ?? safeLineGap;

    const base = Math.round(ascender * scale);
    const lineHeight = Math.round((ascender - descender + lineGap) * scale);

    if (isNaN(lineHeight) || isNaN(base) || font.unitsPerEm === 0) {
        throw new Error(`Could not calculate font metrics (lineHeight: ${lineHeight}, base: ${base}, unitsPerEm: ${font.unitsPerEm}). The font file may be corrupt or have missing metrics.`);
    }

    const GLYPH_PADDING = 1;

    for (const char of uniqueChars) {
        const glyph = font.charToGlyph(char);
        if (!glyph || glyph.index === 0) continue;

        const metrics = glyph.getMetrics();
        if (metrics.xMax === undefined || metrics.xMin === undefined || metrics.yMax === undefined || metrics.yMin === undefined) {
            if (glyph.advanceWidth > 0) {
                fntCharsData.push({
                    id: char.charCodeAt(0), x: 0, y: 0, width: 0, height: 0,
                    xoffset: 0, yoffset: 0, xadvance: Math.round(glyph.advanceWidth * scale), page: 0
                });
            }
            continue;
        }
        
        const glyphWidth = Math.ceil((metrics.xMax - metrics.xMin) * scale);
        
        if (glyphWidth <= 0) {
            if (glyph.advanceWidth > 0) {
                 fntCharsData.push({
                    id: char.charCodeAt(0), x: 0, y: 0, width: 0, height: 0,
                    xoffset: 0, yoffset: 0, xadvance: Math.round(glyph.advanceWidth * scale), page: currentPageIndex
                });
            }
            continue;
        }

        const canvasWidth = glyphWidth + GLYPH_PADDING * 2;
        const canvasHeight = lineHeight; // Use fixed height for all character cells

        if (canvasWidth > atlasWidth || canvasHeight > atlasHeight) {
             console.warn(`Skipping character '${char}' because its size (${canvasWidth}x${canvasHeight}) exceeds the atlas size (${atlasWidth}x${atlasHeight}).`);
             continue;
        }
        
        if (currentX + canvasWidth + spacing > atlasWidth) {
            currentX = spacing;
            currentY += maxYInRow + spacing;
            maxYInRow = 0;
        }

        if (currentY + canvasHeight + spacing > atlasHeight) {
            addNewPage();
            currentX = spacing;
            currentY = spacing;
            maxYInRow = 0;
        }
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;
        tempCtx.imageSmoothingEnabled = false;

        // Draw the glyph onto the fixed-height canvas, using `base` as the baseline
        const path = glyph.getPath(
            -metrics.xMin * scale + GLYPH_PADDING,
            base, // Set baseline position from the top of the canvas
            fontSize
        );
        path.fill = '#FFFFFF';
        path.stroke = null;
        path.draw(tempCtx);

        pages[currentPageIndex].ctx.drawImage(tempCanvas, currentX, currentY);

        fntCharsData.push({
            id: char.charCodeAt(0),
            x: currentX,
            y: currentY,
            width: canvasWidth,
            height: canvasHeight, // Use fixed canvasHeight
            xoffset: Math.round(metrics.xMin * scale),
            yoffset: Math.round(base - (metrics.yMax * scale)),
            xadvance: Math.round(glyph.advanceWidth * scale),
            page: currentPageIndex
        });

        currentX += canvasWidth + spacing;
        if (canvasHeight > maxYInRow) {
            maxYInRow = canvasHeight;
        }
    }

    const safeProjectName = projectName.replace(/"/g, '');
    const fntLines = [
        `info face="${safeProjectName}" size=${fontSize} bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=${GLYPH_PADDING},${GLYPH_PADDING},${GLYPH_PADDING},${GLYPH_PADDING} spacing=${spacing},${spacing} outline=0`,
        `common lineHeight=${lineHeight} base=${base} scaleW=${atlasWidth} scaleH=${atlasHeight} pages=${pages.length} packed=0 alphaChnl=1 redChnl=4 greenChnl=4 blueChnl=4`,
    ];

    pages.forEach((_, i) => {
        const pageFileName = pages.length > 1 ? `${safeProjectName}_${i}.png` : `${safeProjectName}.png`;
        fntLines.push(`page id=${i} file="${pageFileName}"`);
    });

    fntLines.push(`chars count=${fntCharsData.length}`);
    fntCharsData.forEach(c => {
        fntLines.push(`char id=${c.id.toString().padEnd(5)} x=${c.x.toString().padEnd(5)} y=${c.y.toString().padEnd(5)} width=${c.width.toString().padEnd(5)} height=${c.height.toString().padEnd(5)} xoffset=${c.xoffset.toString().padEnd(5)} yoffset=${c.yoffset.toString().padEnd(5)} xadvance=${c.xadvance.toString().padEnd(5)} page=${c.page}  chnl=15`);
    });
    const fntContent = fntLines.join('\n');
    
    const fntBlob = new Blob([fntContent], { type: 'text/plain;charset=utf-8' });
    triggerDownload(URL.createObjectURL(fntBlob), `${safeProjectName}.fnt`);

    pages.forEach((page, i) => {
        const pageFileName = pages.length > 1 ? `${safeProjectName}_${i}.png` : `${safeProjectName}.png`;
        page.canvas.toBlob(pngBlob => {
            if (!pngBlob) throw new Error('Failed to create PNG blob for page ' + i);
            triggerDownload(URL.createObjectURL(pngBlob), pageFileName);
        }, 'image/png');
    });
};
