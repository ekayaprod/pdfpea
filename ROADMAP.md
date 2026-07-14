# Product Roadmap

## Innovation Backlog

### Replace Manual Date Formatting with date-fns
*   **The Problem:** The repository currently relies on custom, manual date formatting logic (`getFullYear()`, `getMonth()`, `getDate()`) in `src/App.vue` (`getFormattedCurrentDate`). This custom "reinvented wheel" utility logic is a form of pattern stagnation that increases technical debt.
*   **The Solution:** Standardize the codebase to use `date-fns`, a mature, standard community library for time-based logic.
*   **The Benefit:** Replacing bespoke code with `date-fns` standardizes the architecture, reduces boilerplate, helps future-proof the repository against technical debt, and improves maintainability.
