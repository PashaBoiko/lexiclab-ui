<script lang="ts" setup>
import { computed } from "vue";

export interface ICrumb {
  title: string;
  disabled?: boolean;
  to?: string;
}

const props = defineProps<{
  items: ICrumb[];
}>();

const length = computed(() => {
  return props.items.length;
});
</script>

<template>
  <v-breadcrumbs>
    <template v-for="(crumb, number) in props.items">
      <v-breadcrumbs-item
        :title="crumb.title"
        :to="crumb.to"
        :disabled="crumb.disabled"
      />
      <v-breadcrumbs-divider v-if="number < length - 1" />
    </template>
  </v-breadcrumbs>
</template>
