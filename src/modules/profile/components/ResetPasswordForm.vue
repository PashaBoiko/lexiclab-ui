<template>
  <v-form ref="form">
    <v-card density="comfortable">
      <v-card-item>
        <v-row>
          <v-col cols="12" class="d-flex align-center">
            <h4 class="text-h6">Reset password</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="d-flex align-center">
            <v-text-field
              v-model="formData.password.value"
              :error-messages="formData.password.errorMessage"
              variant="outlined"
              :rules="formData.password.rules"
              label="Password"
              density="compact"
              @input="clearErrors('password')"
              type="password"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="d-flex align-center">
            <v-text-field
              v-model="formData.repeatPassword.value"
              :error-messages="formData.repeatPassword.errorMessage"
              variant="outlined"
              :rules="formData.repeatPassword.rules"
              label="Repeat password"
              density="compact"
              @input="clearErrors('repeatPassword')"
              type="password"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="d-flex align-center">
            <v-btn
              color="success"
              @click="changeUserPassword()"
              :disabled="!allowResetPassword"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { IFormFieldProfile } from "../types";
import { changePassword } from "@/services/auth/auth.ts";
import errorHandler from "@/utils/error-handler.ts";

interface IResetPasswordForm {
  password: IFormFieldProfile;
  repeatPassword: IFormFieldProfile;
}

const form = ref();

const formData: IResetPasswordForm = reactive({
  password: {
    value: "",
    errorMessage: "",
    rules: [(v: string) => !!v || "Field can't be empty"],
  },
  repeatPassword: {
    value: "",
    errorMessage: "",
    rules: [
      (v: string) => !!v || "Field can't be empty",
      (v: string) =>
        v === formData.password.value || "The repeat password is not matched",
    ],
  },
});

const allowResetPassword = computed(() => {
  return (
    !!formData.password.value &&
    formData.password.value === formData.repeatPassword.value
  );
});

const clearErrors = (key: string) => {
  const target = formData[key as keyof IResetPasswordForm];
  target.errorMessage = "";
};

const changeUserPassword = async () => {
  try {
    await changePassword({
      password: formData.password.value as string,
      repeatPassword: formData.repeatPassword.value as string,
    });

    formData.password.value = "";
    formData.repeatPassword.value = "";

    form.value.reset();
  } catch (err: unknown) {
    errorHandler(err);
  }
};
</script>
