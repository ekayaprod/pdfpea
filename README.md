# ⚡ PDFPea

[![build: passing](https://img.shields.io/badge/build-passing-brightgreen)](#)

> **Note:** This repository is a fork of the original [AlphaCloudTechnologies/pdfpea](https://github.com/AlphaCloudTechnologies/pdfpea), maintained by [ekayaprod](https://github.com/ekayaprod).

PDFPea is a high-velocity, browser-based PDF editor engineered for total local privacy. Built on Vue 3 and Vite, it delivers zero-latency text, image, and shape annotations directly in your browser. No server uploads. No compromises.

Working website: [pdfpea.com](https://pdfpea.com)

## 🚀 The Stack

- **Engine:** Vue 3 + Vanilla JavaScript
- **Build Tooling:** Vite
- **Styling:** Tailwind CSS (v4)
- **PDF Core:** `pdf-lib` & `pdfjs-dist`

*Note: PDFPea strictly targets Node.js >=24.0.0 and npm >=11.0.0.*

## 🏗️ Architectural Map

| Directory | Purpose |
| --- | --- |
| `/src` | Core Vue 3 application logic, components, styling, and utilities. |
| `/src/components` | Reusable UI and tool components. |
| `/src/css` | Global styling and tailwind configuration. |
| `/src/js` | Core Vanilla JavaScript models (e.g. `PDFEditor.js`, `PDFGenerator.js`). |
| `/src/js/OperationComponents` | Manages individual annotation instances. |
| `/src/utils` | Shared utility functions (e.g. `color/`, `canvas/`, `layout/`). |
| `/public` | Static assets like images served directly. |
| `/test-files` | Local PDF and media assets for testing the editor visually. |
| `/tests` | Playwright end-to-end (E2E) UI and visual regression test suites. |

## 🛠️ Boot Sequence (CLI Commands)

1. `npm install` (Install dependencies)

### Development

1. `npm run dev` (Boot the Vite development server)

### Testing

1. `npm run test` (Run the Vitest test suite)
2. `npm run test:watch` (Run tests in watch mode)
3. `npm run test:coverage` (Run tests and generate coverage report)
4. `npm run test:e2e` (Run Playwright end-to-end tests)

### Production & Verification

1. `npm run type-check` (Type check TS and Vue components using `vue-tsc`)
2. `npm run build` (Compile with Vite --debug)
3. `npm run preview` (Locally preview the production build)

### Linting & Formatting

1. `npm run lint` (ESLint auto-fix and cache)
2. `npm run format:check` (Prettier validation)
3. `npm run format` (Prettier auto-format)

## ⚙️ Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur).

## 🛡️ License

MIT License.
