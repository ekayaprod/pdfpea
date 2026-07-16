# 🏗️ Architect Journal

## Abstract Axioms
* **Monolith Decomposition:** Extracting large sets of interdependent classes from monolithic files into their own modules fundamentally improves maintainability and encapsulation.
* **Namespace Isolation:** Enforcing the use of barrel files (`index.js`) with explicit, named exports rather than wildcard defaults ensures predictable API boundaries and prevents namespace collisions.
* **Strict Source Preservation:** When refactoring source files and resolving imports, it is critical to rely on native IDE capabilities or isolated AST parsing over brute-force regex to guarantee semantic correctness.
* **Ephemerality of Build Tooling:** Tooling used for generation or AST parsing (e.g., `ts-morph`) should never leak into production runtime dependency manifests (`package.json`).
