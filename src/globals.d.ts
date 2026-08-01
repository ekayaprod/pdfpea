// Global type declarations for external libraries
/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
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
