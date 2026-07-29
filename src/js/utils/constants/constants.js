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
