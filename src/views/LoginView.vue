<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { RouterLink } from "vue-router";

const { login, loading, error } = useAuth();

const form = ref({
  email: "",
  password: "",
});

async function handleSubmit() {
  try {
    await login(form.value);
  } catch {
    // error sudah otomatis ke-handle di `error` dari useApi
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div
      class="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-gray-100"
    >
      <h1 class="text-2xl font-semibold text-gray-900 mb-1">Masuk</h1>
      <p class="text-sm text-gray-500 mb-6">
        Masuk ke akunmu untuk melanjutkan.
      </p>

      <div
        v-if="error"
        class="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
      >
        {{ error.message }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p v-if="error?.errors?.email" class="text-xs text-red-500 mt-1">
            {{ error.errors.email[0] }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p v-if="error?.errors?.password" class="text-xs text-red-500 mt-1">
            {{ error.errors.password[0] }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ loading ? "Memproses..." : "Masuk" }}
        </button>
      </form>

      <p class="text-sm text-gray-500 mt-6 text-center">
        Belum punya akun?
        <RouterLink
          to="/register"
          class="text-indigo-600 font-medium hover:underline"
        >
          Daftar
        </RouterLink>
      </p>
    </div>
  </div>
</template>
