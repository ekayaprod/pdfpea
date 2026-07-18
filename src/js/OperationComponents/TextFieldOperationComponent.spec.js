import { describe, it, expect, beforeEach } from 'vitest';
import { TextFieldOperationComponent } from './TextFieldOperationComponent.js';

describe('TextFieldOperationComponent', () => {
  let mockContainer;

  beforeEach(() => {
    mockContainer = document.createElement('div');
  });

  it('initializes with default values', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);

    expect(component.shadow.tagName.toLowerCase()).toBe('div');
    expect(component.shadow.contentEditable.toString()).toBe("false");
  });

  it('updates backgroundColor', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged('backgroundColor', '#ffffff');
    expect(component.wrapperContainer.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('updates opacity', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged('opacity', '0.5');
    expect(component.wrapperContainer.style.opacity).toBe('0.5');
  });

  it('updates fontFamily', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged('fontFamily', 'Arial');
    expect(component.shadow.style.fontFamily).toBe('Arial');
  });

  it('updates fontSize', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged('fontSize', 16);
    expect(component.shadow.style.fontSize).toBe('16px');
  });

  it('updates borderColor', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged('borderColor', '#000000');
    expect(component.shadow.style.borderColor).toBe('rgb(0, 0, 0)');
  });

  it('updates borderWidth', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged('borderWidth', 2);
    expect(component.shadow.style.borderWidth).toBe('2px');
    expect(component.shadow.style.borderStyle).toBe('solid');
    expect(component.shadow.style.width).toBe('calc(100% - 4px)');
    expect(component.shadow.style.height).toBe('calc(100% - 4px)');
  });

  it('updates text', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.operationChanged('text', 'Hello World');
    expect(component.shadow.innerText).toBe('Hello World');
  });

  it('handles dblclick event', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    let eventFired = false;
    component.shadow.focus = () => { eventFired = true; };
    const event = new Event('dblclick');
    component.wrapperContainer.dispatchEvent(event);
    expect(component.shadow.contentEditable.toString()).toBe("true");
    expect(eventFired).toBe(true);
  });

  it('handles blur event', () => {
    const operation = TextFieldOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new TextFieldOperationComponent(operation, mockContainer);
    component.shadow.innerText = 'New Text';
    const event = new Event('blur');
    component.shadow.dispatchEvent(event);
    expect(component.shadow.contentEditable.toString()).toBe("false");
    expect(component.getOperation().text).toBe('New Text');
  });

  it('creates update default operation', () => {
    const op = TextFieldOperationComponent.updateDefaultOperation('1', 10, 20, 30, 40, 'text', 2, '#fff', '#000', '#eee', 'Arial', 14, true, false, false, 10, 'Left');
    expect(op.height).toBe(34);
    expect(op.width).toBe(44);
    expect(op.text).toBe('text');
  });
});
