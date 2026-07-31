import { describe, it, expect, vi } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  parseColor,
  parsePdfData,
  generateId,
  calculateInnerDimensions,
  constrainToOrthogonal,
  updateSvgAttribute,
} from "./utils.js";

describe("utils", () => {
  describe("colors", () => {
    it("converts hex to RGB correctly", () => {
      expect(hexToRgb("#ffffff")).toEqual({ red: 1, green: 1, blue: 1 });
      expect(hexToRgb("#000000")).toEqual({ red: 0, green: 0, blue: 0 });
      expect(hexToRgb("#ff0000")).toEqual({ red: 1, green: 0, blue: 0 });
    });

    it("converts short hex to RGB correctly", () => {
      expect(hexToRgb("#fff")).toEqual({ red: 1, green: 1, blue: 1 });
    });

    it("handles invalid hex strings", () => {
      expect(hexToRgb(null)).toBeNull();
      expect(hexToRgb("invalid")).toBeNull();
    });

    it("converts RGB to hex correctly", () => {
      expect(rgbToHex(255, 255, 255)).toEqual("#ffffff");
      expect(rgbToHex(0, 0, 0)).toEqual("#000000");
      expect(rgbToHex(255, 0, 0)).toEqual("#ff0000");
    });

    it("handles out of bounds RGB values", () => {
      expect(rgbToHex(-10, 300, 128)).toEqual("#00ff80");
    });

    it("parses valid color strings correctly", () => {
      expect(parseColor("#ff0000")).toEqual({ red: 1, green: 0, blue: 0, alpha: 1.0 });
      expect(parseColor("rgba(255, 0, 0, 0.5)")).toEqual({ red: 1, green: 0, blue: 0, alpha: 0.5 });
    });

    it("handles invalid color strings gracefully", () => {
      expect(parseColor(null)).toBeNull();
      expect(parseColor("")).toBeNull();
      expect(parseColor("transparent")).toBeNull();
      expect(parseColor("rgba(0,0,0,0)")).toBeNull();
      expect(parseColor("invalid-color")).toBeNull();
    });
  });

  describe("pdfData", () => {
    it("should return the url if it is not a base64 string", () => {
      const url = "http://example.com/file.pdf";
      expect(parsePdfData(url)).toBe(url);
    });

    it("should return null if url is falsy", () => {
      expect(parsePdfData(null)).toBe(null);
    });

    it("should decode base64 data and return binary string", () => {
      const base64Data = btoa("mock pdf content");
      const url = `data:application/pdf;base64,${base64Data}`;
      const expectedOutput = "mock pdf content";

      expect(parsePdfData(url)).toBe(expectedOutput);
    });
  });

  describe("generateId", () => {
    it("should return a string", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
    });

    it("should return a string of length 9", () => {
      const id = generateId();
      expect(id.length).toBe(9);
    });

    it("should return unique IDs on multiple calls", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("should only contain alphanumeric characters", () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });

    it("should not contain the '0.' prefix from Math.random()", () => {
      const id = generateId();
      expect(id.startsWith("0.")).toBe(false);
    });

    it("should pad with zeros if the random string is too short", () => {
      // 0.5 in base 36 is 0.i, which is too short (just 'i')
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const id = generateId();
      expect(id).toBe("i00000000");
      vi.restoreAllMocks();
    });
  });

  describe("dimensions", () => {
    it("should correctly calculate dimension with a valid border width", () => {
      expect(calculateInnerDimensions(2)).toBe("calc(100% - 4px)");
      expect(calculateInnerDimensions("5")).toBe("calc(100% - 10px)");
    });

    it("should correctly calculate dimension when border width is 0", () => {
      expect(calculateInnerDimensions(0)).toBe("calc(100% - 0px)");
      expect(calculateInnerDimensions("0")).toBe("calc(100% - 0px)");
    });

    it("should fall back to 0 if border width is undefined or null", () => {
      expect(calculateInnerDimensions()).toBe("calc(100% - 0px)");
      expect(calculateInnerDimensions(null)).toBe("calc(100% - 0px)");
    });
  });

  describe("constrainToOrthogonal", () => {
    const startPoint = { x: 100, y: 100 };

    it("should not constrain if shift key is false", () => {
      const currentPoint = { x: 150, y: 120 };
      expect(constrainToOrthogonal(false, currentPoint, startPoint)).toEqual({ x: 150, y: 120 });
    });

    it("should constrain to horizontal if deltaX > deltaY", () => {
      const currentPoint = { x: 150, y: 120 }; // deltaX = 50, deltaY = 20
      expect(constrainToOrthogonal(true, currentPoint, startPoint)).toEqual({ x: 150, y: 100 });
    });

    it("should constrain to vertical if deltaY >= deltaX", () => {
      const currentPoint = { x: 120, y: 150 }; // deltaX = 20, deltaY = 50
      expect(constrainToOrthogonal(true, currentPoint, startPoint)).toEqual({ x: 100, y: 150 });
    });
  });

  describe("updateSvgAttribute", () => {
    it("should return the original string if not a valid SVG base64 URL", () => {
      expect(updateSvgAttribute("invalid-url", "fill", "red")).toBe("invalid-url");
      expect(updateSvgAttribute(null, "fill", "red")).toBe(null);
    });

    it("should update an existing attribute", () => {
      const originalSvg = '<svg><path fill="blue" d="M10 10"/></svg>';
      const base64Url = `data:image/svg+xml;base64,${btoa(originalSvg)}`;
      const updatedUrl = updateSvgAttribute(base64Url, "fill", "red");
      const expectedSvg = '<svg><path fill="red" d="M10 10"/></svg>';
      const expectedUrl = `data:image/svg+xml;base64,${btoa(expectedSvg)}`;
      expect(updatedUrl).toBe(expectedUrl);
    });

    it("should add a new attribute if it doesn't exist on the specified element", () => {
      const originalSvg = '<svg><path d="M10 10"/></svg>';
      const base64Url = `data:image/svg+xml;base64,${btoa(originalSvg)}`;
      const updatedUrl = updateSvgAttribute(base64Url, "fill", "red");
      const expectedSvg = '<svg><path d="M10 10"/ fill="red"></svg>';
      const expectedUrl = `data:image/svg+xml;base64,${btoa(expectedSvg)}`;
      expect(updatedUrl).toBe(expectedUrl);
    });

    it("should add a new attribute to a different element tag", () => {
      const originalSvg = '<svg width="10" height="10"><path d="M10 10"/></svg>';
      const base64Url = `data:image/svg+xml;base64,${btoa(originalSvg)}`;
      const updatedUrl = updateSvgAttribute(base64Url, "fill", "red", "svg");
      const expectedSvg = '<svg width="10" height="10" fill="red"><path d="M10 10"/></svg>';
      const expectedUrl = `data:image/svg+xml;base64,${btoa(expectedSvg)}`;
      expect(updatedUrl).toBe(expectedUrl);
    });
  });
});
