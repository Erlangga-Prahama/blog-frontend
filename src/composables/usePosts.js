import { ref } from "vue";
import { useApi } from "@/composables/useApi";

export function usePosts() {
  const { loading, error, request, api } = useApi();

  const post = ref(null);
  const posts = ref([]);
  const meta = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  async function fetchPosts(params = {}) {
    const data = await request(() => api.get("/posts", { params }));

    posts.value = data.data?.posts ?? [];
    meta.value = {
      current_page: data.data?.pagination?.current_page ?? 1,
      last_page: data.data?.pagination?.last_page ?? 1,
      total: data.data?.pagination?.total ?? 0,
    };
  }

  async function fetchPost(id) {
    const data = await request(() => api.get(`/posts/${id}`));
    post.value = data.data?.post ?? data.data ?? data;
  }

  async function fetchMyPosts(params = {}) {
    const data = await request(() => api.get("/posts", { params }));
    posts.value = data.data?.posts ?? [];
    meta.value = data.data?.pagination ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
    };
  }

  async function createPost(formData) {
    const data = await request(() =>
      api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
    return data.data?.post ?? data.data ?? data;
  }

  async function updatePost(id, formData) {
    formData.append("_method", "PUT");
    const data = await request(() =>
      api.post(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
    return data.data?.post ?? data.data ?? data;
  }

  async function deletePost(id) {
    await request(() => api.delete(`/posts/${id}`));
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
}
