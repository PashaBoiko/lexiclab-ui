<template>
  <v-dialog width="500" v-model="dialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add File</span>
      </v-card-title>
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-form @submit.prevent="onFormSubmit" ref="form">
              <v-file-input
                label="Add file"
                v-model="file"
                name="file"
              ></v-file-input>

              <v-btn
                class="mt-3"
                type="submit"
                :disabled="!isFileAdded"
                color="success"
              >
                Import
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { dictionaryRDO } from "@/services/rdo/dictionary.ts";
import { setState as setDictionaryState } from "@/storage/dictionary.ts";
import { toggleErrorToast, toggleSuccessToast } from "@/services/notification";
import { IError } from "@/types";

const form = ref();
const dialog = ref(false);
const file = ref();

const isFileAdded = computed(() => {
  return file.value && file.value.length;
});

function toggleDialog() {
  dialog.value = !dialog.value;
}
async function onFormSubmit(event: any) {
  try {
    const data = await dictionaryRDO.import(new FormData(event.srcElement));
    if ("dictionary" in data) {
      setDictionaryState(data);
    }
    toggleSuccessToast("The import was successfully finished");
    toggleDialog();
  } catch (err) {
    toggleErrorToast((err as IError).message);
  }
}

defineExpose({
  toggleDialog,
});
</script>
