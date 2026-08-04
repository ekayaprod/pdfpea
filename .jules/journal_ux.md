# Espresso Journal

- Mutated `src/components/ImageDialog.vue` to persist `error` state variable, removing reset state function entirely to prevent amnesiac loop for repeated stamping.
- Mutated `src/components/LinkDialog.vue` to persist state, removing reset state function to prevent amnesiac loop for repeated stamping.
- Mutated `src/App.vue` `handleImageConfirm`, `handleLinkConfirm`, text tool, freehand, line, shapes etc to hoist selection and immediately jump to `selectTool("select")` preserving momentum without amnesiac loops.
- Modified `deleteLayer` to add `document.dispatchEvent(new CustomEvent("pdfeditor.shouldClearAllSelection", ...))` to keep properties panel clear on deletion.
