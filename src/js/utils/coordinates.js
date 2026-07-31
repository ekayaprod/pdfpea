/**
 * 🧵 WEAVER: Constrains a point along the X or Y axis relative to a start point.
 * This flattens the deeply nested `if (event.shiftKey) { if (deltaX > deltaY) { ... } else { ... } }` logic.
 *
 * @param {Object} current - The current {x, y} coordinate
 * @param {Object} start - The starting {x, y} coordinate
 * @param {boolean} constrain - Whether to constrain the coordinates (e.g. if Shift is held)
 * @returns {Object} A new constrained {x, y} coordinate
 */
export const constrainToAxis = (current, start, constrain) => {
  if (!constrain) return { ...current };

  const deltaX = Math.abs(current.x - start.x);
  const deltaY = Math.abs(current.y - start.y);

  if (deltaX > deltaY) {
    // Horizontal line/measurement
    return { x: current.x, y: start.y };
  }

  // Vertical line/measurement
  return { x: start.x, y: current.y };
};
