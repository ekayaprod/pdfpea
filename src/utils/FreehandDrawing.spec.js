import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FreehandDrawing, freehandDrawing } from "./FreehandDrawing.js";

describe("FreehandDrawing - Pure Functions Boundary Stress Tests", () => {
  it("calculateBoundingBox handles empty path arrays correctly", () => {
    const result = freehandDrawing.calculateBoundingBox([], 2);
    expect(result).toBeNull();
  });

  it("smoothPath handles insufficient points gracefully", () => {
    const shortPath = [{ x: 10, y: 10 }, { x: 20, y: 20 }];
    const result = freehandDrawing.smoothPath(shortPath, 5);
    expect(result).toEqual(shortPath);
  });

  it("pathToSvgDataUrl returns null for an empty path", () => {
    const result = freehandDrawing.pathToSvgDataUrl([], {});
    expect(result).toBeNull();
  });
});

describe("FreehandDrawing - Canvas and State Management", () => {
  let drawing;
  let mockContext;
  let container;

  beforeEach(() => {
    drawing = new FreehandDrawing();
    container = document.createElement("div");
    // Mock getBoundingClientRect for container
    container.getBoundingClientRect = () => ({ width: 800, height: 600 });
    document.body.appendChild(container);

    mockContext = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      clearRect: vi.fn(),
    };

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(mockContext);
  });

  afterEach(() => {
    drawing.cleanup();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    vi.restoreAllMocks();
  });

  it("createCanvas initializes canvas and context correctly", () => {
    const canvas = drawing.createCanvas(container, { zoomFactor: 2, color: "#123456", width: 5 });
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(container.contains(canvas)).toBe(true);
    expect(drawing.context).toBe(mockContext);

    // Check initial styles
    expect(mockContext.strokeStyle).toBe("#123456");
    expect(mockContext.lineWidth).toBe(5);
    expect(mockContext.lineCap).toBe("round");
    expect(mockContext.lineJoin).toBe("round");

    // Check scaled dimensions based on mock getBoundingClientRect
    expect(canvas.width).toBe(400); // 800 / 2
    expect(canvas.height).toBe(300); // 600 / 2
  });

  it("updateCanvasStyle updates context properties", () => {
    drawing.createCanvas(container);
    drawing.updateCanvasStyle({ color: "#abcdef", width: 10 });
    expect(mockContext.strokeStyle).toBe("#abcdef");
    expect(mockContext.lineWidth).toBe(10);
  });

  it("startPath and addPoint update path and call context correctly", () => {
    drawing.createCanvas(container);
    drawing.startPath(10, 20);

    expect(drawing.getCurrentPath()).toEqual([{ x: 10, y: 20 }]);
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalledWith(10, 20);

    drawing.addPoint(30, 40);
    expect(drawing.getCurrentPath()).toEqual([{ x: 10, y: 20 }, { x: 30, y: 40 }]);
  });

  it("resetPath clears the current path", () => {
    drawing.startPath(10, 20);
    drawing.addPoint(30, 40);
    drawing.resetPath();
    expect(drawing.getCurrentPath()).toEqual([]);
  });

  it("drawPath strokes the path properly", () => {
    drawing.createCanvas(container);
    drawing.drawPath([{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 }]);

    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalled();
    expect(mockContext.lineTo).toHaveBeenCalled();
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  it("drawPath ignores empty paths", () => {
    drawing.createCanvas(container);
    drawing.drawPath([]);

    expect(mockContext.beginPath).not.toHaveBeenCalled();
    expect(mockContext.stroke).not.toHaveBeenCalled();
  });

  it("clearCanvas calls clearRect on context", () => {
    drawing.createCanvas(container);
    drawing.clearCanvas();

    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, drawing.canvas.width, drawing.canvas.height);
  });

  it("cleanup removes canvas and resets references", () => {
    const canvas = drawing.createCanvas(container);
    drawing.startPath(10, 10);

    drawing.cleanup();

    expect(container.contains(canvas)).toBe(false);
    expect(drawing.canvas).toBeNull();
    expect(drawing.context).toBeNull();
    expect(drawing.getCurrentPath()).toEqual([]);
  });
});
