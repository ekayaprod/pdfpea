import { BasicOperationComponent } from "./BasicOperationComponent.js";

import Moveable from "moveable";

class TextOperationComponent extends BasicOperationComponent {
  constructor(operation, canvasContainer) {
    super(operation, canvasContainer);
    this.shadow = document.createElement("div");
    this.shadow.classList.add("component-content");
    this.shadow.style.width = "auto";
    //this.shadow.style.height = 'auto';
    this.shadow.style.whiteSpace = "nowrap";
    //this.shadow.style.overflow = 'visible';
    this.shadow.style.display = "inline-block";
    this.shadow.style.paddingTop = "1px";
    this.shadow.contentEditable = false;
    this.wrapperContainer.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      this.shadow.contentEditable = true;
      this.shadow.focus();
    });
    this.shadow.addEventListener("blur", (event) => {
      event.stopPropagation();
      this.shadow.contentEditable = false;
      this.getOperation().text = this.shadow.innerText;
      this.updateSize();
      this.setSelected(true);
    });
    // Auto-resize while typing
    this.shadow.addEventListener("input", this.updateSize);
    this.wrapperContainer.appendChild(this.shadow);
    this.initializeOperation();
    // Initial size update
    setTimeout(this.updateSize, 0);
  }
  updateSize = () => {
    // Create a temporary element to measure text size
    const temp = document.createElement("div");
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    temp.style.whiteSpace = "nowrap";
    temp.style.font =
      this.shadow.style.font || `${this.operation.fontSize}px ${this.operation.fontFamily}`;
    temp.style.fontSize = this.shadow.style.fontSize;
    temp.style.fontFamily = this.shadow.style.fontFamily;
    temp.innerText = this.shadow.innerText || "sample text";
    document.body.appendChild(temp);
    const width = Math.max(temp.offsetWidth + 4, 20); // Add small padding
    const height = Math.max(temp.offsetHeight + 4, 20); // Add small padding
    document.body.removeChild(temp);
    // Update operation and wrapper size
    this.operation.width = width;
    this.operation.height = height;
    this.wrapperContainer.style.width = `${width}px`;
    this.wrapperContainer.style.height = `${height}px`;
    // Update moveable if it exists
    if (this.wrapperContainer.moveable) {
      this.wrapperContainer.moveable.updateRect();
    }
  };
  // Override makeMoveable to disable resizing for text components
  makeMoveable = () => {
    const deleteAble = this.createDeleteAble();
    this.wrapperContainer.moveable = new Moveable(this.canvasContainer, {
      target: this.wrapperContainer,
      container: this.canvasContainer,
      draggable: true,
      resizable: false, // Disable resizing for text components
      origin: false,
      ables: [deleteAble],
      props: { deleteViewable: true },
    });
    this.wrapperContainer.moveable.on("drag", ({ target, left, top }) => {
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
      this.operation.x = left;
      this.operation.y = top;
      this.fireEvent("pdfeditor.componentDragging");
    });
    this.wrapperContainer.moveable.updateRect();
  };
  operationChanged = (property, value) => {
    switch (property) {
      case "text":
        this.shadow.innerText = value;
        this.updateSize();
        break;
      case "color":
        this.shadow.style.color = value;
        break;
      case "fontSize":
        this.shadow.style.fontSize = value + "px";
        this.updateSize();
        break;
      case "fontFamily":
        this.shadow.style.fontFamily = value;
        this.updateSize();
        break;
      case "opacity":
        this.shadow.style.opacity = value;
        break;
      case "lineHeight":
        this.shadow.style.lineHeight = value;
        break;
      case "wordBreak":
        this.shadow.style.whiteSpace = "pre-wrap";
        this.shadow.style.wordBreak = value;
        break;
    }
  };
  static createDefaultOperation = (
    id,
    x,
    y,
    width = 100,
    height = 25,
    fontFamily = "Helvetica",
    fontSize = 16,
    color = "#000000",
    opacity = 1.0,
  ) => {
    return {
      type: "text",
      operation: "create",
      name: "",
      identifier: id,
      height: height,
      width: width,
      x: x,
      y: y,
      xPadding: 2,
      yPadding: 5,
      text: "sample text",
      fontFamily: fontFamily,
      color: color,
      fontSize: fontSize,
      lineHeight: 1,
      opacity: opacity,
      wordBreak: "break-all",
    };
  };
}

export { TextOperationComponent };