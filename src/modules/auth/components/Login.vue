<template>
  <v-row align="center" justify="center">
    <v-col cols="12" lg="5">
      <h2 class="text-center mb-6" data-testid="login-title">Sign In</h2>

      <v-form @submit.prevent="onFormSubmit" ref="form">
        <v-text-field
          v-model="formData.email.value"
          :rules="formData.email.rules"
          type="email"
          label="Email"
          class="mb-2"
          data-testid="login-email"
        ></v-text-field>

        <v-text-field
          v-model="formData.password.value"
          :rules="formData.password.rules"
          label="Password"
          type="password"
          class="mb-2"
          data-testid="login-password"
        ></v-text-field>

        <v-btn class="mt-3" type="submit"> Submit </v-btn>
      </v-form>

      <p class="text-center">
        <router-link to="/reset-password">Forgot password?</router-link>
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { VForm } from "vuetify/components/VForm";

import { authorize } from "@/services/auth/auth.ts";
import { toggleErrorToast, toggleInfoToast } from "@/services/notification";

import { IFormField } from "@/types";
import { IError } from "@/types/error.ts";

interface ILoginForm {
  email: IFormField;
  password: IFormField;
}

const router = useRouter();

const formData: ILoginForm = reactive({
  email: {
    value: "",
    rules: [(v: string) => !!v || "Name is required"],
    errorMessage: "",
  },
  password: {
    value: "",
    rules: [(v: string) => !!v || "Password is required"],
    errorMessage: "",
  },
});

const form: Ref<typeof VForm | null> = ref(null);

async function onFormSubmit() {
  const { valid } = await form.value?.validate();

  if (!valid) return;

  try {
    const response = await authorize({
      email: formData.email.value as string,
      password: formData.password.value as string,
    });

    if ("message" in response) {
      toggleInfoToast(response.message);
    }
    router.push("/");
  } catch (err: unknown) {
    toggleErrorToast((err as IError).message);
  }
}
</script>
