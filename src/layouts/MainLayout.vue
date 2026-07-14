<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useCategories } from "@/composables/useCategories";

const { user, isAuthenticated, logout } = useAuth();
const { categories, fetchCategories } = useCategories();

const sidebarOpen = ref(false);

onMounted(() => {
  fetchCategories();
});

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div
        class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <button
            @click="toggleSidebar"
            class="md:hidden text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <RouterLink to="/" class="text-lg font-semibold text-gray-900">
            MyBlog
          </RouterLink>
        </div>

        <nav class="flex items-center gap-4">
          <template v-if="isAuthenticated">
            <RouterLink
              to="/dashboard"
              class="text-sm text-gray-600 hover:text-indigo-600"
            >
              Dashboard
            </RouterLink>
            <span class="text-sm text-gray-500 hidden sm:inline">
              Hai, {{ user?.name }}
            </span>
            <button
              @click="logout"
              class="text-sm text-red-600 hover:text-red-700"
            >
              Keluar
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="text-sm text-gray-600 hover:text-indigo-600"
            >
              Masuk
            </RouterLink>
            <RouterLink
              to="/register"
              class="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
            >
              Daftar
            </RouterLink>
          </template>
        </nav>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 flex gap-6 py-6">
      <aside
        :class="['w-56 shrink-0', 'md:block', sidebarOpen ? 'block' : 'hidden']"
      >
        <div
          class="bg-white border border-gray-200 rounded-xl p-4 sticky top-20"
        >
          <h2 class="text-sm font-semibold text-gray-900 mb-3">Kategori</h2>
          <ul class="space-y-1">
            <li>
              <RouterLink
                to="/"
                class="block text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-2 py-1.5 transition"
              >
                Semua Post
              </RouterLink>
            </li>
            <li v-for="category in categories" :key="category.id">
              <RouterLink
                :to="{ path: '/', query: { category: category.slug } }"
                class="block text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-2 py-1.5 transition"
              >
                {{ category.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </aside>

      <main class="flex-1 min-w-0">
        <RouterView />
      </main>
    </div>
  </div>
</template>
