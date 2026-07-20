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

### Fixed

- **📯 Dispatch:** Optimize Playwright Pipeline and inject Docker Ecosystem into Dependabot Scanning.
- **🪲 Scavenger:** Cleaned diagnostic droppings and semantic dust.
