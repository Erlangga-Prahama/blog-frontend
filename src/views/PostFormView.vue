<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'
import { useCategories } from '@/composables/useCategories'
import ImageUploadInput from '@/components/ImageUploadInput.vue'

const route = useRoute()
const router = useRouter()

const { post, loading, error, fetchPostById, createPost, updatePost } = usePosts()
const { categories, fetchCategories } = useCategories()

const isEditMode = computed(() => !!route.params.id)
const submitting = ref(false)

const form = ref({
  title: '',
  category_id: '',
  excerpt: '',
  content: '',
  status: 'draft',
})
const thumbnailFile = ref(null)

onMounted(async () => {
  fetchCategories()
  if (isEditMode.value) {
    await fetchPostById(route.params.id)
  }
})

// Begitu data post (mode edit) selesai di-fetch, isi form dengan data lama.
watch(
  post,
  (val) => {
    if (val && isEditMode.value) {
      form.value = {
        title: val.title,
        category_id: val.category?.id || val.category_id || '',
        excerpt: val.excerpt || '',
        content: val.content || '',
        status: val.status || 'draft',
      }
    }
  },
  { immediate: true }
)

function buildFormData() {
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('category_id', form.value.category_id)
  fd.append('excerpt', form.value.excerpt)
  fd.append('content', form.value.content)
  fd.append('status', form.value.status)
  if (thumbnailFile.value) {
    fd.append('thumbnail', thumbnailFile.value)
  }
  return fd
}

async function handleSubmit() {
  submitting.value = true
  try {
    const fd = buildFormData()
    if (isEditMode.value) {
      await updatePost(route.params.id, fd)
    } else {
      await createPost(fd)
    }
    router.push({ name: 'dashboard' })
  } catch {
    // error sudah tertangani lewat `error` dari useApi
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-xl font-semibold text-gray-900 mb-6">
      {{ isEditMode ? 'Edit Post' : 'Tulis Post Baru' }}
    </h1>

    <div
      v-if="error && !error.errors"
      class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4"
    >
      {{ error.message }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p v-if="error?.errors?.title" class="text-xs text-red-500 mt-1">
          {{ error.errors.title[0] }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
        <select
          v-model="form.category_id"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" disabled>Pilih kategori</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
        <p v-if="error?.errors?.category_id" class="text-xs text-red-500 mt-1">
          {{ error.errors.category_id[0] }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ringkasan</label>
        <textarea
          v-model="form.excerpt"
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Konten</label>
        <textarea
          v-model="form.content"
          rows="10"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
        <p v-if="error?.errors?.content" class="text-xs text-red-500 mt-1">
          {{ error.errors.content[0] }}
        </p>
      </div>

      <ImageUploadInput
        v-model="thumbnailFile"
        :existing-url="post?.thumbnail"
      />
      <p v-if="error?.errors?.thumbnail" class="text-xs text-red-500 -mt-3">
        {{ error.errors.thumbnail[0] }}
      </p>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Terbit</option>
        </select>
      </div>

      <div class="flex gap-2 pt-2">
        <button
          type="submit"
          :disabled="submitting"
          class="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ submitting ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Publikasikan' }}
        </button>
        <RouterLink
          :to="{ name: 'dashboard' }"
          class="text-sm text-gray-600 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Batal
        </RouterLink>
      </div>
    </form>
  </div>
</template>