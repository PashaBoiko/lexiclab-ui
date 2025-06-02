<template>
  <breadcrumbs :items="breadcrumbsItems" />
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="archivedData"
    :sort-by="[{ key: 'en', order: 'asc' }]"
    item-value="name"
  >
    <template v-slot:top>
      <v-toolbar class="toolbar">
        <v-spacer></v-spacer>
        <v-btn variant="tonal" color="info" class="mb-2 mx-2" to="/quiz">
          Go to quiz
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="mr-2" @click="reset(item)">
        fa-solid fa-arrow-rotate-left
      </v-icon>
    </template>
    <template v-slot:no-data> No data </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import { VDataTable } from "vuetify/components";

import { dictionaryStorage } from "@/storage";
import { toggleErrorToast } from "@/services/notification";
import * as configStorage from "@/storage/config.ts";
import Breadcrumbs, { ICrumb } from "@/components/Breadcrumbs.vue";
import { IEditFormPayload } from "@/modules/dictionary/types";

const itemsPerPage = 10;
const headers: Ref<InstanceType<typeof VDataTable>["headers"]> = ref([
  {
    title: "English",
    align: "center",
    key: "en",
    sortable: true,
  },
  {
    title: "Ukrainian",
    align: "center",
    key: "ua",
    sortable: true,
  },
  {
    title: "Description",
    align: "center",
    key: "description",
    sortable: false,
  },
  {
    title: "Actions",
    align: "center",
    key: "actions",
    sortable: false,
  },
]);

const breadcrumbsItems: ICrumb[] = [
  {
    title: "Quiz",
    to: "/quiz",
  },
  {
    title: "Archive",
    disabled: true,
  },
];

const data = computed(() => {
  return dictionaryStorage.getState.value.dictionary;
});

const config = configStorage.getState.value;

const archivedData = computed(() => {
  return data.value.filter(
    (item: IEditFormPayload) => item.iteration >= config.limitOfCorrectAnswers,
  );
});

const created = async () => {
  try {
    await dictionaryStorage.fetchItems();
  } catch (err: unknown) {
    toggleErrorToast(err as string);
  }
};

created();

const reset = (item: IEditFormPayload) => {
  try {
    dictionaryStorage.refresh(item._id);
  } catch (err: unknown) {
    toggleErrorToast(err as string);
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  background: #eaeef3;
}
</style>
