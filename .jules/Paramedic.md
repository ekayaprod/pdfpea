## Paramedic Refactoring Journal\n\n- **Target:** `src/js/PDFGenerator.js`\n- **Symptom:** Performance degradation and output file bloat when executing sequential `pdfDoc.copyPages()` in a loop within `generatePDF`.\n- **Shift Executed:** Replaced the `for` loop of `pdfDoc.copyPages` with a batch operation. Accumulated `pageIndices` during form updates, then fired a single `pdfDoc.copyPages(srcDoc, pageIndices)` call to collapse the N+1 performance bottleneck.\n- **Result:** Native tests passing. Semantic generation logic verified via reviewer.
- Converted concurrent Promise.all calls to sequential for...of loops in PDFGenerator.js

### Task Execution Journal
* **Target:** `src/App.vue`
* **Defect Class:** Catastrophic Halt (ReferenceError: IMAGE_PATHS is not defined during component compilation/boot due to invalid syntax - import outside script tag).
* **Mutation Applied:** Moved `import { IMAGE_PATHS } from "./js/utils/constants.js";` from the top of the file (before `<template>`) to inside the `<script lang="ts">` block to fix Vue compilation error.
* **Verification:** Clean Execution Check passed (server started without console errors). Native tests passing.
