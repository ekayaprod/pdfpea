import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ImageOperationComponent } from "./ImageOperationComponent.js";

vi.mock("moveable", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      updateRect: vi.fn(),
      destroy: vi.fn()
    }))
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
      operation: "create"
    };
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should securely reject null or malformed image paths", () => {
    expect(() => new ImageOperationComponent({ ...operation, src: null }, canvasContainer)).toThrow(TypeError);
  });
});
