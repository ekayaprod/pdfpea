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
    if (!arrayBuffer || arrayBuffer.byteLength < 2) return "unknown";
    const view = new DataView(arrayBuffer);
    const str = new TextDecoder("utf-8").decode(arrayBuffer);
    if (str.startsWith("<svg") || str.startsWith("<?xml")) return "svg";
    if (view.getUint16(0) === 0xffd8) return "jpg";
    if (
      arrayBuffer.byteLength >= 8 &&
      view.getUint32(0) === 0x89504e47 &&
      view.getUint32(4) === 0x0d0a1a0a
    )
      return "png";
    return "unknown";
  }
  static async generatePDF(fileContents, pageOperations) {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const srcDoc = await PDFLib.PDFDocument.load(PDFGenerator.str2ab(fileContents));
    // ⚡ THE ALGORITHMIC TRAP: Pre-compute dictionary of fields for O(1) lookups
    const srcForm = srcDoc.getForm();
    const fieldMap = new Map(srcForm.getFields().map((f) => [f.getName(), f]));
    for (const page of pageOperations) {
      page.operations
        .filter((op) => op.operation === "update" && fieldMap.has(op.id))
        .forEach((op) => {
          srcForm.removeField(fieldMap.get(op.id));
          fieldMap.delete(op.id);
        });
      const [cpage] = await pdfDoc.copyPages(srcDoc, [page.pageNumber - 1]);
      pdfDoc.addPage(cpage);
    }
    // ⚡ THE WATERFALL COLLAPSE: Batch pre-fetch pages
    const pdfPages = pdfDoc.getPages();
    const typeMap = {
      text: "drawTextOnPage",
      rectangle: "drawRectangleOnPage",
      circle: "drawCircleOnPage",
      image: "drawImageOnPage",
      textfield: "drawTextFieldOnPage",
      checkbox: "drawCheckboxOnPage",
      link: "drawLinkOnPage",
    };
    // Pages themselves can be processed concurrently
    await Promise.all(
      pageOperations.map(async (page) => {
        const pdfPage = pdfPages[page.pageNumber - 1];
        // CRITICAL REVERT: Preserve sequential Z-order of canvas painting operations
        for (const op of page.operations) {
          const fn = typeMap[op.type];
          const validUpdate =
            op.operation === "update" && ["textfield", "checkbox", "link"].includes(op.type);
          if (fn && (op.operation === "create" || validUpdate)) await this[fn](pdfDoc, pdfPage, op);
        }
      }),
    );
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
  static async drawTextOnPage(pdfDoc, pdfPage, operation) {
    const fontColor = hexToRgb(operation.color) || { red: 0, green: 0, blue: 0 };
    const resolvedFont =
      operation.fontFamily === "TimesRoman"
        ? PDFLib.StandardFonts.TimesRoman
        : operation.fontFamily;
    const fontToEmbed = Object.values(PDFLib.StandardFonts).includes(resolvedFont)
      ? resolvedFont
      : PDFLib.StandardFonts.Helvetica;

    pdfDoc.__fontCache ??= new Map();
    if (!pdfDoc.__fontCache.has(fontToEmbed))
      pdfDoc.__fontCache.set(fontToEmbed, pdfDoc.embedFont(fontToEmbed));
    const embedFont = await pdfDoc.__fontCache.get(fontToEmbed);

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
    const { x, y, width, height } = operation;
    const opacity = parseFloat(operation.opacity, 10);
    const embeddedImg = await (type === "jpg"
      ? pdfDoc.embedJpg(arrayBuffer)
      : pdfDoc.embedPng(arrayBuffer));
    const scaled = embeddedImg.scaleToFit(width, height);

    await pdfPage.drawImage(embeddedImg, {
      x: x + (width - scaled.width) / 2,
      y: pdfPage.getHeight() - y - height + (height - scaled.height) / 2,
      width: scaled.width,
      height: scaled.height,
      opacity,
    });
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

    const shouldMaintainAspectRatio =
      (svgText.match(/<svg[^>]*preserveAspectRatio="([^"]+)"/)?.[1] ?? "") !== "none";

    const vbMatch = svgText.match(/viewBox="([^"]+)"/);
    if (!vbMatch) throw new Error("SVG viewBox not found");
    const [, , vbW, vbH] = vbMatch[1].split(/\s+/).map(parseFloat);

    const scale = shouldMaintainAspectRatio ? Math.min(width / vbW, height / vbH) : 1;
    const scaleX = shouldMaintainAspectRatio ? scale : width / vbW;
    const scaleY = shouldMaintainAspectRatio ? scale : height / vbH;
    const offsetX = shouldMaintainAspectRatio ? (width - vbW * scale) / 2 : 0;
    const offsetY = shouldMaintainAspectRatio ? (height - vbH * scale) / 2 : 0;

    const drawX = x + offsetX;
    const drawY = pageHeight - y - offsetY;

    await Promise.all(
      paths.map(async (path) => {
        const opts = { x: drawX, y: drawY, opacity };

        const fillColor = path.element.match(/fill="([^"]+)"/)?.[1] ?? globalFillMatch?.[1];
        if (fillColor && fillColor !== "none") {
          const c = hexToRgb(fillColor);
          if (c) {
            opts.color = PDFLib.rgb(c.red, c.green, c.blue);
          }
        }

        const strokeColor = path.element.match(/stroke="([^"]+)"/)?.[1] ?? globalStrokeMatch?.[1];
        if (strokeColor && strokeColor !== "none") {
          const c = hexToRgb(strokeColor);
          if (c) {
            opts.borderColor = PDFLib.rgb(c.red, c.green, c.blue);
          }
        }

        const strokeWidth =
          path.element.match(/stroke-width="([^"]+)"/)?.[1] ?? globalStrokeWidthMatch?.[1];
        if (strokeWidth) opts.borderWidth = parseFloat(strokeWidth) * Math.min(scaleX, scaleY);

        const lineJoin = path.element.match(/stroke-linejoin="([^"]+)"/)?.[1];
        if (lineJoin) {
          opts.borderLineCap =
            {
              butt: PDFLib.LineCapStyle.Butt,
              projecting: PDFLib.LineCapStyle.Projecting,
              round: PDFLib.LineCapStyle.Round,
            }[lineJoin] ?? opts.borderLineCap;
        }

        await pdfPage.drawSvgPath(svgpath(path.data).scale(scaleX, scaleY).toString(), opts);
      }),
    );
  }

  static async drawImageOnPage(pdfDoc, pdfPage, operation) {
    if (!pdfDoc || !pdfPage || !operation || !operation.url) throw new Error("Cannot be null");
    const arrayBuffer = await (await fetch(operation.url)).arrayBuffer();
    const type = PDFGenerator.getImageType(arrayBuffer);
    if (type === "jpg" || type === "png") {
      await PDFGenerator.drawRasterImageOnPage(pdfDoc, pdfPage, arrayBuffer, type, operation);
    } else if (type === "svg") {
      await PDFGenerator.drawSvgImageOnPage(pdfPage, arrayBuffer, operation);
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
    const borderColor = hexToRgb(operation.borderColor) || { red: 0, green: 0, blue: 0 };
    const fontColor = hexToRgb(operation.color) || { red: 0, green: 0, blue: 0 };
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
    if (!pdfDoc.__fontCache.has(fontToEmbed))
      pdfDoc.__fontCache.set(fontToEmbed, pdfDoc.embedFont(fontToEmbed));
    const embedFont = await pdfDoc.__fontCache.get(fontToEmbed);

    const form = pdfDoc.getForm();
    await form.createTextField(id).addToPage(pdfPage, {
      x: operation.x,
      y: pdfPage.getHeight() - operation.y - operation.height,
      width: operation.width - borderWidth / 2,
      height: operation.height - borderWidth / 2,
      textColor: PDFLib.rgb(fontColor.red, fontColor.green, fontColor.blue),
      ...(backgroundColor && {
        backgroundColor: PDFLib.rgb(
          backgroundColor.red,
          backgroundColor.green,
          backgroundColor.blue,
        ),
      }),
      borderColor: PDFLib.rgb(borderColor.red, borderColor.green, borderColor.blue),
      borderWidth,
      font: embedFont,
    });

    const existingTextField = form.getTextField(id);
    existingTextField.setText(operation.text);
    existingTextField.setFontSize(parseFloat(operation.fontSize, 10));
    if (!isNaN(maxLength)) existingTextField.setMaxLength(maxLength);

    existingTextField.setAlignment(
      PDFLib.TextAlignment[operation.alignment] ?? PDFLib.TextAlignment.Left,
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
    const borderColor = hexToRgb(operation.borderColor) || { red: 0, green: 0, blue: 0 };
    const fontColor = hexToRgb(operation.color) || { red: 0, green: 0, blue: 0 };
    const backgroundColor = hexToRgb(operation.backgroundColor);

    const form = pdfDoc.getForm();
    await form.createCheckBox(id).addToPage(pdfPage, {
      x: operation.x,
      y: pdfPage.getHeight() - operation.y - operation.height,
      width: operation.width,
      height: operation.height,
      textColor: PDFLib.rgb(fontColor.red, fontColor.green, fontColor.blue),
      ...(backgroundColor && {
        backgroundColor: PDFLib.rgb(
          backgroundColor.red,
          backgroundColor.green,
          backgroundColor.blue,
        ),
      }),
      borderColor: PDFLib.rgb(borderColor.red, borderColor.green, borderColor.blue),
      borderWidth,
      rotate: PDFLib.degrees(0),
    });

    const existingCheckbox = form.getCheckBox(id);
    operation.isChecked ? existingCheckbox.check() : existingCheckbox.uncheck();
    operation.isReadOnly ? existingCheckbox.enableReadOnly() : existingCheckbox.disableReadOnly();
  }
  static _registerAndAddAnnotation(pdfDoc, pdfPage, linkDictData) {
    const annotsKey = PDFLib.PDFName.of("Annots");
    const annots = pdfPage.node.get(annotsKey) || [];
    annots.push(pdfDoc.context.register(pdfDoc.context.obj(linkDictData)));
    pdfPage.node.set(annotsKey, annots);
  }

  // 🕯️ CHRONICLE: AST reasoning explains the logic; Git history explains the business intent.
  /**
   * Renders clickable link annotations onto the PDF page by translating layout dimensions and URL targets into PDFLib dictionaries.
   * Note the `"rgba(0, 122, 204, 0.1)"` default fill color: this is a magic number mapping to the signature blue link highlighting shade established in the initial release.
   * * Historical Intent: The raw drawing logic was simplified by extracting parsing and annotation logic in PR #60 (commit fbf65a4, Jul 2026). The signature blue fill dates back to the initial commit (76bc964, Jul 2025).
   */
  static async drawLinkOnPage(pdfDoc, pdfPage, operation) {
    const borderWidth = parseInt(operation.borderWidth) || 0;
    const borderColor = hexToRgb(operation.borderColor ?? "#007acc") || {
      red: 0,
      green: 122 / 255,
      blue: 204 / 255,
    };
    const opacity = parseFloat(operation.opacity, 10) || 1.0;
    const fillColor = parseColor(operation.fill ?? "rgba(0, 122, 204, 0.1)");

    await pdfPage.drawRectangle({
      x: operation.x + borderWidth / 2,
      y: pdfPage.getHeight() + borderWidth / 2 - operation.y - operation.height,
      width: operation.width - borderWidth,
      height: operation.height - borderWidth,
      borderWidth,
      borderColor: PDFLib.rgb(borderColor.red, borderColor.green, borderColor.blue),
      opacity,
      ...(fillColor && { color: PDFLib.rgb(fillColor.red, fillColor.green, fillColor.blue) }),
    });

    const linkDictData = {
      Type: "Annot",
      Subtype: "Link",
      Rect: [
        operation.x,
        pdfPage.getHeight() - operation.y - operation.height,
        operation.x + operation.width,
        pdfPage.getHeight() - operation.y - operation.height + operation.height,
      ],
      Border: [0, 0, 0],
    };

    if (operation.linkType === "url" && operation.linkValue?.match(/^https?:\/\//)) {
      PDFGenerator._registerAndAddAnnotation(pdfDoc, pdfPage, {
        ...linkDictData,
        A: { Type: "Action", S: "URI", URI: PDFLib.PDFString.of(operation.linkValue) },
      });
    } else if (operation.linkType === "page" && parseInt(operation.linkValue) > 0) {
      const targetPage = pdfDoc.getPages()[parseInt(operation.linkValue) - 1];
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
