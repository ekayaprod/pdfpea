import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImageDialog from './ImageDialog.vue';
import { nextTick } from 'vue';

describe('ImageDialog', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sets error message when image loading from URL fails', async () => {
    const wrapper = mount(ImageDialog, { props: { show: true } });

    // Switch to URL tab
    await wrapper.findAll('.tab-btn').find(t => t.text() === 'From URL').trigger('click');

    // Set URL
    await wrapper.find('#imageUrl').setValue('https://example.com/bad-image.jpg');

    // Mock Image to simulate loading failure
    const OriginalImage = window.Image;
    window.Image = class {
      constructor() {
        this.onload = null;
        this.onerror = null;
      }
      set src(url) {
        // Trigger onerror asynchronously to match real behavior
        setTimeout(() => {
          if (this.onerror) this.onerror(new Error('simulated load error'));
        }, 10);
      }
    };

    // Trigger load
    await wrapper.find('.load-url-btn').trigger('click');

    // Wait for the async operation in loadFromUrl to complete
    await new Promise(r => setTimeout(r, 50));
    // Wait for Vue DOM update
    await nextTick();

    // Verify the error message is displayed
    const errorMsg = wrapper.find('.image-error');
    expect(errorMsg.exists()).toBe(true);
    expect(errorMsg.text()).toContain('Unable to load the image from the provided URL');

    // Restore window.Image
    window.Image = OriginalImage;
  });
});
