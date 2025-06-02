<script setup lang="ts">
import useQuestionBase from "../../logic/question/questionBase.ts";
import { IQuestion } from "../../types";

const props = defineProps<{
  question: IQuestion;
}>();

const emit = defineEmits(["answerQuestion", "skipQuestion"]);

const {
  answer,
  questionText,
  isAnswerAvailable,
  answerQuestion,
  skipQuestion,
} = useQuestionBase({
  props,
  emit,
});
</script>

<template>
  <div>
    <h4 class="text-h4 text-center mb-10">{{ questionText }}</h4>

    <v-text-field v-model="answer" required></v-text-field>

    <div class="text-center mt-2">
      <v-btn
        @click="answerQuestion"
        :disabled="isAnswerAvailable"
        class="mx-3"
        type="button"
        text="Answer"
      ></v-btn>

      <v-btn
        @click="skipQuestion"
        type="button"
        text="Don't know"
        class="mx-3"
      ></v-btn>
    </div>
  </div>
</template>
