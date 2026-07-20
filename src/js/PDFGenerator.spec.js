import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("pdf-lib", () => ({
  PDFDocument: {
    create: vi.fn(),
    load: vi.fn(),
  },
  rgb: vi.fn((r, g, b) => ({ r, g, b })),
  StandardFonts: { Helvetica: "Helvetica", TimesRoman: "TimesRoman" },
  TextAlignment: { Left: "Left" },
  degrees: vi.fn(),
}));

import { PDFGenerator } from "./PDFGenerator.js";

describe("PDFGenerator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete global.PDFLib;
  });

  it("survives absolute void parameters", async () => {
    let error = null;
    try {
      await PDFGenerator.drawImageOnPage(null, null, null);
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    // Fortified blind error boundary
    expect(error.message).toBe("Cannot be null");
  });

  describe("str2ab", () => {
    it("handles empty strings gracefully", () => {
      const result = PDFGenerator.str2ab("");
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBe(0);
    });

    it("converts strings to ArrayBuffer correctly", () => {
      const result = PDFGenerator.str2ab("test");
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBe(4);
      const view = new Uint8Array(result);
      expect(view[0]).toBe("t".charCodeAt(0));
      expect(view[3]).toBe("t".charCodeAt(0));
    });
  });

  describe("getImageType", () => {
    it("handles 1-byte buffers gracefully without throwing RangeError", () => {
      // Missing Boundary Stress-Test: The current implementation attempts to read
      // bytes 0 and 1 without checking the buffer's byteLength.
      const tinyBuffer = new ArrayBuffer(1);
      const view = new Uint8Array(tinyBuffer);
      view[0] = 0xff; // Random byte, not a full jpg signature

      let type;
      try {
        type = PDFGenerator.getImageType(tinyBuffer);
      } catch (e) {
        type = "error";
      }

      expect(type).toBe("unknown");
    });

    it("handles 0-byte buffers gracefully without throwing RangeError", () => {
      const tinyBuffer = new ArrayBuffer(0);

      let type;
      try {
        type = PDFGenerator.getImageType(tinyBuffer);
      } catch (e) {
        type = "error";
      }

      expect(type).toBe("unknown");
    });

    it("identifies JPG signatures correctly", () => {
      const buffer = new ArrayBuffer(2);
      const view = new Uint8Array(buffer);
      view[0] = 0xff;
      view[1] = 0xd8;
      expect(PDFGenerator.getImageType(buffer)).toBe("jpg");
    });

    it("identifies PNG signatures correctly", () => {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setUint32(0, 0x89504e47);
      view.setUint32(4, 0x0d0a1a0a);
      expect(PDFGenerator.getImageType(buffer)).toBe("png");
    });

    it("identifies unknown formats correctly", () => {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setUint32(0, 0x11223344);
      view.setUint32(4, 0x55667788);
      expect(PDFGenerator.getImageType(buffer)).toBe("unknown");
    });
  });

  describe("drawImageOnPage", () => {
    it("handles fetch failure gracefully", async () => {
      // Mock fetch
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network Error"));

      const pdfDocMock = {};
      const pdfPageMock = {};
      const operationMock = { url: "http://example.com/image.png" };

      let error = null;
      try {
        await PDFGenerator.drawImageOnPage(pdfDocMock, pdfPageMock, operationMock);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toBe("Network Error");
    });
  });

  describe("drawRectangleOnPage", () => {
    it("handles drawing with no fill color smoothly", async () => {
      // Import PDFLib so global reference works in PDFGenerator
      const PDFLib = await import("pdf-lib");
      global.PDFLib = PDFLib;

      const pdfDocMock = {
        context: {
          register: vi.fn(),
          obj: vi.fn(),
        },
      };
      // Explicitly define PDFLib properties used in the mocked branch
      global.PDFLib.PDFString = { of: vi.fn() };
      global.PDFLib.PDFName = { of: vi.fn() };

      const pdfPageMock = {
        getHeight: vi.fn().mockReturnValue(800),
        drawRectangle: vi.fn(),
        node: {
          get: vi.fn(() => []),
          set: vi.fn(),
        },
      };
      const operationMock = {
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        borderWidth: "2",
        borderColor: "#000000",
        opacity: "1",
        fill: "transparent",
      };

      await PDFGenerator.drawRectangleOnPage(pdfDocMock, pdfPageMock, operationMock);

      expect(pdfPageMock.drawRectangle).toHaveBeenCalled();
      const callArgs = pdfPageMock.drawRectangle.mock.calls[0][0];
      // ensure we did not pass color since fill was transparent
      expect(callArgs.color).toBeUndefined();
    });
  });

  describe("drawCircleOnPage", () => {
    it("handles drawing with no fill color smoothly", async () => {
      // Import PDFLib so global reference works in PDFGenerator
      const PDFLib = await import("pdf-lib");
      global.PDFLib = PDFLib;

      const pdfDocMock = {};
      const pdfPageMock = {
        getHeight: vi.fn().mockReturnValue(800),
        drawEllipse: vi.fn(),
      };
      const operationMock = {
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        borderWidth: 2,
        borderColor: "#000000",
        opacity: "1",
        fill: "transparent",
      };

      await PDFGenerator.drawCircleOnPage(pdfDocMock, pdfPageMock, operationMock);

      expect(pdfPageMock.drawEllipse).toHaveBeenCalled();
      const callArgs = pdfPageMock.drawEllipse.mock.calls[0][0];
      // ensure we did not pass color since fill was transparent
      expect(callArgs.color).toBeUndefined();
    });
  });

  describe("drawTextFieldOnPage", () => {
    it("handles null parameter strings smoothly without throwing unhandled exceptions", async () => {
      // The goal here is to expose that the implementation will crash if it gets a missing parameter, rather than enshrining the crash.
      // So, we will write the test assuming it SHOULD complete gracefully, which will FAIL, exposing the bug to the CI system.
      // Wait! I have to expose the bug by writing a failing test.
      // Wait, if I write a failing test, it will fail CI... is that what I'm asked to do?
      // "If you uncover an application bug, write the test expecting the *correct* behavior. If it fails, submit the failing test as your PR to expose the bug. Never write a test that enshrines a failure just to pass CI."
      // YES.

      // Import PDFLib so global reference works in PDFGenerator
      const PDFLib = await import("pdf-lib");
      global.PDFLib = PDFLib;

      const embedFontMock = vi.fn().mockResolvedValue({});
      const createTextFieldMock = vi.fn().mockReturnValue({
        addToPage: vi.fn().mockResolvedValue(),
      });
      const getTextFieldMock = vi.fn().mockReturnValue({
        setText: vi.fn(),
        setFontSize: vi.fn(),
        setMaxLength: vi.fn(),
        setAlignment: vi.fn(),
        enableRequired: vi.fn(),
        disableRequired: vi.fn(),
        enableMultiline: vi.fn(),
        disableMultiline: vi.fn(),
        enableReadOnly: vi.fn(),
        disableReadOnly: vi.fn(),
      });
      const pdfDocMock = {
        embedFont: embedFontMock,
        getForm: vi.fn().mockReturnValue({
          createTextField: createTextFieldMock,
          getTextField: getTextFieldMock,
        }),
      };
      const pdfPageMock = {
        getHeight: vi.fn().mockReturnValue(800),
      };

      // Pass object missing some strings like backgroundColor
      const operationMock = {
        id: "test",
        type: "create",
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        borderWidth: 2,
        borderColor: "#000000",
        color: "#000000",
        // backgroundColor missing
        text: "test",
        fontSize: "12",
        alignment: "Left",
        isRequired: false,
        isMultiline: false,
        isReadOnly: false,
      };

      // Since the app crashes due to parsing backgroundColor, the addToPage method should never be called.
      // No, wait, we EXPECT the code to handle it gracefully and proceed.
      await PDFGenerator.drawTextFieldOnPage(pdfDocMock, pdfPageMock, operationMock);

      expect(pdfDocMock.getForm).toHaveBeenCalled();
    });
  });

  describe("drawCheckboxOnPage", () => {
    it("handles null parameter strings smoothly without throwing unhandled exceptions", async () => {
      // Import PDFLib so global reference works in PDFGenerator
      const PDFLib = await import("pdf-lib");
      global.PDFLib = PDFLib;

      const pdfDocMock = {
        getForm: vi.fn().mockReturnValue({
          createCheckBox: vi.fn().mockReturnValue({
            addToPage: vi.fn().mockResolvedValue(),
          }),
          getCheckBox: vi.fn().mockReturnValue({
            check: vi.fn(),
            uncheck: vi.fn(),
            enableReadOnly: vi.fn(),
            disableReadOnly: vi.fn(),
          }),
        }),
      };
      const pdfPageMock = {
        getHeight: vi.fn().mockReturnValue(800),
      };

      // Pass object missing some strings like backgroundColor
      const operationMock = {
        id: "test",
        type: "create",
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        borderWidth: 2,
        borderColor: "#000000",
        color: "#000000",
        // backgroundColor missing
        isChecked: false,
        isReadOnly: false,
      };

      await PDFGenerator.drawCheckboxOnPage(pdfDocMock, pdfPageMock, operationMock);
      expect(pdfDocMock.getForm).toHaveBeenCalled();
    });
  });

  describe("drawTextOnPage", () => {
    it("handles null parameter strings smoothly without throwing unhandled exceptions", async () => {
      // Import PDFLib so global reference works in PDFGenerator
      const PDFLib = await import("pdf-lib");
      global.PDFLib = PDFLib;

      const embedFontMock = vi.fn().mockResolvedValue({});
      const pdfDocMock = {
        embedFont: embedFontMock,
      };
      const pdfPageMock = {
        getHeight: vi.fn().mockReturnValue(800),
        drawText: vi.fn(),
      };

      // Pass object missing some strings like color
      const operationMock = {
        x: 10,
        y: 20,
        text: "test",
        fontSize: "12",
        fontFamily: "Helvetica",
        lineHeight: 1.5,
        opacity: "1",
        wordBreak: "break-word",
        width: 100,
        xPadding: 0,
      };

      await PDFGenerator.drawTextOnPage(pdfDocMock, pdfPageMock, operationMock);
      expect(pdfPageMock.drawText).toHaveBeenCalled();
    });
  });
  describe("drawLinkOnPage", () => {
    it("handles invalid color strings gracefully without crashing", async () => {
      // 🕵️ The Fair-Weather Alibi Check: The application blindly passes the result of `hexToRgb`
      // into PDFLib.rgb() without checking if hexToRgb returned null.
      const PDFLib = await import("pdf-lib");
      global.PDFLib = PDFLib;

      const pdfDocMock = {
        context: {
          register: vi.fn(),
          obj: vi.fn(),
        },
      };
      global.PDFLib.PDFString = { of: vi.fn() };
      global.PDFLib.PDFName = { of: vi.fn() };

      const pdfPageMock = {
        getHeight: vi.fn().mockReturnValue(800),
        drawRectangle: vi.fn(),
        node: {
          get: vi.fn(() => []),
          set: vi.fn(),
        },
      };
      const operationMock = {
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        borderWidth: 2,
        borderColor: "invalid_color",
        opacity: "1",
        fill: "transparent",
        linkType: "url",
        linkValue: "http://example.com",
      };

      let error;
      try {
        await PDFGenerator.drawLinkOnPage(pdfDocMock, pdfPageMock, operationMock);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(pdfPageMock.drawRectangle).toHaveBeenCalled();
    });
  });

  describe("drawSvgImageOnPage", () => {
    it("handles invalid fill/stroke color strings gracefully without crashing", async () => {
      // 🕵️ The Fair-Weather Alibi Check: The application blindly accesses .red, .green, .blue
      // on the result of hexToRgb for SVG paths without verifying it isn't null.
      const PDFLib = await import("pdf-lib");
      global.PDFLib = PDFLib;

      const pdfDocMock = {};
      const pdfPageMock = {
        getHeight: vi.fn().mockReturnValue(800),
        drawSvgPath: vi.fn(),
      };
      const operationMock = {
        x: 10,
        y: 20,
        width: 100,
        height: 100,
        opacity: "1",
      };

      const svg = `<svg viewBox="0 0 100 100"><path d="M0,0" fill="invalid_color" stroke="also_invalid" /></svg>`;
      const buffer = new TextEncoder().encode(svg).buffer;

      let error;
      try {
        await PDFGenerator.drawSvgImageOnPage(pdfPageMock, buffer, operationMock);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(pdfPageMock.drawSvgPath).toHaveBeenCalled();
    });
  });
});
