/**
 * 🪴 PROPAGATOR: Propagated WET logic into a pure, centralized taproot.
 * Centralized ID generation to replace scattered Math.random() implementations.
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 11).padEnd(9, "0");
};
