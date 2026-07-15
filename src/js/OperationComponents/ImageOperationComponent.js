import { BasicOperationComponent } from "./BasicOperationComponent.js";

class ImageOperationComponent extends BasicOperationComponent {
  constructor(operation, canvasContainer) {
    super(operation, canvasContainer);
    if (!operation || (!operation.url && !operation.src)) {
        throw new TypeError("ImageOperationComponent: image operation must have a url");
    }
    const url = "/images/default_image.jpg";
    this.shadow = document.createElement("img");
    this.shadow.classList.add("component-content");
    this.shadow.setAttribute("src", url);
    this.wrapperContainer.appendChild(this.shadow);
    this.initializeOperation();
  }
  operationChanged = (property, value) => {
    switch (property) {
      case "imageHeight":
        this.shadow.style.height = `${value}%`;
      case "imageWidth":
        this.shadow.style.width = `${value}%`;
      case "opacity":
        this.shadow.style.opacity = value;
        break;
      case "objectFit":
        this.shadow.style.objectFit = value;
        break;
      case "url":
        this.shadow.setAttribute("src", value);
        break;
    }
  };
  static createDefaultOperation = (
    id,
    x,
    y,
    width = 100,
    height = 100,
    url = "/images/default_image.jpg",
    imageHeight = 100,
    imageWidth = 100,
    subType = null,
  ) => {
    return {
      type: "image",
      operation: "create",
      name: "",
      id: id,
      x: x,
      y: y,
      height: height,
      width: width,
      imageHeight: imageHeight,
      imageWidth: imageWidth,
      opacity: 1.0,
      url: url,
      subType: subType,
    };
  };
}

export { ImageOperationComponent };
