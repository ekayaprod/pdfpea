import * as pdfjsLib from "pdfjs-dist";
import {
  ImageOperationComponent,
  RectangleOperationComponent,
  CircleOperationComponent,
  TextOperationComponent,
  TextFieldOperationComponent,
  CheckboxOperationComponent,
  LinkOperationComponent,
} from "./OperationComponents/index.js";
import { PDFGenerator } from "./PDFGenerator.js";
import { rgbToHex } from "../utils/color/colors.js";
import {
  DEFAULT_VALUES,
  FIELD_TYPES,
  ALIGNMENT,
  COMPONENT_TYPES,
  EVENTS,
  IMAGE_PATHS,
} from "../utils/constants/constants.js";
const DEFAULT_PDFJS_DOCUMENT_OPTIONS = {
  cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
  iccUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/iccs/`,
  wasmUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/wasm/`,
};
class PDFEditor {
  container = null;
  pdfPages = [];
  constructor(container) {
    this.container = container;
  }
  async renderPDF(fileName, fileContents) {
    if (fileName == null || fileContents == null) {
      return Promise.reject(new Error("Cannot be null"));
    }
    this.fileContents = fileContents;
    this.pdfPages = [];
    const pdfDoc = await pdfjsLib.getDocument({
      ...DEFAULT_PDFJS_DOCUMENT_OPTIONS,
      data: fileContents,
    }).promise;
    // Prevent concurrent race conditions by initializing sequentially
    const pages = [];
    for (let i = 0; i < pdfDoc.numPages; i++) {
      const pageNum = i + 1;
      const pdfURL = fileName;
      const pdfPageNumber = pageNum;
      const pdfPageContainer = document.createElement("div");
      this.container.appendChild(pdfPageContainer);
      const pdfPage = new PDFPage(pdfPageContainer);
      // Wait for initialization to complete before moving to the next page
      await pdfPage.initialize(pdfURL, pdfPageNumber, fileContents);
      pages.push(pdfPage);
    }
    this.pdfPages.push(...pages);
  }
  async downloadPDF() {
    const pageOperations = this.pdfPages.map((page) => ({
      pageNumber: page.pageNumber,
      operations: page.getOperations(),
    }));
    return PDFGenerator.generatePDF(this.fileContents, pageOperations);
  }
  applyZoom(zoomLevel) {
    this.pdfPages.forEach((page) => {
      page.applyZoom(zoomLevel);
    });
  }
}
class PDFPage {
  constructor(container) {
    this.container = container;
    this.container.classList.add("pdf-page");
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "body-pdf-canvas");
    this.canvas.setAttribute("class", "body-pdf-canvas");
    this.canvas.style.display = "block";
    this.context = this.canvas.getContext("2d");
    this.setupEventListeners();
  }
  setupEventListeners() {
    // Basic click handler for selection - drawing handlers will be added by App.vue
    this.canvas.addEventListener("click", (event) => {
      event.stopPropagation();
      this.setSelected();
    });
  }
  async initialize(pdfURL, pageNumber, fileContents) {
    const scale = DEFAULT_VALUES.SCALE;
    // Render the canvas at a higher resolution than the layout scale. This only
    // affects the canvas backing store, not the on-screen size or form-field
    // coordinate math (which keep using the layout `viewport`).
    const renderScale = scale * DEFAULT_VALUES.RENDER_RESOLUTION_MULTIPLIER;
    this.pdfURL = pdfURL;
    this.pageNumber = pageNumber;
    const pdfDoc = await pdfjsLib.getDocument({
      ...DEFAULT_PDFJS_DOCUMENT_OPTIONS,
      data: fileContents,
    }).promise;
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const renderViewport = page.getViewport({ scale: renderScale });
    // Set canvas backing store to the high-resolution viewport size
    this.canvas.height = renderViewport.height;
    this.canvas.width = renderViewport.width;
    // Set container style to display size (independent of render resolution)
    const displayHeight = viewport.height / scale;
    const displayWidth = viewport.width / scale;
    this.container.style.height = `${displayHeight}px`;
    this.container.style.width = `${displayWidth}px`;
    // Scale canvas style to fit container
    this.canvas.style.height = `${displayHeight}px`;
    this.canvas.style.width = `${displayWidth}px`;
    this.container.appendChild(this.canvas);
    const formFields = await page.getAnnotations();
    await page.render({
      annotationMode: pdfjsLib.AnnotationMode.DISABLE,
      canvasContext: this.context,
      viewport: renderViewport,
    }).promise;
    this.processFormFields(formFields, viewport);
  }
  processFormFields(formFields, viewport) {
    for (let field of formFields) {
      if (field.fieldType === FIELD_TYPES.TEXT_FIELD) {
        this.createTextFieldFromPDF(field, viewport);
      } else if (field.fieldType === FIELD_TYPES.BUTTON && field.checkBox) {
        this.createCheckboxFromPDF(field, viewport);
      }
    }
  }
  createTextFieldFromPDF(field, viewport) {
    const borderWidth = field.borderStyle.width;
    const x = Math.ceil(field.rect[0]);
    const tempY = Math.ceil(field.rect[1]);
    const width = Math.floor(field.rect[2]) - x - 2 * borderWidth;
    const height = Math.floor(field.rect[3]) - tempY - 2 * borderWidth;
    new TextFieldOperationComponent(
      TextFieldOperationComponent.updateDefaultOperation(
        field.fieldName,
        x,
        viewport.height - tempY - height - 2 * borderWidth,
        height,
        width,
        field.fieldValue,
        borderWidth,
        field.color ? rgbToHex(field.color[0], field.color[1], field.color[2]) : "#000000",
        field.borderColor
          ? rgbToHex(field.borderColor[0], field.borderColor[1], field.borderColor[2])
          : "transparent",
        field.backgroundColor
          ? rgbToHex(field.backgroundColor[0], field.backgroundColor[1], field.backgroundColor[2])
          : "transparent",
        field.defaultAppearanceData.fontName,
        field.defaultAppearanceData.fontSize,
        field.required,
        field.multiLine,
        field.readOnly,
        field.maxLen,
        field.textAlignment === 1
          ? ALIGNMENT.CENTER
          : field.textAlignment === 2
            ? ALIGNMENT.RIGHT
            : ALIGNMENT.LEFT,
      ),
      this.container,
    );
  }
  createCheckboxFromPDF(field, viewport) {
    const borderWidth = field.borderStyle.width;
    const x = Math.ceil(field.rect[0]);
    const tempY = Math.ceil(field.rect[1]);
    const width = Math.floor(field.rect[2]) - x - 2 * borderWidth;
    const height = Math.floor(field.rect[3]) - tempY - 2 * borderWidth;
    new CheckboxOperationComponent(
      CheckboxOperationComponent.updateDefaultOperation(
        field.fieldName,
        x,
        viewport.height - tempY - height - 2 * borderWidth,
        height,
        width,
        borderWidth,
        field.color ? rgbToHex(field.color[0], field.color[1], field.color[2]) : "#000000",
        field.borderColor
          ? rgbToHex(field.borderColor[0], field.borderColor[1], field.borderColor[2])
          : "transparent",
        field.backgroundColor
          ? rgbToHex(field.backgroundColor[0], field.backgroundColor[1], field.backgroundColor[2])
          : "transparent",
        field.fieldFlags === 1,
        field.readOnly,
      ),
      this.container,
    );
  }
  // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
  /**
   * Instantiates the appropriate OperationComponent (e.g., Circle, Rectangle, Text) based on the toolType.
   * Utilizes the AST to evaluate tool types and maps layout dimensions and stylistic settings from the user's active configuration.
   * Note the 0.5 opacity fallback for the "highlight" subType: this is a magic number mapping back to the initial release of the highlighter feature.
   * * Historical Intent: The imperative block was collapsed into declarative ternaries via PR #88 (commit 66d515e, Jul 2026), while the highlight opacity dates back to the initial commit (76bc964, Jul 2025).
   */
  createComponentWithDimensions(toolType, settings, id, x, y, width, height) {
    switch (toolType) {
      case COMPONENT_TYPES.CIRCLE:
        return new CircleOperationComponent(
          CircleOperationComponent.createDefaultOperation(
            id,
            x,
            y,
            width,
            height,
            settings?.fill ?? "transparent",
            settings?.borderColor ?? "#FF0000",
            settings?.borderWidth ?? 2,
            settings?.opacity ?? 1.0,
          ),
          this.container,
        );
      case COMPONENT_TYPES.RECTANGLE:
        return new RectangleOperationComponent(
          RectangleOperationComponent.createDefaultOperation(
            id,
            x,
            y,
            width,
            height,
            settings?.subType === "highlight"
              ? (settings.fill ?? "#FFFF00")
              : settings?.subType === "white-out"
                ? "#FFFFFF"
                : (settings?.fill ?? "transparent"),
            settings?.subType === "white-out" || settings?.subType === "highlight"
              ? ""
              : (settings?.borderColor ?? "#FF0000"),
            settings?.subType === "white-out" || settings?.subType === "highlight"
              ? 0
              : (settings?.borderWidth ?? 2),
            settings?.subType === "white-out" ? undefined : "solid",
            settings?.subType === "highlight"
              ? (settings.opacity ?? 0.5)
              : settings?.subType === "white-out"
                ? undefined
                : (settings?.opacity ?? 1.0),
          ),
          this.container,
        );
      case COMPONENT_TYPES.TEXT:
        return new TextOperationComponent(
          TextOperationComponent.createDefaultOperation(
            id,
            x,
            y,
            width,
            height,
            settings?.fontFamily ?? "Helvetica",
            settings?.fontSize ?? 16,
            settings?.color ?? "#000000",
            settings?.opacity ?? 1.0,
          ),
          this.container,
        );
      case COMPONENT_TYPES.IMAGE:
        return new ImageOperationComponent(
          ImageOperationComponent.createDefaultOperation(
            id,
            x,
            y,
            width,
            height,
            settings?.url ?? (settings?.subType ? undefined : "./images/default_image.jpg"),
            100,
            100,
            settings?.subType,
          ),
          this.container,
        );
      case COMPONENT_TYPES.TEXT_FIELD:
        return new TextFieldOperationComponent(
          TextFieldOperationComponent.createDefaultOperation(id, x, y, width, height),
          this.container,
        );
      case COMPONENT_TYPES.CHECKBOX:
        return new CheckboxOperationComponent(
          CheckboxOperationComponent.createDefaultOperation(id, x, y, width, height),
          this.container,
        );
      case COMPONENT_TYPES.LINK:
        return new LinkOperationComponent(
          LinkOperationComponent.createDefaultOperation(
            id,
            x,
            y,
            width,
            height,
            settings?.linkType ?? "url",
            settings?.linkValue ?? "",
            settings?.fill ?? "rgba(0, 122, 204, 0.1)",
            settings?.borderColor ?? "#007acc",
            settings?.borderWidth ?? 1,
            settings?.opacity ?? 1.0,
          ),
          this.container,
        );
      default:
        return null;
    }
  }
  getOperations = () => {
    const components = Array.from(this.container.getElementsByClassName("component"));
    return components.map((element) => element.operation);
  };
  setSelected = () => {
    this.fireEvent(EVENTS.SHOULD_CLEAR_ALL_SELECTION);
  };
  fireEvent = (eventName) => {
    const event = new CustomEvent(eventName, {
      detail: {
        target: this,
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };
  applyZoom(zoomLevel) {
    this.container.style.transform = `scale(${zoomLevel})`;
    this.container.style.transformOrigin = "top left";
    // Calculate the actual dimensions after scaling
    const originalHeight = this.container.offsetHeight;
    const originalWidth = this.container.offsetWidth;
    const scaledHeight = originalHeight * zoomLevel;
    const scaledWidth = originalWidth * zoomLevel;
    // Set margins to account for the increased size after scaling
    // This ensures the next page is pushed down by the full scaled height
    this.container.style.marginBottom = `${scaledHeight - originalHeight + 20}px`; // +20px for gap between pages
    this.container.style.marginRight = `${scaledWidth - originalWidth}px`;
  }
}
export { PDFEditor };
