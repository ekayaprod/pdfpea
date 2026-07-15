import { describe, it, expect } from 'vitest';
import { PDFGenerator } from './PDFGenerator.js';

describe('PDFGenerator', () => {
  it('survives absolute void parameters', async () => {
    let error = null;
    try {
      await PDFGenerator.drawImageOnPage(null, null, null);
    } catch(e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.message).toMatch(/cannot be null/i);
  });
});
