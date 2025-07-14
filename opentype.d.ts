// This file tells TypeScript that the 'opentype.js' module exists,
// even though it's a JavaScript library without its own type declarations.
// This resolves the TS7016 build error.
declare module 'opentype.js';
