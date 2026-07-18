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
vi.mock("../utils/color/colors.js", () => ({
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

    let error = null;
    try {
      await editor.renderPDF(null, null);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toMatch(/cannot be null/i);
  });

  it("handles getDocument error in renderPDF", async () => {
    const editor = new PDFEditor({ appendChild: vi.fn() });

    // Make getDocument return an object with a rejecting promise
    pdfjsLib.getDocument.mockReturnValue({
      promise: Promise.reject(new Error("Mocked PDF error")),
    });

    let error = null;
    try {
      await editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]));
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toBe("Mocked PDF error");
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
