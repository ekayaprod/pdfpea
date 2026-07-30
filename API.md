# 📡 PDFPea External Integrations API

Welcome to the PDFPea macroscopic API reference. This document maps the core endpoints exposed globally for consumer consumption and external integrations.

These endpoints are strictly derived from the mechanical ground truth defined in `src/main.js` and `src/globals.d.ts`. PDFPea is built to be a high-velocity, zero-latency editor, and exposing these underlying libraries globally ensures backwards compatibility and allows for advanced programmatic control without requiring a full build pipeline integration.

## 🌍 Global `window` Endpoints

The following libraries are instantiated and attached directly to the global `window` object upon application boot.

| Endpoint | Source Library | Purpose |
| :--- | :--- | :--- |
| `window.PDFLib` | `pdf-lib` | The core engine for reading, creating, and modifying the actual binary PDF files. Handles annotation injection, form field manipulation, and document generation prior to download. |
| `window.pdfjsLib` | `pdfjs-dist` | The rendering engine. Handles parsing the PDF binary and rendering its pages to HTML `<canvas>` elements for visual display within the editor interface. |
| `window.Moveable` | `moveable` | The interaction engine. Powers the drag, drop, resize, and rotation capabilities for all dynamically injected annotation components (text, images, shapes) overlaying the PDF canvas. |

## 🛠️ Usage Notes

Because these are attached to the global scope, they can be accessed directly from the browser console or by any external scripts loaded on the page after the main PDFPea bundle has executed.

```javascript
// Example: Accessing the PDFLib engine directly
const { PDFDocument } = window.PDFLib;
```
