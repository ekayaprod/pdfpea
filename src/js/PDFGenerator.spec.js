import { describe, it, expect } from "vitest";
import { PDFGenerator } from "./PDFGenerator.js";

describe("PDFGenerator", () => {
  it("survives absolute void parameters", async () => {
    let error = null;
    try {
      await PDFGenerator.drawImageOnPage(null, null, null);
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    // Fortified blind error boundary
    expect(error.message).toBe("Cannot be null");
  });
});
