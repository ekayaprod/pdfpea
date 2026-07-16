import { describe, it, expect } from "vitest";
import { readFileAsText, readFileAsDataURL, readFileAsBinaryString } from "./fileUtils.js";

describe("readFile utilities", () => {
  const dummyContent = "dummy text";
  const dummyFile = new Blob([dummyContent], { type: "text/plain" });
  const dummyError = new Error("read error");

  const setupMockFileReader = (methodName, shouldReject = false) => {
    class MockFileReader {
      [methodName]() {
        setTimeout(() => {
          if (shouldReject) {
            this.onerror(dummyError);
          } else {
            this.onload({ target: { result: dummyContent } });
          }
        }, 0);
      }
    }
    const originalFileReader = global.FileReader;
    global.FileReader = MockFileReader;
    return originalFileReader;
  };

  describe("readFileAsText", () => {
    it("resolves with the file content on load", async () => {
      const originalFileReader = setupMockFileReader("readAsText");
      try {
        const result = await readFileAsText(dummyFile);
        expect(result).toBe(dummyContent);
      } finally {
        global.FileReader = originalFileReader;
      }
    });

    it("rejects on error", async () => {
      const originalFileReader = setupMockFileReader("readAsText", true);
      try {
        await expect(readFileAsText(dummyFile)).rejects.toThrow("read error");
      } finally {
        global.FileReader = originalFileReader;
      }
    });
  });

  describe("readFileAsDataURL", () => {
    it("resolves with the file content on load", async () => {
      const originalFileReader = setupMockFileReader("readAsDataURL");
      try {
        const result = await readFileAsDataURL(dummyFile);
        expect(result).toBe(dummyContent);
      } finally {
        global.FileReader = originalFileReader;
      }
    });

    it("rejects on error", async () => {
      const originalFileReader = setupMockFileReader("readAsDataURL", true);
      try {
        await expect(readFileAsDataURL(dummyFile)).rejects.toThrow("read error");
      } finally {
        global.FileReader = originalFileReader;
      }
    });
  });

  describe("readFileAsBinaryString", () => {
    it("resolves with the file content on load", async () => {
      const originalFileReader = setupMockFileReader("readAsBinaryString");
      try {
        const result = await readFileAsBinaryString(dummyFile);
        expect(result).toBe(dummyContent);
      } finally {
        global.FileReader = originalFileReader;
      }
    });

    it("rejects on error", async () => {
      const originalFileReader = setupMockFileReader("readAsBinaryString", true);
      try {
        await expect(readFileAsBinaryString(dummyFile)).rejects.toThrow("read error");
      } finally {
        global.FileReader = originalFileReader;
      }
    });
  });
});
