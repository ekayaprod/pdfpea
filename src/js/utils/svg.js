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
