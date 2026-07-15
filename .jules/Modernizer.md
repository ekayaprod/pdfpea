# Syntax Shift Ledger

## Applied Shifts

1. **The Async Sequence Conversion:**
   - Flattned chained `.then()` structures into `async/await` after verifying no synchronous side effects existed in the chain.
   - Targets refactored: `src/App.vue`, `src/js/PDFEditor.js`, `src/js/PDFGenerator.js`

2. **The Agnostic Nullish Coalescing:**
   - Replaced loose logical OR (`||`) fallbacks with strict nullish coalescing (`??`) for configuration and parameter defaults where zeroes or empty strings were valid.
   - Guard condition successfully avoided cases where `parseInt` returned `NaN` (which is falsy but not nullish, e.g., `parseInt(operation.borderWidth) || 0`).
   - Targets refactored: `src/js/PDFEditor.js`, `src/js/PDFGenerator.js`
