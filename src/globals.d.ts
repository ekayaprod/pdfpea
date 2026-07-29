// Global type declarations for external libraries

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PDFLib: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfjsLib: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Moveable: any;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PDFLib: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Moveable: any;
}

export {};
