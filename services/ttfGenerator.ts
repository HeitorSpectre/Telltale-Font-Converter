import * as opentype from 'opentype.js';
import { FntData, PngFilesMap, SelectedCharsets } from '../types';
import { CHAR_MAP, CHAR_SETS, CHAR_SET_NAMES } from '../constants';

const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateTtf = async (
  projectName: string, 
  fntData: FntData, 
  pngFiles: PngFilesMap,
  selectedCharsets: SelectedCharsets
): Promise<void> => {
  const pageImages: Record<number, HTMLImageElement> = {};
  for (const pageDef of fntData.pages) {
    const file = pngFiles[pageDef.file];
    if (!file) throw new Error(`Missing PNG file: ${pageDef.file}`);
    pageImages[pageDef.id] = await loadImage(file);
  }

  const contexts: Record<number, CanvasRenderingContext2D> = {};
  for (const id in pageImages) {
    const img = pageImages[id];
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error("Could not create canvas context");
    ctx.drawImage(img, 0, 0);
    contexts[id] = ctx;
  }

  const unitsPerEm = 1000;
  const scale = unitsPerEm / fntData.common.lineHeight;
  const ascender = Math.round(fntData.common.base * scale);
  const descender = -Math.round((fntData.common.lineHeight - fntData.common.base) * scale);
  
  const glyphs = [];
  
  let allowedChars = "";
  for (const name of CHAR_SET_NAMES) {
      if (selectedCharsets[name]) {
          allowedChars += CHAR_SETS[name];
      }
  }
  const allowedCharsSet = new Set(allowedChars.split(''));

  const notdefPath = new opentype.Path();
  const notdefAdvance = Math.round(unitsPerEm / 2);
  notdefPath.moveTo(0,0);
  notdefPath.lineTo(notdefAdvance, 0);
  notdefPath.lineTo(notdefAdvance, ascender);
  notdefPath.lineTo(0, ascender);
  notdefPath.lineTo(0,0);
  
  const notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: notdefAdvance,
    path: notdefPath
  });
  glyphs.push(notdefGlyph);

  for (const char of fntData.chars) {
    const charCode = char.id;
    const character = CHAR_MAP[charCode];

    if (!character || !allowedCharsSet.has(character) || char.width === 0 || char.height === 0) {
      continue;
    }

    const ctx = contexts[char.page];
    if (!ctx) continue;

    const imageData = ctx.getImageData(char.x, char.y, char.width, char.height);

    const path = new opentype.Path();
    const binaryMatrix: number[][] = [];
    
    for (let y = 0; y < char.height; y++) {
      const row: number[] = [];
      for (let x = 0; x < char.width; x++) {
        // Alpha channel (index 3) is used to determine pixel presence
        const alpha = imageData.data[(y * char.width + x) * 4 + 3];
        // Invert color: black text needs non-transparent pixels. White text source is fine.
        row.push(alpha > 128 ? 1 : 0);
      }
      binaryMatrix.push(row);
    }
    
    for (let y = 0; y < char.height; y++) {
      for (let x = 0; x < char.width; x++) {
        if (binaryMatrix[y][x] === 1) {
          let startX = x;
          while (x + 1 < char.width && binaryMatrix[y][x + 1] === 1) {
            x++;
          }
          let endX = x;
          
          const topOfGlyphInFontUnits = (fntData.common.base - char.yoffset) * scale;
          
          const px1 = (char.xoffset + startX) * scale;
          const py1 = topOfGlyphInFontUnits - y * scale;
          const px2 = (char.xoffset + endX + 1) * scale;
          const py2 = topOfGlyphInFontUnits - (y + 1) * scale;

          path.moveTo(px1, py2);
          path.lineTo(px2, py2);
          path.lineTo(px2, py1);
          path.lineTo(px1, py1);
          path.closePath();
        }
      }
    }
    
    const glyph = new opentype.Glyph({
      name: character,
      unicode: charCode,
      advanceWidth: Math.round(char.xadvance * scale),
      path: path,
    });
    glyphs.push(glyph);
  }
  
  if (glyphs.length <= 1) { // Only .notdef glyph is present
    throw new Error("No valid characters were selected or found in the FNT file to generate a font.");
  }

  const font = new opentype.Font({
    familyName: projectName,
    styleName: 'Regular',
    unitsPerEm: unitsPerEm,
    ascender: ascender,
    descender: descender,
    glyphs: glyphs,
  });

  font.download(`${projectName.replace(/\s/g, '_')}.ttf`);
};