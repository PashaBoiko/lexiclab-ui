<script setup lang="ts">
import { Ref, ref, onMounted } from "vue";
import { authorizedUser } from "../../services/auth/auth.ts";
import * as configStorage from "../../storage/config.ts";

const user = authorizedUser.get();
const questionLanguageKey: Ref<string> = ref("");
const answerLanguageKey: Ref<string> = ref("");
const quizType: Ref<string> = ref("selectQuestion");

const config = configStorage.getState.value;

if (user) {
  questionLanguageKey.value = user.user.foreignLanguage;
  answerLanguageKey.value = user.user.nativeLanguage;
}

const emit = defineEmits(['swapLanguages', 'selectQuizType'])

onMounted(() => {
  emit('selectQuizType', quizType.value)
});

function swapLanguages() {
  const temporaryKeyStorage = questionLanguageKey.value;
  questionLanguageKey.value = answerLanguageKey.value;
  answerLanguageKey.value = temporaryKeyStorage;

  emit('swapLanguages', {
    questionKey: questionLanguageKey.value,
    answerKey: answerLanguageKey.value,
  });
}

function selectQuizType(value: string) {
  emit('selectQuizType', value)
}

</script>

<template>
  <div>
    <v-row>
      <v-col cols="4">{{ questionLanguageKey }}</v-col>
      <v-col cols="4">
        <v-btn
            variant="outlined"
            @click="swapLanguages"
        >
          Swap
        </v-btn>
      </v-col>
      <v-col cols="4">{{ answerLanguageKey }}</v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="10">
        <v-select
            v-model="quizType"
            @update:modelValue="selectQuizType"
            label="Quiz type"
            :items="config.questionTypes"
        ></v-select>
      </v-col>
    </v-row>
  </div>
</template>