<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center max-w-sm">
      <p class="text-6xl font-bold text-indigo-600 mb-2">404</p>
      <h1 class="text-xl font-semibold text-gray-900 mb-2">
        Halaman tidak ditemukan
      </h1>
      <p class="text-sm text-gray-500 mb-8">
        Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau memang tidak pernah ada.
      </p>
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Kembali ke beranda
      </RouterLink>
    </div>
  </div>
</template>