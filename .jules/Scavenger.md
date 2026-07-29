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

## Tier 5: Orphaned Entities
* `src/js/utils/constants/constants.js`
  * Removed: `export const IMAGE_PATHS` (Identified by Knip as unused export).
