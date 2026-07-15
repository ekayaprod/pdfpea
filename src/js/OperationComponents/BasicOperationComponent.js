import Moveable from "moveable";

class BasicOperationComponent {
  operation = null;
  htmlNode = null;
  canvasContainer = null;
  wrapperContainer = null;
  renderDirections = ["n", "e", "s", "w", "nw", "ne", "sw", "se"];
  constructor(operation, canvasContainer) {
    this.canvasContainer = canvasContainer;
    this.operation = operation;
    this.wrapperContainer = document.createElement("div");
    this.wrapperContainer.classList.add("component");
    this.wrapperContainer.classList.add(`${this.operation.type}-component`);
    this.wrapperContainer.dataset.type = this.operation.type;
    this.wrapperContainer.style.left = `${this.operation.x}px`;
    this.wrapperContainer.style.top = `${this.operation.y}px`;
    this.wrapperContainer.style.height = `${this.operation.height}px`;
    this.wrapperContainer.style.width = `${this.operation.width}px`;
    this.wrapperContainer.operation = operation;
    this.wrapperContainer.__component = this;
    this.canvasContainer.appendChild(this.wrapperContainer);
    this.wrapperContainer.addEventListener("click", (event) => {
      const pdfView = document.querySelector(".body-pdf-view");
      const isDrawingMode = pdfView && pdfView.classList.contains("drawing-mode");
      if (!isDrawingMode) {
        event.stopPropagation();
        this.setSelected(true);
      }
    });
    document.addEventListener("pdfeditor.shouldClearAllSelection", (e) => {
      if (e.detail.target != this) {
        this.setSelected(false);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Delete" &&
        this.wrapperContainer.classList.contains("selected") &&
        this.operation.operation === "create"
      ) {
        this.deleteComponent();
      }
    });
  }
  // Start dragging the component from the move handle
  startMoveDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startX = this.operation.x;
    const startY = this.operation.y;
    // Account for canvas zoom (the container is scaled via CSS transform)
    const rect = this.canvasContainer.getBoundingClientRect();
    const scale = this.canvasContainer.offsetWidth
      ? rect.width / this.canvasContainer.offsetWidth
      : 1;
    const onMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startClientX) / scale;
      const deltaY = (moveEvent.clientY - startClientY) / scale;
      const newLeft = startX + deltaX;
      const newTop = startY + deltaY;
      this.wrapperContainer.style.left = `${newLeft}px`;
      this.wrapperContainer.style.top = `${newTop}px`;
      this.operation.x = newLeft;
      this.operation.y = newTop;
      if (this.wrapperContainer.moveable) {
        this.wrapperContainer.moveable.updateRect();
      }
      this.fireEvent("pdfeditor.componentDragging");
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  // Create the controls able (move + delete) for Moveable
  createDeleteAble = () => {
    const deleteAble = {
      name: "deleteViewable",
      props: [],
      events: [],
      render: (moveable, r) => {
        return r.createElement(
          "div",
          {
            key: "delete-viewer",
            className: "moveable-delete-container",
          },
          [
            r.createElement(
              "div",
              {
                key: "move-button",
                className: "moveable-move-button",
                title: "Move component",
                onMouseDown: (e) => {
                  this.startMoveDrag(e);
                },
                onClick: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                },
              },
              [
                r.createElement("i", {
                  className: "fa-solid fa-up-down-left-right",
                }),
              ],
            ),
            r.createElement(
              "div",
              {
                key: "delete-button",
                className: "moveable-delete-button",
                title: "Delete component",
                onMouseDown: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                },
                onClick: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  this.deleteComponent();
                },
              },
              [
                r.createElement("i", {
                  className: "fa-solid fa-trash",
                }),
              ],
            ),
          ],
        );
      },
    };
    return deleteAble;
  };
  deleteComponent = () => {
    this.removeMoveable();
    this.wrapperContainer.remove();
    // Set a temporary flag to prevent immediate component creation
    window.preventComponentCreation = true;
    setTimeout(() => {
      window.preventComponentCreation = false;
    }, 200); // 200ms delay
    // Clear selection in property panel
    const clearEvent = new CustomEvent("pdfeditor.shouldClearAllSelection", {
      detail: { target: null },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(clearEvent);
  };
  initializeOperation = () => {
    Object.keys(this.operation).forEach((key) => {
      if (this.operationChanged) this.operationChanged(key, this.operation[key]);
    });
  };
  makeMoveable = () => {
    const deleteAble = this.createDeleteAble();
    this.wrapperContainer.moveable = new Moveable(this.canvasContainer, {
      target: this.wrapperContainer,
      container: this.canvasContainer,
      draggable: true,
      resizable: true,
      origin: false,
      renderDirections: this.renderDirections,
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
    this.wrapperContainer.moveable.on("resize", ({ target, width, height, direction, delta }) => {
      // Handle resizing based on direction
      // direction[0]: -1 (left), 0 (center), 1 (right)
      // direction[1]: -1 (top), 0 (center), 1 (bottom)
      let newLeft = parseInt(target.style.left);
      let newTop = parseInt(target.style.top);
      let newWidth = width;
      let newHeight = height;
      // Handle horizontal resizing (left edge movement)
      if (direction[0] === -1) {
        newLeft = parseInt(target.style.left) - delta[0];
        newWidth = parseInt(target.style.width) + delta[0];
      }
      // Handle vertical resizing (top edge movement)
      if (direction[1] === -1) {
        newTop = parseInt(target.style.top) - delta[1];
        newHeight = parseInt(target.style.height) + delta[1];
      }
      // Apply the changes
      target.style.left = `${newLeft}px`;
      target.style.top = `${newTop}px`;
      target.style.width = `${newWidth}px`;
      target.style.height = `${newHeight}px`;
      // Update operation
      this.operation.x = newLeft;
      this.operation.y = newTop;
      this.operation.width = newWidth;
      this.operation.height = newHeight;
      this.fireEvent("pdfeditor.componentResizing");
      this.wrapperContainer.moveable.updateRect();
    });
    this.wrapperContainer.moveable.updateRect();
  };
  removeMoveable = () => {
    if (this.wrapperContainer.moveable) {
      this.wrapperContainer.moveable.destroy();
      this.wrapperContainer.moveable = null;
    }
  };
  getOperation = () => {
    const handler = {
      set: (target, property, value) => {
        target[property] = value;
        if (this.operationChanged) this.operationChanged(property, value);
        this.handleBasicOperation(property, value);
        return true;
      },
    };
    return new Proxy(this.operation, handler);
  };
  handleBasicOperation = (property, value) => {
    switch (property) {
      case "x":
        this.wrapperContainer.style.left = `${value}px`;
        break;
      case "y":
        this.wrapperContainer.style.top = `${value}px`;
        break;
      case "width":
        this.wrapperContainer.style.width = `${value}px`;
        break;
      case "height":
        this.wrapperContainer.style.height = `${value}px`;
        break;
    }
    if (this.wrapperContainer.moveable) {
      this.wrapperContainer.moveable.updateRect();
    }
  };
  setSelected = (selected) => {
    if (selected) {
      this.fireEvent("pdfeditor.shouldClearAllSelection");
      this.fireEvent("pdfeditor.componentSelected");
      this.wrapperContainer.classList.add("selected");
      if (!this.wrapperContainer.moveable) {
        this.makeMoveable();
      }
    } else {
      this.wrapperContainer.classList.remove("selected");
      this.removeMoveable();
    }
  };
  fireEvent = (eventName) => {
    const componentSelected = new CustomEvent(eventName, {
      detail: {
        target: this,
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(componentSelected);
  };
}

export { BasicOperationComponent };