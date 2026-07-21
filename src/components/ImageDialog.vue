<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-overlay-enter"
    @click="handleOverlayClick"
  >
    <div
      class="flex w-[90%] max-w-[500px] max-h-[80vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-dialog-enter"
      @click.stop
    >
      <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-5">
        <h3 class="m-0 text-lg font-semibold text-gray-800">Add Image</h3>
        <button
          @click="closeDialog"
          class="flex h-8 w-8 items-center justify-center rounded-full border-none bg-transparent text-2xl text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close dialog"
        >
          &times;
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-5">
        <div class="mb-5 flex gap-1 border-b border-gray-200">
          <button
            :class="[
              'rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none',
              activeTab === 'upload'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ]"
            @click="activeTab = 'upload'"
          >
            Upload File
          </button>
          <button
            :class="[
              'rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none',
              activeTab === 'url'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ]"
            @click="activeTab = 'url'"
          >
            From URL
          </button>
        </div>

        <div v-if="activeTab === 'upload'" class="mb-5">
          <div
            class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center transition-all hover:border-blue-600 hover:bg-blue-50 focus:border-blue-600 focus:bg-blue-50 focus:outline-none"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
            tabindex="0"
            role="button"
            aria-label="Upload file area"
            @keydown.enter="triggerFileInput"
            @keydown.space.prevent="triggerFileInput"
          >
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleFileUpload"
              class="hidden"
            />
            <i class="fa-solid fa-cloud-upload-alt mb-3 text-4xl text-blue-500"></i>
            <p class="my-2 text-gray-600">Select or drag and drop an image</p>
            <p class="my-2 text-sm text-gray-500">Supports: JPG, PNG, GIF, WebP</p>
          </div>
        </div>

        <div v-if="activeTab === 'url'" class="mb-5">
          <label for="imageUrl" class="mb-2 block font-medium text-gray-800">Image URL:</label>
          <div class="flex gap-2">
            <input
              id="imageUrl"
              type="url"
              v-model="imageUrl"
              placeholder="https://example.com/image.jpg"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              @keyup.enter="loadFromUrl"
            />
            <button
              @click="loadFromUrl"
              class="btn-primary whitespace-nowrap rounded-lg px-4 py-2 font-medium disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              :disabled="!imageUrl"
            >
              Load Image
            </button>
          </div>
        </div>

        <div
          v-if="preview"
          class="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center"
        >
          <h4 class="mb-3 mt-0 text-left text-sm font-medium text-gray-700">Preview:</h4>
          <img
            :src="preview"
            alt="Preview"
            class="max-h-[200px] max-w-full rounded border border-gray-300 object-contain shadow-sm"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div v-if="error" class="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
          <p class="m-0 flex items-center gap-2 text-sm">
            <i class="fa-solid fa-circle-exclamation"></i>
            {{ error }}
          </p>
        </div>
      </div>

      <div class="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-5">
        <button
          @click="closeDialog"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Cancel
        </button>
        <button
          @click="confirmSelection"
          :disabled="!preview"
          class="btn-primary rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          Add Image
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";

export default {
  name: "ImageDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "confirm"],
  setup(props, { emit }) {
    const activeTab = ref("upload");
    const imageUrl = ref("");
    const preview = ref("");
    const error = ref("");
    const fileInput = ref(null);

    // Reset state when dialog is opened
    watch(
      () => props.isOpen,
      (newValue) => {
        if (newValue) {
          resetState();
        }
      },
    );

    const resetState = () => {
      activeTab.value = "upload";
      imageUrl.value = "";
      preview.value = "";
      error.value = "";
    };

    const handleOverlayClick = () => {
      closeDialog();
    };

    const closeDialog = () => {
      emit("close");
    };

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        processFile(file);
      }
    };

    const handleDrop = (event) => {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          processFile(file);
        } else {
          error.value = "Select a valid image file.";
        }
      }
    };

    const processFile = (file) => {
      error.value = "";

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        error.value = "File size must be less than 5MB.";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        preview.value = e.target.result;
      };
      reader.onerror = () => {
        error.value = "Unable to read the file. Try uploading again.";
      };
      reader.readAsDataURL(file);
    };

    const loadFromUrl = async () => {
      if (!imageUrl.value) return;

      error.value = "";

      try {
        // Create a temporary image to test if URL is valid
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl.value;
        });

        // Convert image to base64
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        preview.value = canvas.toDataURL("image/png");
      } catch {
        error.value =
          "Unable to load the image from the provided URL. Verify the link and try again.";
      }
    };

    const confirmSelection = () => {
      if (!preview.value) return;

      emit("confirm", preview.value);
      closeDialog();
    };

    return {
      activeTab,
      imageUrl,
      preview,
      error,
      fileInput,
      handleOverlayClick,
      closeDialog,
      triggerFileInput,
      handleFileUpload,
      handleDrop,
      loadFromUrl,
      confirmSelection,
    };
  },
};
</script>
