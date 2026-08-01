// 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
/**
 * Parses a PDF data URL, stripping the "data:application/pdf;base64," prefix and decoding the base64 string into binary data.
 * * Historical Intent: Extracted and centralized via PR #184 (commit 29fef6d, Jul 2026) to handle raw PDF data processing efficiently.
 */
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
