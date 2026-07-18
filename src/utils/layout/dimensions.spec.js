import { describe, it, expect } from 'vitest';
import { calculateInnerDimensions } from './dimensions.js';

describe('calculateInnerDimensions', () => {
  it('calculates inner dimensions with standard border width', () => {
    expect(calculateInnerDimensions(2)).toBe('calc(100% - 4px)');
  });

  it('handles null border width gracefully', () => {
    expect(calculateInnerDimensions(null)).toBe('calc(100% - 0px)');
  });

  it('handles undefined border width gracefully', () => {
    expect(calculateInnerDimensions(undefined)).toBe('calc(100% - 0px)');
  });

  it('handles empty string gracefully', () => {
    expect(calculateInnerDimensions('')).toBe('calc(100% - 0px)');
  });

  it('handles zero border width correctly', () => {
    expect(calculateInnerDimensions(0)).toBe('calc(100% - 0px)');
  });
});
