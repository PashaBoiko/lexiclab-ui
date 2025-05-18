<template>
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="archivedData"
    item-value="name"
  >
    <template v-slot:top>
      <v-toolbar rounded>
        <v-toolbar-title>Archive</v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          size="small"
          class="mr-2"
          @click="reset(item.raw)"
      >
        fa-solid fa-arrow-rotate-left
      </v-icon>
    </template>
    <template v-slot:no-data>
      No data
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import {computed, ref, Ref} from "vue";
import { VDataTable } from "vuetify/components";
import { IEditFormPayload } from "../dictionary/types.ts";
import { dictionaryStorage } from "../../storage";
import { toggleErrorAlert } from "../../services/alert";
import * as configStorage from "../../storage/config.ts";

const itemsPerPage = 10;
const headers: Ref<InstanceType<typeof VDataTable>['headers']> = ref([
  {
    title: 'EN',
    align: 'center',
    key: 'en',
    sortable: true,
  },
  {
    title: 'UA',
    align: 'center',
    key: 'ua',
    sortable: true,
  },
  {
    title: 'Iteration',
    align: 'center',
    key: 'iteration',
    sortable: false,
  },
  {
    title: 'Actions',
    align: 'center',
    key: 'actions',
    sortable: false
  },
]);

const data = computed(() => {
  return dictionaryStorage.getState.value.dictionary;
});

const config = configStorage.getState.value;

const archivedData = computed(() => {
  return data.value.filter((item: IEditFormPayload) => item.iteration >= config.limitOfCorrectAnswers);
});

const created = async () => {
  try {
    await dictionaryStorage.fetchItems();
  } catch (err) {
    toggleErrorAlert(err as string);
  }
}

created();

const reset = (item: IEditFormPayload) => {
  try {
    dictionaryStorage.refresh(item._id)
  } catch (err) {
    toggleErrorAlert(err as string);
  }
}
</script>