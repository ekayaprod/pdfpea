# Journal: Docs & Contracts

- Rerolled dry README with a bestseller hook and strictly formatted architectural map.
- Synchronized CLI setup commands and requirements from active `package.json` to the new `README.md`.
- Synchronized macro-documentation (`ARCHITECTURE.md`, `CONTRIBUTING.md`, `CHANGELOG.md`) with accurate directory trees and CLI verification instructions based on package.json ground truth.
- 🧿 Extracted duplicated JSON file reading and parsing logic found within `src/App.vue` into a new centralized utility at `src/js/utils/fileConfig.ts`.
- 🧿 Enforced a strict TypeScript contract (`@param {File}`, explicit `Promise<any>`) and drafted a binding JSDoc for `parseConfigFile` to prevent implicit `any` bypasses.
