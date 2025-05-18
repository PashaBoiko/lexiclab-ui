<template>
  <v-row
      align="center"
      justify="center"
  >
    <v-col
        cols="12"
        lg="6"
    >
      <h3 class="text-center mb-3">Login Form</h3>

      <v-form @submit.prevent="onFormSubmit" ref="form">
        <v-text-field
            v-model="formData.email.value"
            :rules="formData.email.rules"
            label="Email"
        ></v-text-field>

        <v-text-field
            v-model="formData.password.value"
            :rules="formData.password.rules"
            label="Password"
            type="password"
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
import {reactive, Ref, ref} from "vue";
import { useRouter } from 'vue-router'
import { authorize } from "../../services/auth/auth.ts";
import { toggleErrorAlert, toggleInfoAlert } from "../../services/alert";
import { IFormField } from "../../types";
import {VForm} from "vuetify/components/VForm";
import {IError} from "../../types/error.ts";

interface ILoginForm {
  email: IFormField;
  password: IFormField
}

const router = useRouter();

const formData: ILoginForm = reactive({
  email: {
    value: "",
    rules: [
      (v: string) => !!v || 'Name is required',
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

async function onFormSubmit() {
  const { valid } = await form.value?.validate();

  if (!valid) return;

  try {
    const response = await authorize({
      email: formData.email.value,
      password: formData.password.value,
    });

    if("message" in response) {
      toggleInfoAlert(response.message);
    }
    router.push("/");
  } catch (err: unknown) {
    toggleErrorAlert((err as IError).message);
  }
}

</script>