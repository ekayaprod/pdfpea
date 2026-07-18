# Helix Journal

## Axioms
- Density is clarity.
- Focus on `src/js/PDFGenerator.js` to find imperative loops and redundant variables to collapse.
- Only apply if reduction is >30%.
- Respect max 120 line width.
- Check O(n) implications.

## Targets
- [x] Collapse imperative `for` loops filtering arrays in `generatePDF` (e.g. `updateOperations` nested loops).
- [ ] Collapse imperative `for` loops handling SVG paths in `drawSvgImageOnPage` if applicable.
