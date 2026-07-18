import { describe, it, expect, beforeEach } from "vitest";
import { CheckboxOperationComponent } from "./CheckboxOperationComponent.js";

describe("CheckboxOperationComponent", () => {
  let mockContainer;

  beforeEach(() => {
    mockContainer = document.createElement("div");
  });

  it("initializes with default values", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);

    expect(component.shadow.getAttribute("src")).toBe("./images/checkbox-unchecked.png");
  });

  it("updates width", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("width", 50);
    expect(component.wrapperContainer.style.width).toBe("50px");
  });

  it("updates height", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("height", 50);
    expect(component.wrapperContainer.style.height).toBe("50px");
  });

  it("updates backgroundColor", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("backgroundColor", "#ffffff");
    expect(component.wrapperContainer.style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("updates opacity", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("opacity", "0.5");
    expect(component.wrapperContainer.style.opacity).toBe("0.5");
  });

  it("updates fontFamily", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("fontFamily", "Arial");
    expect(component.shadow.style.fontFamily).toBe("Arial");
  });

  it("updates borderColor", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("borderColor", "#000000");
    expect(component.shadow.style.borderColor).toBe("rgb(0, 0, 0)");
  });

  it("updates borderWidth", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("borderWidth", 2);
    expect(component.shadow.style.borderWidth).toBe("2px");
    expect(component.shadow.style.borderStyle).toBe("solid");
    expect(component.shadow.style.width).toBe("calc(100% - 4px)");
    expect(component.shadow.style.height).toBe("calc(100% - 4px)");
  });

  it("updates isChecked", () => {
    const operation = CheckboxOperationComponent.createDefaultOperation("1", 10, 20);
    const component = new CheckboxOperationComponent(operation, mockContainer);
    component.operationChanged("isChecked", true);
    expect(component.shadow.getAttribute("src")).toBe("./images/checkbox-checked.png");
    component.operationChanged("isChecked", false);
    expect(component.shadow.getAttribute("src")).toBe("./images/checkbox-unchecked.png");
  });

  it("creates update default operation", () => {
    const op = CheckboxOperationComponent.updateDefaultOperation(
      "1",
      10,
      20,
      30,
      40,
      2,
      "#fff",
      "#000",
      "#eee",
      true,
      false,
    );
    expect(op.height).toBe(34);
    expect(op.width).toBe(44);
  });
});
