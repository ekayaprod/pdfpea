import { describe, it, expect } from "vitest";
import { constrainToOrthogonal } from "./constrainToOrthogonal";

describe("constrainToOrthogonal", () => {
  it("should return a copy of currentPoint if isShiftKey is false", () => {
    const currentPoint = { x: 10, y: 20 };
    const startPoint = { x: 0, y: 0 };
    const result = constrainToOrthogonal(false, currentPoint, startPoint);
    expect(result).toEqual(currentPoint);
    expect(result).not.toBe(currentPoint); // Should be a copy
  });

  it("should constrain to horizontal axis if horizontal movement is greater", () => {
    const currentPoint = { x: 100, y: 20 };
    const startPoint = { x: 0, y: 10 };
    const result = constrainToOrthogonal(true, currentPoint, startPoint);
    // DeltaX = 100, DeltaY = 10 -> horizontal movement is greater
    // Final y should be startPoint.y
    expect(result).toEqual({ x: 100, y: 10 });
  });

  it("should constrain to vertical axis if vertical movement is greater", () => {
    const currentPoint = { x: 20, y: 100 };
    const startPoint = { x: 10, y: 0 };
    const result = constrainToOrthogonal(true, currentPoint, startPoint);
    // DeltaX = 10, DeltaY = 100 -> vertical movement is greater
    // Final x should be startPoint.x
    expect(result).toEqual({ x: 10, y: 100 });
  });

  it("should default to vertical axis if horizontal and vertical movements are equal", () => {
    const currentPoint = { x: 50, y: 50 };
    const startPoint = { x: 0, y: 0 };
    const result = constrainToOrthogonal(true, currentPoint, startPoint);
    // DeltaX = 50, DeltaY = 50
    // According to logic, if deltaX > deltaY is false, it returns { x: startPoint.x, y: currentPoint.y }
    expect(result).toEqual({ x: 0, y: 50 });
  });

  it("should handle negative coordinates correctly", () => {
    const currentPoint = { x: -100, y: -20 };
    const startPoint = { x: -10, y: -10 };
    const result = constrainToOrthogonal(true, currentPoint, startPoint);
    // DeltaX = |-100 - (-10)| = 90
    // DeltaY = |-20 - (-10)| = 10
    // horizontal movement is greater
    expect(result).toEqual({ x: -100, y: -10 });
  });

  it("should handle currentPoint equaling startPoint", () => {
    const currentPoint = { x: 10, y: 10 };
    const startPoint = { x: 10, y: 10 };
    const result = constrainToOrthogonal(true, currentPoint, startPoint);
    // DeltaX = 0, DeltaY = 0
    expect(result).toEqual({ x: 10, y: 10 });
  });
});
