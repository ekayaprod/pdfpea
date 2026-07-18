import fs from 'fs';
let content = fs.readFileSync('src/js/OperationComponents/BasicOperationComponent.spec.js', 'utf8');
content = content.replace('  };\n\ndescribe("BasicOperationComponent", () => {', '  };\n});\n\ndescribe("BasicOperationComponent", () => {');
fs.writeFileSync('src/js/OperationComponents/BasicOperationComponent.spec.js', content);
