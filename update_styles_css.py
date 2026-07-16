import re

with open('src/css/styles.css', 'r') as f:
    content = f.read()

# Add root variables
root_vars = """
:root {
  --primary: #007acc;
  --primary-hover: #005a99;
  --primary-light: #f0f8ff;
  --primary-alpha: rgba(0, 122, 204, 0.2);
  --primary-alpha-10: rgba(0, 122, 204, 0.1);
  --primary-drag: #e3f2fd;
  --primary-drag-border: #2196f3;
  --primary-drag-text: #1976d2;
  --primary-drag-alpha: rgba(33, 150, 243, 0.1);
  --error: #c33;
  --error-bg: #fee;
  --error-border: #fcc;
  --text-main: #333;
  --text-muted: #666;
  --text-light: #999;
  --border-color: #e0e0e0;
  --border-color-dark: #ccc;
  --bg-main: #fff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #f5f5f5;
  --bg-hover: #e8e8e8;
  --bg-upload: #fafafa;

  /* Feature Gradients */
  --hero-grad-1: #f8fafc;
  --hero-grad-2: #dbeafe;
  --cta-grad-1: #2563eb;
  --cta-grad-2: #1e40af;
  --feat-green-1: #f0fdf4;
  --feat-green-2: #dcfce7;
  --feat-blue-1: #eff6ff;
  --feat-blue-2: #dbeafe;
  --feat-purple-1: #faf5ff;
  --feat-purple-2: #f3e8ff;
  --feat-orange-1: #fff7ed;
  --feat-orange-2: #fed7aa;
  --feat-pink-1: #fdf2f8;
  --feat-pink-2: #fce7f3;
  --feat-cyan-1: #f0f9ff;
  --feat-cyan-2: #e0f2fe;
}
"""

content = root_vars + content

# Replace hardcoded colors in lines 14-56 (approximately, or we can just replace everywhere if they match)

replacements = {
    '#e3f2fd': 'var(--primary-drag)',
    'rgba(33, 150, 243, 0.1)': 'var(--primary-drag-alpha)',
    '#2196f3': 'var(--primary-drag-border)',
    '#1976d2': 'var(--primary-drag-text)',
    '#f8fafc': 'var(--hero-grad-1)',
    '#dbeafe': 'var(--hero-grad-2)',
    '#2563eb': 'var(--cta-grad-1)',
    '#1e40af': 'var(--cta-grad-2)',
    '#f0fdf4': 'var(--feat-green-1)',
    '#dcfce7': 'var(--feat-green-2)',
    '#eff6ff': 'var(--feat-blue-1)',
    '#faf5ff': 'var(--feat-purple-1)',
    '#f3e8ff': 'var(--feat-purple-2)',
    '#fff7ed': 'var(--feat-orange-1)',
    '#fed7aa': 'var(--feat-orange-2)',
    '#fdf2f8': 'var(--feat-pink-1)',
    '#fce7f3': 'var(--feat-pink-2)',
    '#f0f9ff': 'var(--feat-cyan-1)',
    '#e0f2fe': 'var(--feat-cyan-2)',
}

# The task says: src/css/styles.css (lines 14-56): Replace hardcoded hex colors (#e3f2fd, #2196f3, #1976d2, etc.) with CSS variables or design system tokens.
# So I'll split by lines, apply replacements to those lines.

lines = content.split('\n')
for i, line in enumerate(lines):
    if i > 20: # since we added root vars, adjust index
        for k, v in replacements.items():
            lines[i] = lines[i].replace(k, v)

with open('src/css/styles.css', 'w') as f:
    f.write('\n'.join(lines))
