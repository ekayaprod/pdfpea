# Scavenger Excision Ledger

## Tier 3: Fossilized Debris
* `src/js/OperationComponents/TextOperationComponent.js`
  * Removed: `//this.shadow.style.height = 'auto';`
  * Removed: `//this.shadow.style.overflow = 'visible';`

## Tier 5: Orphaned Entities
* `src/js/OperationComponents/index.js`
  * Removed: `export { BasicOperationComponent } from "./BasicOperationComponent.js";` (Identified by Knip as unused export).
* `src/App.vue`
  * Removed: Unused `component` variables from `handleImageConfirm`, `handleLinkConfirm`, and `iconTools` logic.
  * Removed: Unused `zoomFactor` and `container` parameters from `updateDrawingOverlay`.
* `src/js/utils/constants.js`
  * Removed: Unused internal constants `FONTS`, `OPERATION_TYPES`, and `IMAGE_SIGNATURES`.

## Tier 2: Orphaned Entities
* `src/js/OperationComponents/BasicOperationComponent.spec.js`
  * Removed: `import Moveable from "moveable";`
* `src/js/OperationComponents/TextOperationComponent.spec.js`
  * Removed: `import Moveable from "moveable";`

Banked for next run: `src/js/PDFEditor.js` (Unused IMAGE_PATHS import)
