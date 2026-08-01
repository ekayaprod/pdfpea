# Yggdrasil Journal

## Pruned Axioms
- Replaced verbose loops with declarative functional chains (`.reduce()`, `.forEach()`) in utility modules.
- Extracted iterative side-effects strictly into `.forEach()` (eschewing `.map()` side-effect anti-patterns).
- Avoided replacing optimized native `for` loops with redundant `Array.from()` object instantiation overhead just to mimic declarative sequences.

## Current Cycle Execution
- Discovered Massive Mutable Imperative Loops in `src/js/utils/FreehandDrawing.js`.
- Mutated the imperative `for (let pass = 0...` smoothing logic into a clean `Array.from().reduce()` pipeline.
- Mutated the index-based path rendering `for (let i = 1...` into a functional `pathToRender.slice(1).forEach()` iteration.
