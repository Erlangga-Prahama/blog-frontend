<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: File, default: null },
  existingUrl: { type: String, default: null },
});

const emit = defineEmits(["update:modelValue"]);

const previewUrl = ref(props.existingUrl || null);
const fileInput = ref(null);

function handleChange(e) {
  const file = e.target.files[0];
  if (!file) return;
}

function removeImage() {
  emit("update:modelValue", null);
  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) previewUrl.value = props.existingUrl || null;
  },
);
</script>

<template>
  <div>
    <label for="" class="block text-sm font-medium text-gray-700 mb-1"
      >Thumbnail</label
    >

    <div
      v-if="previewUrl"
      class="relative aspect-[16/9] w-full max-w-md bg-gray-100 rounded-lg overflow-hidden mb-2"
    >
      <img :src="previewUrl" class="w-full h-full object-cover" />
      <button
        type="button"
        @click="removeImage"
        class="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/80"
      >
        ✕
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleChange"
      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
    />
    <p class="text-xs text-gray-400 mt-1">Format: JPG, PNG. Maksimal 2MB.</p>
  </div>
</template>
