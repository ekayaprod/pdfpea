# 📘 Author Journal

## Prune-and-Compress Journal Protocol

*   **Axiom 1:** The Onboarding Void is a critical blocker. Synthesizing `CONTRIBUTING.md` from `package.json` eliminates setup ambiguity and converts visitors to contributors.
*   **Axiom 2:** The CLI Contradiction causes immediate boot-up failure. Unlisted system dependencies (e.g., Playwright browsers) must be explicitly mapped in onboarding markdown to prevent testing purgatory.
*   **Heuristic:** CLI commands must be explicitly verified against `package.json` scripts. Hallucinations are strictly forbidden. The tone must mirror the core product philosophy (privacy-first, high-velocity).
*   **Operation:** Generated `CONTRIBUTING.md` defining Node.js/npm prerequisites, local dev server (`npm run dev`), type checking, linting, formatting, and building (`npm run build`) based exactly on the `package.json` mechanical ground truth. Injected `npx playwright install` to both `README.md` and `CONTRIBUTING.md` to prevent verification friction during E2E test runs.
Learning: Author Workflow & Execution Mandate restricts write operations strictly to markdown documentation up to a maximum of 2 targets, requiring strict adherence to the existing repository tone and accurate verification of CLI commands against configuration files. | Action: Updated `README.md` and `ARCHITECTURE.md` to accurately reflect the location of utilities (`/src/js/utils`) and the new `/src/workers` directory, ensuring all paths and architectural diagrams align with the physical codebase structure. Addressed the Onboarding Void by explicitly calling `npx playwright install` before `npm run test:e2e` in both `README.md` and `CONTRIBUTING.md`.
