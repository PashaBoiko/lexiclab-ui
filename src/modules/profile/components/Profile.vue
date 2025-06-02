<template>
  <breadcrumbs :items="breadcrumbsItems" />

  <v-row>
    <v-col cols="10">
      <v-card density="comfortable" class="mb-8">
        <v-card-item>
          <v-row>
            <v-col cols="4" class="d-flex align-center">
              <h4 class="text-h6">User name:</h4>
            </v-col>
            <v-col cols="8" class="d-flex align-center">
              <p>{{ userName }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" class="d-flex align-center">
              <h4 class="text-h6">Email:</h4>
            </v-col>
            <v-col cols="8" class="d-flex align-center">
              <p>{{ userEmail }}</p>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>

      <v-form ref="form">
        <v-card density="comfortable" class="mb-8">
          <v-card-item>
            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <h4 class="text-h6">Questions in quiz:</h4>
              </v-col>

              <v-col cols="8" class="d-flex align-center">
                <v-row>
                  <v-col cols="6" class="d-flex align-center">
                    <v-text-field
                      v-if="formData.questionsInQuiz.mode"
                      v-model="formData.questionsInQuiz.value"
                      :error-messages="formData.questionsInQuiz.errorMessage"
                      variant="outlined"
                      :rules="formData.questionsInQuiz.rules"
                      density="compact"
                      @input="clearErrors('questionsInQuiz')"
                    ></v-text-field>
                    <p v-else>
                      {{ formData.questionsInQuiz.value }}
                    </p>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-end">
                    <v-btn
                      variant="text"
                      @click="profileChanged('questionsInQuiz')"
                    >
                      {{ formData.questionsInQuiz.mode ? "Save" : "Edit" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>

        <v-card density="comfortable" class="mb-8">
          <v-card-item>
            <v-row>
              <v-col cols="4" class="d-flex align-center">
                <h4 class="text-h6">Questions in quiz (repeat mode):</h4>
              </v-col>

              <v-col cols="8" class="d-flex align-center">
                <v-row>
                  <v-col cols="6" class="d-flex align-center">
                    <v-text-field
                      v-if="formData.questionsInQuizRepeat.mode"
                      v-model="formData.questionsInQuizRepeat.value"
                      :error-messages="
                        formData.questionsInQuizRepeat.errorMessage
                      "
                      variant="outlined"
                      :rules="formData.questionsInQuizRepeat.rules"
                      density="compact"
                      @input="clearErrors('questionsInQuizRepeat')"
                    ></v-text-field>
                    <p v-else>
                      {{ formData.questionsInQuizRepeat.value }}
                    </p>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-end">
                    <v-btn
                      variant="text"
                      @click="profileChanged('questionsInQuizRepeat')"
                    >
                      {{
                        formData.questionsInQuizRepeat.mode ? "Save" : "Edit"
                      }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>

        <thumbnail-form />

        <reset-password-form />
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import * as auth from "@/services/auth/auth.ts";
import { updateProfile } from "@/services/auth/auth.ts";
import { IFormField, IValidationError } from "@/types";
import Breadcrumbs, { ICrumb } from "@/components/Breadcrumbs.vue";
import ResetPasswordForm from "@/modules/profile/components/ResetPasswordForm.vue";
import ThumbnailForm from "@/modules/profile/components/ThumbnailForm.vue";

interface IFormFieldProfile extends IFormField {
  mode?: boolean;
}

interface IProfileForm {
  questionsInQuiz: IFormFieldProfile;
  questionsInQuizRepeat: IFormFieldProfile;
  password: IFormFieldProfile;
  repeatPassword: IFormFieldProfile;
}

const breadcrumbsItems: ICrumb[] = [
  {
    title: "Quiz",
    to: "/quiz",
  },
  {
    title: "Profile",
    disabled: true,
  },
];

const authInfo = auth.authorizedUser;

const form = ref();

const formData: IProfileForm = reactive({
  questionsInQuiz: {
    value: authInfo.questionsInQuiz,
    mode: false,
    errorMessage: "",
    rules: [(v: string) => !!v || "Field can't be empty"],
  },
  questionsInQuizRepeat: {
    value: authInfo.questionsInQuizRepeat,
    mode: false,
    errorMessage: "",
    rules: [(v: string) => !!v || "Field can't be empty"],
  },
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

const userName = computed(() => {
  if (authInfo) return authInfo.name;
  return "";
});

const userEmail = computed(() => {
  if (authInfo) return authInfo.email;
  return "";
});

const clearErrors = (key: string) => {
  const target = formData[key as keyof IProfileForm];
  target.errorMessage = "";
};

const profileChanged = async (key: string) => {
  const target = formData[key as keyof IProfileForm];

  if (!target.mode) {
    target.mode = true;
    return;
  }
  try {
    await updateProfile({
      [key]: target.value,
    });
    target.mode = false;
  } catch (err: unknown) {
    if ((err as IValidationError).fields) {
      if ((err as IValidationError).fields.questionsInQuiz) {
        target.errorMessage = (err as IValidationError).fields.questionsInQuiz;
      }
      return;
    }
  }
};
</script>
