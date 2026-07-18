import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RectangleOperationComponent } from "./RectangleOperationComponent.js";

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
    expect(comp.shadow.tagName.toLowerCase()).toBe("div");
  });

  it("should securely reject missing borderWidth in operation", () => {
    expect(
      () =>
        new RectangleOperationComponent({ ...operation, borderWidth: undefined }, canvasContainer),
    ).toThrow(TypeError);
  });

  describe("operationChanged", () => {
    let comp;
    beforeEach(() => {
      comp = new RectangleOperationComponent(operation, canvasContainer);
    });

    it("should update borderWidth, width, height, and borderStyle when property is borderWidth", () => {
      comp.operationChanged("borderWidth", 4);
      expect(comp.shadow.style.borderWidth).toBe("4px");
      expect(comp.shadow.style.width).toBe("100%");
      expect(comp.shadow.style.height).toBe("100%");
      expect(comp.shadow.style.borderStyle).toBe("solid");
    });

    it("should update opacity when property is opacity", () => {
      comp.operationChanged("opacity", 0.5);
      expect(comp.shadow.style.opacity).toBe("0.5");
    });

    it("should update borderColor when property is borderColor", () => {
      comp.operationChanged("borderColor", "#ff0000");
      expect(comp.shadow.style.borderColor).toBe("rgb(255, 0, 0)");
    });

    it("should update fill (background) when property is fill", () => {
      comp.operationChanged("fill", "#00ff00");
      expect(comp.shadow.style.background).toBe("rgb(0, 255, 0)");
    });

    it("should safely ignore unknown properties", () => {
      expect(() => {
        comp.operationChanged("unknownProperty", "someValue");
      }).not.toThrow();
    });
  });

  describe("createDefaultOperation", () => {
    it("should create expected default object with minimal required arguments", () => {
      const defaultOp = RectangleOperationComponent.createDefaultOperation("id-123", 50, 150);
      expect(defaultOp).toEqual({
        type: "rectangle",
        operation: "create",
        name: "",
        id: "id-123",
        x: 50,
        y: 150,
        height: 100,
        width: 100,
        fill: "",
        opacity: 1.0,
        borderOpacity: 1.0,
        borderColor: "#FF0000",
        borderWidth: 2,
        borderStyle: "solid",
      });
    });

    it("should accurately assign all provided properties", () => {
      const allArgsOp = RectangleOperationComponent.createDefaultOperation(
        "id-999",
        10,
        20,
        200,
        300,
        "#cccccc",
        "#0000ff",
        5,
        "dashed",
        0.8,
      );
      expect(allArgsOp).toEqual({
        type: "rectangle",
        operation: "create",
        name: "",
        id: "id-999",
        x: 10,
        y: 20,
        height: 300,
        width: 200,
        fill: "#cccccc",
        opacity: 0.8,
        borderOpacity: 1.0,
        borderColor: "#0000ff",
        borderWidth: 5,
        borderStyle: "dashed",
      });
    });
  });
});
