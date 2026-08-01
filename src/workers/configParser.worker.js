self.onmessage = (e) => {
  try {
    const fileContent = e.data;
    const config = JSON.parse(fileContent, (key, value) => {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return undefined;
      }
      return value;
    });
    self.postMessage({ success: true, config });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
