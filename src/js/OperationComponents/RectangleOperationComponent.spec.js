import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RectangleOperationComponent } from "./RectangleOperationComponent.js";

vi.mock("moveable", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      updateRect: vi.fn(),
      destroy: vi.fn(),
    })),
  };
});

describe("RectangleOperationComponent", () => {
  let canvasContainer;
  let operation;

  beforeEach(() => {
    canvasContainer = document.createElement("div");
    document.body.appendChild(canvasContainer);
    operation = {
      type: "rectangle",
      x: 10,
      y: 20,
      height: 100,
      width: 100,
      operation: "create",
      borderWidth: 2,
    };
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should create successfully with valid operation", () => {
    const comp = new RectangleOperationComponent(operation, canvasContainer);
    expect(comp).toBeDefined();
  });

  it("should aggressively reject undefined borderWidth for rectangles", () => {
    const { borderWidth, ...missingBorderOp } = operation;
    expect(() => new RectangleOperationComponent(missingBorderOp, canvasContainer)).toThrow(
      TypeError,
    );
  });
});
