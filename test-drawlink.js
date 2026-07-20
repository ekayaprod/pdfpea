import { PDFGenerator } from './src/js/PDFGenerator.js';

async function test() {
  const pdfDoc = {
    context: {
      register: () => {},
      obj: () => {}
    }
  };
  global.PDFLib = {
    rgb: () => {},
    PDFName: { of: () => {} },
    PDFString: { of: () => {} }
  };
  const pdfPage = {
    getHeight: () => 800,
    drawRectangle: () => {},
    node: {
      get: () => [],
      set: () => {}
    }
  };
  const operation = {
    x: 0, y: 0, width: 100, height: 100,
    borderColor: "invalid_color",
    linkType: "url",
    linkValue: "http://example.com"
  };
  try {
    await PDFGenerator.drawLinkOnPage(pdfDoc, pdfPage, operation);
    console.log("Success");
  } catch (e) {
    console.error(e);
  }
}

test();
