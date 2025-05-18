<script setup lang="ts">
import {computed, ref} from "vue";
import { RouteLocationRaw, useRouter } from "vue-router";

import * as auth from "../services/auth/auth.ts";
import { navigateTo } from "../services/navigation";

import Menu from "./Menu.vue";
import errorHandler from "../utils/error-handler.ts";

const drawer = ref(auth.authorized.value);
const router = useRouter();
const authInfo = auth.authorizedUser.get();

const userName = computed(() => {
  if (authInfo) return authInfo.user.name
  return "";
});

const userNameFirstLetter = computed(() => {
  return userName.value.slice(0, 1).toUpperCase();
});

const userEmail = computed(() => {
  if (authInfo) return authInfo.user.email
  return "";
});

function navigate(path: RouteLocationRaw) {
  navigateTo(router, path);
}
function toggleDrawer() {
  drawer.value = !drawer.value;
}

async function logout() {
  try {
    await auth.logout();
    navigate('/login');
  } catch (err: unknown) {
    errorHandler(err);
  }
}

</script>

<template>
  <v-app-bar
    color="primary"
    prominent
  >
    <v-app-bar-nav-icon
        v-if="auth.authorized.value"
        variant="text"
        @click.stop="toggleDrawer"
    />

    <v-toolbar-title>LexicLab</v-toolbar-title>

    <v-spacer />

    <template v-slot:append>

      <template v-if="!auth.authorized.value">
        <v-btn
            variant="outlined"
            text="login"
            theme="secondary"
            @click="navigate('/login')"
        />
        <v-btn
            variant="text"
            text="Register"
            theme="secondary"
            @click="navigate('/register')"
        />
      </template>

      <template v-else>

        <v-menu
            min-width="200px"
            rounded
        >
          <template v-slot:activator="{ props }">
            <v-btn
                icon
                v-bind="props"
            >
              <v-avatar
                  color="#8D8C8A"
                  size="40"
              >
                <span class="text-h5 text-white">{{ userNameFirstLetter }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar
                    color="#8D8C8A"
                    size="40"
                >
                  <span class="text-h5 text-white">
                    {{ userNameFirstLetter }}
                  </span>
                </v-avatar>
                <h3>{{ userName }}</h3>
                <p class="text-caption mt-1">{{ userEmail }}</p>
                <v-divider class="my-3"></v-divider>
                <v-btn
                    variant="text"
                    text="Profile"
                    theme="secondary"
                />
                <v-divider class="my-3"></v-divider>
                <v-btn
                    variant="text"
                    text="Log out"
                    theme="secondary"
                    @click="logout"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </template>

  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
  >
    <Menu />
  </v-navigation-drawer>
</template>