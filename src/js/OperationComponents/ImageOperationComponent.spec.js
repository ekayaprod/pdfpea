import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ImageOperationComponent } from "./ImageOperationComponent.js";

vi.mock("moveable", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      updateRect: vi.fn(),
      destroy: vi.fn(),
    })),
  };
});

describe("ImageOperationComponent", () => {
  let canvasContainer;
  let operation;

  beforeEach(() => {
    canvasContainer = document.createElement("div");
    document.body.appendChild(canvasContainer);
    operation = {
      type: "image",
      x: 10,
      y: 20,
      height: 100,
      width: 100,
      operation: "create",
    };
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should create successfully with valid operation", () => {
    const comp = new ImageOperationComponent(operation, canvasContainer);
    expect(comp).toBeDefined();
    expect(comp.shadow.getAttribute("src")).toBe("/images/default_image.jpg");
  });

  it("should securely reject null or undefined operation", () => {
    expect(() => new ImageOperationComponent(null, canvasContainer)).toThrow(TypeError);
  });
});
