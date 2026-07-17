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
  if (!colorString || colorString === "transparent" || colorString === "rgba(0,0,0,0)" || colorString === "") {
    return null;
  }
  if (colorString.startsWith("rgba(")) {
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
