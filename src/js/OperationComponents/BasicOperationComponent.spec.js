import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BasicOperationComponent } from "./BasicOperationComponent.js";
import Moveable from "moveable";

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
    expect(window.preventComponentCreation).toBe(true);
    expect(eventDispatched).toBe(true);

    vi.advanceTimersByTime(200);
    expect(window.preventComponentCreation).toBe(false);

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
  expect(typeof deleteAble.render).toBe("function");
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
