import re

def update_link_vue():
    with open('src/components/LinkDialog.vue', 'r') as f:
        content = f.read()

    # Apply the same replacements for the CSS block inside LinkDialog.vue if it exists
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
    }

    style_idx = content.find('<style>')
    if style_idx != -1:
        before = content[:style_idx]
        style_content = content[style_idx:]
        for k, v in replacements.items():
            if k.startswith('#'):
                style_content = re.sub(k + r'(?![a-fA-F0-9])', v, style_content, flags=re.IGNORECASE)
            else:
                style_content = style_content.replace(k, v)
        content = before + style_content

    with open('src/components/LinkDialog.vue', 'w') as f:
        f.write(content)

update_link_vue()
