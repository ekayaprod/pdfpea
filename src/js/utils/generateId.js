/**
 * 🪴 PROPAGATOR: Propagated WET logic into a pure, centralized taproot.
 * Centralized ID generation to replace scattered Math.random() implementations.
 */
export const generateId = () => {
  // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
  /**
   * Generates a 9-character alphanumeric ID by converting random values to base-36 and right-padding with zeroes.
   * * Historical Intent: Extracted and centralized to fix duplicate IDs during rapid component rendering, introduced alongside the fluid UI refactor in commit 9e89291 (Jul 2026).
   */
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  return (array[0].toString(36) + array[1].toString(36))
    .substring(0, 9)
    .padEnd(9, "0");
};
