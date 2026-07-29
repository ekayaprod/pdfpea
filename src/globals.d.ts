// Global type declarations for external libraries

declare global {
  interface Window {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    PDFLib: any;
    pdfjsLib: any;
    Moveable: any;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const PDFLib: any;
  const pdfjsLib: any;
  const Moveable: any;
}

export {};
