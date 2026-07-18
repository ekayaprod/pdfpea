const fs = require('fs');
let content = fs.readFileSync('src/js/OperationComponents/BasicOperationComponent.spec.js', 'utf8');
const t = '});\n  it("should handle createDeleteAble interactions", () => {';
if (content.includes(t)) {
    content = content.replace(t, '  it("should handle createDeleteAble interactions", () => {');
    content += '\n});\n';
    fs.writeFileSync('src/js/OperationComponents/BasicOperationComponent.spec.js', content);
}
