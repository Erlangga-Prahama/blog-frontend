import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useApi } from "@/composables/useApi";

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();
  const { loading, error, request, api } = useApi();

  async function login(credentials) {
    const data = await request(() => api.post("/login", credentials));
    authStore.setAuth(data.token, data.user);
    router.push("/");
  }

  async function register(payload) {
    const data = await request(() => api.post("/register", payload));
    authStore.setAuth(data.token, data.user);
    router.push("/");
  }

  async function logout() {
    try {
      await request(() => api.post("/logout"));
    } finally {
      authStore.clearAuth();
      router.push("/login");
    }
  }

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
}
