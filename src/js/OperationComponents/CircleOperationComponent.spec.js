import { describe, it, expect, beforeEach } from 'vitest';
import { CircleOperationComponent } from './CircleOperationComponent.js';

describe('CircleOperationComponent', () => {
  let mockContainer;

  beforeEach(() => {
    mockContainer = document.createElement('div');
  });

  it('initializes with default values', () => {
    const operation = CircleOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);

    expect(component.shadow.tagName.toLowerCase()).toBe('div');
    expect(component.shadow.classList.contains('component-content')).toBe(true);
  });

  it('updates borderWidth', () => {
    const operation = CircleOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged('borderWidth', 2);
    expect(component.shadow.style.borderWidth).toBe('2px');
    expect(component.shadow.style.borderStyle).toBe('solid');
    expect(component.shadow.style.width).toBe('100%');
    expect(component.shadow.style.height).toBe('100%');
  });

  it('updates borderRadius', () => {
    const operation = CircleOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged('borderRadius', 50);
    expect(component.shadow.style.borderRadius).toBe('50%');
  });

  it('updates opacity', () => {
    const operation = CircleOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged('opacity', '0.5');
    expect(component.shadow.style.opacity).toBe('0.5');
  });

  it('updates borderColor', () => {
    const operation = CircleOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged('borderColor', '#000000');
    expect(component.shadow.style.borderColor).toBe('rgb(0, 0, 0)');
  });

  it('updates color', () => {
    const operation = CircleOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged('color', '#ff0000');
    expect(component.shadow.style.background).toBe('rgb(255, 0, 0)');
  });

  it('updates fill', () => {
    const operation = CircleOperationComponent.createDefaultOperation('1', 10, 20);
    const component = new CircleOperationComponent(operation, mockContainer);
    component.operationChanged('fill', '#00ff00');
    expect(component.shadow.style.background).toBe('rgb(0, 255, 0)');
  });

  it('creates default operation', () => {
    const op = CircleOperationComponent.createDefaultOperation('1', 10, 20);
    expect(op.type).toBe('circle');
    expect(op.borderRadius).toBe(50);
  });
});
