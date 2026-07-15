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

  describe("operationChanged", () => {
    let comp;
    beforeEach(() => {
      comp = new ImageOperationComponent(operation, canvasContainer);
    });

    it("should update height when property is imageHeight", () => {
      comp.operationChanged("imageHeight", 50);
      expect(comp.shadow.style.height).toBe("50%");
    });

    it("should update width when property is imageWidth", () => {
      comp.operationChanged("imageWidth", 75);
      expect(comp.shadow.style.width).toBe("75%");
    });

    it("should update opacity when property is opacity", () => {
      comp.operationChanged("opacity", 0.5);
      expect(comp.shadow.style.opacity).toBe("0.5");
    });

    it("should update objectFit when property is objectFit", () => {
      comp.operationChanged("objectFit", "contain");
      expect(comp.shadow.style.objectFit).toBe("contain");
    });

    it("should update src attribute when property is url", () => {
      comp.operationChanged("url", "/images/new_image.jpg");
      expect(comp.shadow.getAttribute("src")).toBe("/images/new_image.jpg");
    });
  });

  describe("createDefaultOperation", () => {
    it("should create expected default object with minimal required arguments", () => {
      const defaultOp = ImageOperationComponent.createDefaultOperation("id-123", 50, 150);
      expect(defaultOp).toEqual({
        type: "image",
        operation: "create",
        name: "",
        id: "id-123",
        x: 50,
        y: 150,
        width: 100,
        height: 100,
        imageHeight: 100,
        imageWidth: 100,
        opacity: 1.0,
        url: "/images/default_image.jpg",
        subType: null,
      });
    });

    it("should accurately assign all provided properties", () => {
      const allArgsOp = ImageOperationComponent.createDefaultOperation(
        "id-999", 10, 20, 200, 300, "/images/custom.png", 50, 75, "logo"
      );
      expect(allArgsOp).toEqual({
        type: "image",
        operation: "create",
        name: "",
        id: "id-999",
        x: 10,
        y: 20,
        width: 200,
        height: 300,
        url: "/images/custom.png",
        imageHeight: 50,
        imageWidth: 75,
        opacity: 1.0,
        subType: "logo",
      });
    });
  });
});
