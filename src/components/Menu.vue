<script setup lang="ts">
import { computed } from "vue";
import { RouteLocationRaw, useRouter } from "vue-router";

import * as auth from "@/services/auth/auth.ts";
import { navigateTo } from "@/services/navigation";

const router = useRouter();

function navigate(path: RouteLocationRaw) {
  navigateTo(router, path);
}

const isAuthorized = computed(() => auth.isAuthorized.value);
</script>

<template>
  <v-list class="l-main-menu">
    <v-list-item
      v-if="isAuthorized"
      class="link"
      title="Home"
      @click="navigate('/')"
    >
      <template #prepend>
        <v-icon size="x-small" icon="fa-solid fa-house"></v-icon>
      </template>
    </v-list-item>

    <v-list-item
      v-if="isAuthorized"
      class="link"
      title="Quiz"
      @click="navigate('/quiz')"
    >
      <template #prepend>
        <v-icon size="x-small" icon="fa-solid fa-gamepad"></v-icon>
      </template>
    </v-list-item>

    <v-list-item
      v-if="isAuthorized"
      class="link"
      title="Dictionary"
      @click="navigate('/dictionary')"
    >
      <template #prepend>
        <v-icon size="x-small" icon="fa-solid fa-book"></v-icon>
      </template>
    </v-list-item>

    <v-list-item
      v-if="isAuthorized"
      class="link"
      title="Progress"
      @click="navigate('/statistic')"
    >
      <template #prepend>
        <v-icon size="x-small" icon="fa-solid fa-chart-simple"></v-icon>
      </template>
    </v-list-item>

    <v-list-item
      v-if="isAuthorized"
      class="link"
      title="Archive"
      @click="navigate('/archive')"
    >
      <template #prepend>
        <v-icon size="x-small" icon="fa-solid fa-box-archive"></v-icon>
      </template>
    </v-list-item>
  </v-list>
</template>
