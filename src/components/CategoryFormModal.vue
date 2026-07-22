<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  category: { type: Object, default: null }, // null = mode create
  loading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

const emit = defineEmits(['submit', 'cancel'])

const name = ref('')

watch(
  () => props.show,
  (val) => {
    if (val) {
      name.value = props.category?.name ?? ''
    }
  }
)

function handleSubmit() {
  emit('submit', { name: name.value })
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    @click.self="emit('cancel')"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
      <h3 class="text-base font-semibold text-gray-900 mb-4">
        {{ category ? 'Edit Kategori' : 'Tambah Kategori' }}
      </h3>

      <div
        v-if="errorMessage"
        class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Kategori</label>
        <input
          v-model="name"
          type="text"
          required
          placeholder="Misal: Teknologi"
          class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition mb-6"
        />

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="emit('cancel')"
            :disabled="loading"
            class="px-4 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {{ loading ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>