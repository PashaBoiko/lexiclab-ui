<template>
  <v-dialog width="500" v-model="dialog">
    <template v-slot:activator="{ props }">
      <v-btn variant="tonal" color="success" class="mb-2" v-bind="props">
        New Word
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Word</span>
      </v-card-title>
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-form @submit.prevent="onFormSubmit" ref="form">
              <v-text-field
                v-model="formData.ua.value"
                :rules="formData.ua.rules"
                :error-messages="formData.ua.errorMessage"
                label="Ua"
                @input="clearError('ua')"
              ></v-text-field>

              <v-text-field
                v-model="formData.en.value"
                :rules="formData.en.rules"
                :error-messages="formData.en.errorMessage"
                @input="clearError('en')"
                label="En"
              ></v-text-field>

              <v-textarea
                v-model="formData.description.value"
                :rules="formData.description.rules"
                :error-messages="formData.description.errorMessage"
                @input="clearError('description')"
                label="Description"
              ></v-textarea>

              <v-text-field
                v-model="formData.iteration.value"
                :rules="formData.iteration.rules"
                :error-messages="formData.iteration.errorMessage"
                @input="clearError('iteration')"
                label="Amount of correct answers"
                v-if="isEditMode"
              ></v-text-field>

              <v-btn class="mt-3" type="submit" color="success"> Save </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, Ref, computed } from "vue";
import { VForm } from "vuetify/components/VForm";

import { IEditFormPayload } from "@/modules/dictionary/types";
import { IDictionaryForm } from "@/modules/dictionary/types";
import { toggleErrorToast, toggleSuccessToast } from "@/services/notification";
import { dictionaryStorage } from "@/storage";
import { IError, IValidationError } from "@/types/error.ts";
import errorHandler from "@/utils/error-handler.ts";

const formData: IDictionaryForm = reactive({
  ua: {
    value: "",
    rules: [(v) => !!v || "Ua is required"],
    errorMessage: "",
  },
  en: {
    value: "",
    rules: [(v) => !!v || "En is required"],
    errorMessage: "",
  },
  description: {
    value: "",
    rules: [],
    errorMessage: "",
  },
  iteration: {
    value: "0",
    rules: [(v) => !!v || "Iteration is required"],
    errorMessage: "",
  },
});

const form: Ref<typeof VForm | null> = ref(null);
const mode: Ref<"add" | "edit"> = ref("add");
const dialog = ref(false);
let childID: string = "";

const isEditMode = computed(() => {
  return mode.value === "edit";
});

async function onFormSubmit() {
  const { valid } = await form.value?.validate();

  if (!valid) return;

  try {
    if (mode.value === "add") await addNewItem();
    else await editItem();

    closeDialog();
    clearForm();
  } catch (err: unknown) {
    if ((err as IValidationError).fields) {
      formData.ua.errorMessage = (err as IValidationError).fields.ua;
      formData.en.errorMessage = (err as IValidationError).fields.en;
      formData.description.errorMessage = (
        err as IValidationError
      ).fields.description;
      formData.iteration.errorMessage = (
        err as IValidationError
      ).fields.iteration;
      return;
    }
    toggleErrorToast((err as IError).message);
  }
}

async function addNewItem() {
  try {
    await dictionaryStorage.addItem({
      ua: formData.ua.value as string,
      en: formData.en.value as string,
      description: formData.description.value as string,
      iteration: parseInt(formData.iteration.value as string) || 0,
    });
    toggleSuccessToast("The word was successfully added");
  } catch (err: unknown) {
    errorHandler(err);
  }
}

async function editItem() {
  try {
    await dictionaryStorage.editItem(
      {
        ua: formData.ua.value as string,
        en: formData.en.value as string,
        description: formData.description.value as string,
        iteration: parseInt(formData.iteration.value as string),
      },
      childID,
    );
    toggleSuccessToast("The word was successfully edited");
  } catch (err: unknown) {
    throw new Error((err as IError).message);
  }
}

function editForm(payload: IEditFormPayload) {
  formData.en.value = payload.en;
  formData.ua.value = payload.ua;
  (formData.description.value = payload.description),
    (formData.iteration.value = String(payload.iteration)),
    (childID = payload._id);
  mode.value = "edit";
  openDialog();
}

function clearError(key: "en" | "ua" | "iteration" | "description") {
  formData[key].errorMessage = "";
}

function clearForm() {
  Object.values(formData).forEach((item) => {
    item.value = "";
  });
  mode.value = "add";
}

function openDialog() {
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  childID = "";
}

watch(dialog, (newValue: boolean) => {
  if (!newValue) clearForm();
});

defineExpose({
  editForm,
});
</script>
