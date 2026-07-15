<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usePosts } from '@/composables/usePosts'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { posts, meta, loading, error, fetchMyPosts, deletePost } = usePosts()

const deleteTarget = ref(null) // post yang mau dihapus
const deleting = ref(false)
const deleteError = ref(null)

onMounted(() => {
  fetchMyPosts()
})

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
    deleteError.value = err.response?.data?.message || 'Gagal menghapus post.'
  } finally {
    deleting.value = false
  }
}

function cancelDelete() {
  deleteTarget.value = null
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Dashboard Penulis</h1>
      <RouterLink
        :to="{ name: 'post-create' }"
        class="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        + Tulis Post Baru
      </RouterLink>
    </div>

    <div
      v-if="error"
      class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4"
    >
      {{ error.message }}
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
    </div>

    <div
      v-else-if="posts.length === 0"
      class="text-center text-gray-400 text-sm py-16 bg-white border border-gray-200 rounded-xl"
    >
      Kamu belum menulis post apapun.
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
      <div
        v-for="p in posts"
        :key="p.id"
        class="flex items-center justify-between px-4 py-3 gap-4"
      >
        <div class="min-w-0 flex-1">
          <RouterLink
            :to="{ name: 'post-detail', params: { slug: p.slug } }"
            class="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate block"
          >
            {{ p.title }}
          </RouterLink>
          <div class="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
            <span
              class="px-1.5 py-0.5 rounded-full"
              :class="p.status === 'published'
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-100 text-gray-500'"
            >
              {{ p.status === 'published' ? 'Terbit' : 'Draft' }}
            </span>
            <span>{{ p.published_at || p.created_at }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <RouterLink
            :to="{ name: 'post-edit', params: { id: p.id } }"
            class="text-sm text-indigo-600 hover:text-indigo-800 px-2 py-1"
          >
            Edit
          </RouterLink>
          <button
            @click="askDelete(p)"
            class="text-sm text-red-600 hover:text-red-800 px-2 py-1"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      :show="!!deleteTarget"
      title="Hapus Post"
      :message="`Yakin ingin menghapus '${deleteTarget?.title}'? Tindakan ini tidak bisa dibatalkan.`"
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