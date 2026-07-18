import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LinkOperationComponent } from "./LinkOperationComponent.js";

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
    expect(comp.shadow.tagName.toLowerCase()).toBe("div");
    expect(comp.shadow.classList.contains("link-component")).toBe(true);
  });

  it("should securely reject missing linkValue in operation", () => {
    expect(
      () => new LinkOperationComponent({ ...operation, linkValue: undefined }, canvasContainer),
    ).toThrow(TypeError);
    expect(
      () => new LinkOperationComponent({ ...operation, linkValue: null }, canvasContainer),
    ).toThrow(TypeError);
  });

  describe("operationChanged", () => {
    let comp;
    beforeEach(() => {
      comp = new LinkOperationComponent(operation, canvasContainer);
    });

    it("should update borderWidth and borderStyle when property is borderWidth", () => {
      comp.operationChanged("borderWidth", 4);
      expect(comp.shadow.style.borderWidth).toBe("4px");
      expect(comp.shadow.style.borderStyle).toBe("solid");
    });

    it("should update opacity when property is opacity", () => {
      comp.operationChanged("opacity", 0.5);
      expect(comp.shadow.style.opacity).toBe("0.5");
    });

    it("should update borderColor and borderStyle when property is borderColor", () => {
      comp.operationChanged("borderColor", "#ff0000");
      expect(comp.shadow.style.borderColor).toBe("rgb(255, 0, 0)");
      expect(comp.shadow.style.borderStyle).toBe("solid");
    });

    it("should update fill (backgroundColor) when property is fill", () => {
      comp.operationChanged("fill", "#00ff00");
      expect(comp.shadow.style.backgroundColor).toBe("rgb(0, 255, 0)");
    });

    it("should safely ignore unknown properties", () => {
      expect(() => {
        comp.operationChanged("unknownProperty", "someValue");
      }).not.toThrow();
    });
  });

  describe("createDefaultOperation", () => {
    it("should create expected default object with minimal required arguments", () => {
      const defaultOp = LinkOperationComponent.createDefaultOperation("id-123", 50, 150);
      expect(defaultOp).toEqual({
        type: "link",
        operation: "create",
        name: "",
        id: "id-123",
        x: 50,
        y: 150,
        height: 30,
        width: 100,
        linkType: "url",
        linkValue: "",
        fill: "rgba(0, 122, 204, 0.1)",
        opacity: 1.0,
        borderColor: "#007acc",
        borderWidth: 1,
      });
    });

    it("should accurately assign all provided properties", () => {
      const allArgsOp = LinkOperationComponent.createDefaultOperation(
        "id-999",
        10,
        20,
        200,
        300,
        "page",
        "5",
        "#cccccc",
        "#0000ff",
        5,
        0.8,
      );
      expect(allArgsOp).toEqual({
        type: "link",
        operation: "create",
        name: "",
        id: "id-999",
        x: 10,
        y: 20,
        height: 300,
        width: 200,
        linkType: "page",
        linkValue: "5",
        fill: "#cccccc",
        opacity: 0.8,
        borderColor: "#0000ff",
        borderWidth: 5,
      });
    });
  });
});
