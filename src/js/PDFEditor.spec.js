import { describe, it, expect, vi, afterEach } from "vitest";

// Mock everything since we just want to test boundary logic on renderPDF
vi.mock("pdfjs-dist", () => ({
  getDocument: vi.fn(),
  version: "mock-version",
  AnnotationMode: { DISABLE: 1 },
}));

import * as pdfjsLib from "pdfjs-dist";
import { PDFEditor } from "./PDFEditor.js";

// Mock rgbToHex from colors to avoid errors
vi.mock("./utils/colors.js", () => ({
  rgbToHex: vi.fn((r, g, b) => {
    if (
      r === undefined ||
      g === undefined ||
      b === undefined ||
      r === null ||
      g === null ||
      b === null
    ) {
      throw new TypeError("Cannot read properties of undefined/null");
    }
    return "#000000";
  }),
}));

describe("PDFEditor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("survives absolute void parameters", async () => {
    // Create an instance with dummy container
    const editor = new PDFEditor({});

    await expect(editor.renderPDF(null, null)).rejects.toThrow(/cannot be null/i);
  });

  it("handles getDocument error in renderPDF", async () => {
    const editor = new PDFEditor({ appendChild: vi.fn() });

    // Make getDocument return an object with a rejecting promise
    pdfjsLib.getDocument.mockReturnValue({
      promise: Promise.reject(new Error("Mocked PDF error")),
    });

    await expect(editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]))).rejects.toThrow(
      "Mocked PDF error",
    );
  });

  it("handles form fields with missing color arrays gracefully without crashing", async () => {
    // 🕵️ The Fair-Weather Alibi Check: The application blindly assumes PDF field properties like 'color',
    // 'borderColor', and 'backgroundColor' will always be valid arrays instead of null/undefined.

    // We can just test the createTextFieldFromPDF directly instead of through the pipeline to avoid JSDOM appendChild issues
    const container = document.createElement("div");
    // Mock the canvas element correctly so we can construct a PDFPage instance
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        const canvas = originalCreateElement("canvas");
        vi.spyOn(canvas, "getContext").mockImplementation(() => ({}));
        return canvas;
      }
      return originalCreateElement(tag);
    });

    const editor = new PDFEditor(container);

    const mockPage = {
      getViewport: vi.fn().mockReturnValue({ width: 800, height: 600 }),
      getAnnotations: vi.fn().mockResolvedValue([
        {
          fieldType: "Tx",
          rect: [10, 10, 100, 50],
          borderStyle: { width: 1 },
          color: null, // Hazard: the PDF field lacks a color array
          borderColor: [0, 0, 0],
          backgroundColor: [255, 255, 255],
          fieldName: "TestField",
          fieldValue: "value",
          defaultAppearanceData: { fontName: "Helvetica", fontSize: 12 },
          required: false,
          multiLine: false,
          readOnly: false,
          maxLen: 100,
          textAlignment: 0,
        },
      ]),
      render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
    };

    pdfjsLib.getDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: vi.fn().mockResolvedValue(mockPage),
      }),
    });

    let error;
    try {
      await editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]));
    } catch (e) {
      error = e;
    }

    // 🕵️ The Truth Mandate: Expose, Don't Enshrine
    // We expect it NOT to have an error. So expect(error).toBeUndefined().
    // If it fails (which it will, because the logic throws), it will break the build.
    expect(error).toBeUndefined();
  });

  describe("PDFPage uncovered logic", () => {
    it("createComponentWithDimensions creates proper components", async () => {
      const container = document.createElement("div");
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tag) => {
        if (tag === "canvas") {
          const canvas = originalCreateElement("canvas");
          vi.spyOn(canvas, "getContext").mockImplementation(() => ({}));
          return canvas;
        }
        return originalCreateElement(tag);
      });

      const editor = new PDFEditor(container);
      const mockPage = {
        getViewport: vi.fn().mockReturnValue({ width: 800, height: 600 }),
        getAnnotations: vi.fn().mockResolvedValue([]),
        render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
      };
      pdfjsLib.getDocument.mockReturnValue({
        promise: Promise.resolve({
          numPages: 1,
          getPage: vi.fn().mockResolvedValue(mockPage),
        }),
      });

      await editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]));
      const page = editor.pdfPages[0];

      // Test all component types
      const compCircle = page.createComponentWithDimensions(
        "circle",
        { fill: "#111" },
        "id1",
        10,
        10,
        50,
        50,
      );
      expect(compCircle.operation.type).toBe("circle");

      const compRect = page.createComponentWithDimensions(
        "rectangle",
        { subType: "highlight" },
        "id2",
        10,
        10,
        50,
        50,
      );
      expect(compRect.operation.type).toBe("rectangle");

      const compRectWhiteout = page.createComponentWithDimensions(
        "rectangle",
        { subType: "white-out" },
        "id3",
        10,
        10,
        50,
        50,
      );
      expect(compRectWhiteout.operation.type).toBe("rectangle");

      const compText = page.createComponentWithDimensions(
        "text",
        { fontSize: 20 },
        "id4",
        10,
        10,
        50,
        50,
      );
      expect(compText.operation.type).toBe("text");

      const compImage = page.createComponentWithDimensions(
        "image",
        { url: "foo.jpg" },
        "id5",
        10,
        10,
        50,
        50,
      );
      expect(compImage.operation.type).toBe("image");

      const compTextField = page.createComponentWithDimensions(
        "textfield",
        {},
        "id6",
        10,
        10,
        50,
        50,
      );
      expect(compTextField.operation.type).toBe("textfield");

      const compCheckbox = page.createComponentWithDimensions(
        "checkbox",
        {},
        "id7",
        10,
        10,
        50,
        50,
      );
      expect(compCheckbox.operation.type).toBe("checkbox");

      const compLink = page.createComponentWithDimensions(
        "link",
        { linkType: "url", linkValue: "example.com" },
        "id8",
        10,
        10,
        50,
        50,
      );
      expect(compLink.operation.type).toBe("link");

      const compDefault = page.createComponentWithDimensions("unknown", {}, "id9", 10, 10, 50, 50);
      expect(compDefault).toBeNull();

      vi.restoreAllMocks();
    });

    it("getOperations correctly retrieves components", async () => {
      const container = document.createElement("div");

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tag) => {
        if (tag === "canvas") {
          const canvas = originalCreateElement("canvas");
          vi.spyOn(canvas, "getContext").mockImplementation(() => ({}));
          return canvas;
        }
        return originalCreateElement(tag);
      });

      const editor = new PDFEditor(container);
      const mockPage = {
        getViewport: vi.fn().mockReturnValue({ width: 800, height: 600 }),
        getAnnotations: vi.fn().mockResolvedValue([]),
        render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
      };
      pdfjsLib.getDocument.mockReturnValue({
        promise: Promise.resolve({
          numPages: 1,
          getPage: vi.fn().mockResolvedValue(mockPage),
        }),
      });

      await editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]));
      const page = editor.pdfPages[0];

      page.createComponentWithDimensions("circle", { fill: "#111" }, "id1", 10, 10, 50, 50);

      const operations = page.getOperations();
      expect(operations.length).toBe(1);
      expect(operations[0].type).toBe("circle");

      vi.restoreAllMocks();
    });

    it("setSelected dispatches SHOULD_CLEAR_ALL_SELECTION event", async () => {
      const container = document.createElement("div");
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tag) => {
        if (tag === "canvas") {
          const canvas = originalCreateElement("canvas");
          vi.spyOn(canvas, "getContext").mockImplementation(() => ({}));
          return canvas;
        }
        return originalCreateElement(tag);
      });

      const editor = new PDFEditor(container);
      const mockPage = {
        getViewport: vi.fn().mockReturnValue({ width: 800, height: 600 }),
        getAnnotations: vi.fn().mockResolvedValue([]),
        render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
      };
      pdfjsLib.getDocument.mockReturnValue({
        promise: Promise.resolve({
          numPages: 1,
          getPage: vi.fn().mockResolvedValue(mockPage),
        }),
      });

      await editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]));
      const page = editor.pdfPages[0];

      let eventFired = false;
      const listener = (e) => {
        eventFired = true;
        expect(e.detail.target).toBe(page);
      };
      document.addEventListener("pdfeditor.shouldClearAllSelection", listener);
      page.setSelected();
      document.removeEventListener("pdfeditor.shouldClearAllSelection", listener);

      expect(eventFired).toBe(true);

      vi.restoreAllMocks();
    });

    it("applyZoom sets container styles appropriately", async () => {
      const container = document.createElement("div");
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tag) => {
        if (tag === "canvas") {
          const canvas = originalCreateElement("canvas");
          vi.spyOn(canvas, "getContext").mockImplementation(() => ({}));
          return canvas;
        }
        return originalCreateElement(tag);
      });

      const editor = new PDFEditor(container);
      const mockPage = {
        getViewport: vi.fn().mockReturnValue({ width: 800, height: 600 }),
        getAnnotations: vi.fn().mockResolvedValue([]),
        render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
      };
      pdfjsLib.getDocument.mockReturnValue({
        promise: Promise.resolve({
          numPages: 1,
          getPage: vi.fn().mockResolvedValue(mockPage),
        }),
      });

      await editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]));
      const page = editor.pdfPages[0];

      // Setup some size to verify margin logic
      Object.defineProperty(page.container, "offsetHeight", { value: 1000 });
      Object.defineProperty(page.container, "offsetWidth", { value: 800 });

      page.applyZoom(1.5);

      expect(page.container.style.transform).toBe("scale(1.5)");
      expect(page.container.style.transformOrigin).toBe("top left");
      expect(page.container.style.marginBottom).toBe(`${1000 * 0.5 + 20}px`);
      expect(page.container.style.marginRight).toBe(`${800 * 0.5}px`);

      vi.restoreAllMocks();
    });
  });

  it("handles form fields with missing backgroundColor arrays gracefully without crashing", async () => {
    // Similar to above, but for Checkbox
    const container = document.createElement("div");

    // Mock the canvas element correctly so we can construct a PDFPage instance
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") {
        const canvas = originalCreateElement("canvas");
        vi.spyOn(canvas, "getContext").mockImplementation(() => ({}));
        return canvas;
      }
      return originalCreateElement(tag);
    });

    const editor = new PDFEditor(container);

    const mockPage = {
      getViewport: vi.fn().mockReturnValue({ width: 800, height: 600 }),
      getAnnotations: vi.fn().mockResolvedValue([
        {
          fieldType: "Btn",
          checkBox: true,
          rect: [10, 10, 100, 50],
          borderStyle: { width: 1 },
          color: [0, 0, 0],
          borderColor: [0, 0, 0],
          backgroundColor: undefined, // Hazard: the PDF field lacks a backgroundColor array
          fieldName: "TestField",
          fieldFlags: 1,
          readOnly: false,
        },
      ]),
      render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
    };

    pdfjsLib.getDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: vi.fn().mockResolvedValue(mockPage),
      }),
    });

    let error;
    try {
      await editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]));
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });
});
