import { describe, it, expect, vi, afterEach } from "vitest";
import { generateId } from "./generateId.js";

describe("generateId", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
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
    expect(/^[a-z0-9]+$/.test(id)).toBe(true);
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
