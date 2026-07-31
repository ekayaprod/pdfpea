/**
 * 🪴 PROPAGATOR: Propagated WET logic into a pure, parameterized central taproot.
 */
export const calculateInnerDimensions = (borderWidth) => {
  return `calc(100% - ${parseInt(borderWidth || 0) * 2}px)`;
};
