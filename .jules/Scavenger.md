# Scavenger Excision Ledger

## Tier 3: Fossilized Debris
* `src/js/OperationComponents/TextOperationComponent.js`
  * Removed: `//this.shadow.style.height = 'auto';`
  * Removed: `//this.shadow.style.overflow = 'visible';`

## Tier 5: Orphaned Entities
* `src/js/OperationComponents/index.js`
  * Removed: `export { BasicOperationComponent } from "./BasicOperationComponent.js";` (Identified by Knip as unused export).
### Scavenger Execution Log
* ✂️ Picked `src/js/PDFEditor.js` clean of `IMAGE_PATHS` import whose internal logic had been entirely outsourced, leaving zero syntactic footprints.
