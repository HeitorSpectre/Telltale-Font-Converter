// This file provides basic type definitions for 'opentype.js' to satisfy TypeScript.

declare module 'opentype.js' {
    export interface BoundingBox {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }

    export class Path {
        constructor();
        commands: any[];
        fill: string | null;
        stroke: string | null;
        strokeWidth: number;
        
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        curveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): void;
        quadTo(x1: number, y1: number, x: number, y: number): void;
        closePath(): void;
        getBoundingBox(): BoundingBox;
        draw(ctx: CanvasRenderingContext2D, x?: number, y?: number, fontSize?: number, options?: any): void;
    }

    export interface GlyphOptions {
        name: string;
        unicode: number;
        advanceWidth: number;
        path: Path;
        [key: string]: any;
    }

    export class Glyph {
        constructor(options: GlyphOptions);
        name: string;
        unicode: number;
        advanceWidth: number;
        path: Path;
        index: number;

        getMetrics(): {
            xMin: number;
            xMax: number;
            yMin: number;
            yMax: number;
            leftSideBearing?: number;
            rightSideBearing?: number;
            advanceWidth?: number;
        };
        getPath(x: number, y: number, fontSize: number): Path;
        draw(ctx: CanvasRenderingContext2D, x?: number, y?: number, fontSize?: number, options?: any): void;
    }
    
    export interface FontOptions {
        familyName: string;
        styleName: string;
        unitsPerEm: number;
        ascender: number;
        descender: number;
        glyphs: Glyph[];
        [key: string]: any;
    }

    export class Font {
        constructor(options: FontOptions);
        names: {
            fontFamily: { [lang: string]: string };
            [key: string]: any;
        };
        unitsPerEm: number;
        ascender: number;
        descender: number;
        lineGap: number;
        tables: {
            os2?: {
                sTypoAscender?: number;
                sTypoDescender?: number;
                sTypoLineGap?: number;
                [key: string]: any;
            };
            [key: string]: any;
        };

        charToGlyph(char: string): Glyph;
        download(fileName?: string): void;
    }

    export function parse(buffer: ArrayBuffer | any, options?: any): Font;
}