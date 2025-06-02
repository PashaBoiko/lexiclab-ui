<template>
  <v-row align="center" justify="center">
    <v-col cols="12" lg="6">
      <h2 class="text-center mb-5">Reset password</h2>

      <v-form @submit.prevent="onFormSubmit" ref="form">
        <v-text-field
          v-model="formData.email.value"
          :rules="formData.email.rules"
          label="Email"
        ></v-text-field>

        <v-btn class="mt-3" type="submit"> Submit </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { VForm } from "vuetify/components/VForm";

import { toggleErrorToast, toggleInfoToast } from "@/services/notification";
import { resetPassword } from "@/services/auth/auth.ts";

import { IFormField } from "@/types";
import { IError } from "@/types/error.ts";

interface IResetPasswordForm {
  email: IFormField;
}

const router = useRouter();

const formData: IResetPasswordForm = reactive({
  email: {
    value: "",
    rules: [(v: string) => !!v || "Name is required"],
    errorMessage: "",
  },
});

const form: Ref<typeof VForm | null> = ref(null);

async function onFormSubmit() {
  const { valid } = await form.value?.validate();

  if (!valid) return;

  try {
    const response = await resetPassword({
      email: formData.email.value as string,
    });

    if ("message" in response) {
      toggleInfoToast(response.message);
    }

    router.push("/login");
  } catch (err: unknown) {
    toggleErrorToast((err as IError).message);
  }
}
</script>
