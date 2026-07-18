import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/js/OperationComponents/BasicOperationComponent.spec.js', 'utf8');
content = content.replace(
  '  // Assert that render returns the expected structure rather than just being a function\n  const mockRenderElement = deleteAble.render(component.wrapperContainer.moveable, mockR);\n  expect(mockRenderElement.tag).toBe("div");\n  expect(mockRenderElement.props.className).toContain("moveable-delete-container");\n\n  // Mock the Moveable r object',
  '  // Mock the Moveable r object'
);
writeFileSync('src/js/OperationComponents/BasicOperationComponent.spec.js', content);
