import { describe, it, expect, vi, beforeEach } from "vitest";
import { PDFGenerator, fetchLimiter } from "./PDFGenerator.js";

describe("Cerberus Defense: PDFGenerator fetch boundary", () => {
  let mockPdfDoc, mockPdfPage;

  beforeEach(() => {
    mockPdfDoc = {
      embedPng: vi.fn().mockResolvedValue({ scaleToFit: () => ({ width: 10, height: 10 }) }),
      embedJpg: vi.fn().mockResolvedValue({ scaleToFit: () => ({ width: 10, height: 10 }) }),
    };
    mockPdfPage = {
      getHeight: () => 800,
      drawImage: vi.fn(),
    };
    vi.spyOn(PDFGenerator, 'getImageType').mockReturnValue('png');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
    });
    fetchLimiter.reset(); // ensure fresh limit state
  });

  it("Sad Path: Rejects malformed payload schema and catches fetch errors gracefully", async () => {
    // 1. Schema Rejection Check
    const malformedOperation = {
      x: "invalid", // should be number
      y: 0,
      width: 100,
      height: 100,
      opacity: "1",
      url: "not-a-url",
      __proto__: { evil: true }
    };

    // Should not crash, should return early or degrade gracefully
    await expect(PDFGenerator.drawImageOnPage(mockPdfDoc, mockPdfPage, malformedOperation)).resolves.toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();

    // 2. Throttle Check (Thundering Herd)
    const validOperation = {
      type: "image",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      opacity: "1",
      url: "https://example.com/image.png"
    };

    // Assume limit is 100 requests. We will call it 105 times.
    for (let i = 0; i < 105; i++) {
      await PDFGenerator.drawImageOnPage(mockPdfDoc, mockPdfPage, validOperation);
    }
    // Should be rate limited at exactly 100 requests. Further requests are dropped gracefully.
    expect(global.fetch).toHaveBeenCalledTimes(100);

    // 3. Catch Network Error Check
    fetchLimiter.reset(); // reset to test fetch failure
    global.fetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error"
    });

    // Should not crash document generation on fetch error
    await expect(PDFGenerator.drawImageOnPage(mockPdfDoc, mockPdfPage, validOperation)).resolves.toBeUndefined();
  });
});
