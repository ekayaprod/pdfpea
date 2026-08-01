// 🧿 CODIFY: A single, centralized utility locked behind a strict, binding JSDoc contract.
/**
 * Reads and parses a JSON configuration file representing a PDF configuration.
 *
 * @param {File} configFileToProcess - The file object to read and parse. Must be a valid JSON file.
 * @throws {Error} If the file configuration structure is invalid or cannot be read.
 * @returns {Promise<any>} A promise that resolves to the parsed configuration object.
 */
export const parseConfigFile = async (configFileToProcess: File): Promise<any> => {
  const fileContent = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(configFileToProcess);
  });
  const config = JSON.parse(fileContent, (key, value) => {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return undefined;
    }
    return value;
  });
  // Validate config structure
  if (
    !config ||
    typeof config !== "object" ||
    typeof config.pdfURL !== "string" ||
    !Array.isArray(config.pages) ||
    !config.pages.every(
      (page: any) => page && typeof page === "object" && Array.isArray(page.operations),
    )
  ) {
    throw new Error("Invalid config file format");
  }
  return config;
};
