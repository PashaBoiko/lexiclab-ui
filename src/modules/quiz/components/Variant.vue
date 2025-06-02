<script setup lang="ts">
import { Ref, ref, onMounted, computed } from "vue";
import * as auth from "@/services/auth/auth.ts";
import * as configStorage from "@/storage/config.ts";

const authInfo = auth.authorizedUser;
const questionLanguageKey: Ref<string> = ref("");
const answerLanguageKey: Ref<string> = ref("");
const quizType: Ref<string> = ref("selectQuestion");
const showDescription: Ref<boolean> = ref(false);

const config = configStorage.getState.value;

questionLanguageKey.value = authInfo.foreignLanguage;
answerLanguageKey.value = authInfo.nativeLanguage;

const emit = defineEmits([
  "swapLanguages",
  "selectQuizType",
  "triggerDescription",
]);

const isFromNativeToForeign = computed(() => {
  return authInfo.foreignLanguage === questionLanguageKey.value;
});

onMounted(() => {
  emit("selectQuizType", quizType.value);
});

function swapLanguages() {
  const temporaryKeyStorage = questionLanguageKey.value;
  questionLanguageKey.value = answerLanguageKey.value;
  answerLanguageKey.value = temporaryKeyStorage;

  //Reset showDescription option
  showDescription.value = false;

  emit("swapLanguages", {
    questionKey: questionLanguageKey.value,
    answerKey: answerLanguageKey.value,
  });
}

function selectQuizType(value: string) {
  emit("selectQuizType", value);
}

function triggerDescription() {
  emit("triggerDescription", showDescription.value);
}
</script>

<template>
  <div>
    <v-row>
      <v-col cols="4">{{ questionLanguageKey }}</v-col>
      <v-col cols="4">
        <v-btn variant="outlined" @click="swapLanguages"> Swap </v-btn>
      </v-col>
      <v-col cols="4">{{ answerLanguageKey }}</v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10">
        <v-select
          v-model="quizType"
          @update:modelValue="selectQuizType"
          label="Quiz type"
          :items="config.questionTypes"
        ></v-select>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" v-if="isFromNativeToForeign">
      <v-col cols="12" sm="10">
        <v-checkbox
          v-model="showDescription"
          label="Description in options"
          @change="triggerDescription"
        ></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>
