import * as VueRouter from "vue-router";

import { isAuthorized } from "../services/auth/auth.ts";

import Home from "@/components/Home.vue";
import Quiz from "@/modules/quiz/components/Quiz.vue";

import Dictionary from "@/modules/dictionary/components/Dictionary.vue";
import Archive from "@/components/archive/Archive.vue";
import Profile from "@/modules/profile/components/Profile.vue";
import Statistic from "@/modules/statistic/components/Statistic.vue";

import Login from "@/modules/auth/components/Login.vue";
import SignUp from "@/modules/auth/components/SignUp.vue";
import ResetPassword from "@/modules/auth/components/ResetPassword.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      private: true,
    },
  },
  {
    path: "/quiz",
    name: "Quiz",
    component: Quiz,
    meta: {
      private: true,
    },
  },
  {
    path: "/dictionary",
    name: "Dictionary",
    component: Dictionary,
    meta: {
      private: true,
    },
  },
  {
    path: "/archive",
    name: "Archive",
    component: Archive,
    meta: {
      private: true,
    },
  },
  {
    path: "/statistic",
    name: "Statistic",
    component: Statistic,
    meta: {
      private: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      private: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      private: false,
      notAuthorizedOnly: true,
    },
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
    meta: {
      private: false,
      notAuthorizedOnly: true,
    },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
    meta: {
      private: false,
      notAuthorizedOnly: true,
    },
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.private && !isAuthorized.value) next({ name: "Login" });

  if (to.meta.notAuthorizedOnly && isAuthorized.value) next({ name: "Home" });

  next();
});

export default router;
