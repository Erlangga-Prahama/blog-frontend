<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usePosts } from '@/composables/usePosts'
import { useAuth } from '@/composables/useAuth'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { user } = useAuth()
const { posts, meta, loading, error, fetchPosts, deletePost } = usePosts()

const deleteTarget = ref(null)
const deleting = ref(false)
const deleteError = ref(null)

// Filter di frontend: hanya post milik user yang login
const myPosts = computed(() =>
  posts.value.filter((p) => p.author?.id === user.value?.id)
)

const publishedCount = computed(
  () => myPosts.value.filter((p) => p.status === 'published').length
)
const draftCount = computed(
  () => myPosts.value.filter((p) => p.status === 'draft').length
)

function load() {
  // per_page besar supaya filter frontend menangkap lebih banyak post sekaligus
  fetchPosts({ per_page: 100 })
}

function askDelete(post) {
  deleteTarget.value = post
  deleteError.value = null
}

async function confirmDelete() {
  deleting.value = true
  deleteError.value = null
  try {
    await deletePost(deleteTarget.value.id)
    deleteTarget.value = null
  } catch (err) {
    deleteError.value =
      typeof err.response?.data?.message === 'string'
        ? err.response.data.message
        : 'Gagal menghapus post.'
  } finally {
    deleting.value = false
  }
}

function cancelDelete() {
  deleteTarget.value = null
}

function statusBadge(status) {
  if (status === 'published') return 'bg-green-100 text-green-700'
  if (status === 'archived') return 'bg-gray-100 text-gray-600'
  return 'bg-yellow-100 text-yellow-700'
}

function statusLabel(status) {
  if (status === 'published') return 'Terbit'
  if (status === 'archived') return 'Arsip'
  return 'Draft'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(load)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Halo, {{ user?.name }} 👋
        </p>
      </div>
      <RouterLink
        :to="{ name: 'post-create' }"
        class="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tulis Post
      </RouterLink>
    </div>

    <!-- Stats card -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Total Post
        </p>
        <p class="text-3xl font-bold text-gray-900">
          {{ myPosts.length }}
        </p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Terbit
        </p>
        <p class="text-3xl font-bold text-green-600">
          {{ publishedCount }}
        </p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-5 col-span-2 sm:col-span-1">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Draft
        </p>
        <p class="text-3xl font-bold text-yellow-500">
          {{ draftCount }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="py-16 text-center text-red-500">
      {{ error }}
      <button class="block mx-auto mt-2 text-sm text-indigo-600 hover:underline" @click="load">
        Coba lagi
      </button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="!myPosts.length"
      class="py-16 text-center bg-white rounded-2xl border border-gray-100"
    >
      <svg class="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      <p class="text-gray-500 font-medium">Kamu belum menulis post apapun</p>
      <p class="text-gray-400 text-sm mt-1 mb-4">Mulai tulis post pertamamu</p>
      <RouterLink
        :to="{ name: 'post-create' }"
        class="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        Tulis sekarang
      </RouterLink>
    </div>

    <!-- Post list -->
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="post in myPosts"
        :key="post.id"
        class="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-sm transition"
      >
        <!-- Thumbnail mini -->
        <div class="w-16 h-16 rounded-xl bg-indigo-50 shrink-0 overflow-hidden">
          <img
            v-if="post.thumbnail"
            :src="post.thumbnail"
            :alt="post.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
              {{ post.title }}
            </h3>
            <span
              class="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
              :class="statusBadge(post.status)"
            >
              {{ statusLabel(post.status) }}
            </span>
          </div>

          <div class="flex items-center gap-3 mt-2">
            <span class="text-xs text-gray-400">{{ formatDate(post.created_at) }}</span>
            <span v-if="post.category" class="text-xs text-indigo-500 font-medium">
              {{ post.category.name }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <RouterLink
            :to="{ name: 'post-detail', params: { id: post.id } }"
            class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
            title="Lihat"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </RouterLink>

          <RouterLink
            :to="{ name: 'post-edit', params: { id: post.id } }"
            class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </RouterLink>

          <button
            class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Hapus"
            @click="askDelete(post)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :show="!!deleteTarget"
      title="Hapus Post"
      :message="`'${deleteTarget?.title}' akan dihapus permanen dan tidak bisa dikembalikan.`"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <div
      v-if="deleteError"
      class="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
    >
      {{ deleteError }}
    </div>
  </div>
</template>