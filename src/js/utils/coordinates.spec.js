import { describe, it, expect } from "vitest";
import { constrainToAxis } from "./coordinates.js";

describe("constrainToAxis", () => {
  it("returns unmodified point if not constrained", () => {
    const start = { x: 0, y: 0 };
    const current = { x: 10, y: 5 };
    expect(constrainToAxis(current, start, false)).toEqual(current);
  });

  it("constrains horizontally if deltaX > deltaY", () => {
    const start = { x: 0, y: 0 };
    const current = { x: 10, y: 5 };
    expect(constrainToAxis(current, start, true)).toEqual({ x: 10, y: 0 });
  });

  it("constrains vertically if deltaY >= deltaX", () => {
    const start = { x: 0, y: 0 };
    const current = { x: 5, y: 10 };
    expect(constrainToAxis(current, start, true)).toEqual({ x: 0, y: 10 });
  });
});
