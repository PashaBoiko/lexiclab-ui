<script setup lang="ts">
  import { ref } from "vue";
  import * as auth from "./services/auth/auth.ts";
  import { configStorage } from "./storage";

  import AppBar from "./components/AppBar.vue";
  import Alert from "./components/Alert.vue";
  import Loader from "./components/Loader.vue";

  const loaderState = ref(true);

  async function created() {
    auth.authorizationStatus();
    await configStorage.fetchPublicConfig();

    loaderState.value = false;
  }

  created();

</script>

<template>
  <v-app class="rounded rounded-md">

    <app-bar></app-bar>

    <v-main class="d-flex align-center justify-center">
      <v-container class="middle-container">
          <alert></alert>
          <Loader v-if="loaderState"/>
          <router-view v-else></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
  .middle-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

</style>
