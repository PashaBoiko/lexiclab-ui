<script setup lang="ts"></script>

<template>
  <div class="ll-loader">
    <v-progress-circular
      indeterminate
      :size="64"
      :width="5"
    ></v-progress-circular>
  </div>
</template>

<style lang="scss">
.ll-loader {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(255, 255, 255, 0.5);
  z-index: 1000;
}
</style>
