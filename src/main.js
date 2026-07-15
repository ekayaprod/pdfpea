import "./css/main.css";
import { createApp } from "vue";
import App from "./App.vue";
// Import external dependencies
import * as pdfLib from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import Moveable from "moveable";
// Set up global references for backwards compatibility
window.PDFLib = pdfLib;
window.pdfjsLib = pdfjsLib;
window.Moveable = Moveable;
// Set worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
try {
  const app = createApp(App);
  const mountedApp = app.mount("#app");
} catch (error) {
  console.error("Error creating or mounting Vue app:", error);
}
