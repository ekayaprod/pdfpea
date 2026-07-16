import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHex } from "./colors.js";

describe("colors utils", () => {
  describe("hexToRgb", () => {
    it("should convert #000000 to rgb", () => {
      expect(hexToRgb("#000000")).toEqual({ red: 0, green: 0, blue: 0 });
    });
    it("should convert #ffffff to rgb", () => {
      expect(hexToRgb("#ffffff")).toEqual({ red: 1, green: 1, blue: 1 });
    });
    it("should convert #ff0000 to rgb", () => {
      expect(hexToRgb("#ff0000")).toEqual({ red: 1, green: 0, blue: 0 });
    });
    it("should convert #00ff00 to rgb", () => {
      expect(hexToRgb("#00ff00")).toEqual({ red: 0, green: 1, blue: 0 });
    });
    it("should convert #0000ff to rgb", () => {
      expect(hexToRgb("#0000ff")).toEqual({ red: 0, green: 0, blue: 1 });
    });
    it("should convert #123456 to rgb", () => {
      const rgb = hexToRgb("#123456");
      expect(rgb.red).toBeCloseTo(18 / 255);
      expect(rgb.green).toBeCloseTo(52 / 255);
      expect(rgb.blue).toBeCloseTo(86 / 255);
    });
    it("should convert short hex #fff to rgb", () => {
      expect(hexToRgb("#fff")).toEqual({ red: 1, green: 1, blue: 1 });
    });
    it("should convert short hex #f00 to rgb", () => {
      expect(hexToRgb("#f00")).toEqual({ red: 1, green: 0, blue: 0 });
    });
    it("should handle missing # prefix", () => {
      expect(hexToRgb("ffffff")).toEqual({ red: 1, green: 1, blue: 1 });
    });
    it("should return null for empty or invalid input", () => {
      expect(hexToRgb("")).toBeNull();
      expect(hexToRgb(null)).toBeNull();
      expect(hexToRgb("invalid")).toBeNull();
    });
  });

  describe("rgbToHex", () => {
    it("should convert 0, 0, 0 to #000000", () => {
      expect(rgbToHex(0, 0, 0)).toBe("#000000");
    });
    it("should convert 255, 255, 255 to #ffffff", () => {
      expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
    });
    it("should convert 255, 0, 0 to #ff0000", () => {
      expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
    });
    it("should convert 0, 255, 0 to #00ff00", () => {
      expect(rgbToHex(0, 255, 0)).toBe("#00ff00");
    });
    it("should convert 0, 0, 255 to #0000ff", () => {
      expect(rgbToHex(0, 0, 255)).toBe("#0000ff");
    });
    it("should convert 18, 52, 86 to #123456", () => {
      expect(rgbToHex(18, 52, 86)).toBe("#123456");
    });
    it("should clamp values out of bounds", () => {
      expect(rgbToHex(-10, 300, 256)).toBe("#00ffff");
    });
    it("should handle floating point values", () => {
      expect(rgbToHex(254.9, 0.1, 128.5)).toBe("#ff0081");
    });
  });
});
