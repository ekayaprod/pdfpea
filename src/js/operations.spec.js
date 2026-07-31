import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BasicOperationComponent, CheckboxOperationComponent, ImageOperationComponent, LinkOperationComponent, TextFieldOperationComponent, TextOperationComponent, CircleOperationComponent, RectangleOperationComponent } from "./operations.js";

vi.mock("moveable", () => {
  return {
    default: class MockMoveable {
      constructor(container, options) {
        this.options = options;
        this.on = vi.fn();
        this.updateRect = vi.fn();
        this.destroy = vi.fn();
      }
    },
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
      operation: "create",
    };
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("should aggressively reject null canvasContainer via native TypeError", () => {
    expect(() => new BasicOperationComponent(operation, null)).toThrow(TypeError);
  });

  it("should aggressively reject null operation via native TypeError", () => {
    expect(() => new BasicOperationComponent(null, canvasContainer)).toThrow(TypeError);
  });

  it("should properly initialize wrapper container styles", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    expect(component.wrapperContainer.style.left).toBe("10px");
    expect(component.wrapperContainer.style.top).toBe("20px");
    expect(component.wrapperContainer.style.height).toBe("100px");
    expect(component.wrapperContainer.style.width).toBe("100px");
  });

  it("should handle Delete keydown event", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "deleteComponent").mockImplementation(() => {});

    component.wrapperContainer.classList.add("selected");

    const event = new KeyboardEvent("keydown", { key: "Delete" });
    document.dispatchEvent(event);

    expect(component.deleteComponent).toHaveBeenCalled();
  });

  it("should not delete on Delete keydown if not selected", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "deleteComponent").mockImplementation(() => {});

    const event = new KeyboardEvent("keydown", { key: "Delete" });
    document.dispatchEvent(event);

    expect(component.deleteComponent).not.toHaveBeenCalled();
  });

  it("should handle click event and select component", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "setSelected").mockImplementation(() => {});

    const event = new MouseEvent("click");
    vi.spyOn(event, "stopPropagation");

    component.wrapperContainer.dispatchEvent(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.setSelected).toHaveBeenCalledWith(true);
  });

  it("should handle pdfeditor.shouldClearAllSelection event", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "setSelected").mockImplementation(() => {});

    const event = new CustomEvent("pdfeditor.shouldClearAllSelection", {
      detail: { target: null },
    });
    document.dispatchEvent(event);

    expect(component.setSelected).toHaveBeenCalledWith(false);
  });

  it("should properly setup and remove Moveable", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );

    component.makeMoveable();
    expect(component.wrapperContainer.moveable).toBeDefined();

    component.removeMoveable();
    expect(component.wrapperContainer.moveable).toBeNull();
  });

  it("should handle setSelected", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "makeMoveable");
    vi.spyOn(component, "removeMoveable");
    vi.spyOn(component, "fireEvent").mockImplementation(() => {});

    component.setSelected(true);
    expect(component.wrapperContainer.classList.contains("selected")).toBe(true);
    expect(component.makeMoveable).toHaveBeenCalled();
    expect(component.fireEvent).toHaveBeenCalledWith("pdfeditor.shouldClearAllSelection");
    expect(component.fireEvent).toHaveBeenCalledWith("pdfeditor.componentSelected");

    component.setSelected(false);
    expect(component.wrapperContainer.classList.contains("selected")).toBe(false);
    expect(component.removeMoveable).toHaveBeenCalled();
  });

  it("should proxy operation and handle changes", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    const proxy = component.getOperation();

    proxy.x = 50;
    expect(component.wrapperContainer.style.left).toBe("50px");

    proxy.y = 60;
    expect(component.wrapperContainer.style.top).toBe("60px");

    proxy.width = 150;
    expect(component.wrapperContainer.style.width).toBe("150px");

    proxy.height = 200;
    expect(component.wrapperContainer.style.height).toBe("200px");
  });

  it("should handle drag event", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "fireEvent").mockImplementation(() => {});

    component.makeMoveable();

    const onCalls = component.wrapperContainer.moveable.on.mock.calls;
    const dragCall = onCalls.find((call) => call[0] === "drag");
    expect(dragCall).toBeDefined();

    const dragHandler = dragCall[1];

    const mockTarget = { style: { left: "", top: "" } };
    dragHandler({ target: mockTarget, left: 100, top: 200 });

    expect(mockTarget.style.left).toBe("100px");
    expect(mockTarget.style.top).toBe("200px");
    expect(component.operation.x).toBe(100);
    expect(component.operation.y).toBe(200);
    expect(component.fireEvent).toHaveBeenCalledWith("pdfeditor.componentDragging");
  });

  it("should handle resize event", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "fireEvent").mockImplementation(() => {});

    component.makeMoveable();

    const onCalls = component.wrapperContainer.moveable.on.mock.calls;
    const resizeCall = onCalls.find((call) => call[0] === "resize");
    expect(resizeCall).toBeDefined();

    const resizeHandler = resizeCall[1];

    const mockTarget = { style: { left: "10px", top: "20px", width: "100px", height: "100px" } };

    // Test center/right/bottom resize
    resizeHandler({
      target: mockTarget,
      width: 150,
      height: 200,
      direction: [1, 1],
      delta: [50, 100],
    });

    expect(mockTarget.style.left).toBe("10px");
    expect(mockTarget.style.top).toBe("20px");
    expect(mockTarget.style.width).toBe("150px");
    expect(mockTarget.style.height).toBe("200px");

    // Test left/top resize
    resizeHandler({
      target: mockTarget,
      width: 150,
      height: 200,
      direction: [-1, -1],
      delta: [50, 100],
    });
    expect(mockTarget.style.left).toBe("-40px"); // 10 - 50
    expect(mockTarget.style.top).toBe("-80px"); // 20 - 100
  });

  it("should delete component", async () => {
    vi.useFakeTimers();
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "removeMoveable");
    vi.spyOn(component.wrapperContainer, "remove");

    let eventDispatched = false;
    document.addEventListener("pdfeditor.shouldClearAllSelection", () => {
      eventDispatched = true;
    });

    component.deleteComponent();

    expect(component.removeMoveable).toHaveBeenCalled();
    expect(component.wrapperContainer.remove).toHaveBeenCalled();
    expect(window.isComponentCreationPrevented).toBe(true);
    expect(eventDispatched).toBe(true);

    vi.advanceTimersByTime(200);
    expect(window.isComponentCreationPrevented).toBe(false);

    vi.useRealTimers();
  });

  it("should handle startMoveDrag", () => {
    const component = new BasicOperationComponent(
      { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
      document.createElement("div"),
    );
    vi.spyOn(component, "fireEvent").mockImplementation(() => {});

    const event = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
    vi.spyOn(event, "stopPropagation");
    vi.spyOn(event, "preventDefault");

    component.startMoveDrag(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();

    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 150 });
    document.dispatchEvent(moveEvent);

    expect(component.wrapperContainer.style.left).toBe("60px"); // 10 + 50
    expect(component.wrapperContainer.style.top).toBe("70px"); // 20 + 50
    expect(component.fireEvent).toHaveBeenCalledWith("pdfeditor.componentDragging");

    const upEvent = new MouseEvent("mouseup");
    document.dispatchEvent(upEvent);
  });
});

it("should handle createDeleteAble interactions", () => {
  const component = new BasicOperationComponent(
    { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
    document.createElement("div"),
  );
  const deleteAble = component.createDeleteAble();

  expect(deleteAble.name).toBe("deleteViewable");
  // Mock the Moveable r object
  const mockR = {
    createElement: vi.fn((tag, props, children) => {
      return { tag, props, children };
    }),
  };

  const rendered = deleteAble.render(null, mockR);
  // Verify strict DOM structure returned by the render function
  expect(rendered.tag).toBe("div");
  expect(rendered.props.className).toContain("moveable-delete-container");

  // Test Move button interactions
  const moveButtonProps = rendered.children[0].props;
  vi.spyOn(component, "startMoveDrag").mockImplementation(() => {});

  const mockMouseDownEvent = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
  moveButtonProps.onMouseDown(mockMouseDownEvent);
  expect(component.startMoveDrag).toHaveBeenCalledWith(mockMouseDownEvent);

  const mockClickEvent = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
  moveButtonProps.onClick(mockClickEvent);
  expect(mockClickEvent.stopPropagation).toHaveBeenCalled();
  expect(mockClickEvent.preventDefault).toHaveBeenCalled();

  // Test Delete button interactions
  const deleteButtonProps = rendered.children[1].props;
  vi.spyOn(component, "deleteComponent").mockImplementation(() => {});

  const mockDeleteMouseDownEvent = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
  deleteButtonProps.onMouseDown(mockDeleteMouseDownEvent);
  expect(mockDeleteMouseDownEvent.stopPropagation).toHaveBeenCalled();
  expect(mockDeleteMouseDownEvent.preventDefault).toHaveBeenCalled();

  const mockDeleteClickEvent = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
  deleteButtonProps.onClick(mockDeleteClickEvent);
  expect(mockDeleteClickEvent.stopPropagation).toHaveBeenCalled();
  expect(mockDeleteClickEvent.preventDefault).toHaveBeenCalled();
  expect(component.deleteComponent).toHaveBeenCalled();
});

it("should handle startMoveDrag without moveable", () => {
  const component = new BasicOperationComponent(
    { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
    document.createElement("div"),
  );
  vi.spyOn(component, "fireEvent").mockImplementation(() => {});

  // Explicitly set moveable to null to cover the branch
  component.wrapperContainer.moveable = null;

  const event = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
  vi.spyOn(event, "stopPropagation");
  vi.spyOn(event, "preventDefault");

  component.startMoveDrag(event);

  const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 150 });
  document.dispatchEvent(moveEvent);

  expect(component.wrapperContainer.style.left).toBe("60px");
  expect(component.wrapperContainer.style.top).toBe("70px");

  const upEvent = new MouseEvent("mouseup");
  document.dispatchEvent(upEvent);
});

it("should handle handleBasicOperation without moveable", () => {
  const component = new BasicOperationComponent(
    { type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" },
    document.createElement("div"),
  );
  // Moveable is not set yet

  component.handleBasicOperation("x", 50);
  expect(component.wrapperContainer.style.left).toBe("50px");
});

describe("CheckboxOperationComponent", () => {
  let mockContainer;

  beforeEach(() => {
    mockContainer = document.createElement("div");
  });

  it("initializes with default values", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);

    expect(component.shadow.getAttribute("src")).toBe("./images/checkbox-unchecked.png");
  });

  it("updates width", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("width", 50);
    expect(component.wrapperContainer.style.width).toBe("50px");
  });

  it("updates height", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("height", 50);
    expect(component.wrapperContainer.style.height).toBe("50px");
  });

  it("updates backgroundColor", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("backgroundColor", "#ffffff");
    expect(component.wrapperContainer.style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("updates opacity", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("opacity", "0.5");
    expect(component.wrapperContainer.style.opacity).toBe("0.5");
  });

  it("updates fontFamily", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("fontFamily", "Arial");
    expect(component.shadow.style.fontFamily).toBe("Arial");
  });

  it("updates borderColor", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("borderColor", "#000000");
    expect(component.shadow.style.borderColor).toBe("rgb(0, 0, 0)");
  });

  it("updates borderWidth", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("borderWidth", 2);
    expect(component.shadow.style.borderWidth).toBe("2px");
    expect(component.shadow.style.borderStyle).toBe("solid");
    expect(component.shadow.style.width).toBe("calc(100% - 4px)");
    expect(component.shadow.style.height).toBe("calc(100% - 4px)");
  });

  it("updates isChecked", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("isChecked", true);
    expect(component.shadow.getAttribute("src")).toBe("./images/checkbox-checked.png");
    component.operationChanged("isChecked", false);
    expect(component.shadow.getAttribute("src")).toBe("./images/checkbox-unchecked.png");
  });

  it("creates update default operation", () => {
    const op = CheckboxOperationComponent.updateDefaultOperation(
      "1",
      10,
      20,
      30,
      40,
      2,
      "#fff",
      "#000",
      "#eee",
      true,
      false,
    );
    expect(op.height).toBe(34);
    expect(op.width).toBe(44);
  });
});

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
    expect(comp.shadow.getAttribute("src")).toBe("./images/default_image.jpg");
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
      comp.operationChanged("url", "./images/new_image.jpg");
      expect(comp.shadow.getAttribute("src")).toBe("./images/new_image.jpg");
    });

    it("should safely ignore unknown properties", () => {
      expect(() => {
        comp.operationChanged("unknownProperty", "someValue");
      }).not.toThrow();
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
        url: "./images/default_image.jpg",
        subType: null,
      });
    });

    it("should accurately assign all provided properties", () => {
      const allArgsOp = ImageOperationComponent.createDefaultOperation(
        "id-999",
        10,
        20,
        200,
        300,
        "./images/custom.png",
        50,
        75,
        "logo",
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
        url: "./images/custom.png",
        imageHeight: 50,
        imageWidth: 75,
        opacity: 1.0,
        subType: "logo",
      });
    });
  });
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

describe("TextFieldOperationComponent", () => {
  let mockContainer;

  beforeEach(() => {
    mockContainer = document.createElement("div");
  });

  it("initializes with default values", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);

    expect(component.shadow.tagName.toLowerCase()).toBe("div");
    expect(component.shadow.contentEditable.toString()).toBe("false");
  });

  it("updates backgroundColor", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged("backgroundColor", "#ffffff");
    expect(component.wrapperContainer.style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("updates opacity", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged("opacity", "0.5");
    expect(component.wrapperContainer.style.opacity).toBe("0.5");
  });

  it("updates fontFamily", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged("fontFamily", "Arial");
    expect(component.shadow.style.fontFamily).toBe("Arial");
  });

  it("updates fontSize", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged("fontSize", 16);
    expect(component.shadow.style.fontSize).toBe("16px");
  });

  it("updates borderColor", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged("borderColor", "#000000");
    expect(component.shadow.style.borderColor).toBe("rgb(0, 0, 0)");
  });

  it("updates borderWidth", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged("borderWidth", 2);
    expect(component.shadow.style.borderWidth).toBe("2px");
    expect(component.shadow.style.borderStyle).toBe("solid");
    expect(component.shadow.style.width).toBe("calc(100% - 4px)");
    expect(component.shadow.style.height).toBe("calc(100% - 4px)");
  });

  it("updates text", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged("text", "Hello World");
    expect(component.shadow.innerText).toBe("Hello World");
  });

  it("handles dblclick event", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    let eventFired = false;
    component.shadow.focus = () => {
      eventFired = true;
    };
    const event = new Event("dblclick");
    component.wrapperContainer.dispatchEvent(event);
    expect(component.shadow.contentEditable.toString()).toBe("true");
    expect(eventFired).toBe(true);
  });

  it("handles blur event", () => {
    const operation = TextFieldOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.shadow.innerText = "New Text";
    const event = new Event("blur");
    component.shadow.dispatchEvent(event);
    expect(component.shadow.contentEditable.toString()).toBe("false");
    expect(component.getOperation().text).toBe("New Text");
  });

  it("creates update default operation", () => {
    const op = TextFieldOperationComponent.updateDefaultOperation(
      "1",
      10,
      20,
      30,
      40,
      "text",
      2,
      "#fff",
      "#000",
      "#eee",
      "Arial",
      14,
      true,
      false,
      false,
      10,
      "Left",
    );
    expect(op.height).toBe(34);
    expect(op.width).toBe(44);
    expect(op.text).toBe("text");
  });
});

vi.mock("moveable", () => {
  return {
    default: class MockMoveable {
      constructor(container, options) {
        this.options = options;
        this.on = vi.fn();
        this.updateRect = vi.fn();
        this.destroy = vi.fn();
      }
    },
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
    vi.clearAllMocks();
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

  it("should make shadow editable and focus on dblclick", () => {
    const comp = new TextOperationComponent(operation, canvasContainer);

    expect(String(comp.shadow.contentEditable)).toBe("false");

    vi.spyOn(comp.shadow, "focus");

    const event = new MouseEvent("dblclick");
    vi.spyOn(event, "stopPropagation");

    comp.wrapperContainer.dispatchEvent(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(String(comp.shadow.contentEditable)).toBe("true");
    expect(comp.shadow.focus).toHaveBeenCalled();
  });

  it("should handle blur event properly", () => {
    const comp = new TextOperationComponent(operation, canvasContainer);

    comp.shadow.contentEditable = "true";
    comp.shadow.innerText = "new text after edit";

    const updateSizeSpy = vi.fn();
    comp.updateSize = updateSizeSpy;

    const setSelectedSpy = vi.fn();
    comp.setSelected = setSelectedSpy;

    const event = new Event("blur");
    vi.spyOn(event, "stopPropagation");

    comp.shadow.dispatchEvent(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(String(comp.shadow.contentEditable)).toBe("false");
    expect(comp.operation.text).toBe("new text after edit");
    expect(updateSizeSpy).toHaveBeenCalled();
    expect(setSelectedSpy).toHaveBeenCalledWith(true);
  });

  it("should update size based on temporary DOM element measurements", () => {
    const comp = new TextOperationComponent(operation, canvasContainer);

    comp.wrapperContainer.moveable = { updateRect: vi.fn() };

    comp.shadow.innerText = "dummy text";
    comp.shadow.style.fontSize = "20px";
    comp.shadow.style.fontFamily = "Arial";

    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tag) => {
      const el = originalCreateElement(tag);
      if (tag === "div") {
        Object.defineProperty(el, "offsetWidth", { value: 100, configurable: true });
        Object.defineProperty(el, "offsetHeight", { value: 30, configurable: true });
      }
      return el;
    });

    try {
      comp.updateSize();

      expect(comp.operation.width).toBe(104);
      expect(comp.operation.height).toBe(34);
      expect(comp.wrapperContainer.style.width).toBe("104px");
      expect(comp.wrapperContainer.style.height).toBe("34px");
      expect(comp.wrapperContainer.moveable.updateRect).toHaveBeenCalled();
    } finally {
      createElementSpy.mockRestore();
    }
  });

  it("should handle operationChanged for various properties", () => {
    const comp = new TextOperationComponent(operation, canvasContainer);
    vi.spyOn(comp, "updateSize");

    // text
    comp.operationChanged("text", "new text content");
    expect(comp.shadow.innerText).toBe("new text content");
    expect(comp.updateSize).toHaveBeenCalledTimes(1);

    // color
    comp.operationChanged("color", "#ff0000");
    expect(comp.shadow.style.color).toBe("rgb(255, 0, 0)"); // JSDOM normalizes hex to rgb

    // fontSize
    comp.operationChanged("fontSize", "24");
    expect(comp.shadow.style.fontSize).toBe("24px");
    expect(comp.updateSize).toHaveBeenCalledTimes(2);

    // fontFamily
    comp.operationChanged("fontFamily", "Courier");
    expect(comp.shadow.style.fontFamily).toBe("Courier");
    expect(comp.updateSize).toHaveBeenCalledTimes(3);

    // opacity
    comp.operationChanged("opacity", "0.5");
    expect(comp.shadow.style.opacity).toBe("0.5");

    // lineHeight
    comp.operationChanged("lineHeight", "1.5");
    expect(comp.shadow.style.lineHeight).toBe("1.5");

    // wordBreak
    comp.operationChanged("wordBreak", "break-word");
    expect(comp.shadow.style.whiteSpace).toBe("pre-wrap");
    expect(comp.shadow.style.wordBreak).toBe("break-word");
  });

  it("should setup Moveable with resizable: false and drag events in makeMoveable", () => {
    const comp = new TextOperationComponent(operation, canvasContainer);

    vi.spyOn(comp, "createDeleteAble").mockReturnValue("mock-delete-able");

    comp.makeMoveable();

    expect(comp.createDeleteAble).toHaveBeenCalled();
    expect(comp.wrapperContainer.moveable).toBeDefined();
    expect(comp.wrapperContainer.moveable.options.resizable).toBe(false); // Specifically verifying resizable is false
    expect(comp.wrapperContainer.moveable.on).toHaveBeenCalled();
    expect(comp.wrapperContainer.moveable.updateRect).toHaveBeenCalled();

    // Test the drag event logic
    const onCalls = comp.wrapperContainer.moveable.on.mock.calls;
    const dragCall = onCalls.find((call) => call[0] === "drag");
    expect(dragCall).toBeDefined();

    const dragHandler = dragCall[1];
    vi.spyOn(comp, "fireEvent").mockImplementation(() => {});

    const mockTarget = { style: { left: "", top: "" } };
    dragHandler({ target: mockTarget, left: 100, top: 200 });

    expect(mockTarget.style.left).toBe("100px");
    expect(mockTarget.style.top).toBe("200px");
    expect(comp.operation.x).toBe(100);
    expect(comp.operation.y).toBe(200);
    expect(comp.fireEvent).toHaveBeenCalledWith("pdfeditor.componentDragging");
  });

  it("should create a valid default operation", () => {
    const defaultOp = TextOperationComponent.createDefaultOperation(
      "test-id",
      50,
      60,
      200,
      30,
      "Times New Roman",
      20,
      "#ff0000",
      0.8,
    );

    expect(defaultOp).toEqual({
      type: "text",
      operation: "create",
      name: "",
      identifier: "test-id",
      height: 30,
      width: 200,
      x: 50,
      y: 60,
      xPadding: 2,
      yPadding: 5,
      text: "sample text",
      fontFamily: "Times New Roman",
      color: "#ff0000",
      fontSize: 20,
      lineHeight: 1,
      opacity: 0.8,
      wordBreak: "break-all",
    });
  });
});

describe("CircleOperationComponent", () => {
  let mockContainer;

  beforeEach(() => {
    mockContainer = document.createElement("div");
  });

  it("initializes with default values", () => {
    const operation = CircleOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);

    expect(component.shadow.tagName.toLowerCase()).toBe("div");
    expect(component.shadow.classList.contains("component-content")).toBe(true);
  });

  it("updates borderWidth", () => {
    const operation = CircleOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged("borderWidth", 2);
    expect(component.shadow.style.borderWidth).toBe("2px");
    expect(component.shadow.style.borderStyle).toBe("solid");
    expect(component.shadow.style.width).toBe("100%");
    expect(component.shadow.style.height).toBe("100%");
  });

  it("updates borderRadius", () => {
    const operation = CircleOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged("borderRadius", 50);
    expect(component.shadow.style.borderRadius).toBe("50%");
  });

  it("updates opacity", () => {
    const operation = CircleOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged("opacity", "0.5");
    expect(component.shadow.style.opacity).toBe("0.5");
  });

  it("updates borderColor", () => {
    const operation = CircleOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged("borderColor", "#000000");
    expect(component.shadow.style.borderColor).toBe("rgb(0, 0, 0)");
  });

  it("updates color", () => {
    const operation = CircleOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged("color", "#ff0000");
    expect(component.shadow.style.background).toBe("rgb(255, 0, 0)");
  });

  it("updates fill", () => {
    const operation = CircleOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged("fill", "#00ff00");
    expect(component.shadow.style.background).toBe("rgb(0, 255, 0)");
  });

  it("creates default operation", () => {
    const op = CircleOperationComponent.createDefaultOperation("1", 10, 20);
    expect(op.type).toBe("circle");
    expect(op.borderRadius).toBe(50);
  });
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
