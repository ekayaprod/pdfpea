# 🛠️ Contributing to PDFPea

> **Note:** This repository is a fork of the original [AlphaCloudTechnologies/pdfpea](https://github.com/AlphaCloudTechnologies/pdfpea).
>
> All contributions made here apply exclusively to this fork and its unique architectural enhancements.

Welcome aboard! PDFPea is a high-velocity, privacy-first PDF editor. We value zero-latency operations and zero server uploads. No compromises. If you're ready to contribute, here is the mechanical ground truth to spin up the local environment and get hacking.

## ⚙️ Prerequisites

Before booting, ensure your environment meets the strict engine requirements:

* **Node.js:** `>=24.0.0`
* **npm:** `>=11.0.0`

## 🚀 Local Boot Sequence

To boot the application locally, run these commands in sequence:

1. ```bash
   npm install
   ```

2. ```bash
   npm run dev
   ```

The Vite development server will boot up and handle hot module replacement seamlessly.

## ✅ Verification & Build

Before submitting any Pull Requests, you must validate your changes against the established linters and parsers. We do not tolerate regressions.

1. **Testing:**

    ```bash
    npm run test
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

    *(If formatting fails, auto-fix the codebase with `npm run format`)*
5. **Production Build:**

    ```bash
    npm run build
    ```

Once all checks pass, your code is ready for review!
