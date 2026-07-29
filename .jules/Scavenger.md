# Scavenger Excision Ledger

## Tier 3: Fossilized Debris
* `src/js/OperationComponents/TextOperationComponent.js`
  * Removed: `//this.shadow.style.height = 'auto';`
  * Removed: `//this.shadow.style.overflow = 'visible';`

## Tier 5: Orphaned Entities
* `src/js/OperationComponents/index.js`
  * Removed: `export { BasicOperationComponent } from "./BasicOperationComponent.js";` (Identified by Knip as unused export).
### Scavenger Execution Log
* Executed full codebase sweep for tier 1-5 necrotic code.
* 🪹 Swept `src/App.vue` and removed an empty `} else {` structural shell block on line 2505 without disturbing the living logic.
* ✂️ Picked `src/js/PDFEditor.js` clean of `IMAGE_PATHS` package import whose internal logic had been entirely outsourced, leaving zero syntactic footprints.
* Verified mutations incrementally with `npm run test` and `npm run test:e2e`.
\n* Executed Scavenger sweep to clean up dead code and fix linting errors.\n* Removed unused variables in `src/App.vue`, `src/globals.d.ts`, and operation component spec files.\n* Converted unused expressions to variable assignments/blocks in `src/js/PDFGenerator.js`.\n* Cleaned up mock assignments in `src/js/PDFGenerator.spec.js`.\n* Deleted unused exports (`COLORS`, `FONTS`, `OPERATION_TYPES`, `IMAGE_SIGNATURES`) in `src/js/utils/constants/constants.js`.\n* Removed unused `mountedApp` assignment in `src/main.js`.
