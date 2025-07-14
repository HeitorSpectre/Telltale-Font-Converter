
import { FntData, FntInfo, FntCommon, FntPage, FntChar } from '../types';

function parseKeyValue(line: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /(\w+)=("([^"]*)"|([^ ]+))/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    result[match[1]] = match[3] !== undefined ? match[3] : match[4];
  }
  return result;
}

export function parseFnt(fntContent: string): FntData {
  const lines = fntContent.split('\n');
  
  let info: FntInfo | null = null;
  let common: FntCommon | null = null;
  const pages: FntPage[] = [];
  const chars: FntChar[] = [];

  for (const line of lines) {
    const parts = line.trim().split(' ');
    const type = parts[0];
    const data = parseKeyValue(line);

    if (type === 'info') {
      info = {
        face: data.face,
        size: parseInt(data.size, 10),
      };
    } else if (type === 'common') {
      common = {
        lineHeight: parseInt(data.lineHeight, 10),
        base: parseInt(data.base, 10),
        pages: parseInt(data.pages, 10),
      };
    } else if (type === 'page') {
      pages.push({
        id: parseInt(data.id, 10),
        file: data.file,
      });
    } else if (type === 'char') {
      chars.push({
        id: parseInt(data.id, 10),
        x: parseInt(data.x, 10),
        y: parseInt(data.y, 10),
        width: parseInt(data.width, 10),
        height: parseInt(data.height, 10),
        xoffset: parseInt(data.xoffset, 10),
        yoffset: parseInt(data.yoffset, 10),
        xadvance: parseInt(data.xadvance, 10),
        page: parseInt(data.page, 10),
      });
    }
  }

  if (!info || !common) {
    throw new Error('Invalid .fnt file: missing "info" or "common" line.');
  }

  return { info, common, pages, chars };
}