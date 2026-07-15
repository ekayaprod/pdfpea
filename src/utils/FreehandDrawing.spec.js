import { describe, it, expect } from "vitest";
import { FreehandDrawing, freehandDrawing } from "./FreehandDrawing.js";

describe("FreehandDrawing - Pure Functions Boundary Stress Tests", () => {
  it("calculateBoundingBox handles empty path arrays correctly", () => {
    const result = freehandDrawing.calculateBoundingBox([], 2);
    expect(result).toBeNull();
  });

  it("smoothPath handles insufficient points gracefully", () => {
    const shortPath = [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ];
    const result = freehandDrawing.smoothPath(shortPath, 5);
    expect(result).toEqual(shortPath);
  });

  it("pathToSvgDataUrl returns null for an empty path", () => {
    const result = freehandDrawing.pathToSvgDataUrl([], {});
    expect(result).toBeNull();
  });
});
