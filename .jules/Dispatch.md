Injected CodeQL SAST scanning pipeline to address Tier 3 vulnerabilities.
- provisioned .mcp.json manifest with filesystem and puppeteer MCPs for context-awareness
- Provisioned multi-stage Dockerfile and .dockerignore for optimized container transit
- Bumped actions/setup-node cache mechanism in playbook playwright.yml
- Defined permissions: contents: read to explicit scope
- [2025-07-18] Injected test/doc boundary exclusions into `.dockerignore` to address Tier 2 Transit Bloat.
- [UNHANDLED TARGET] `.github/workflows/playwright.yml`: Contains deprecated `node-version: lts/*` definition (Tier 5: Chronological Decay).
- Updated Node.js version in Playwright Workflow (`.github/workflows/playwright.yml`) from `lts/*` to `24`.
