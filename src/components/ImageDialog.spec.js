import { describe, it, expect, vi, beforeEach } from "vitest";
// Instead of @vue/test-utils which fails in CI without installation,
// let's manually test with vue 3 components properly mapped without a string template.
import { createApp, nextTick, h } from "vue";
import ImageDialog from "./ImageDialog.vue";

describe("ImageDialog", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sets error message when image loading from URL fails", async () => {
    const root = document.createElement("div");
    document.body.appendChild(root);

    // Mount using render function (h) to avoid string template compiler dependency
    const app = createApp({
      render() {
        return h(ImageDialog, { isOpen: true });
      },
    });

    app.mount(root);
    await nextTick();

    // Switch to URL tab
    const tabs = Array.from(root.querySelectorAll(".tab-btn"));
    const urlTab = tabs.find((t) => t.textContent.includes("From URL"));
    urlTab.click();

    await nextTick();

    // Set URL
    const input = root.querySelector("#imageUrl");
    input.value = "https://example.com/bad-image.jpg";
    input.dispatchEvent(new Event("input"));

    await nextTick();

    // Mock Image to simulate loading failure
    const OriginalImage = window.Image;
    window.Image = class {
      constructor() {
        this.onload = null;
        this.onerror = null;
      }
      set src(url) {
        setTimeout(() => {
          if (this.onerror) this.onerror(new Error("simulated load error"));
        }, 10);
      }
    };

    // Trigger load
    const loadBtn = root.querySelector(".load-url-btn");
    loadBtn.click();

    // Wait for the async operation in loadFromUrl to complete
    await new Promise((r) => setTimeout(r, 50));

    // Wait for Vue DOM update
    await nextTick();
    await nextTick();

    // Verify the error message is displayed
    const errorMsg = root.querySelector(".image-error");
    expect(errorMsg).not.toBeNull();
    expect(errorMsg.textContent).toContain("Unable to load the image from the provided URL. Verify the link and try again");

    // Restore window.Image and clean up
    window.Image = OriginalImage;
    app.unmount();
    document.body.removeChild(root);
  });
});
