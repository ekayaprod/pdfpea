import svgpath from "svgpath";
import { hexToRgb, parseColor } from "../utils/color/colors.js";
class PDFGenerator {
  static str2ab(binaryString) {
    return Uint8Array.from(binaryString, (char) => char.charCodeAt(0)).buffer;
  }
  // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
  /**
   * Identifies the image file type by inspecting the magic bytes (file signature) of the buffer.
   * Checks for '<svg' or '<?xml' for SVG files, 0xFFD8 for JPEG, and the 8-byte 0x89504E470D0A1A0A signature for PNG.
   * * Historical Intent: Introduced in commit 7c1af7e (Jun 2026) to handle file identification locally without relying on external dependencies.
   */
  static getImageType(arrayBuffer) {
    if (!arrayBuffer || arrayBuffer.byteLength < 2) {
      return "unknown";
    }
    const view = new DataView(arrayBuffer);
    const signature = [view.getUint8(0), view.getUint8(1)];
    const decoder = new TextDecoder("utf-8"); // or whatever encoding you expect
    const str = decoder.decode(arrayBuffer);
    if (str.startsWith("<svg") || str.startsWith("<?xml")) {
      return "svg";
    } else if (signature[0] === 0xff && signature[1] === 0xd8) {
      return "jpg";
    } else if (arrayBuffer.byteLength >= 8 && view.getUint32(0) === 0x89504e47 && view.getUint32(4) === 0x0d0a1a0a) {
      return "png";
    } else {
      return "unknown";
    }
  }
  static async generatePDF(fileContents, pageOperations) {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const srcDoc = await PDFLib.PDFDocument.load(PDFGenerator.str2ab(fileContents));
    // ⚡ THE ALGORITHMIC TRAP: Pre-compute dictionary of fields for O(1) lookups
    const srcForm = srcDoc.getForm();
    const fieldMap = new Map(srcForm.getFields().map((f) => [f.getName(), f]));
    for (const page of pageOperations) {
      const pageNumber = page.pageNumber;
      const updateOperations = page.operations.filter((op) => op.operation === "update");
      for (const op of updateOperations) {
        const formField = fieldMap.get(op.id);
        if (formField !== null && formField !== undefined) {
          srcForm.removeField(formField);
          fieldMap.delete(op.id); // Prevent Double Remove
        }
      }
      const [cpage] = await pdfDoc.copyPages(srcDoc, [pageNumber - 1]);
      pdfDoc.addPage(cpage);
    }
    // ⚡ THE WATERFALL COLLAPSE: Batch pre-fetch pages
    const pdfPages = pdfDoc.getPages();
    // Pages themselves can be processed concurrently
    const pagePromises = pageOperations.map(async (page) => {
      const pageNumber = page.pageNumber;
      const createOperations = page.operations.filter((op) => op.operation === "create");
      const updateOperations = page.operations.filter((op) => op.operation === "update");
      const pdfPage = pdfPages[pageNumber - 1];
      // CRITICAL REVERT: Preserve sequential Z-order of canvas painting operations
      for (const op of createOperations) {
        if (op.type === "text") {
          await this.drawTextOnPage(pdfDoc, pdfPage, op);
        } else if (op.type === "rectangle") {
          await this.drawRectangleOnPage(pdfDoc, pdfPage, op);
        } else if (op.type === "circle") {
          await this.drawCircleOnPage(pdfDoc, pdfPage, op);
        } else if (op.type === "image") {
          await this.drawImageOnPage(pdfDoc, pdfPage, op);
        } else if (op.type === "textfield") {
          await this.drawTextFieldOnPage(pdfDoc, pdfPage, op);
        } else if (op.type === "checkbox") {
          await this.drawCheckboxOnPage(pdfDoc, pdfPage, op);
        } else if (op.type === "link") {
          await this.drawLinkOnPage(pdfDoc, pdfPage, op);
        }
      }
      for (const op of updateOperations) {
        if (op.type === "textfield") {
          await this.drawTextFieldOnPage(pdfDoc, pdfPage, op);
        } else if (op.type === "checkbox") {
          await this.drawCheckboxOnPage(pdfDoc, pdfPage, op);
        } else if (op.type === "link") {
          await this.drawLinkOnPage(pdfDoc, pdfPage, op);
        }
      }
    });
    // Await all pages concurrently
    await Promise.all(pagePromises);
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
  static async drawTextOnPage(pdfDoc, pdfPage, operation) {
    const fontColor = hexToRgb(operation.color);
    const resolvedFont =
      operation.fontFamily === "TimesRoman"
        ? PDFLib.StandardFonts.TimesRoman
        : operation.fontFamily;
    const fontToEmbed = Object.values(PDFLib.StandardFonts).includes(resolvedFont)
      ? resolvedFont
      : PDFLib.StandardFonts.Helvetica;

    pdfDoc.__fontCache ??= new Map();
    let embedFontPromise = pdfDoc.__fontCache.get(fontToEmbed);
    if (!embedFontPromise) {
      embedFontPromise = pdfDoc.embedFont(fontToEmbed);
      pdfDoc.__fontCache.set(fontToEmbed, embedFontPromise);
    }
    const embedFont = await embedFontPromise;

    await pdfPage.drawText(operation.text.replaceAll("\n\n", "\n \n"), {
      x: operation.x + operation.xPadding,
      y: pdfPage.getHeight() - operation.y - parseInt(operation.fontSize),
      color: PDFLib.rgb(fontColor.red, fontColor.green, fontColor.blue),
      font: embedFont,
      size: parseInt(operation.fontSize),
      lineHeight: operation.fontSize * operation.lineHeight,
      opacity: parseFloat(operation.opacity, 10),
      wordBreaks:
        operation.wordBreak === "break-all"
          ? [""]
          : operation.wordBreak === "break-word"
            ? [" "]
            : [],
      maxWidth: operation.width,
    });
  }
  static async drawRasterImageOnPage(pdfDoc, pdfPage, arrayBuffer, type, operation) {
    const pageHeight = pdfPage.getHeight();
    const { x, y, width, height, opacity: opacityStr } = operation;
    const opacity = parseFloat(opacityStr, 10);

    const drawRaster = async (embeddedImg) => {
      const scaled = embeddedImg.scaleToFit(width, height);
      const offsetX = (width - scaled.width) / 2;
      const offsetY = (height - scaled.height) / 2;
      await pdfPage.drawImage(embeddedImg, {
        x: x + offsetX,
        y: pageHeight - y - height + offsetY,
        width: scaled.width,
        height: scaled.height,
        opacity,
      });
    };

    if (type === "jpg") {
      await drawRaster(await pdfDoc.embedJpg(arrayBuffer));
    } else if (type === "png") {
      await drawRaster(await pdfDoc.embedPng(arrayBuffer));
    }
  }

  static async drawSvgImageOnPage(pdfPage, arrayBuffer, operation) {
    const pageHeight = pdfPage.getHeight();
    const { x, y, width, height, opacity: opacityStr } = operation;
    const opacity = parseFloat(opacityStr, 10);

    const svgText = new TextDecoder("utf-8").decode(arrayBuffer);

    // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
    /**
     * Parses SVG `<path>` elements and extracts the 'd' attribute (path data) to enable rendering custom SVG icons.
     * * Historical Intent: Added in PR #11 (commit a36a5ae, Jul 2026) to elevate UI copy and inject accessibility labels, standardizing icon rendering via PDF generation.
     */
    const pathRegex = /<path[^>]*d="([^"]+)"[^>]*>/g;
    const paths = Array.from(svgText.matchAll(pathRegex), (m) => ({ data: m[1], element: m[0] }));
    if (paths.length === 0) throw new Error("No SVG paths found");

    const globalFillMatch = svgText.match(/<svg[^>]*fill="([^"]+)"/);
    const globalStrokeMatch = svgText.match(/<svg[^>]*stroke="([^"]+)"/);
    const globalStrokeWidthMatch = svgText.match(/<svg[^>]*stroke-width="([^"]+)"/);

    const preserveAspectRatioMatch = svgText.match(/<svg[^>]*preserveAspectRatio="([^"]+)"/);
    const preserveAspectRatio = preserveAspectRatioMatch ? preserveAspectRatioMatch[1] : null;
    const shouldMaintainAspectRatio = preserveAspectRatio !== "none";

    const vbMatch = svgText.match(/viewBox="([^"]+)"/);
    if (!vbMatch) throw new Error("SVG viewBox not found");
    const [, vb] = vbMatch;
    const [, , vbW, vbH] = vb.split(/\s+/).map(parseFloat);

    const scale = shouldMaintainAspectRatio ? Math.min(width / vbW, height / vbH) : 1;
    const scaleX = shouldMaintainAspectRatio ? scale : width / vbW;
    const scaleY = shouldMaintainAspectRatio ? scale : height / vbH;
    const offsetX = shouldMaintainAspectRatio ? (width - vbW * scale) / 2 : 0;
    const offsetY = shouldMaintainAspectRatio ? (height - vbH * scale) / 2 : 0;

    const drawX = x + offsetX;
    const drawY = pageHeight - y - offsetY;

    for (const path of paths) {
      const pathFillMatch = path.element.match(/fill="([^"]+)"/);
      const pathStrokeMatch = path.element.match(/stroke="([^"]+)"/);
      const pathStrokeWidthMatch = path.element.match(/stroke-width="([^"]+)"/);
      const lineJoinMatch = path.element.match(/stroke-linejoin="([^"]+)"/);
      const opts = { x: drawX, y: drawY, opacity };

      const fillColor = pathFillMatch?.[1] ?? globalFillMatch?.[1];
      if (fillColor && fillColor !== "none") {
        const c = hexToRgb(fillColor);
        opts.color = PDFLib.rgb(c.red, c.green, c.blue);
      }

      const strokeColor = pathStrokeMatch?.[1] ?? globalStrokeMatch?.[1];
      if (strokeColor && strokeColor !== "none") {
        const c = hexToRgb(strokeColor);
        opts.borderColor = PDFLib.rgb(c.red, c.green, c.blue);
      }

      const strokeWidth = pathStrokeWidthMatch?.[1] ?? globalStrokeWidthMatch?.[1];
      if (strokeWidth) {
        opts.borderWidth = parseFloat(strokeWidth) * Math.min(scaleX, scaleY);
      }

      if (lineJoinMatch) {
        opts.borderLineCap =
          {
            butt: PDFLib.LineCapStyle.Butt,
            projecting: PDFLib.LineCapStyle.Projecting,
            round: PDFLib.LineCapStyle.Round,
          }[lineJoinMatch[1]] ?? opts.borderLineCap;
      }

      const scaledPathData = svgpath(path.data).scale(scaleX, scaleY).toString();
      await pdfPage.drawSvgPath(scaledPathData, opts);
    }
  }

  static async drawImageOnPage(pdfDoc, pdfPage, operation) {
    if (!pdfDoc || !pdfPage || !operation || !operation.url) {
      throw new Error("Cannot be null");
    }
    const { url } = operation;
    // Fetch image data
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const type = PDFGenerator.getImageType(arrayBuffer);

    switch (type) {
      case "jpg":
      case "png":
        await PDFGenerator.drawRasterImageOnPage(pdfDoc, pdfPage, arrayBuffer, type, operation);
        break;
      case "svg":
        await PDFGenerator.drawSvgImageOnPage(pdfPage, arrayBuffer, operation);
        break;
      default:
    }
  }
  static async drawRectangleOnPage(pdfDoc, pdfPage, operation) {
    const borderWidth = parseInt(operation.borderWidth);
    const borderColor = hexToRgb(operation.borderColor);
    const fillColor = parseColor(operation.fill ?? operation.color);
    const opacity = parseFloat(operation.opacity, 10);

    await pdfPage.drawRectangle({
      x: operation.x + borderWidth / 2,
      y: pdfPage.getHeight() + borderWidth / 2 - operation.y - operation.height,
      width: operation.width - borderWidth,
      height: operation.height - borderWidth,
      borderWidth,
      borderColor: PDFLib.rgb(borderColor.red, borderColor.green, borderColor.blue),
      borderOpacity: borderWidth ? opacity : 0,
      ...(fillColor && {
        color: PDFLib.rgb(fillColor.red, fillColor.green, fillColor.blue),
        opacity,
      }),
    });
  }
  static async drawCircleOnPage(pdfDoc, pdfPage, operation) {
    const borderColor = hexToRgb(operation.borderColor);
    const fillColor = parseColor(operation.fill ?? operation.color);
    const opacity = parseFloat(operation.opacity, 10);

    await pdfPage.drawEllipse({
      x: operation.x + operation.width / 2,
      y: pdfPage.getHeight() - operation.y - operation.height / 2,
      xScale: (operation.width - operation.borderWidth) / 2,
      yScale: (operation.height - operation.borderWidth) / 2,
      borderWidth: operation.borderWidth,
      borderColor: PDFLib.rgb(borderColor.red, borderColor.green, borderColor.blue),
      borderOpacity: operation.borderWidth ? opacity : 0,
      ...(fillColor && {
        color: PDFLib.rgb(fillColor.red, fillColor.green, fillColor.blue),
        opacity,
      }),
    });
  }
  static async drawTextFieldOnPage(pdfDoc, pdfPage, operation) {
    const id = operation.type === "create" ? `text-field-${operation.id}` : operation.id;
    const borderWidth = parseFloat(operation.borderWidth, 10);
    const borderColor = hexToRgb(operation.borderColor);
    const fontColor = hexToRgb(operation.color);
    const backgroundColor = hexToRgb(operation.backgroundColor);
    const maxLength = parseFloat(operation.maxLength, 10);
    const resolvedFont =
      operation.fontFamily === "TimesRoman"
        ? PDFLib.StandardFonts.TimesRoman
        : operation.fontFamily;
    const fontToEmbed = Object.values(PDFLib.StandardFonts).includes(resolvedFont)
      ? resolvedFont
      : PDFLib.StandardFonts.Helvetica;

    pdfDoc.__fontCache ??= new Map();
    let embedFontPromise = pdfDoc.__fontCache.get(fontToEmbed);
    if (!embedFontPromise) {
      embedFontPromise = pdfDoc.embedFont(fontToEmbed);
      pdfDoc.__fontCache.set(fontToEmbed, embedFontPromise);
    }
    const embedFont = await embedFontPromise;

    const form = pdfDoc.getForm();
    await form.createTextField(id).addToPage(pdfPage, {
      x: operation.x,
      y: pdfPage.getHeight() - operation.y - operation.height,
      width: operation.width - borderWidth / 2,
      height: operation.height - borderWidth / 2,
      textColor: PDFLib.rgb(fontColor.red, fontColor.green, fontColor.blue),
      backgroundColor: PDFLib.rgb(backgroundColor.red, backgroundColor.green, backgroundColor.blue),
      borderColor: PDFLib.rgb(borderColor.red, borderColor.green, borderColor.blue),
      borderWidth,
      font: embedFont,
    });

    const existingTextField = form.getTextField(id);
    existingTextField.setText(operation.text);
    existingTextField.setFontSize(parseFloat(operation.fontSize, 10));
    if (!isNaN(maxLength)) existingTextField.setMaxLength(maxLength);

    existingTextField.setAlignment(
      operation.alignment === "Left"
        ? PDFLib.TextAlignment.Left
        : operation.alignment === "Center"
          ? PDFLib.TextAlignment.Center
          : operation.alignment === "Right"
            ? PDFLib.TextAlignment.Right
            : PDFLib.TextAlignment.Left,
    );

    operation.isRequired ? existingTextField.enableRequired() : existingTextField.disableRequired();
    operation.isMultiline
      ? existingTextField.enableMultiline()
      : existingTextField.disableMultiline();
    operation.isReadOnly ? existingTextField.enableReadOnly() : existingTextField.disableReadOnly();
  }
  static async drawCheckboxOnPage(pdfDoc, pdfPage, operation) {
    const id = operation.type === "create" ? `checkbox-${operation.id}` : operation.id;
    const borderWidth = parseFloat(operation.borderWidth, 10);
    const borderColor = hexToRgb(operation.borderColor);
    const fontColor = hexToRgb(operation.color);
    const backgroundColor = hexToRgb(operation.backgroundColor);

    const form = pdfDoc.getForm();
    await form.createCheckBox(id).addToPage(pdfPage, {
      x: operation.x,
      y: pdfPage.getHeight() - operation.y - operation.height,
      width: operation.width,
      height: operation.height,
      textColor: PDFLib.rgb(fontColor.red, fontColor.green, fontColor.blue),
      backgroundColor: PDFLib.rgb(backgroundColor.red, backgroundColor.green, backgroundColor.blue),
      borderColor: PDFLib.rgb(borderColor.red, borderColor.green, borderColor.blue),
      borderWidth,
      rotate: PDFLib.degrees(0),
    });

    const existingCheckbox = form.getCheckBox(id);
    operation.isChecked ? existingCheckbox.check() : existingCheckbox.uncheck();
    operation.isReadOnly ? existingCheckbox.enableReadOnly() : existingCheckbox.disableReadOnly();
  }
  static _registerAndAddAnnotation(pdfDoc, pdfPage, linkDictData) {
    pdfPage.node.set(
      PDFLib.PDFName.of("Annots"),
      pdfPage.node.get(PDFLib.PDFName.of("Annots")) || [],
    );
    const linkDict = pdfDoc.context.obj(linkDictData);
    const linkRef = pdfDoc.context.register(linkDict);
    const annots = pdfPage.node.get(PDFLib.PDFName.of("Annots"));
    if (annots) {
      annots.push(linkRef);
    } else {
      pdfPage.node.set(PDFLib.PDFName.of("Annots"), [linkRef]);
    }
  }

  static async drawLinkOnPage(pdfDoc, pdfPage, operation) {
    const operationPageHeight = pdfPage.getHeight();
    const x = operation.x;
    const y = operation.y;
    const height = operation.height;
    const width = operation.width;
    const borderWidth = parseInt(operation.borderWidth) || 0;
    const borderColor = hexToRgb(operation.borderColor ?? "#007acc");
    const fill = operation.fill ?? "rgba(0, 122, 204, 0.1)";
    const opacity = parseFloat(operation.opacity, 10) || 1.0;
    const linkType = operation.linkType;
    const linkValue = operation.linkValue;
    // Parse fill color (handle rgba format)
    const fillColor = parseColor(fill);
    // Draw the visual rectangle for the link area
    const rectangleOptions = {
      x: x + borderWidth / 2,
      y: operationPageHeight + borderWidth / 2 - y - height,
      width: width - borderWidth,
      height: height - borderWidth,
      borderWidth: borderWidth,
      borderColor: PDFLib.rgb(borderColor.red, borderColor.green, borderColor.blue),
      opacity: opacity,
    };
    // Only add color and opacity if fill is not transparent
    if (fillColor) {
      rectangleOptions.color = PDFLib.rgb(fillColor.red, fillColor.green, fillColor.blue);
    }
    await pdfPage.drawRectangle(rectangleOptions);
    // Create the link annotation
    const linkAnnotation = {
      x: x,
      y: operationPageHeight - y - height,
      width: width,
      height: height,
    };
    const rect = [
      linkAnnotation.x,
      linkAnnotation.y,
      linkAnnotation.x + linkAnnotation.width,
      linkAnnotation.y + linkAnnotation.height,
    ];

    const linkDictData = { Type: "Annot", Subtype: "Link", Rect: rect, Border: [0, 0, 0] };
    if (linkType === "url" && linkValue?.match(/^https?:\/\//)) {
      PDFGenerator._registerAndAddAnnotation(pdfDoc, pdfPage, {
        ...linkDictData,
        A: { Type: "Action", S: "URI", URI: PDFLib.PDFString.of(linkValue) },
      });
    } else if (linkType === "page" && parseInt(linkValue) > 0) {
      const targetPage = pdfDoc.getPages()[parseInt(linkValue) - 1];
      if (targetPage) {
        PDFGenerator._registerAndAddAnnotation(pdfDoc, pdfPage, {
          ...linkDictData,
          Dest: [targetPage.ref, "XYZ", null, null, null],
        });
      }
    }
  }
}
export { PDFGenerator };
