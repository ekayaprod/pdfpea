// Global type declarations for external libraries

declare global {
  interface Window {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    PDFLib: any;
    pdfjsLib: any;
    Moveable: any;
  }

  const PDFLib: any;
  const pdfjsLib: any;
  const Moveable: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export {};
