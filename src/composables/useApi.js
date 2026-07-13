import { ref } from "vue";
import api from "@/lib/axios";

export function useApi() {
  const loading = ref(false);
  const error = ref(null);

  async function request(requestFn) {
    loading.value = true;
    error.value = null;
    try {
      const response = await requestFn();
      return response.data;
    } catch (err) {
      error.value = {
        message: err.response?.data?.message || "Terjadi kesalahan, coba lagi.",
        errors: err.response?.data?.errors || null,
        status: err.response?.status || null,
      };
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, request, api };
}
