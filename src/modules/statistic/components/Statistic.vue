<template>
  <breadcrumbs :items="breadcrumbsItems" />
  <dictionary-block />
  <progress-block class="mt-6" />
</template>

<script lang="ts" setup>
import Breadcrumbs, { ICrumb } from "@/components/Breadcrumbs.vue";
import DictionaryBlock from "@/modules/statistic/components/DictionaryBlock.vue";
import ProgressBlock from "@/modules/statistic/components/ProgressBlock.vue";

const breadcrumbsItems: ICrumb[] = [
  {
    title: "Quiz",
    to: "/quiz",
  },
  {
    title: "Progress",
    disabled: true,
  },
];
</script>
