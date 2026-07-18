// 🪴 PROPAGATOR: Propagated WET font embedding logic into a pure parameterized central utility.
export const getEmbeddedFont = async (pdfDoc, fontFamily, PDFLib) => {
  const resolvedFont = fontFamily === "TimesRoman" ? PDFLib.StandardFonts.TimesRoman : fontFamily;
  const fontToEmbed = Object.values(PDFLib.StandardFonts).includes(resolvedFont)
    ? resolvedFont
    : PDFLib.StandardFonts.Helvetica;

  if (!pdfDoc.__fontCache) {
    pdfDoc.__fontCache = new Map();
  }
  let embedFontPromise = pdfDoc.__fontCache.get(fontToEmbed);
  if (!embedFontPromise) {
    embedFontPromise = pdfDoc.embedFont(fontToEmbed);
    pdfDoc.__fontCache.set(fontToEmbed, embedFontPromise);
  }
  return await embedFontPromise;
};
