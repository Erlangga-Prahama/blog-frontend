import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/PostListView.vue"),
      },
      {
        path: "posts/:id",
        name: "post-detail",
        component: () => import("@/views/PostDetailView.vue"),
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/DashboardView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "dashboard/posts/create",
        name: "post-create",
        component: () => import("@/views/PostFormView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "dashboard/posts/:id/edit",
        name: "post-edit",
        component: () => import("@/views/PostFormView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "admin",
        name: "admin-dashboard",
        component: () => import("@/views/AdminDashboardView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== "admin") {
    return next({ name: "home" });
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: "home" });
  }

  next();
});

export default router