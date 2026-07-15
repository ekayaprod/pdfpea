import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BasicOperationComponent } from "./BasicOperationComponent.js";

vi.mock("moveable", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      updateRect: vi.fn(),
      destroy: vi.fn()
    }))
  };
});

describe("BasicOperationComponent", () => {
  let canvasContainer;
  let operation;

  beforeEach(() => {
    canvasContainer = document.createElement("div");
    document.body.appendChild(canvasContainer);
    operation = {
      type: "test",
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

  it("should aggressively reject null canvasContainer via native TypeError", () => {
    expect(() => new BasicOperationComponent(operation, null)).toThrow(TypeError);
  });

  it("should properly initialize wrapper container styles", () => {
    const component = new BasicOperationComponent(operation, canvasContainer);
    expect(component.wrapperContainer.style.left).toBe("10px");
    expect(component.wrapperContainer.style.top).toBe("20px");
    expect(component.wrapperContainer.style.height).toBe("100px");
    expect(component.wrapperContainer.style.width).toBe("100px");
  });
});
