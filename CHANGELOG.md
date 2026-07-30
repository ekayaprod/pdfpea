# Changelog

## [Unreleased]

### Changed

- **🧬 Helix:** Refactor `PDFEditor.js` and `PDFGenerator.js` to collapse imperative logic blocks.
- **🪴 Propagator:** Extract duplicated border width dimension calculations.
- **🗂️ Organizer:** Refactor to organize utils into semantic subdirectories.
- **🥄 Sylar:** Splice `parseColor` utility to consolidate redundant logic and fix Prettier formatting.
- **🔤 Lexicon:** Standardize fetching and binary string terminology, and enforce boolean prefix for dialog states.
- **🦢 Finesse:** Eradicate inline styles and refactor to use Tailwind CSS variables for hardcoded hex colors.
- **🗜️ Vice:** Minify SVG assets by stripping bloated XML metadata.
- Elevate UI copy and inject accessibility labels.
- Code formatting.

### Security

- **🕵️ Inspector:** Fortify PDFGenerator boundaries with stress tests for unhandled parameter exceptions.
- **🕵️ Inspector:** Author unverified logic test suites to ensure proper test coverage across operation components.
- **🪨 Vibe Check:** Strip out hallucinated promise wrappers and cosmetic try/catch blocks.

### Added

- **📘 Author:** Add testing instructions to documentation.
- **📤 Dispatch:** Provision multi-stage Dockerfile and `.dockerignore`.
- **🎯 Feature:** Add Pop-out Editor for Sidebar Dashboard.

### Fixed

- **📯 Dispatch:** Optimize Playwright Pipeline and inject Docker Ecosystem into Dependabot Scanning.
- **🪲 Scavenger:** Cleaned diagnostic droppings and semantic dust.
- **🧹 Scavenger:** Excise orphaned IMAGE_PATHS constant (commit 34e1b64).
- Resolve missing tools in popout and layer deletion on imported PDFs (commit fd65520).
- **🚨 Paramedic:** Batch PDFLib copyPages for optimized generation to prevent font duplication bloat (commit dac31e0).
- **📁 Organizer:** Consolidate utilities and components to reduce file count (commit cc239af).
- **🕯️ Scribe:** Remove dead code, resolve linting errors, and address unused variables (commits 984ecba, f7098ee).
- **🪲 Scavenger:** Cleaned up necrotic code in App.vue and PDFEditor.js (commit 33e93da).
- **🚨 Paramedic:** Fix null pointer in drawRectangle and drawCircle (commit bc632df).
