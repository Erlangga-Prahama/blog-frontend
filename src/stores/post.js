import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/lib/axios";

export const usePostStore = defineStore("post", () => {
  const posts = ref([]);
  const post = ref(null);
  const meta = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchPosts(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get("/posts", { params });
      posts.value = res.data.data?.posts ?? [];
      meta.value = {
        current_page: res.data.data?.pagination?.current_page ?? 1,
        last_page: res.data.data?.pagination?.last_page ?? 1,
        total: res.data.data?.pagination?.total ?? 0,
      };
    } catch (err) {
      error.value = err.response?.data?.message ?? "Gagal memuat post.";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPost(id) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get(`/posts/${id}`);
      post.value = res.data.data ?? res.data;
    } catch (err) {
      error.value = err.response?.data?.message ?? "Gagal memuat post.";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMyPosts(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get("/my-posts", { params });
      posts.value = res.data.data ?? [];
      meta.value = {
        current_page: res.data.meta?.current_page ?? 1,
        last_page: res.data.meta?.last_page ?? 1,
        total: res.data.meta?.total ?? 0,
      };
    } catch (err) {
      error.value = err.response?.data?.message ?? "Gagal memuat post.";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createPost(formData) {
    const res = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data ?? res.data;
  }

  async function updatePost(id, formData) {
    formData.append("_method", "PUT");
    const res = await api.post(`/posts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data ?? res.data;
  }

  async function deletePost(id) {
    await api.delete(`/posts/${id}`);
    posts.value = posts.value.filter((p) => p.id !== id);
  }

  return {
    posts,
    post,
    meta,
    loading,
    error,
    fetchPosts,
    fetchPost,
    fetchMyPosts,
    createPost,
    updatePost,
    deletePost,
  };
});
