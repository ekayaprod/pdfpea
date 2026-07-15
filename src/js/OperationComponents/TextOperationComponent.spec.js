import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TextOperationComponent } from "./TextOperationComponent.js";
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

    vi.spyOn(comp.shadow, 'focus');

    const event = new MouseEvent('dblclick');
    vi.spyOn(event, 'stopPropagation');

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

    const event = new Event('blur');
    vi.spyOn(event, 'stopPropagation');

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
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = originalCreateElement(tag);
      if (tag === 'div') {
        Object.defineProperty(el, 'offsetWidth', { value: 100, configurable: true });
        Object.defineProperty(el, 'offsetHeight', { value: 30, configurable: true });
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
    vi.spyOn(comp, 'updateSize');

    // text
    comp.operationChanged('text', 'new text content');
    expect(comp.shadow.innerText).toBe('new text content');
    expect(comp.updateSize).toHaveBeenCalledTimes(1);

    // color
    comp.operationChanged('color', '#ff0000');
    expect(comp.shadow.style.color).toBe('rgb(255, 0, 0)'); // JSDOM normalizes hex to rgb

    // fontSize
    comp.operationChanged('fontSize', '24');
    expect(comp.shadow.style.fontSize).toBe('24px');
    expect(comp.updateSize).toHaveBeenCalledTimes(2);

    // fontFamily
    comp.operationChanged('fontFamily', 'Courier');
    expect(comp.shadow.style.fontFamily).toBe('Courier');
    expect(comp.updateSize).toHaveBeenCalledTimes(3);

    // opacity
    comp.operationChanged('opacity', '0.5');
    expect(comp.shadow.style.opacity).toBe('0.5');

    // lineHeight
    comp.operationChanged('lineHeight', '1.5');
    expect(comp.shadow.style.lineHeight).toBe('1.5');

    // wordBreak
    comp.operationChanged('wordBreak', 'break-word');
    expect(comp.shadow.style.whiteSpace).toBe('pre-wrap');
    expect(comp.shadow.style.wordBreak).toBe('break-word');
  });

  it("should setup Moveable with resizable: false and drag events in makeMoveable", () => {
    const comp = new TextOperationComponent(operation, canvasContainer);

    vi.spyOn(comp, 'createDeleteAble').mockReturnValue('mock-delete-able');

    comp.makeMoveable();

    expect(comp.createDeleteAble).toHaveBeenCalled();
    expect(comp.wrapperContainer.moveable).toBeDefined();
    expect(comp.wrapperContainer.moveable.options.resizable).toBe(false); // Specifically verifying resizable is false
    expect(comp.wrapperContainer.moveable.on).toHaveBeenCalled();
    expect(comp.wrapperContainer.moveable.updateRect).toHaveBeenCalled();

    // Test the drag event logic
    const onCalls = comp.wrapperContainer.moveable.on.mock.calls;
    const dragCall = onCalls.find(call => call[0] === 'drag');
    expect(dragCall).toBeDefined();

    const dragHandler = dragCall[1];
    vi.spyOn(comp, 'fireEvent').mockImplementation(() => {});

    const mockTarget = { style: { left: '', top: '' } };
    dragHandler({ target: mockTarget, left: 100, top: 200 });

    expect(mockTarget.style.left).toBe('100px');
    expect(mockTarget.style.top).toBe('200px');
    expect(comp.operation.x).toBe(100);
    expect(comp.operation.y).toBe(200);
    expect(comp.fireEvent).toHaveBeenCalledWith('pdfeditor.componentDragging');
  });

  it("should create a valid default operation", () => {
    const defaultOp = TextOperationComponent.createDefaultOperation(
      "test-id", 50, 60, 200, 30, "Times New Roman", 20, "#ff0000", 0.8
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
