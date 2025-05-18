import * as VueRouter from 'vue-router';

import { authorized } from "../services/auth/auth.ts";

import Home from "../components/Home.vue";
import Quiz from "../components/quiz/Quiz.vue";

import Dictionary from "../components/dictionary/Dictionary.vue";
import Archive from "../components/archive/Archive.vue";

import Login from "../components/auth/Login.vue";
import Register from "../components/auth/Register.vue";

const routes = [
  {
    path: '/',
    name: "Home",
    component: Home,
    meta: {
      private: true
    },
  },
  {
    path: '/quiz',
    name: "Quiz",
    component: Quiz,
    meta: {
      private: true,
    }
  },
  {
    path: '/dictionary',
    name: "Dictionary",
    component: Dictionary,
    meta: {
      private: true,
    },
  },
  {
    path: '/archive',
    name: "Archive",
    component: Archive,
    meta: {
      private: true,
    },
  },
  {
    path: '/login',
    name: "Login",
    component: Login,
    meta: {
      private: false,
    }
  },
  {
    path: '/register',
    name: "Register",
    component: Register,
    meta: {
      private: false
    }
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

// @ts-ignore
router.beforeEach((to, from, next) => {
  if (to.meta.private && !authorized.value) next({ name: 'Login' })
  next()
})

export default router;