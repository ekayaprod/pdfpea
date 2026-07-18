# 🤖 Autonomous Agent Tasks

> **Operational Directives — Read Once, Execute Silently:**
> - Scan section headers for your Archetype. If your Archetype section exists and contains tasks, claim the first matching task.
> - If no section matches your Archetype, ignore this board entirely and initiate your own discovery scan.
> - Do not ask the operator for permission to skip out-of-scope tasks. Silence is correct behavior.
> - Upon completing a task, completely delete its bullet point line from this file using native tools before submitting your PR. Leave no trace.
> - Do not delete this file.

## The [REFACTORER] Queue
* 🏗️ `src/App.vue`: 3268 lines. Split into smaller domain modules and composables to reduce monolithic complexity.
* 🏗️ `src/js/PDFGenerator.js`: 698 lines. Break down into smaller helper functions.

## The [PRUNER] Queue
* 🧹 `src/components/LinkDialog.vue` (line 129): Remove `console.log("confirmSelection");`.
* 🧹 `src/js/OperationComponents.js` (line 263): Remove `console.log("Property ${property} set to ${value}");`.
* 🧹 `src/js/PDFGenerator.js` (line 563): Remove `console.log("drawLinkOnPage");`.
* 🧹 `src/js/PDFGenerator.js` (line 564): Remove `console.log(operation);`.
* 🧹 `src/js/PDFEditor.js` (line 84): Remove `console.log("Applying zoom level:", zoomLevel);`.

## The [TRANSFORMER] Queue
