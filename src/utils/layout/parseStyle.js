/**
 * 🥄 SPLICE: Semantic duplicate logic identified and integrated into a single utility block.
 */

export function parseStyleInt(element, property, fallback = 0) {
  const value = element.style[property];
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}
