import { describe, it, expect } from "vitest";
import { generateId } from "./generateId.js";

describe("generateId", () => {
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
});
