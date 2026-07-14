<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'
import PostCard from '@/components/PostCard.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()
const { posts, meta, loading, error, fetchPosts } = usePosts()

const search = ref(route.query.search || '')
let debounceTimer = null

function load() {
  fetchPosts({
    search: route.query.search || undefined,
    category: route.query.category || undefined,
    page: route.query.page || 1,
  })
}

watch(
  () => route.query,
  () => load(),
  { immediate: true }
)

watch(search, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    router.push({
      query: { ...route.query, search: value || undefined, page: undefined },
    })
  }, 400)
})

function handlePageChange(page) {
  router.push({ query: { ...route.query, page } })
}

function clearCategory() {
  const { category, ...rest } = route.query
  router.push({ query: rest })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-900">
        {{ route.query.category ? 'Post dalam kategori ini' : 'Semua Post' }}
      </h1>

      <div class="flex items-center gap-2">
        <span
          v-if="route.query.category"
          class="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
        >
          Filter aktif
          <button @click="clearCategory" class="hover:text-indigo-800">✕</button>
        </span>
      </div>
    </div>


    <div class="mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Cari judul post..."
        class="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div
      v-if="error"
      class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4"
    >
      {{ error.message }}
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="n in 6"
        :key="n"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse"
      >
        <div class="aspect-[16/9] bg-gray-100"></div>
        <div class="p-4 space-y-2">
          <div class="h-3 bg-gray-100 rounded w-1/3"></div>
          <div class="h-4 bg-gray-100 rounded w-3/4"></div>
          <div class="h-3 bg-gray-100 rounded w-full"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="posts.length === 0"
      class="text-center text-gray-400 text-sm py-16"
    >
      Belum ada post yang ditemukan.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <Pagination
      v-if="!loading && posts.length > 0"
      :current-page="meta.current_page"
      :last-page="meta.last_page"
      @change="handlePageChange"
    />
  </div>
</template>