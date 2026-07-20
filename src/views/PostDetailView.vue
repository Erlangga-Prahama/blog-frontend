<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { usePosts } from '@/composables/usePosts';

const route = useRoute()
const { post, loading, fetchPost } = usePosts()

function load() {
  fetchPost(route.params.id)
}

onMounted(load)

watch(() => route.params.id, load)
</script>

<template>
  <div>
    <RouterLink to="/" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-4"
    > kembali ke semua post</RouterLink>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-100 rounded w-2/3"></div>
      <div class="h-4 bg-gray-100 rounded w-1/3"></div>
      <div class="aspect-[16/9] bg-gray-100 rounded-xl"></div>
      <div class="h-4 bg-gray-100 rounded w-full"></div>
      <div class="h-4 bg-gray-100 rounded w-full"></div>
      <div class="h-4 bg-gray-100 rounded w-3/4"></div>
    </div>

    <div v-else-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
      {{ error.message }}
    </div>

    <article v-else-if="post">
      <span v-if="post.category" class="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-3">
        {{ post.category.name }}
      </span>

      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        {{ post.title }}
      </h1>

      <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>{{ post.author?.name }}</span>
        <span>.</span>
        <span>{{ post.published_at }}</span>
      </div>

      <div
        v-if="post.thumbnail"
        class="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-6"
      >
        <img
          :src="post.thumbnail"
          :alt="post.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Isi konten post: asumsi rich text / HTML dari backend -->
      <div
        class="prose prose-sm sm:prose-base max-w-none"
        v-html="post.content"
      ></div>
    </article>
  </div>
</template>