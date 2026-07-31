// Global type declarations for external libraries

declare global {
  /* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
    PDFLib: any;
    pdfjsLib: any;
    Moveable: any;
  }

  const PDFLib: any;
  const pdfjsLib: any;
  const Moveable: any;
}

export {};
