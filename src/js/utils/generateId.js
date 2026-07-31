/**
 * 🪴 PROPAGATOR: Propagated WET logic into a pure, centralized taproot.
 * Centralized ID generation to replace scattered Math.random() implementations.
 */
export const generateId = () => {
  // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
  /**
   * Generates a 9-character alphanumeric ID by converting a random float to base-36, slicing off the "0." prefix, and right-padding with zeroes.
   * * Historical Intent: Extracted and centralized to fix duplicate IDs during rapid component rendering, introduced alongside the fluid UI refactor in commit 9e89291 (Jul 2026).
   */
  return Math.random().toString(36).substring(2, 11).padEnd(9, "0");
};
