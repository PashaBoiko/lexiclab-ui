<template>
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="data"
    :sort-by="[{key: 'en', order: 'asc'}]"
    item-value="name"
  >
    <template v-slot:top>
      <v-toolbar
          rounded
      >
        <v-toolbar-title>Dictionary</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <dictionary-form ref="form"></dictionary-form>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          size="small"
          class="mr-2"
          @click="editItem(item.raw)"
          color="#363538"
      >
        fa-solid fa-pencil
      </v-icon>
      <v-icon
          size="small"
          @click="deleteItem(item.raw)"
          color="#363538"
      >
        fa-solid fa-trash
      </v-icon>
    </template>
    <template v-slot:no-data>
      No data
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { IEditFormPayload } from "./types.ts";
import DictionaryForm from "./DictionaryForm.vue";
import { dictionaryStorage } from "../../storage";
import { toggleErrorAlert } from "../../services/alert";

import { VDataTable } from 'vuetify/components'
import * as configStorage from "../../storage/config.ts";

const itemsPerPage = 10;
const form: Ref<typeof DictionaryForm | null> = ref(null);
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

const config = configStorage.getState.value;

const allData = computed(() => {
  return dictionaryStorage.getState.value.dictionary;
});

const data = computed(() => {
  return allData.value.filter((item: IEditFormPayload) => item.iteration < config.limitOfCorrectAnswers);
});

const created = async () => {
  try {
    await dictionaryStorage.fetchItems();
  } catch (err) {
    toggleErrorAlert(err as string);
  }
}

created();

const deleteItem = async(item: IEditFormPayload) => {
  try {
    await dictionaryStorage.removeItem(item._id);
  } catch (err) {
    toggleErrorAlert(err as string);
  }
}

const editItem = async(item: IEditFormPayload) => {
  if (form.value) {
    form.value?.editForm({
      _id: item._id,
      en: item.en,
      ua: item.ua,
      iteration: item.iteration,
    });
  }
}
</script>