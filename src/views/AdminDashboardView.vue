<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { usePosts } from "@/composables/usePosts";
import { useCategories } from "@/composables/useCategories";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import CategoryFormModal from "@/components/CategoryFormModal.vue";

const activeTab = ref("categories");

const {
  categories,
  loading: catLoading,
  error: catError,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategories();

const catModalShow = ref(false);
const catModalTarget = ref(null);
const catModalLoading = ref(false);
const catModalError = ref("");

const catDeleteTarget = ref(null);
const catDeleting = ref(false);

function openCreateCategory() {
  catModalTarget.value = null;
  catModalError.value = "";
  catModalShow.value = true;
}

function openEditCategory(category) {
  catModalTarget.value = category;
  catModalError.value = "";
  catModalShow.value = true;
}

async function handleCategorySubmit(payload) {
  catModalLoading.value = true;
  catModalError.value = "";
  try {
    if (catModalTarget.value) {
      await updateCategory(catModalTarget.value.id, payload);
    } else {
      await createCategory(payload);
    }
    catModalShow.value = false;
    fetchCategories();
  } catch (err) {
    catModalError.value =
      err.response?.data?.message ?? "Gagal menyimpan kategori.";
  } finally {
    catModalLoading.value = false;
  }
}

function askDeleteCategory(category) {
  catDeleteTarget.value = category;
}

async function confirmDeleteCategory() {
  catDeleting.value = true;
  try {
    await deleteCategory(catDeleteTarget.value.id);
    catDeleteTarget.value = null;
  } finally {
    catDeleting.value = false;
  }
}

const {
  posts,
  loading: postLoading,
  error: postError,
  fetchPosts,
  deletePost,
} = usePosts();

const postDeleteTarget = ref(null);
const postDeleting = ref(false);

function loadPosts() {
  fetchPosts({ per_page: 100 });
}

function askDeletePost(post) {
  postDeleteTarget.value = post;
}

async function confirmDeletePost() {
  postDeleting.value = true;
  try {
    await deletePost(postDeleteTarget.value.id);
    postDeleteTarget.value = null;
  } finally {
    postDeleting.value = false;
  }
}

function statusBadge(status) {
  if (status === "published") return "bg-green-100 text-green-700";
  if (status === "archived") return "bg-gray-100 text-gray-600";
  return "bg-yellow-100 text-yellow-700";
}

function statusLabel(status) {
  if (status === "published") return "Terbit";
  if (status === "archived") return "Arsip";
  return "Draft";
}

onMounted(() => {
  fetchCategories();
  loadPosts();
});
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        Admin Dashboard
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Kelola kategori dan seluruh post dari semua penulis.
      </p>
    </div>

    <div class="flex gap-1 border-b border-gray-200 mb-6">
      <button
        @click="activeTab = 'categories'"
        class="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition"
        :class="
          activeTab === 'categories'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        "
      >
        Kategori
      </button>
      <button
        @click="activeTab = 'posts'"
        class="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition"
        :class="
          activeTab === 'posts'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        "
      >
        Semua Post
      </button>
    </div>

    <div v-if="activeTab === 'categories'">
      <div class="flex justify-end mb-4">
        <button
          @click="openCreateCategory"
          class="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          + Tambah Kategori
        </button>
      </div>

      <div
        v-if="catError"
        class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4"
      >
        {{ catError }}
      </div>

      <div v-if="catLoading" class="space-y-2">
        <div
          v-for="n in 4"
          :key="n"
          class="h-14 bg-gray-100 rounded-xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="categories.length === 0"
        class="text-center text-gray-400 text-sm py-16 bg-white border border-gray-200 rounded-2xl"
      >
        Belum ada kategori.
      </div>

      <div
        v-else
        class="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100"
      >
        <div
          v-for="c in categories"
          :key="c.id"
          class="flex items-center justify-between px-4 py-3"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">{{ c.name }}</p>
            <p class="text-xs text-gray-400">{{ c.slug }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="openEditCategory(c)"
              class="text-sm text-indigo-600 hover:text-indigo-800 px-2 py-1"
            >
              Edit
            </button>
            <button
              @click="askDeleteCategory(c)"
              class="text-sm text-red-600 hover:text-red-800 px-2 py-1"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div
        v-if="postError"
        class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4"
      >
        {{ postError }}
      </div>

      <div v-if="postLoading" class="space-y-2">
        <div
          v-for="n in 4"
          :key="n"
          class="h-16 bg-gray-100 rounded-xl animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="posts.length === 0"
        class="text-center text-gray-400 text-sm py-16 bg-white border border-gray-200 rounded-2xl"
      >
        Belum ada post.
      </div>

      <div
        v-else
        class="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100"
      >
        <div
          v-for="p in posts"
          :key="p.id"
          class="flex items-center justify-between px-4 py-3 gap-4"
        >
          <div class="min-w-0 flex-1">
            <RouterLink
              :to="{ name: 'post-detail', params: { id: p.id } }"
              class="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate block"
            >
              {{ p.title }}
            </RouterLink>
            <div class="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
              <span
                class="px-1.5 py-0.5 rounded-full"
                :class="statusBadge(p.status)"
              >
                {{ statusLabel(p.status) }}
              </span>
              <span>oleh {{ p.author?.name }}</span>
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
              @click="askDeletePost(p)"
              class="text-sm text-red-600 hover:text-red-800 px-2 py-1"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CategoryFormModal
      :show="catModalShow"
      :category="catModalTarget"
      :loading="catModalLoading"
      :error-message="catModalError"
      @submit="handleCategorySubmit"
      @cancel="catModalShow = false"
    />

    <ConfirmDialog
      :show="!!catDeleteTarget"
      title="Hapus Kategori"
      :message="`Yakin ingin menghapus kategori '${catDeleteTarget?.name}'?`"
      :loading="catDeleting"
      @confirm="confirmDeleteCategory"
      @cancel="catDeleteTarget = null"
    />

    <ConfirmDialog
      :show="!!postDeleteTarget"
      title="Hapus Post"
      :message="`Yakin ingin menghapus '${postDeleteTarget?.title}'?`"
      :loading="postDeleting"
      @confirm="confirmDeletePost"
      @cancel="postDeleteTarget = null"
    />
  </div>
</template>
