import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LinkOperationComponent } from "./LinkOperationComponent.js";

vi.mock("moveable", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      updateRect: vi.fn(),
      destroy: vi.fn(),
    })),
  };
});

describe("LinkOperationComponent", () => {
  let canvasContainer;
  let operation;

  beforeEach(() => {
    canvasContainer = document.createElement("div");
    document.body.appendChild(canvasContainer);
    operation = {
      type: "link",
      x: 10,
      y: 20,
      height: 100,
      width: 100,
      operation: "create",
      linkValue: "https://example.com",
    };
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should create successfully with valid operation", () => {
    const comp = new LinkOperationComponent(operation, canvasContainer);
    expect(comp).toBeDefined();
  });

  it("should aggressively reject null urls for links", () => {
    expect(
      () => new LinkOperationComponent({ ...operation, linkValue: null }, canvasContainer),
    ).toThrow(TypeError);
  });
});
