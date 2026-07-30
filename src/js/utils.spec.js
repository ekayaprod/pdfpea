import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { hexToRgb, rgbToHex, parseColor, parsePdfData, FreehandDrawing, freehandDrawing, generateId, calculateInnerDimensions } from "./utils.js";


describe("colors utils", () => {
  describe("hexToRgb", () => {
    it("should convert #000000 to rgb", () => {
      expect(hexToRgb("#000000")).toEqual({ red: 0, green: 0, blue: 0 });
    });
    it("should convert #ffffff to rgb", () => {
      expect(hexToRgb("#ffffff")).toEqual({ red: 1, green: 1, blue: 1 });
    });
    it("should convert #ff0000 to rgb", () => {
      expect(hexToRgb("#ff0000")).toEqual({ red: 1, green: 0, blue: 0 });
    });
    it("should convert #00ff00 to rgb", () => {
      expect(hexToRgb("#00ff00")).toEqual({ red: 0, green: 1, blue: 0 });
    });
    it("should convert #0000ff to rgb", () => {
      expect(hexToRgb("#0000ff")).toEqual({ red: 0, green: 0, blue: 1 });
    });
    it("should convert #123456 to rgb", () => {
      const rgb = hexToRgb("#123456");
      expect(rgb.red).toBeCloseTo(18 / 255);
      expect(rgb.green).toBeCloseTo(52 / 255);
      expect(rgb.blue).toBeCloseTo(86 / 255);
    });
    it("should convert short hex #fff to rgb", () => {
      expect(hexToRgb("#fff")).toEqual({ red: 1, green: 1, blue: 1 });
    });
    it("should convert short hex #f00 to rgb", () => {
      expect(hexToRgb("#f00")).toEqual({ red: 1, green: 0, blue: 0 });
    });
    it("should handle missing # prefix", () => {
      expect(hexToRgb("ffffff")).toEqual({ red: 1, green: 1, blue: 1 });
    });
    it("should return null for empty or invalid input", () => {
      expect(hexToRgb("")).toBeNull();
      expect(hexToRgb(null)).toBeNull();
      expect(hexToRgb("invalid")).toBeNull();
    });
  });

  describe("rgbToHex", () => {
    it("should convert 0, 0, 0 to #000000", () => {
      expect(rgbToHex(0, 0, 0)).toBe("#000000");
    });
    it("should convert 255, 255, 255 to #ffffff", () => {
      expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
    });
    it("should convert 255, 0, 0 to #ff0000", () => {
      expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
    });
    it("should convert 0, 255, 0 to #00ff00", () => {
      expect(rgbToHex(0, 255, 0)).toBe("#00ff00");
    });
    it("should convert 0, 0, 255 to #0000ff", () => {
      expect(rgbToHex(0, 0, 255)).toBe("#0000ff");
    });
    it("should convert 18, 52, 86 to #123456", () => {
      expect(rgbToHex(18, 52, 86)).toBe("#123456");
    });
    it("should clamp values out of bounds", () => {
      expect(rgbToHex(-10, 300, 256)).toBe("#00ffff");
    });
    it("should handle floating point values", () => {
      expect(rgbToHex(254.9, 0.1, 128.5)).toBe("#ff0081");
    });
  });

  describe("parseColor", () => {
    it("should handle transparent strings", () => {
      expect(parseColor("transparent")).toBeNull();
      expect(parseColor("rgba(0,0,0,0)")).toBeNull();
      expect(parseColor("")).toBeNull();
      expect(parseColor(null)).toBeNull();
    });

    it("should parse rgba strings", () => {
      expect(parseColor("rgba(255, 128, 0, 0.5)")).toEqual({
        red: 1,
        green: 128 / 255,
        blue: 0,
        alpha: 0.5,
      });
    });

    it("should parse hex strings", () => {
      expect(parseColor("#ff0000")).toEqual({
        red: 1,
        green: 0,
        blue: 0,
        alpha: 1.0,
      });
    });
  });
});


describe("parsePdfData", () => {
  it("should return undefined or null if pdfURL is falsy", () => {
    expect(parsePdfData(null)).toBeNull();
    expect(parsePdfData(undefined)).toBeUndefined();
    expect(parsePdfData("")).toBe("");
  });

  it("should decode base64 pdf data if it starts with the correct prefix", () => {
    // Mock atob since it's a browser API
    global.atob = vi.fn().mockImplementation((str) => `decoded_${str}`);

    const base64Data = "c29tZWRhdGE=";
    const result = parsePdfData(`data:application/pdf;base64,${base64Data}`);

    expect(global.atob).toHaveBeenCalledWith(base64Data);
    expect(result).toBe(`decoded_${base64Data}`);

    // Clean up mock
    delete global.atob;
  });

  it("should return the original URL if it does not start with the base64 prefix", () => {
    const regularURL = "https://example.com/sample.pdf";
    const result = parsePdfData(regularURL);

    expect(result).toBe(regularURL);
  });
});


describe("FreehandDrawing - Pure Functions Boundary Stress Tests", () => {
  it("calculateBoundingBox handles empty path arrays correctly", () => {
    const result = freehandDrawing.calculateBoundingBox([], 2);
    expect(result).toBeNull();
  });

  it("smoothPath handles insufficient points gracefully", () => {
    const shortPath = [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ];
    const result = freehandDrawing.smoothPath(shortPath, 5);
    expect(result).toEqual(shortPath);
  });

  it("pathToSvgDataUrl returns null for an empty path", () => {
    const result = freehandDrawing.pathToSvgDataUrl([], {});
    expect(result).toBeNull();
  });

  it("pathToSvgDataUrl handles Unicode characters in options securely without throwing", () => {
    const path = [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ];
    // This previously crashed with `unescape` or invalid Unicode encoding paths.
    // We pass a Unicode symbol in the color property.
    const result = freehandDrawing.pathToSvgDataUrl(path, { color: "red-🔥" });
    expect(result).toMatch(/^data:image\/svg\+xml;base64,/);

    // Decode the base64 back and ensure the Unicode string is present
    const base64Data = result.split(",")[1];
    const binString = Buffer.from(base64Data, "base64").toString("binary");
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    const decodedSvg = new TextDecoder().decode(bytes);
    expect(decodedSvg).toContain('stroke="red-🔥"');
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
    expect(drawing.getCurrentPath()).toEqual([
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ]);
  });

  it("resetPath clears the current path", () => {
    drawing.startPath(10, 20);
    drawing.addPoint(30, 40);
    drawing.resetPath();
    expect(drawing.getCurrentPath()).toEqual([]);
  });

  it("drawPath strokes the path properly", () => {
    drawing.createCanvas(container);
    drawing.drawPath([
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 },
    ]);

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

    expect(mockContext.clearRect).toHaveBeenCalledWith(
      0,
      0,
      drawing.canvas.width,
      drawing.canvas.height,
    );
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


describe("generateId", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    // Verify value isn't a tautological constant when the underlying system produces unpredictable random bytes
    expect(id).toMatch(/^[a-z0-9]{9}$/);
  });

  it("should generate an ID of exactly 9 characters", () => {
    const id = generateId();
    expect(id).toHaveLength(9);
  });

  it("should generate distinct IDs on consecutive calls", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("should contain only alphanumeric characters", () => {
    const id = generateId();
    // Base 36 string contains lowercase letters and numbers
    expect(id).toMatch(/^[a-z0-9]+$/);
  });

  it("should pad with zeros if Math.random() returns a short value (e.g. 0.5)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const id = generateId();
    expect(id).toHaveLength(9);
    expect(id).toBe("i00000000");
  });

  it("should handle Math.random() returning 0 correctly", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const id = generateId();
    expect(id).toHaveLength(9);
    expect(id).toBe("000000000");
  });
});


describe("calculateInnerDimensions", () => {
  it("calculates inner dimensions with standard border width", () => {
    expect(calculateInnerDimensions(2)).toBe("calc(100% - 4px)");
  });

  it("handles null border width gracefully", () => {
    expect(calculateInnerDimensions(null)).toBe("calc(100% - 0px)");
  });

  it("handles undefined border width gracefully", () => {
    expect(calculateInnerDimensions(undefined)).toBe("calc(100% - 0px)");
  });

  it("handles empty string gracefully", () => {
    expect(calculateInnerDimensions("")).toBe("calc(100% - 0px)");
  });

  it("handles zero border width correctly", () => {
    expect(calculateInnerDimensions(0)).toBe("calc(100% - 0px)");
  });
});
