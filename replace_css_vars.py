import re

def update_css():
    with open('src/css/styles.css', 'r') as f:
        content = f.read()

    # Define variables map
    replacements = {
        '#007acc': 'var(--primary-color)',
        '#005a99': 'var(--primary-hover)',
        '#f0f8ff': 'var(--primary-light)',
        'rgba(0, 122, 204, 0.2)': 'var(--primary-bg-alpha)',
        '#e3f2fd': 'var(--primary-drag-bg)',
        '#2196f3': 'var(--primary-drag-border)',
        '#1976d2': 'var(--primary-drag-text)',
        'rgba(33, 150, 243, 0.1)': 'var(--primary-drag-bg-alpha)',
        '#c33': 'var(--error-color)',
        '#fee': 'var(--error-bg)',
        '#fcc': 'var(--error-border)',
        '#333': 'var(--text-main)',
        '#666': 'var(--text-muted)',
        '#999': 'var(--text-light)',
        '#e0e0e0': 'var(--border-color)',
        '#ccc': 'var(--border-color-dark)',
        '#fff': 'var(--bg-main)',
        '#f8f9fa': 'var(--bg-secondary)',
        '#f5f5f5': 'var(--bg-tertiary)',
        '#e8e8e8': 'var(--bg-hover)',
        '#fafafa': 'var(--bg-upload)',

        '#f8fafc': 'var(--hero-grad-start)',
        '#dbeafe': 'var(--hero-grad-end)',
        '#2563eb': 'var(--cta-grad-start)',
        '#1e40af': 'var(--cta-grad-end)',
        '#f0fdf4': 'var(--feat-green-start)',
        '#dcfce7': 'var(--feat-green-end)',
        '#eff6ff': 'var(--feat-blue-start)',
        '#faf5ff': 'var(--feat-purple-start)',
        '#f3e8ff': 'var(--feat-purple-end)',
        '#fff7ed': 'var(--feat-orange-start)',
        '#fed7aa': 'var(--feat-orange-end)',
        '#fdf2f8': 'var(--feat-pink-start)',
        '#fce7f3': 'var(--feat-pink-end)',
        '#f0f9ff': 'var(--feat-cyan-start)',
        '#e0f2fe': 'var(--feat-cyan-end)',
    }

    # replace colors
    for k, v in replacements.items():
        if k.startswith('#'):
            # only replace if followed by non-hex char (like semicolon or comma or space or paren)
            content = re.sub(k + r'(?![a-fA-F0-9])', v, content, flags=re.IGNORECASE)
        else:
            # literal replace for rgba
            content = content.replace(k, v)

    # prepend variables at root
    root_vars = """
:root {
  --primary-color: #007acc;
  --primary-hover: #005a99;
  --primary-light: #f0f8ff;
  --primary-bg-alpha: rgba(0, 122, 204, 0.2);
  --primary-drag-bg: #e3f2fd;
  --primary-drag-border: #2196f3;
  --primary-drag-text: #1976d2;
  --primary-drag-bg-alpha: rgba(33, 150, 243, 0.1);
  --error-color: #c33;
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

  /* Theme Colors */
  --hero-grad-start: #f8fafc;
  --hero-grad-end: #dbeafe;
  --cta-grad-start: #2563eb;
  --cta-grad-end: #1e40af;
  --feat-green-start: #f0fdf4;
  --feat-green-end: #dcfce7;
  --feat-blue-start: #eff6ff;
  --feat-blue-end: #dbeafe;
  --feat-purple-start: #faf5ff;
  --feat-purple-end: #f3e8ff;
  --feat-orange-start: #fff7ed;
  --feat-orange-end: #fed7aa;
  --feat-pink-start: #fdf2f8;
  --feat-pink-end: #fce7f3;
  --feat-cyan-start: #f0f9ff;
  --feat-cyan-end: #e0f2fe;
}
"""
    content = root_vars + content

    with open('src/css/styles.css', 'w') as f:
        f.write(content)

update_css()
