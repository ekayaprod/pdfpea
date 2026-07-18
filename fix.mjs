import fs from 'fs';
let content = fs.readFileSync('src/js/OperationComponents/BasicOperationComponent.spec.js', 'utf8');

if (content.endsWith('});\n')) {
    content = content.slice(0, -4);

    content += `    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 150 });
    document.dispatchEvent(moveEvent);

    expect(component.wrapperContainer.style.left).toBe("60px");
    expect(component.wrapperContainer.style.top).toBe("70px");

    const upEvent = new MouseEvent("mouseup");
    document.dispatchEvent(upEvent);
  });

  it("should handle createDeleteAble interactions", () => {
    const component = new BasicOperationComponent({ type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" }, document.createElement("div"));
    const deleteAble = component.createDeleteAble();

    expect(deleteAble.name).toBe("deleteViewable");
    expect(typeof deleteAble.render).toBe("function");

    const mockR = {
      createElement: vi.fn((tag, props, children) => {
        return { tag, props, children };
      })
    };

    const rendered = deleteAble.render(null, mockR);
    expect(rendered.tag).toBe("div");

    const moveButtonProps = rendered.children[0].props;
    vi.spyOn(component, "startMoveDrag").mockImplementation(() => {});

    const mockMouseDownEvent = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
    moveButtonProps.onMouseDown(mockMouseDownEvent);
    expect(component.startMoveDrag).toHaveBeenCalledWith(mockMouseDownEvent);

    const mockClickEvent = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
    moveButtonProps.onClick(mockClickEvent);
    expect(mockClickEvent.stopPropagation).toHaveBeenCalled();
    expect(mockClickEvent.preventDefault).toHaveBeenCalled();

    const deleteButtonProps = rendered.children[1].props;
    vi.spyOn(component, "deleteComponent").mockImplementation(() => {});

    const mockDeleteMouseDownEvent = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
    deleteButtonProps.onMouseDown(mockDeleteMouseDownEvent);
    expect(mockDeleteMouseDownEvent.stopPropagation).toHaveBeenCalled();
    expect(mockDeleteMouseDownEvent.preventDefault).toHaveBeenCalled();

    const mockDeleteClickEvent = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
    deleteButtonProps.onClick(mockDeleteClickEvent);
    expect(mockDeleteClickEvent.stopPropagation).toHaveBeenCalled();
    expect(mockDeleteClickEvent.preventDefault).toHaveBeenCalled();
    expect(component.deleteComponent).toHaveBeenCalled();
  });

  it("should handle startMoveDrag without moveable", () => {
    const component = new BasicOperationComponent({ type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" }, document.createElement("div"));
    vi.spyOn(component, "fireEvent").mockImplementation(() => {});

    component.wrapperContainer.moveable = null;

    const event = new MouseEvent("mousedown", { clientX: 100, clientY: 100 });
    vi.spyOn(event, "stopPropagation");
    vi.spyOn(event, "preventDefault");

    component.startMoveDrag(event);

    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 150 });
    document.dispatchEvent(moveEvent);

    expect(component.wrapperContainer.style.left).toBe("60px");
    expect(component.wrapperContainer.style.top).toBe("70px");

    const upEvent = new MouseEvent("mouseup");
    document.dispatchEvent(upEvent);
  });

  it("should handle handleBasicOperation without moveable", () => {
    const component = new BasicOperationComponent({ type: "test", x: 10, y: 20, height: 100, width: 100, operation: "create" }, document.createElement("div"));

    component.handleBasicOperation("x", 50);
    expect(component.wrapperContainer.style.left).toBe("50px");
  });
});\n`;
    fs.writeFileSync('src/js/OperationComponents/BasicOperationComponent.spec.js', content);
}
