import { ref } from "vue";
import { useApi } from "@/composables/useApi";

export function useCategories() {
  const { loading, error, request, api } = useApi();

  const categories = ref([]);

  async function fetchCategories() {
    const data = await request(() => api.get("/categories"));
    categories.value = data.data?.categories ?? [];
  }

  async function createCategory(payload) {
    const data = await request(() => api.post("/categories", payload));
    return data.data;
  }

  async function updateCategory(id, payload) {
    const data = await request(() => api.put(`/categories/${id}`, payload));
    return data.data;
  }

  async function deleteCategory(id) {
    await request(() => api.delete(`/categories/${id}`));
    categories.value = categories.value.filter((c) => c.id !== id);
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
