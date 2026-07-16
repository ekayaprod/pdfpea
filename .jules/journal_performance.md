# Vice Performance Heuristics

- Enforced physical dimensions (`width`/`height`) on `<img />` tags to prevent Cumulative Layout Shifts (CLS).
- Attached `loading="lazy" decoding="async"` strictly to reduce main-thread parsing payloads on render.
- Eradicated synchronous reflow layouts from `<div v-if="toast.show">` directly inline by assigning hardware-accelerated Tailwind classes.
- Removed dead redundant `@keyframes` duplicates to clear CSS Object Model (CSSOM) thrashing.
