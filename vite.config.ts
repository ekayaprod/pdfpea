import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          pdflib: ["pdf-lib"],
          pdfjs: ["pdfjs-dist"],
          moveable: ["moveable"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["vue", "pdf-lib", "pdfjs-dist", "moveable"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
