<template>
  <breadcrumbs :items="breadcrumbsItems" />
  <v-toolbar class="toolbar">
    <v-spacer></v-spacer>
    <v-btn variant="tonal" color="info" class="mb-2 mx-2" to="/quiz">
      Go to quiz
    </v-btn>
    <add-form ref="form" />
    <other-actions />
  </v-toolbar>
  <v-toolbar class="toolbar pl-3">
    <v-switch
      v-model="showAllToggler"
      label="All words"
      color="info"
      hide-details
    ></v-switch>

    <v-spacer></v-spacer>

    <v-text-field
      v-model="search"
      density="compact"
      label="Search"
      prepend-inner-icon="fa-solid fa-magnifying-glass"
      variant="solo-filled"
      flat
      hide-details
      single-line
    ></v-text-field>
  </v-toolbar>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="dataTableData"
    :sort-by="[{ key: 'en', order: 'asc' }]"
    item-value="name"
    items-per-page="9"
  >
    <template v-slot:top> </template>
    <template v-slot:item.iteration="{ value }">
      <div class="d-flex justify-center">
        <div style="width: 100px">
          <v-progress-linear
            :color="getProgressColor(value)"
            height="8"
            :model-value="value"
            max="10"
          />
        </div>
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="mr-2" @click="editItem(item)" color="#363538">
        fa-solid fa-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)" color="#363538">
        fa-solid fa-trash
      </v-icon>
    </template>
    <template v-slot:no-data> No data </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { VDataTable } from "vuetify/components";
import { IEditFormPayload } from "@/modules/dictionary/types";
import { dictionaryStorage } from "@/storage";
import { toggleErrorToast, toggleSuccessToast } from "@/services/notification";
import * as configStorage from "@/storage/config.ts";
import Breadcrumbs, { ICrumb } from "@/components/Breadcrumbs.vue";
import AddForm from "@/modules/dictionary/components/forms/AddForm.vue";
import OtherActions from "@/modules/dictionary/components/OtherActions.vue";

const search = ref("");
const showAllToggler = ref(false);
const form: Ref<typeof AddForm | null> = ref(null);
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
    title: "Progress",
    align: "center",
    key: "iteration",
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
    title: "Dictionary",
    disabled: true,
  },
];

const config = configStorage.getState.value;

const allData = computed(() => {
  return dictionaryStorage.getState.value.dictionary;
});

const data = computed(() => {
  return allData.value.filter(
    (item: IEditFormPayload) => item.iteration < config.limitOfCorrectAnswers,
  );
});

const dataTableData = computed(() => {
  if (showAllToggler.value) return allData.value;
  return data.value;
});

const getProgressColor = (value: number) => {
  if (value < 3) return "#D2511E";
  if (value >= 3 && value < 8) return "#f07f1c";
  if (value >= 8) return "#198754";
};

const created = async () => {
  try {
    await dictionaryStorage.fetchItems();
  } catch (err: unknown) {
    toggleErrorToast(err as string);
  }
};

created();

const deleteItem = async (item: IEditFormPayload) => {
  try {
    await dictionaryStorage.removeItem(item._id);
    toggleSuccessToast("The word was successfully deleted");
  } catch (err: unknown) {
    toggleErrorToast(err as string);
  }
};

const editItem = async (item: IEditFormPayload) => {
  if (form.value) {
    form.value?.editForm({
      _id: item._id,
      en: item.en,
      ua: item.ua,
      description: item.description,
      iteration: item.iteration,
    });
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  background: #eaeef3;
}
</style>
