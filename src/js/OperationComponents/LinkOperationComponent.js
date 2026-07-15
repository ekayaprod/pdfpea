import { BasicOperationComponent } from "./BasicOperationComponent.js";

class LinkOperationComponent extends BasicOperationComponent {
  constructor(operation, canvasContainer) {
    super(operation, canvasContainer);
    this.shadow = document.createElement("div");
    this.shadow.classList.add("component-content", "link-component");
    // Add link visual indicator
    this.wrapperContainer.appendChild(this.shadow);
    this.initializeOperation();
  }
  operationChanged = (property, value) => {
    switch (property) {
      case "borderWidth":
        this.shadow.style.borderWidth = value + "px";
        this.shadow.style.borderStyle = "solid";
        break;
      case "opacity":
        this.shadow.style.opacity = value;
        break;
      case "borderColor":
        this.shadow.style.borderStyle = "solid";
        this.shadow.style.borderColor = value;
        break;
      case "fill":
        this.shadow.style.backgroundColor = value;
        break;
    }
  };
  static createDefaultOperation = (
    id,
    x,
    y,
    width = 100,
    height = 30,
    linkType = "url",
    linkValue = "",
    fill = "rgba(0, 122, 204, 0.1)",
    borderColor = "#007acc",
    borderWidth = 1,
    opacity = 1.0,
  ) => {
    return {
      type: "link",
      operation: "create",
      name: "",
      id: id,
      x: x,
      y: y,
      height: height,
      width: width,
      linkType: linkType,
      linkValue: linkValue,
      fill: fill,
      opacity: opacity,
      borderColor: borderColor,
      borderWidth: borderWidth,
    };
  };
}

export { LinkOperationComponent };