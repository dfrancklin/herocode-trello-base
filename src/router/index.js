import { createRouter, createWebHistory } from "vue-router";

import useUserStore from "../stores/user";

import BoardView from "../views/BoardView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuthentication: true,
      },
    },
    {
      path: "/board/:boardId",
      name: "board",
      component: BoardView,
      meta: {
        requiresAuthentication: true,
      },
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: SignUpView,
      meta: {
        requiresNotAuthenticated: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        requiresNotAuthenticated: true,
      },
    },
  ],
});

router.beforeEach((to, _, next) => {
  if (!to.meta.requiresAuthentication && !to.meta.requiresNotAuthenticated) {
    return next();
  }

  const userStore = useUserStore();

  if (to.meta.requiresAuthentication && !userStore.user) {
    return next({ name: "login" });
  }

  if (to.meta.requiresNotAuthenticated && userStore.user) {
    return next({ name: "home" });
  }

  next();
});

export default router;
