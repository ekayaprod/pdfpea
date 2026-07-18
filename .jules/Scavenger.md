### Targets Removed:
- Tier 1: Single-line diagnostic droppings (`console.log`, etc.)
- Tier 2: Hollow carapaces (empty branches, catch blocks)
- Tier 3: Fossilized debris (commented-out logic and TODOs)
- Tier 5: Orphaned entities (unused exports flagged by knip)
### Methodology:
- Used `sed` for pure single-line string replacement to surgically excise identified dead code.
- Verified safe excisions incrementally by building the frontend (
> pdfpea@1.0.0 build
> vite build --debug

vite v7.2.6 building client environment for production...
transforming...
✓ 232 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                             35.53 kB │ gzip:   7.35 kB
dist/assets/pdf.worker.min-LyOxJPrg.mjs  1,072.84 kB
dist/assets/index-8ZU8sbaJ.css              55.14 kB │ gzip:  10.62 kB
dist/assets/vue-CgC0o95C.js                 63.81 kB │ gzip:  25.31 kB
dist/assets/index-CoJ3dvdD.js              113.37 kB │ gzip:  29.95 kB
dist/assets/moveable-OeWcwQJw.js           246.50 kB │ gzip:  80.62 kB
dist/assets/pdfjs-CtkuH8i1.js              407.56 kB │ gzip: 119.12 kB
dist/assets/pdflib-BBgOaPys.js             437.41 kB │ gzip: 181.32 kB
✓ built in 6.01s).
### Safety Check:
- `npm run build` succeeds cleanly. Test immunity doctrine adhered to.

- Note: Evaluated [PRUNER] targets from agent_tasks.md but they were previously removed or false positive targets (ghost entries); task board cleaned up.
