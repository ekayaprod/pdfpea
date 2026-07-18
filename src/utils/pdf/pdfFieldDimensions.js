/**
 * 🥄 SPLICE: Semantic duplicate logic identified and integrated into a single utility block.
 */
import { rgbToHex } from "../color/colors.js";

export function extractFieldDimensions(field, viewport) {
  const rect = field.rect;
  const borderWidth = field.borderStyle.width;
  const x = Math.ceil(rect[0]);
  const tempY = Math.ceil(rect[1]);
  const width = Math.floor(rect[2]) - x - 2 * borderWidth;
  const height = Math.floor(rect[3]) - tempY - 2 * borderWidth;
  const y = viewport.height - tempY - height - 2 * borderWidth;
  const color = rgbToHex(field.color[0], field.color[1], field.color[2]);
  const borderColor = rgbToHex(field.borderColor[0], field.borderColor[1], field.borderColor[2]);
  const backgroundColor = rgbToHex(
    field.backgroundColor[0],
    field.backgroundColor[1],
    field.backgroundColor[2]
  );

  return { x, y, width, height, color, borderColor, backgroundColor, borderWidth };
}
