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
    expect(error.message).toMatch(/cannot be null/i);
  });

  describe("str2ab", () => {
    it("handles empty strings gracefully", () => {
      const result = PDFGenerator.str2ab("");
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBe(0);
    });

    it("converts strings to ArrayBuffer correctly", () => {
      const result = PDFGenerator.str2ab("test");
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBe(4);
      const view = new Uint8Array(result);
      expect(view[0]).toBe("t".charCodeAt(0));
      expect(view[3]).toBe("t".charCodeAt(0));
    });
  });

  describe("getImageType", () => {
    it("handles 1-byte buffers gracefully without throwing RangeError", () => {
      // Missing Boundary Stress-Test: The current implementation attempts to read
      // bytes 0 and 1 without checking the buffer's byteLength.
      const tinyBuffer = new ArrayBuffer(1);
      const view = new Uint8Array(tinyBuffer);
      view[0] = 0xff; // Random byte, not a full jpg signature

      let type;
      try {
        type = PDFGenerator.getImageType(tinyBuffer);
      } catch(e) {
        type = "error"
      }

      expect(type).toBe("unknown");
    });

    it("handles 0-byte buffers gracefully without throwing RangeError", () => {
      const tinyBuffer = new ArrayBuffer(0);

      let type;
      try {
        type = PDFGenerator.getImageType(tinyBuffer);
      } catch(e) {
        type = "error"
      }

      expect(type).toBe("unknown");
    });

    it("identifies JPG signatures correctly", () => {
      const buffer = new ArrayBuffer(2);
      const view = new Uint8Array(buffer);
      view[0] = 0xff;
      view[1] = 0xd8;
      expect(PDFGenerator.getImageType(buffer)).toBe("jpg");
    });

    it("identifies PNG signatures correctly", () => {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setUint32(0, 0x89504e47);
      view.setUint32(4, 0x0d0a1a0a);
      expect(PDFGenerator.getImageType(buffer)).toBe("png");
    });

    it("identifies unknown formats correctly", () => {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setUint32(0, 0x11223344);
      view.setUint32(4, 0x55667788);
      expect(PDFGenerator.getImageType(buffer)).toBe("unknown");
    });
  });
});
