<script setup lang="ts">
  import useQuestionBase from "../../../logic/quiz/question/questionBase.ts";
  import { IQuestion } from "../../../logic/quiz/types.ts";

  const props = defineProps<{
    question: IQuestion;
  }>();

  const emit = defineEmits(['answerQuestion'])

  const { answer, questionText, isAnswerAvailable, answerQuestion } = useQuestionBase({
    props,
    emit
  });
</script>

<template>
  <div>
    <h4 class="text-h4 text-center mb-10">{{ questionText }}</h4>

    <v-text-field
        v-model="answer"
        required
    ></v-text-field>

    <div class="text-center">
      <v-btn
          @click="answerQuestion"
          :disabled="isAnswerAvailable"
          type="button"
          class="mt-2"
          text="Answer"
      ></v-btn>
    </div>
  </div>
</template>