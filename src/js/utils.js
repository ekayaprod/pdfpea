// 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
/**
 * Parses a hexadecimal color string into RGB channels.
 * * Historical Intent: Extracted and consolidated into this utility block via PR #141 (commit ab9ed33, Jul 2026) to enforce DRY principles across PDF generation and editing.
 */
export const hexToRgb = (hexString) => {
  if (!hexString) return null;
  hexString = hexString.replace("#", "");
  // handle short hex strings e.g. #fff
  if (hexString.length === 3) {
    hexString = hexString
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const bigint = parseInt(hexString, 16);
  if (isNaN(bigint)) return null;
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;
  return {
    red: red / 255,
    green: green / 255,
    blue: blue / 255,
  };
};

// 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
/**
 * Converts RGB channel values into a standard hexadecimal color string.
 * * Historical Intent: Extracted and consolidated into this utility block via PR #141 (commit ab9ed33, Jul 2026) to enforce DRY principles across PDF generation and editing.
 */
export const rgbToHex = (red, green, blue) => {
  const redHex = Math.max(0, Math.min(255, Math.round(red)))
    .toString(16)
    .padStart(2, "0");
  const greenHex = Math.max(0, Math.min(255, Math.round(green)))
    .toString(16)
    .padStart(2, "0");
  const blueHex = Math.max(0, Math.min(255, Math.round(blue)))
    .toString(16)
    .padStart(2, "0");
  return `#${redHex}${greenHex}${blueHex}`;
};

// 🥄 SPLICE: Semantic duplicate logic identified and integrated into a single utility block.
export const parseColor = (colorString) => {
  if (
    !colorString ||
    colorString === "transparent" ||
    colorString === "rgba(0,0,0,0)" ||
    colorString === ""
  ) {
    return null;
  }
  if (colorString.startsWith("rgba(")) {
    // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
    /**
     * Parses RGBA color strings (e.g., 'rgba(255, 255, 255, 0.5)') to capture the individual R, G, B, and Alpha channels for transparent link highlights.
     * * Historical Intent: Extracted and consolidated into this utility block via PR #106 (commit 2bd2bfd, Jul 2026) to enforce DRY principles across PDF generation and editing.
     */
    const rgba = colorString.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgba) {
      return {
        red: parseInt(rgba[1]) / 255,
        green: parseInt(rgba[2]) / 255,
        blue: parseInt(rgba[3]) / 255,
        alpha: parseFloat(rgba[4]),
      };
    }
  } else if (colorString.startsWith("#")) {
    const rgb = hexToRgb(colorString);
    if (rgb) {
      return { ...rgb, alpha: 1.0 };
    }
  }
  return null;
};
export function parsePdfData(pdfURL) {
  if (!pdfURL) {
    return pdfURL;
  }

  if (pdfURL.startsWith("data:application/pdf;base64,")) {
    const base64Data = pdfURL.replace("data:application/pdf;base64,", "");
    return atob(base64Data);
  }

  return pdfURL;
}
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
/**
 * Updates a specific attribute on an SVG data URL (base64 encoded).
 * Uses early returns to flatten execution.
 *
 * @param {string} base64Url The base64 encoded SVG data URL.
 * @param {string} attribute The attribute to update (e.g., 'stroke', 'fill').
 * @param {string} value The new value for the attribute.
 * @param {string} elementTag The default element tag to apply the attribute to if missing (e.g., 'path', 'svg').
 * @returns {string} The updated base64 encoded SVG data URL.
 */
export const updateSvgAttribute = (base64Url, attribute, value, elementTag = "path") => {
  if (!base64Url || !base64Url.startsWith("data:image/svg+xml;base64,")) {
    return base64Url;
  }

  try {
    const base64Data = base64Url.replace("data:image/svg+xml;base64,", "");
    let svgString = atob(base64Data);

    if (svgString.includes(`${attribute}=`)) {
      const regex = new RegExp(`${attribute}="[^"]*"`, "g");
      svgString = svgString.replace(regex, `${attribute}="${value}"`);
    } else {
      const regex = new RegExp(`<${elementTag}([^>]*)>`, "g");
      svgString = svgString.replace(regex, `<${elementTag}$1 ${attribute}="${value}">`);
    }

    const newBase64 = btoa(svgString);
    return `data:image/svg+xml;base64,${newBase64}`;
  } catch (error) {
    console.error(`Error updating SVG ${attribute}:`, error);
    return base64Url;
  }
};
/**
 * 🪴 PROPAGATOR: Propagated WET logic into a pure, centralized taproot.
 * Centralized ID generation to replace scattered Math.random() implementations.
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 11).padEnd(9, "0");
};
// Default values and constants
export const DEFAULT_VALUES = {
  SCALE: 2.0,
  // Extra multiplier applied only to the rendered canvas backing store so the
  // PDF is drawn at a higher resolution than the on-screen layout size.
  RENDER_RESOLUTION_MULTIPLIER: 2.0,
  COMPONENT_HEIGHT: 100,
  COMPONENT_WIDTH: 100,
  TEXT_HEIGHT: 25,
  TEXT_WIDTH: 100,
  TEXT_FIELD_HEIGHT: 25,
  TEXT_FIELD_WIDTH: 150,
  CHECKBOX_SIZE: 25,
  FONT_SIZE: 14,
  TEXT_FIELD_FONT_SIZE: 14,
  LINE_HEIGHT: 1,
  OPACITY: 1.0,
  BORDER_WIDTH: 2,
  TEXT_FIELD_BORDER_WIDTH: 1,
  X_PADDING: 2,
  Y_PADDING: 5,
};

// Colors
const COLORS = {
  WHITE: "#FFFFFF",
  RED: "#FF0000",
  BLACK: "#000000",
  LIGHT_BLUE: "#ADD8E6",
};

// Font families
const FONTS = {
  HELVETICA: "Helvetica",
  COURIER: "Courier",
  TIMES_ROMAN: "TimesRoman",
};

// Field types
export const FIELD_TYPES = {
  TEXT_FIELD: "Tx",
  BUTTON: "Btn",
};

// Alignment options
export const ALIGNMENT = {
  LEFT: "Left",
  CENTER: "Center",
  RIGHT: "Right",
};

// Operation types
const OPERATION_TYPES = {
  CREATE: "create",
  UPDATE: "update",
};

// Component types
export const COMPONENT_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
  TEXT_FIELD: "textfield",
  CHECKBOX: "checkbox",
  LINK: "link",
};

// Events
export const EVENTS = {
  COMPONENT_SELECTED: "pdfeditor.componentSelected",
  COMPONENT_DRAGGING: "pdfeditor.componentDragging",
  COMPONENT_RESIZING: "pdfeditor.componentResizing",
  SHOULD_CLEAR_ALL_SELECTION: "pdfeditor.shouldClearAllSelection",
};

// Image file signatures
const IMAGE_SIGNATURES = {
  JPG: [0xff, 0xd8],
  PNG: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
};
/**
 * 🪴 PROPAGATOR: Propagated WET logic into a pure, parameterized central taproot.
 */
export const calculateInnerDimensions = (borderWidth) => {
  return `calc(100% - ${parseInt(borderWidth || 0) * 2}px)`;
};
