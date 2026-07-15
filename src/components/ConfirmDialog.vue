<script setup>
defineProps({
    show: { type: Boolean, default: false },
    title: { type: String, default: 'Konfirmasi' },
    message: { type: String, default: 'Apakah kamu yakin?' },
    loading: {type: Boolean, default: false},
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
    <div v-if="show"" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" @click="emit('cancel')">
        <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h3 class="text-base font-semibold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-500 mb-6"> {{ message }}</p>

            <button @click="emit('cancel')" :disabled="loading" class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                Batal
            </button>

            <button
            @click="emit('confirm')" :disabled="loading" class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                {{ loading ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
        </div>
    </div>
</template>