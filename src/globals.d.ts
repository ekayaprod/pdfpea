// Global type declarations for external libraries

declare global {
  interface Window {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    PDFLib: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    pdfjsLib: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Moveable: any;
  }

  const /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    PDFLib: any;
  const /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    pdfjsLib: any;
  const /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Moveable: any;
}

export {};
