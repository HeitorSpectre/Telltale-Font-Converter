
import { CHAR_SET_NAMES } from './constants';

export type AppState = 'setup' | 'fnt_upload' | 'png_upload' | 'processing' | 'generating' | 'done';
export type ConversionMode = 'select' | 'fntToTtf' | 'ttfToFnt';

export type CharSetName = typeof CHAR_SET_NAMES[number];

export type SelectedCharsets = Partial<Record<CharSetName, boolean>>;

export interface FntInfo {
  face: string;
  size: number;
}

export interface FntCommon {
  lineHeight: number;
  base: number;
  pages: number;
}

export interface FntPage {
  id: number;
  file: string;
}

export interface FntChar {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  xoffset: number;
  yoffset: number;
  xadvance: number;
  page: number;
}

export interface FntData {
  info: FntInfo;
  common: FntCommon;
  pages: FntPage[];
  chars: FntChar[];
}

export type PngFilesMap = Record<string, File>;
