## TL;DR
PDFPea is an editing tool that works completely locally. Add text, images, shapes, annotations, and more without uploading your files to any server.

Working website: [pdfpea.com](https://pdfpea.com)


## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Architectural Map
| Directory | Purpose |
| --- | --- |
| `/src` | Core Vue 3 application logic, components, styling, and utilities. |
| `/src/components` | Reusable UI and tool components. |
| `/src/css` | Global styling and tailwind configuration. |
| `/src/js` | Vanilla JavaScript modules and integrations (like `pdf-lib`). |
| `/src/utils` | Shared utility functions and helpers. |
| `/public` | Static assets like images served directly. |
| `/test-files` | Local PDF and media assets for testing the editor visually. |

## Project Setup

1. `npm install` (Install dependencies)

### Compile and Hot-Reload for Development

1. `npm run dev` (Boot the Vite development server)

### Type-Check, Compile and Minify for Production

1. `npm run type-check` (Type check TS and Vue components)
2. `npm run build` (Compile with Vite)

### Lint with [ESLint](https://eslint.org/)

1. `npm run lint`

## License
MIT License.