import { describe, it, expect, vi } from "vitest";

// Mock everything since we just want to test boundary logic on renderPDF
vi.mock("pdfjs-dist", () => ({
  getDocument: vi.fn(),
  version: "mock-version",
}));

import * as pdfjsLib from "pdfjs-dist";
import { PDFEditor } from "./PDFEditor.js";

describe("PDFEditor", () => {
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
    pdfjsLib.getDocument.mockReturnValueOnce({
      promise: Promise.reject(new Error("Mocked PDF error"))
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
});
