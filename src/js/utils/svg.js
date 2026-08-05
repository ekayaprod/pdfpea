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
      // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
      /**
       * Matches existing attribute declarations in the SVG string for targeted replacement.
       * * Historical Intent: Added in PR #77 (commit 9e89291, Jul 2026) to enable dynamic SVG recoloring and dynamic dimension adjustments on the client-side.
       */
      const regex = new RegExp(`${attribute}="[^"]*"`, "g");
      svgString = svgString.replace(regex, `${attribute}="${value}"`);
    } else {
      // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
      /**
       * Matches the opening tag of a specified SVG element to inject a new attribute when it does not already exist.
       * * Historical Intent: Added in PR #77 (commit 9e89291, Jul 2026) to enable dynamic SVG recoloring and dynamic dimension adjustments on the client-side.
       */
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
 * Extracts a specific attribute from an SVG data URL (base64 encoded).
 * Uses early returns to flatten execution.
 *
 * @param {string} base64Url The base64 encoded SVG data URL.
 * @param {string} attribute The attribute to extract (e.g., 'stroke', 'fill').
 * @param {any} defaultValue The value to return if extraction fails.
 * @returns {any} The extracted attribute value or the default value.
 */
export const getSvgAttribute = (base64Url, attribute, defaultValue) => {
  if (!base64Url || !base64Url.startsWith("data:image/svg+xml;base64,")) {
    return defaultValue;
  }

  try {
    const base64Data = base64Url.replace("data:image/svg+xml;base64,", "");
    const svgString = atob(base64Data);

    // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
    /**
     * Matches existing attribute declarations in the SVG string for targeted extraction.
     * * Historical Intent: Extracted from App.vue duplicates to unify SVG attribute reading.
     */
    const regex = new RegExp(`${attribute}="([^"]+)"`);
    const match = svgString.match(regex);

    return match ? match[1] : defaultValue;
  } catch (error) {
    console.error(`Error extracting SVG ${attribute}:`, error);
    return defaultValue;
  }
};
