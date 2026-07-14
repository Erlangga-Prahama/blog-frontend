<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true },
});

const emit = defineEmits(["change"]);

function goTo(page) {
  if (page < 1 || page > props.lastPage || page === props.currentPage) return;
  emit("change", page);
}
</script>

<template>
  <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-6">
    <button
      @click="goTo(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Sebelumnya
    </button>

    <span class="text-sm text-gray-500 px-2">
      Halaman {{ currentPage }} dari {{ lastPage }}
    </span>

    <button
      @click="goTo(currentPage + 1)"
      :disabled="currentPage === lastPage"
      class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Selanjutnya
    </button>
  </div>
</template>
