<template>
  <v-snackbar
    v-model="toastState.state"
    location="end top"
    :color="toastState.type"
    :timeout="3000"
    multi-line
  >
    {{ toastState.text }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import { toastState } from "@/services/notification";
</script>
