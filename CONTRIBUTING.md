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

1. **Testing:**

   ```bash
   npm run test
   npm run test:watch
   npm run test:coverage
   npm run test:e2e
   ```

2. **Type Checking:**

   ```bash
   npm run type-check
   ```

3. **Linting:**

   ```bash
   npm run lint
   ```

4. **Formatting:**

   ```bash
   npm run format:check
   ```

   _(If formatting fails, auto-fix the codebase with `npm run format`)_

5. **Production Build & Preview:**

   ```bash
   npm run build
   npm run preview
   ```

Once all checks pass, your code is ready for review!
