import { ref } from 'vue';
import { useApi } from '@/composables/useApi'

export function usePosts() {
    const { loading, error, request, api } = useApi()
    
  const post = ref(null);
  const posts = ref([]);
  const meta = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  async function fetchPosts(params = {}) {
    const data = await request(() => api.get("/posts", { params }));

    posts.value = data.data;
    meta.value = {
      current_page: data.meta?.current_page ?? data.current_page ?? 1,
      last_page: data.meta?.last_page ?? data.last_page ?? 1,
      total: data.meta?.total ?? data.total ?? 0,
    };
  }

  async function fetchPost(slug) {
    const data = await request(() => api.get(`/posts/${slug}`));
    posts.value = data.data || data;
  }

  return { posts, meta, loading, error, fetchPosts, fetchPost };
}