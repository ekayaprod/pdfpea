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

    await expect(editor.renderPDF(null, null)).rejects.toThrow(/cannot be null/i);
  });

  it("handles getDocument error in renderPDF", async () => {
    const editor = new PDFEditor({ appendChild: vi.fn() });

    // Make getDocument return an object with a rejecting promise
    pdfjsLib.getDocument.mockReturnValueOnce({
      promise: Promise.reject(new Error("Mocked PDF error")),
    });

    await expect(editor.renderPDF("dummy.pdf", new Uint8Array([1, 2, 3]))).rejects.toThrow("Mocked PDF error");
  });
});
