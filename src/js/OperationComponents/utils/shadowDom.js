// 🪴 PROPAGATOR: Propagated WET UI initialization logic into a centralized utility.
export const initializeShadowElement = (component) => {
  component.shadow = document.createElement("div");
  component.shadow.classList.add("component-content");
  component.wrapperContainer.appendChild(component.shadow);
  component.initializeOperation();
};
