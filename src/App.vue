<script setup lang="ts">
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { RouteLocationRaw, useRouter } from "vue-router";

import * as auth from "@/services/auth/auth.ts";
import http, { HttpEvents } from "@/services/http";
import { clearUserData } from "@/services/auth/auth.ts";
import { navigateTo } from "@/services/navigation";

import AppBar from "@/components/AppBar.vue";
import Alert from "@/components/Alert.vue";
import Loader from "@/components/Loader.vue";
import Menu from "@/components/Menu.vue";
import ToastPopup from "@/components/ToastPopup.vue";

import { configStorage } from "./storage";

const router = useRouter();
const { mdAndDown, lgAndUp } = useDisplay();

const loaderState = ref(true);
const drawer = ref(false);
const rail = ref(false);

async function created() {
  console.log("Deployed");
  auth.authorizationStatus();
  drawer.value = auth.isAuthorized.value;
  await configStorage.fetchPublicConfig();

  loaderState.value = false;

  http.on(HttpEvents.UNAUTHORIZED, () => {
    clearUserData();
    toggleDrawer();
    navigate("/login");
  });
}

function toggleDrawer() {
  drawer.value = !drawer.value;
}

function toggleRail() {
  rail.value = !rail.value;
}

function navigate(path: RouteLocationRaw) {
  navigateTo(router, path);
}

created();

watch(auth.isAuthorized, async (state: boolean) => {
  drawer.value = state;
});

watch(lgAndUp, async (state: boolean) => {
  if (!auth.isAuthorized.value) {
    state = false;
  }
  drawer.value = state;
});
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail || mdAndDown"
      :disable-resize-watcher="true"
    >
      <div class="l-app-bar">
        <i class="l-app-bar--logo fa-solid fa-flask-vial"></i>
        <span class="l-app-bar--title">LexicLab</span>
      </div>
      <Menu />
    </v-navigation-drawer>

    <app-bar
      :drawer="drawer"
      @toggle-drawer="toggleDrawer"
      @toggle-rail="toggleRail"
    ></app-bar>

    <v-main class="d-flex align-center justify-center">
      <v-container class="middle-container" :fluid="true">
        <alert></alert>
        <toast-popup></toast-popup>
        <Loader v-if="loaderState" />
        <router-view v-else></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
