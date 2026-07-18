/**
 * 🥄 SPLICE: Semantic duplicate logic identified and integrated into a single utility block.
 */

export function getConstrainedPoint(currentPoint, startPoint, isShiftHeld) {
  if (!isShiftHeld) {
    return { ...currentPoint };
  }
  const constrainedPoint = { ...currentPoint };
  const deltaX = Math.abs(currentPoint.x - startPoint.x);
  const deltaY = Math.abs(currentPoint.y - startPoint.y);

  if (deltaX > deltaY) {
    constrainedPoint.y = startPoint.y;
  } else {
    constrainedPoint.x = startPoint.x;
  }
  return constrainedPoint;
}
