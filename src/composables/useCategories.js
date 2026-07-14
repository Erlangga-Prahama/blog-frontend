import { ref } from "vue";
import { useApi } from "@/composables/useApi";

export function useCategories() {
  const { loading, error, request, api } = useApi;

  const categories = ref([]);

  async function fetchCategories() {
    const data = await request(() => api.get("/categories"));
    categories.value = data.data || data;
  }

  return { categories, loading, error, fetchCategories };
}
