# 📘 Author Journal

## Prune-and-Compress Journal Protocol

*   **Axiom 1:** The Onboarding Void is a critical blocker. Synthesizing `CONTRIBUTING.md` from `package.json` eliminates setup ambiguity and converts visitors to contributors.
*   **Heuristic:** CLI commands must be explicitly verified against `package.json` scripts. Hallucinations are strictly forbidden. The tone must mirror the core product philosophy (privacy-first, high-velocity).
*   **Operation:** Generated `CONTRIBUTING.md` defining Node.js/npm prerequisites, local dev server (`npm run dev`), type checking, linting, formatting, and building (`npm run build`) based exactly on the `package.json` mechanical ground truth.
*   **Axiom 2:** The Monorepo Maze is an onboarding block. Correcting architectural domain maps to point to actual existing files (`/src/js/utils`) enables efficient local navigation.
*   **Heuristic:** File paths documented in README.md and ARCHITECTURE.md must strictly map to existing files. Hallucinated or outdated paths severely impact the developer experience.
*   **Operation:** Fixed path discrepancy for `utils` route in README.md by updating to `/src/js/utils` and consolidated duplicated fork difference sections. Corrected component module paths in ARCHITECTURE.md to point to `js/...`.
*   **Axiom 3:** Architectural map comprehensiveness prevents the Monorepo Maze. CI/CD pipelines, configurations, and deployment definitions are integral to the map.
*   **Heuristic:** Always include hidden configuration directories like `.github/workflows` and deployment scripts like `wrangler.jsonc` in `README.md` to ensure full structural transparency.
*   **Operation:** Appended `.github/workflows`, `*.config.ts`, and `wrangler.jsonc` to the `README.md` map and updated the `ARCHITECTURE.md` Component Diagram to reflect Form tools and nested directories correctly based on ground truth.
