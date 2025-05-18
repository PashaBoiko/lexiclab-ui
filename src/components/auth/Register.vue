<template>
  <v-row
      align="center"
      justify="center"
  >
    <v-col
        cols="12"
        lg="6"
    >
      <h3 class="text-center mb-3">Register Form</h3>

      <v-form @submit.prevent="onFormSubmit" ref="form">
        <v-text-field
            v-model="formData.name.value"
            :rules="formData.name.rules"
            label="Name"
        ></v-text-field>

        <v-select
            label="Native language"
            v-model="formData.nativeLanguage.value"
            :rules="formData.nativeLanguage.rules"
            item-value="key"
            item-title="title"
            :items="languages"
            @update:modelValue="onNativeLanguageChanged"
        ></v-select>

        <v-select
            v-if="formData.nativeLanguage.value"
            label="Foreign language"
            v-model="formData.foreignLanguage.value"
            :rules="formData.foreignLanguage.rules"
            item-value="key"
            item-title="title"
            :items="foreignLanguageList"
        ></v-select>

        <v-text-field
            v-model="formData.email.value"
            :rules="formData.email.rules"
            type="email"
            label="Email"
        ></v-text-field>

        <v-text-field
            v-model="formData.password.value"
            :rules="formData.password.rules"
            type="password"
            label="Password"
        ></v-text-field>

        <v-btn
            class="mt-3"
            type="submit"
        >
          Submit
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {computed, reactive, Ref, ref} from "vue";
import { useRouter } from 'vue-router'
import { VForm } from "vuetify/components/VForm";
import { register } from "../../services/auth/auth.ts"
import {toggleErrorAlert, toggleInfoAlert} from "../../services/alert";
import { configStorage } from "../../storage";
import { IFormField } from "../../types";
import { IError } from "../../types/error.ts";

interface IRegisterForm {
  name: IFormField;
  email: IFormField;
  nativeLanguage: IFormField;
  foreignLanguage: IFormField;
  password: IFormField;
}
const router = useRouter();

const formData: IRegisterForm = reactive({
  name: {
    value: "",
    rules: [
      (v: string) => !!v || 'Name is required',
    ],
    errorMessage: '',
  },
  nativeLanguage: {
    value: "",
    rules: [
      (v: string) => !!v || 'Native language is required',
    ],
    errorMessage: '',
  },
  foreignLanguage: {
    value: "",
    rules: [
      (v: string) => !!v || 'Foreign language is required',
    ],
    errorMessage: '',
  },
  email: {
    value: "",
    rules: [
      (v: string) => !!v || 'Email is required',
    ],
    errorMessage: '',
  },
  password: {
    value: "",
    rules: [
      (v: string) => !!v || 'Password is required',
      (v: string) => (v && v.length >= 8) || 'Password must be more than 8 characters',
    ],
    errorMessage: '',
  }
});

const form: Ref<typeof VForm | null> = ref(null);

const languages = computed(() => configStorage.getState.value.languages)

const foreignLanguageList = computed(() => languages.value.filter((item) => {
  return item.key !== formData.nativeLanguage.value;
}));

function onNativeLanguageChanged() {
  formData.foreignLanguage.value = "";
}

async function onFormSubmit() {
  const { valid } = await form.value?.validate();

  if (!valid) return;

  try {
    const response = await register({
      name: formData.name.value,
      email: formData.email.value,
      nativeLanguage: formData.nativeLanguage.value,
      foreignLanguage: formData.foreignLanguage.value,
      password: formData.password.value,
    })

    if("message" in response) {
      toggleInfoAlert(response.message);
    }

    router.push("/");
  } catch (err: unknown) {
    toggleErrorAlert((err as IError).message);
  }
}

</script>