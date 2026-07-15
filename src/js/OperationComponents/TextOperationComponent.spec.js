import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TextOperationComponent } from "./TextOperationComponent.js";

vi.mock("moveable", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      updateRect: vi.fn(),
      destroy: vi.fn(),
    })),
  };
});

describe("TextOperationComponent", () => {
  let canvasContainer;
  let operation;

  beforeEach(() => {
    canvasContainer = document.createElement("div");
    document.body.appendChild(canvasContainer);
    operation = {
      type: "text",
      x: 10,
      y: 20,
      height: 100,
      width: 100,
      operation: "create",
      text: "hello",
    };
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should create successfully with valid operation", () => {
    const comp = new TextOperationComponent(operation, canvasContainer);
    expect(comp).toBeDefined();
  });

  it("should securely reject null or undefined text values via native TypeError", () => {
    expect(() => new TextOperationComponent({ ...operation, text: null }, canvasContainer)).toThrow(
      TypeError,
    );
  });
});
