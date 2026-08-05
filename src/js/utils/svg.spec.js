import { describe, it, expect, vi } from "vitest";
import { updateSvgAttribute, getSvgAttribute } from "./svg.js";

describe("updateSvgAttribute", () => {
  const prefix = "data:image/svg+xml;base64,";

  const createBase64Url = (svgString) => prefix + btoa(svgString);

  it("should return the original input if it is falsy", () => {
    expect(updateSvgAttribute(null, "stroke", "blue")).toBeNull();
    expect(updateSvgAttribute("", "stroke", "blue")).toBe("");
  });

  it("should return the original input if it does not start with the correct prefix", () => {
    const invalidUrl = "data:image/png;base64,iVBORw0KGgo=";
    expect(updateSvgAttribute(invalidUrl, "stroke", "blue")).toBe(invalidUrl);
  });

  it("should update an existing attribute", () => {
    const originalSvg = '<svg><path d="M0 0" stroke="red"></path></svg>';
    const expectedSvg = '<svg><path d="M0 0" stroke="blue"></path></svg>';
    const base64Url = createBase64Url(originalSvg);
    const result = updateSvgAttribute(base64Url, "stroke", "blue");
    expect(result).toBe(createBase64Url(expectedSvg));
  });

  it("should inject a new attribute into the default elementTag (path) if it does not exist", () => {
    const originalSvg = '<svg><path d="M0 0"></path></svg>';
    const expectedSvg = '<svg><path d="M0 0" stroke="blue"></path></svg>';
    const base64Url = createBase64Url(originalSvg);
    const result = updateSvgAttribute(base64Url, "stroke", "blue");
    expect(result).toBe(createBase64Url(expectedSvg));
  });

  it("should inject a new attribute into a specified elementTag if it does not exist", () => {
    const originalSvg = '<svg width="100"><path d="M0 0"></path></svg>';
    const expectedSvg = '<svg width="100" fill="green"><path d="M0 0"></path></svg>';
    const base64Url = createBase64Url(originalSvg);
    const result = updateSvgAttribute(base64Url, "fill", "green", "svg");
    expect(result).toBe(createBase64Url(expectedSvg));
  });

  it("should catch errors and return the original input if base64 decoding fails", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const invalidBase64Url = prefix + "invalid_base64_data_%"; // This will throw on atob in browser/jsdom
    const result = updateSvgAttribute(invalidBase64Url, "stroke", "blue");

    expect(result).toBe(invalidBase64Url);
    expect(consoleSpy).toHaveBeenCalledWith("Error updating SVG stroke:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});

describe("getSvgAttribute", () => {
  const prefix = "data:image/svg+xml;base64,";
  const createBase64Url = (svgString) => prefix + btoa(svgString);

  it("should return the defaultValue if input is falsy", () => {
    expect(getSvgAttribute(null, "stroke", "#000000")).toBe("#000000");
    expect(getSvgAttribute("", "stroke", "#000000")).toBe("#000000");
  });

  it("should return the defaultValue if it does not start with the correct prefix", () => {
    const invalidUrl = "data:image/png;base64,iVBORw0KGgo=";
    expect(getSvgAttribute(invalidUrl, "stroke", "#000000")).toBe("#000000");
  });

  it("should extract an existing attribute", () => {
    const originalSvg = '<svg><path d="M0 0" stroke="red"></path></svg>';
    const base64Url = createBase64Url(originalSvg);
    const result = getSvgAttribute(base64Url, "stroke", "#000000");
    expect(result).toBe("red");
  });

  it("should return the defaultValue if the attribute does not exist", () => {
    const originalSvg = '<svg><path d="M0 0"></path></svg>';
    const base64Url = createBase64Url(originalSvg);
    const result = getSvgAttribute(base64Url, "stroke", "#000000");
    expect(result).toBe("#000000");
  });

  it("should catch errors and return the defaultValue if base64 decoding fails", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const invalidBase64Url = prefix + "invalid_base64_data_%";
    const result = getSvgAttribute(invalidBase64Url, "stroke", "#000000");

    expect(result).toBe("#000000");
    expect(consoleSpy).toHaveBeenCalledWith("Error extracting SVG stroke:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});
