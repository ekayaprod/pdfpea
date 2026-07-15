import { describe, it, expect, vi } from "vitest";
import { parsePdfData } from "./pdfData";

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
