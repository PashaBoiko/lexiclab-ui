<template>
  <div class="text-center mb-2">
    <v-menu location="end">
      <template v-slot:activator="{ props }">
        <v-btn icon="fa-solid fa-ellipsis-vertical" dark v-bind="props" />
      </template>

      <v-list>
        <v-list-item>
          <v-btn variant="text" @click="openImportForm">Import</v-btn>
        </v-list-item>
      </v-list>
    </v-menu>

    <import-form ref="importForm"></import-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ImportForm from "@/modules/dictionary/components/forms/ImportForm.vue";

const importForm = ref();

function openImportForm() {
  importForm.value.toggleDialog();
}
</script>
