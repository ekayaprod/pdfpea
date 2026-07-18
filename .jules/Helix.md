# Helix - The Molecular Centrifuge Journal
**Current Task:** [TRANSFORMER] Queue - Refactor `src/js/PDFGenerator.js` to break down into smaller helper functions / collapse logic.
**Target File:** `src/js/PDFGenerator.js`

## Plan:
I will use High-Pressure Vertical Reduction of `src/js/PDFGenerator.js`. The `agent_tasks.md` specifically calls out: `src/js/PDFGenerator.js: 698 lines. Break down into smaller helper functions.` (Wait, the instructions say I am a Transformer, but my role is Helix. The tasks board says: Refactor PDFGenerator.js in the refactorer queue. Oh, wait, the refactorer queue said `Break down into smaller helper functions.`. My role is to collapse imperative logic into functional pipelines, inline single-use variables, and strip tautological comments.)

Since my target limit is 3-5 structural collapses, I will identify sprawling imperative blocks, verbose assignment mirrors, and single-use scaffolding variables within `src/js/PDFGenerator.js`.

Let's look at `generatePDF`, `getImageType`, and the `for` loops in `generatePDF`, as well as `drawSvgImageOnPage`.
