Fixed no-unused-expressions warnings in src/js/PDFGenerator.js by converting standalone ternary expressions to if/else blocks.
- Solved the 'page.render' race condition by awaiting the RenderTask.promise in pdfjs-dist v5+.
- Resolved a critical PDF race condition by removing the concurrent `Array.from` map which invoked multiple asynchronous PDF rendering contexts concurrently. Replaced with sequential PDF page rendering queue in `src/js/PDFEditor.js`, preventing web worker deadlocks and preserving mathematically pure return constraints.
