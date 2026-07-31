import { BasicOperationComponent } from "./BasicOperationComponent.js";
import { calculateInnerDimensions } from "../utils/dimensions.js";

class TextFieldOperationComponent extends BasicOperationComponent {
  constructor(operation, canvasContainer) {
    super(operation, canvasContainer);
    this.shadow = document.createElement("div");
    this.shadow.classList.add("component-content");
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
      this.setSelected(true);
    });
    this.wrapperContainer.appendChild(this.shadow);
    this.initializeOperation();
  }
  operationChanged = (property, value) => {
    switch (property) {
      case "backgroundColor":
        this.wrapperContainer.style.backgroundColor = value;
        break;
      case "opacity":
        this.wrapperContainer.style.opacity = value;
        break;
      case "fontFamily":
        this.shadow.style.fontFamily = value;
        break;
      case "fontSize":
        this.shadow.style.fontSize = `${value}px`;
        break;
      case "borderColor":
        this.shadow.style.borderColor = value;
        break;
      case "borderWidth":
        this.shadow.style.borderWidth = value + "px";
        this.shadow.style.width = calculateInnerDimensions(this.shadow.style.borderWidth);
        this.shadow.style.height = calculateInnerDimensions(this.shadow.style.borderWidth);
        this.shadow.style.borderStyle = "solid";
        break;
      case "text":
        this.shadow.innerText = value;
        break;
    }
  };
  static createDefaultOperation = (id, x, y, width = 150, height = 25) => {
    return {
      type: "textfield",
      operation: "create",
      name: "",
      id: id,
      x: x,
      y: y,
      text: "",
      height: height,
      width: width,
      color: "#000000",
      borderWidth: 1,
      borderColor: "#000000",
      backgroundColor: "#ADD8E6",
      opacity: 1,
      fontFamily: "Helvetica",
      fontSize: 14,
      isRequired: false,
      isMultiline: false,
      isReadOnly: false,
      maxLength: undefined,
      alignment: "Left",
    };
  };
  static updateDefaultOperation = (
    id,
    x,
    y,
    height,
    width,
    text,
    borderWidth,
    color,
    borderColor,
    backgroundColor,
    fontFamily,
    fontSize,
    isRequired,
    isMultiline,
    isReadOnly,
    maxLength,
    alignment,
  ) => {
    return {
      type: "textfield",
      operation: "update",
      name: "",
      id: id,
      x: parseInt(x),
      y: parseInt(y),
      text: text,
      height: height + borderWidth * 2,
      width: width + borderWidth * 2,
      color: color,
      borderWidth: borderWidth,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      opacity: 1,
      fontFamily: fontFamily,
      fontSize: fontSize,
      isRequired: isRequired,
      isMultiline: isMultiline,
      isReadOnly: isReadOnly,
      maxLength: maxLength || undefined,
      alignment: alignment,
    };
  };
}

export { TextFieldOperationComponent };
