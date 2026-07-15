import { BasicOperationComponent } from "./BasicOperationComponent.js";

class CircleOperationComponent extends BasicOperationComponent {
  constructor(operation, canvasContainer) {
    super(operation, canvasContainer);
    this.shadow = document.createElement("div");
    this.shadow.classList.add("component-content");
    this.wrapperContainer.appendChild(this.shadow);
    this.initializeOperation();
  }
  operationChanged = (property, value) => {
    switch (property) {
      case "borderWidth":
        this.shadow.style.borderWidth = value + "px";
        this.shadow.style.width = `100%`;
        this.shadow.style.height = `100%`;
        this.shadow.style.borderStyle = "solid";
        break;
      case "borderRadius":
        this.shadow.style.borderRadius = `${value}%`;
      case "opacity":
        this.shadow.style.opacity = value;
        break;
      case "borderColor":
        this.shadow.style.borderColor = value;
        break;
      case "color":
        this.shadow.style.background = value;
        break;
      case "fill":
        this.shadow.style.background = value;
        break;
    }
  };
  static createDefaultOperation = (
    id,
    x,
    y,
    width = 100,
    height = 100,
    fill = "transparent",
    borderColor = "#FF0000",
    borderWidth = 2,
    opacity = 1.0,
  ) => {
    return {
      type: "circle",
      operation: "create",
      name: "",
      id: id,
      x: x,
      y: y,
      height: height,
      width: width,
      color: "#FFFFFF",
      fill: fill,
      opacity: opacity,
      borderOpacity: 1.0,
      borderColor: borderColor,
      borderWidth: borderWidth,
      borderStyle: "solid",
      borderRadius: 50,
    };
  };
}

export { CircleOperationComponent };
