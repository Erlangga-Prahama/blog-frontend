<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'
import { useCategories } from '@/composables/useCategories'
import ImageUploadInput from '@/components/ImageUploadInput.vue'

const route = useRoute()
const router = useRouter()

const { post, loading, error, fetchPost, createPost, updatePost } = usePosts()
const { categories, fetchCategories } = useCategories()

const isEditMode = computed(() => !!route.params.id)
const submitting = ref(false)

const form = ref({
  title: '',
  category_id: '',
  body: '',
  status: 'draft',
})
const thumbnailFile = ref(null)

const statusOptions = [
  {
    value: 'draft',
    label: 'Draft',
    desc: 'Belum dipublikasikan',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  },
  {
    value: 'published',
    label: 'Terbit',
    desc: 'Tampil di halaman publik',
    icon: 'M5 13l4 4L19 7',
  },
  {
    value: 'archived',
    label: 'Arsip',
    desc: 'Disembunyikan dari publik',
    icon: 'M5 8h14M5 8a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  },
]

onMounted(async () => {
  fetchCategories()
  if (isEditMode.value) {
    await fetchPost(route.params.id)
  }
})

watch(
  post,
  (val) => {
    if (val && isEditMode.value) {
      form.value = {
        title: val.title,
        category_id: val.category?.id ?? '',
        body: val.body ?? '',
        status: val.status ?? 'draft',
      }
    }
  },
  { immediate: true }
)

function buildFormData() {
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('category_id', form.value.category_id)
  fd.append('body', form.value.body)
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
    // error sudah tertangani lewat `error`
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <RouterLink
        :to="{ name: 'dashboard' }"
        class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition mb-3"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </RouterLink>
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        {{ isEditMode ? 'Edit Post' : 'Tulis Post Baru' }}
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        {{ isEditMode ? 'Perbarui konten dan pengaturan post kamu.' : 'Isi detail di bawah untuk membuat post baru.' }}
      </p>
    </div>

    <div
      v-if="error && typeof error === 'string'"
      class="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6"
    >
      <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section: Konten utama -->
      <div class="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-5 shadow-sm">
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-1.5">Judul</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Judul yang menarik perhatian pembaca..."
            class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-1.5">Kategori</label>
          <div class="relative">
            <select
              v-model="form.category_id"
              required
              class="w-full appearance-none px-3.5 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition bg-white"
            >
              <option value="" disabled>Pilih kategori</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
            <svg class="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-1.5">Konten</label>
          <textarea
            v-model="form.body"
            rows="12"
            required
            placeholder="Tulis isi post di sini..."
            class="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm placeholder:text-gray-400 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition resize-y"
          ></textarea>
        </div>
      </div>

      <!-- Section: Thumbnail -->
      <div class="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
        <ImageUploadInput
          v-model="thumbnailFile"
          :existing-url="post?.thumbnail"
        />
      </div>

      <!-- Section: Status -->
      <div class="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
        <label class="block text-sm font-semibold text-gray-800 mb-3">Status</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label
            v-for="opt in statusOptions"
            :key="opt.value"
            class="relative flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition"
            :class="form.status === opt.value
              ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
          >
            <input
              v-model="form.status"
              type="radio"
              name="status"
              :value="opt.value"
              class="sr-only"
            />
            <div class="flex items-center justify-between">
              <svg
                class="w-4.5 h-4.5"
                :class="form.status === opt.value ? 'text-indigo-600' : 'text-gray-400'"
                width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="opt.icon" />
              </svg>
              <span
                v-if="form.status === opt.value"
                class="w-2 h-2 rounded-full bg-indigo-600"
              ></span>
            </div>
            <div>
              <p
                class="text-sm font-medium"
                :class="form.status === opt.value ? 'text-indigo-900' : 'text-gray-700'"
              >
                {{ opt.label }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">{{ opt.desc }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-1">
        <button
          type="submit"
          :disabled="submitting"
          class="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm shadow-indigo-600/20"
        >
          <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ submitting ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Publikasikan' }}
        </button>
        <RouterLink
          :to="{ name: 'dashboard' }"
          class="text-sm text-gray-600 font-medium px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
        >
          Batal
        </RouterLink>
      </div>
    </form>
  </div>
</template>