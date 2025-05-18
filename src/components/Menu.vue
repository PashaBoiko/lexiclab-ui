<script setup lang="ts">
import {RouteLocationRaw, useRouter} from "vue-router";
  import * as auth from "../services/auth/auth.ts";
  import { navigateTo } from "../services/navigation";
  import { computed } from "vue";

  const router = useRouter();

  function navigate(path: RouteLocationRaw) {
    navigateTo(router, path);
  }

  const isAuthorized = computed(() => auth.authorized.value);

</script>

<template>
  <v-list>
    <v-list-item
      title="Home"
      @click="navigate('/')"
      v-if="isAuthorized"
    />

    <v-list-item
      title="Quiz"
      @click="navigate('/quiz')"
      v-if="isAuthorized"
    />

    <v-list-item
      title="Dictionary"
      @click="navigate('/dictionary')"
      v-if="isAuthorized"
    />

    <v-list-item
      title="Archive"
      @click="navigate('/archive')"
      v-if="isAuthorized"
    />
  </v-list>
</template>