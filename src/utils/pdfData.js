export function parsePdfData(pdfURL) {
  if (!pdfURL) {
    return pdfURL;
  }

  if (pdfURL.startsWith("data:application/pdf;base64,")) {
    const base64Data = pdfURL.replace("data:application/pdf;base64,", "");
    return atob(base64Data);
  }

  return pdfURL;
}
