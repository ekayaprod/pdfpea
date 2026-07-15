Fixed no-unused-expressions warnings in src/js/PDFGenerator.js by converting standalone ternary expressions to if/else blocks.
- Solved the 'page.render' race condition by awaiting the RenderTask.promise in pdfjs-dist v5+.
