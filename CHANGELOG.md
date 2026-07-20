# Changelog

## [Unreleased]

### ✨ Features & Refactoring

- **🧬 Helix:** Refactor `PDFEditor.js` and `PDFGenerator.js` to collapse imperative logic blocks.
- **🪴 Propagator:** Extract duplicated border width dimension calculations.
- **🗂️ Organizer:** Refactor to organize utils into semantic subdirectories.
- **🥄 Sylar:** Splice `parseColor` utility to consolidate redundant logic and fix Prettier formatting.
- **🔤 Lexicon:** Standardize fetching and binary string terminology, and enforce boolean prefix for dialog states.
- **🦢 Finesse:** Eradicate inline styles and refactor to use Tailwind CSS variables for hardcoded hex colors.
- **🗜️ Vice:** Minify SVG assets by stripping bloated XML metadata.

### 🛡️ Security & Reliability

- **🕵️ Inspector:** Fortify PDFGenerator boundaries with stress tests for unhandled parameter exceptions (commits 31b2fd6, be54c6f, e097456, 3ad0af8).
- **🕵️ Inspector:** Author unverified logic test suites to ensure proper test coverage across operation components.
- **🪨 Vibe Check:** Strip out hallucinated promise wrappers and cosmetic try/catch blocks (commit d112452).

### 📖 Documentation & UX

- **📘 Author:** Add testing instructions to documentation (commit 85e6748).
- Elevate UI copy and inject accessibility labels (commit a36a5ae).
- Code formatting (commit 7c1af7e).

### 🚀 Infrastructure

- **📯 Dispatch:** Optimize Playwright Pipeline and inject Docker Ecosystem into Dependabot Scanning (commits 4a064e5, e2eafd0, 4349980).
- **📤 Dispatch:** Provision multi-stage Dockerfile and `.dockerignore`.
- **🪲 Scavenger:** Cleaned diagnostic droppings and semantic dust.
