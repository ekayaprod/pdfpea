/**
 * Constrains a coordinate to an orthogonal line (horizontal or vertical)
 * relative to a starting point if the shift key is held.
 *
 * @param {boolean} isShiftKey - Whether the shift key is pressed.
 * @param {Object} currentPoint - The current {x, y} coordinate.
 * @param {Object} startPoint - The starting {x, y} coordinate.
 * @returns {Object} A new {x, y} coordinate constrained to the horizontal or vertical axis if shift is pressed, otherwise a copy of the current point.
 */
export const constrainToOrthogonal = (isShiftKey, currentPoint, startPoint) => {
  if (!isShiftKey) {
    return { ...currentPoint };
  }

  const deltaX = Math.abs(currentPoint.x - startPoint.x);
  const deltaY = Math.abs(currentPoint.y - startPoint.y);

  if (deltaX > deltaY) {
    return { x: currentPoint.x, y: startPoint.y };
  }

  return { x: startPoint.x, y: currentPoint.y };
};
