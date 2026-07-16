import { BasicOperationComponent } from "./BasicOperationComponent.js";

class CheckboxOperationComponent extends BasicOperationComponent {
  constructor(operation, canvasContainer) {
    super(operation, canvasContainer);
    this.shadow = document.createElement("img");
    this.shadow.classList.add("component-content");
    this.shadow.setAttribute("src", "/images/checkbox-checked.png");
    this.shadow.style.maxWidth = "100%";
    this.shadow.style.maxHeight = "100%";
    this.shadow.style.objectFit = "contain";
    this.wrapperContainer.appendChild(this.shadow);
    this.initializeOperation();
  }
  operationChanged = (property, value) => {
    switch (property) {
      case "width":
        this.wrapperContainer.style.width = `${value}px`;
        break;
      case "height":
        this.wrapperContainer.style.height = `${value}px`;
        break;
      case "backgroundColor":
        this.wrapperContainer.style.backgroundColor = value;
        break;
      case "opacity":
        this.wrapperContainer.style.opacity = value;
        break;
      case "fontFamily":
        this.shadow.style.fontFamily = value;
        break;
      case "borderColor":
        this.shadow.style.borderColor = value;
        break;
      case "borderWidth":
        this.shadow.style.borderWidth = value + "px";
        this.shadow.style.borderStyle = "solid";
        this.shadow.style.width = `calc(100% - ${parseInt(this.shadow.style.borderWidth) * 2}px)`;
        this.shadow.style.height = `calc(100% - ${parseInt(this.shadow.style.borderWidth) * 2}px)`;
        break;
      case "isChecked":
        this.shadow.setAttribute(
          "src",
          value ? "/images/checkbox-checked.png" : "/images/checkbox-unchecked.png",
        );
        break;
    }
  };
  static createDefaultOperation = (id, x, y, width = 25, height = 25) => {
    return {
      type: "checkbox",
      operation: "create",
      name: "",
      id: id,
      x: x,
      y: y,
      height: height,
      width: width,
      color: "#000000",
      borderWidth: 1,
      borderColor: "#000000",
      backgroundColor: "#ADD8E6",
      opacity: 1,
      isChecked: false,
      isReadOnly: false,
    };
  };
  static updateDefaultOperation = (
    id,
    x,
    y,
    height,
    width,
    borderWidth,
    color,
    borderColor,
    backgroundColor,
    isChecked,
    isReadOnly,
  ) => {
    return {
      type: "checkbox",
      operation: "update",
      name: "",
      id: id,
      x: parseInt(x),
      y: parseInt(y),
      height: height + borderWidth * 2,
      width: width + borderWidth * 2,
      color: color,
      borderWidth: borderWidth,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      opacity: 1,
      isChecked: isChecked,
      isReadOnly: isReadOnly,
    };
  };
}

export { CheckboxOperationComponent };
