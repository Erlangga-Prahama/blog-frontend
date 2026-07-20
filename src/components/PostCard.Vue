<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink
    :to="{ name: 'post-detail', params: { id: post.id } }"
    class="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
  >
    <div class="aspect-[16/9] bg-gray-100 overflow-hidden">
      <img
        v-if="post.thumbnail"
        :src="post.thumbnail"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-sm">
        Tidak ada gambar
      </div>
    </div>

    <div class="p-4">
      <span
        v-if="post.category"
        class="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2"
      >
        {{ post.category.name }}
      </span>

      <h3 class="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition">
        {{ post.title }}
      </h3>

      <p class="text-sm text-gray-500 mt-1 line-clamp-2">
        {{ post.excerpt }}
      </p>

      <div class="flex items-center justify-between mt-3 text-xs text-gray-400">
        <span>{{ post.author?.name }}</span>
        <span>{{ post.published_at }}</span>
      </div>
    </div>
  </RouterLink>
</template>
