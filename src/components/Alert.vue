<script setup lang="ts">
import { isAlertAvailable, alertState } from "@/services/notification";
</script>

<template>
  <v-alert
    v-if="isAlertAvailable"
    class="ll-alert"
    :type="alertState.type"
    :title="alertState.title"
    :text="alertState.text"
  />
</template>

<style>
.ll-alert {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  top: 20px;
}
</style>
