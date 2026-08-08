# 🛠️ Contributing to PDFPea

Welcome aboard! PDFPea is a high-velocity, privacy-first PDF editor. We value zero-latency operations and zero server uploads. No compromises. If you're ready to contribute, here is the mechanical ground truth to spin up the local environment and get hacking.

## ⚙️ Prerequisites

Before booting, ensure your environment meets the strict engine requirements:

- **Node.js:** `>=24.0.0`
- **npm:** `>=11.0.0`

## 🚀 Local Boot Sequence

To boot the application locally, run these commands in sequence:

1. ```bash
   npm install
   ```

2. ```bash
   npm run dev
   ```

The Vite development server will boot up and handle hot module replacement seamlessly.

## 🐳 Docker Boot Sequence

To run the application inside an isolated Docker container based on our multi-stage `Dockerfile`:

1. ```bash
   docker build -t pdfpea .
   ```
2. ```bash
   docker run -p 8080:80 pdfpea
   ```

## ✅ Verification & Build

Before submitting any Pull Requests, you must validate your changes against the established linters and parsers. We do not tolerate regressions.

1. ```bash
   npm run test
   ```
   (Run the Vitest test suite)
2. ```bash
   npm run test:watch
   ```
   (Run tests in watch mode)
3. ```bash
   npm run test:coverage
   ```
   (Run tests and generate coverage report)
4. ```bash
   npx playwright install
   ```
   (Install Playwright browsers for E2E testing)
5. ```bash
   npm run test:e2e
   ```
   (Run Playwright end-to-end tests)
6. ```bash
   npm run type-check
   ```
   (Type check TS and Vue components using `vue-tsc`)
7. ```bash
   npm run lint
   ```
   (ESLint auto-fix and cache)
8. ```bash
   npm run format:check
   ```
   (Prettier validation. If it fails, auto-fix the codebase with `npm run format`)
9. ```bash
   npm run build
   ```
   (Compile with Vite)
10. ```bash
    npm run preview
    ```
    (Locally preview the production build)

Once all checks pass, your code is ready for review!
