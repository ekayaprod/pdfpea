# ⚡ PDFPea (ekayaprod Fork)

[![build: passing](https://img.shields.io/badge/build-passing-brightgreen)](#)

*Note: This is a modified fork of the original [AlphaCloudTechnologies/pdfpea](https://github.com/AlphaCloudTechnologies/pdfpea).*

PDFPea is a high-velocity, browser-based PDF editor engineered for total local privacy. Built on Vue 3 and Vite, it delivers zero-latency text, image, and shape annotations directly in your browser. No server uploads. No compromises.

## 🔀 Differences from the Original Project

This fork incorporates significant architectural, UX, and pipeline improvements over the original project, including:

- **🎨 UX & Design (Palette+):** Enhanced UI elements with fluid motion, accessible focus states, and refined typography for a premium, frictionless user experience.
- **🏗️ Architectural Reorganization:** Split monolithic structures into domain-specific modules (e.g., semantic `utils/` and operation components).
- **🛡️ Hardened Security & Testing:** Implemented strict boundaries on `PDFGenerator.js`, expanded E2E Playwright test coverage, and established unverified logic test suites.
- **🚀 Pipeline Optimizations:** Built out Docker-based CI environments and dependable GitHub Actions configurations.
- **🧹 Code Quality:** Aggressive linting, lexicon standardization, dead code removal, and eradication of inline styles in favor of modern utility tokens.

Working website: [ekayaprod.github.io/pdfpea](https://ekayaprod.github.io/pdfpea)

## 🔀 Fork Differences (vs. Original)

This repository is a heavily modernized and architecturally refined fork of the original [AlphaCloudTechnologies/pdfpea](https://github.com/AlphaCloudTechnologies/pdfpea). Key improvements in this fork include:

- **Modular Architecture:** The monolithic `OperationComponents.js` has been fractured into smaller, domain-driven classes (e.g., `TextOperationComponent`, `ImageOperationComponent`) inside `/src/js/OperationComponents/`. Utility functions have been similarly categorized into semantic subdirectories (`/src/utils/canvas/`, `/src/utils/color/`, etc.).
- **Comprehensive Testing:** Introduced a robust testing strategy utilizing **Vitest** for unit testing (`*.spec.js`) and **Playwright** for end-to-end (E2E) UI and visual regression testing (`/tests/`).
- **Infrastructure & CI:** Added a multi-stage `Dockerfile` and a `.dockerignore` for containerized deployments, along with an `.mcp.json` configuration.
- **Enhanced Documentation:** Introduced `ARCHITECTURE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, and `ROADMAP.md` to establish clear institutional memory and contribution guidelines.

## 🔀 Fork Differences

Why choose this version over the original `AlphaCloudTechnologies/pdfpea`? This fork has been systematically polished and hardened for a superior user experience and rock-solid reliability. Key improvements include:

- **Enhanced UX & Accessibility:** Upgraded UI copy and deep accessibility (a11y) label injections ensure a seamless experience for all users.
- **Hardened Security & Stability:** Fortified PDF generation boundaries with rigorous stress testing for unhandled parameters, catching edge cases the original misses.
- **Optimized Performance:** Minified SVG assets, eradicated inline styles in favor of CSS variables, and collapsed imperative logic blocks for a leaner, faster application.
- **Modern Infrastructure:** Multi-stage Docker environments and optimized CI/CD pipelines ensure robust testing and deployment.

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
