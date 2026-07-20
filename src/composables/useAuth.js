import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useApi } from "@/composables/useApi";

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute(); // <-- pindah ke sini, JANGAN di dalam login()
  const { loading, error, request, api } = useApi();

  // storeToRefs menjaga `user` & `isAuthenticated` tetap reaktif
  const { user, isAuthenticated } = storeToRefs(authStore);

  async function login(credentials) {
    const data = await request(() => api.post("/auth/login", credentials));
    authStore.setAuth(data.data.token, data.data.user);
    router.push(route.query.redirect || "/");
  }

  async function register(payload) {
    const data = await request(() => api.post("/auth/register", payload));
    authStore.setAuth(data.data.token, data.data.user);
    router.push("/");
  }

  async function logout() {
    try {
      await request(() => api.post("/auth/logout"));
    } finally {
      authStore.clearAuth();
      router.push("/login");
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
}
