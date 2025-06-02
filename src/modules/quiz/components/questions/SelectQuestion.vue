<script setup lang="ts">
import { computed } from "vue";
import useQuestionBase from "@/modules/quiz/logic/question/questionBase.ts";
import { IQuestion } from "@/modules/quiz/types";
import {
  allQuestions,
  answerKey,
  showDescription,
} from "@/modules/quiz/logic/quizState.ts";
import { shuffle } from "@/utils/functions.ts";

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

const allAnswers = computed(() => {
  return allQuestions.value.map((question) => {
    return {
      answer: question[answerKey.value],
      description: question.description,
    };
  });
});

const correctAnswers = computed(() => {
  return {
    answer: props.question[answerKey.value],
    description: props.question.description,
  };
});

const answers = computed(() => {
  const variants = shuffle(allAnswers.value)
    .filter((item) => item.answer !== correctAnswers.value.answer)
    .splice(0, 2);
  variants.push(correctAnswers.value);
  return shuffle(variants);
});

const selectAnswer = (selectedAnswer: string) => {
  answer.value = selectedAnswer;
};

const selectedAnswer = (selectedAnswer: string) => {
  return answer.value === selectedAnswer ? "primary" : "";
};

/** ToDo */
const answerText = (answerOptions: { answer: string; description: string }) => {
  if (showDescription.value)
    return answerOptions.description || answerOptions.answer;
  return answerOptions.answer;
};
</script>

<template>
  <div>
    <h5 class="text-h5 text-center mb-10">
      What translation is for word - <b>{{ questionText }}</b>
    </h5>

    <ul>
      <li v-for="answerOptions in answers" :key="answerOptions.answer">
        <v-btn
          @click="selectAnswer(answerOptions.answer)"
          type="button"
          class="my-2 select-answers"
          width="100%"
          :text="answerText(answerOptions)"
          :color="selectedAnswer(answerOptions.answer)"
          variant="elevated"
        />
      </li>
    </ul>

    <div class="text-center mt-2">
      <v-btn
        @click="answerQuestion"
        :disabled="isAnswerAvailable"
        type="button"
        class="mx-3"
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

<style lang="scss">
.select-answers {
  height: auto !important;
  min-height: calc(var(--v-btn-height) + 0px);

  .v-btn__content {
    white-space: normal !important;
  }
}
</style>
