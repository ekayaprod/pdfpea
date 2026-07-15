import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createApp, nextTick } from "vue";
import LinkDialog from "./LinkDialog.vue";

describe("LinkDialog", () => {
  let root;
  let app;
  let instance;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  afterEach(() => {
    if (app) {
      app.unmount();
      app = null;
    }
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  });

  const mountDialog = (props = {}) => {
    app = createApp(LinkDialog, props);
    instance = app.mount(root);
    return { app, instance, root };
  };

  it("does not render when show is false", () => {
    mountDialog({ show: false });
    expect(root.querySelector(".link-dialog-overlay")).toBeNull();
  });

  it("renders when show is true", () => {
    mountDialog({ show: true });
    expect(root.querySelector(".link-dialog-overlay")).not.toBeNull();
    expect(root.querySelector(".link-dialog")).not.toBeNull();
  });

  it("emits close when overlay is clicked", async () => {
    const onClose = vi.fn();
    mountDialog({ show: true, onClose });

    const overlay = root.querySelector(".link-dialog-overlay");
    overlay.dispatchEvent(new Event("click"));

    expect(onClose).toHaveBeenCalled();
  });

  it("emits close when close button is clicked", async () => {
    const onClose = vi.fn();
    mountDialog({ show: true, onClose });

    const closeBtn = root.querySelector(".dialog-close-btn");
    closeBtn.dispatchEvent(new Event("click"));

    expect(onClose).toHaveBeenCalled();
  });

  it("emits close when cancel button is clicked", async () => {
    const onClose = vi.fn();
    mountDialog({ show: true, onClose });

    const cancelBtn = root.querySelector(".btn-secondary");
    cancelBtn.dispatchEvent(new Event("click"));

    expect(onClose).toHaveBeenCalled();
  });

  it("switches tabs correctly", async () => {
    mountDialog({ show: true });

    // Initial state: External URL tab should be active
    expect(root.querySelector(".link-url-section")).not.toBeNull();
    expect(root.querySelector(".link-page-section")).toBeNull();

    // Click Page Link tab
    const tabs = root.querySelectorAll(".tab-btn");
    tabs[1].dispatchEvent(new Event("click"));
    await nextTick();

    // Page Link tab should be active
    expect(root.querySelector(".link-url-section")).toBeNull();
    expect(root.querySelector(".link-page-section")).not.toBeNull();

    // Click External URL tab again
    tabs[0].dispatchEvent(new Event("click"));
    await nextTick();

    // External URL tab should be active again
    expect(root.querySelector(".link-url-section")).not.toBeNull();
    expect(root.querySelector(".link-page-section")).toBeNull();
  });

  it("validates and emits url correctly", async () => {
    const onConfirm = vi.fn();
    mountDialog({ show: true, onConfirm });

    const input = root.querySelector("#linkUrl");
    const submitBtn = root.querySelector(".btn-primary");

    // Invalid URL (doesn't start with http/https)
    input.value = "example.com";
    input.dispatchEvent(new Event("input"));
    await nextTick();

    submitBtn.dispatchEvent(new Event("click"));
    await nextTick();

    expect(onConfirm).not.toHaveBeenCalled();
    const errorMsg = root.querySelector(".link-error");
    expect(errorMsg.textContent.trim()).toBe("URL must start with http:// or https://");

    // Valid URL
    input.value = "https://example.com";
    input.dispatchEvent(new Event("input"));
    await nextTick();

    submitBtn.dispatchEvent(new Event("click"));

    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "url",
        value: "https://example.com",
      }),
    );
  });

  it("validates and emits page correctly", async () => {
    const onConfirm = vi.fn();
    mountDialog({ show: true, onConfirm });

    // Switch to page tab
    const tabs = root.querySelectorAll(".tab-btn");
    tabs[1].dispatchEvent(new Event("click"));
    await nextTick();

    const input = root.querySelector("#pageNumber");
    const submitBtn = root.querySelector(".btn-primary");

    // Invalid page (<= 0)
    input.value = "0";
    input.dispatchEvent(new Event("input"));
    await nextTick();

    submitBtn.dispatchEvent(new Event("click"));
    await nextTick();

    expect(onConfirm).not.toHaveBeenCalled();

    // Valid page
    input.value = "5";
    input.dispatchEvent(new Event("input"));
    await nextTick();

    submitBtn.dispatchEvent(new Event("click"));

    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "page",
        value: 5,
      }),
    );
  });

  it("disables add button when inputs are empty/invalid", async () => {
    mountDialog({ show: true });

    const submitBtn = root.querySelector(".btn-primary");

    // URL empty by default
    expect(submitBtn.disabled).toBe(true);

    // Switch to page tab
    const tabs = root.querySelectorAll(".tab-btn");
    tabs[1].dispatchEvent(new Event("click"));
    await nextTick();

    // Page empty by default
    expect(submitBtn.disabled).toBe(true);

    // Invalid page
    const pageInput = root.querySelector("#pageNumber");
    pageInput.value = "0";
    pageInput.dispatchEvent(new Event("input"));
    await nextTick();

    expect(submitBtn.disabled).toBe(true);
  });

  // State reset test is slightly tricky with createApp since we can't easily
  // update props reactively like with @vue/test-utils. We will just test mounting
  // with state changes if necessary.
});
