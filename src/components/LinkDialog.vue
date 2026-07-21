<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-overlay-enter"
    @click="handleOverlayClick"
  >
    <div
      class="flex w-[90%] max-w-[450px] max-h-[70vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-dialog-enter"
      @click.stop
    >
      <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-5">
        <h3 class="m-0 text-lg font-semibold text-gray-800">Add Link</h3>
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
              activeTab === 'url'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ]"
            @click="activeTab = 'url'"
          >
            External URL
          </button>
          <button
            :class="[
              'rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none',
              activeTab === 'page'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ]"
            @click="activeTab = 'page'"
          >
            Page Link
          </button>
        </div>
        <div v-if="activeTab === 'url'" class="mb-5">
          <label for="linkUrl" class="mb-2 block font-medium text-gray-800">URL:</label>
          <input
            id="linkUrl"
            type="url"
            v-model="linkUrl"
            placeholder="https://example.com"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @keyup.enter="confirmSelection"
          />
        </div>
        <div v-if="activeTab === 'page'" class="mb-5">
          <label for="pageNumber" class="mb-2 block font-medium text-gray-800">Page Number:</label>
          <input
            id="pageNumber"
            type="number"
            v-model="pageNumber"
            placeholder="1"
            min="1"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @keyup.enter="confirmSelection"
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
          :disabled="!isValid"
          class="btn-primary rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          Add Link
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, watch, computed } from "vue";
export default {
  name: "LinkDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "confirm"],
  setup(props, { emit }) {
    const activeTab = ref("url");
    const linkUrl = ref("");
    const pageNumber = ref("");
    const error = ref("");
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
      activeTab.value = "url";
      linkUrl.value = "";
      pageNumber.value = "";
      error.value = "";
    };
    const isValid = computed(() => {
      if (activeTab.value === "url") {
        return linkUrl.value.trim() !== "";
      } else {
        const num = parseInt(pageNumber.value);
        return !isNaN(num) && num > 0;
      }
    });
    const handleOverlayClick = () => {
      closeDialog();
    };
    const closeDialog = () => {
      emit("close");
    };
    const confirmSelection = () => {
      if (!isValid.value) return;
      error.value = "";
      try {
        if (activeTab.value === "url") {
          // Validate URL format
          if (!linkUrl.value.startsWith("http://") && !linkUrl.value.startsWith("https://")) {
            error.value = "URL must start with http:// or https://";
            return;
          }
          emit("confirm", {
            type: "url",
            value: linkUrl.value.trim(),
          });
        } else {
          const num = parseInt(pageNumber.value);
          if (isNaN(num) || num < 1) {
            error.value = "Enter a valid page number (1 or greater).";
            return;
          }
          emit("confirm", {
            type: "page",
            value: num,
          });
        }
        closeDialog();
      } catch (error) {
        error.value = "Invalid input. Verify your values and try again.";
      }
    };
    return {
      activeTab,
      linkUrl,
      pageNumber,
      error,
      isValid,
      handleOverlayClick,
      closeDialog,
      confirmSelection,
    };
  },
};
</script>
