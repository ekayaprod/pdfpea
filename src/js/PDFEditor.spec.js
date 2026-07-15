import { describe, it, expect, vi } from 'vitest';

// Mock everything since we just want to test boundary logic on renderPDF
vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(),
  version: 'mock-version'
}));

import { PDFEditor } from './PDFEditor.js';

describe('PDFEditor', () => {
  it('survives absolute void parameters', async () => {
    // Create an instance with dummy container
    const editor = new PDFEditor({});

    let error = null;
    try {
      await editor.renderPDF(null, null);
    } catch(e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toMatch(/cannot be null/i);
  });
});
