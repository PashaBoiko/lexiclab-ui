<script setup lang="ts">
import { computed } from "vue";
import useQuestionBase from "../../../logic/quiz/question/questionBase.ts";
import { IQuestion } from "../../../logic/quiz/types.ts";
import { questions, answerKey } from "../../../logic/quiz/quizState.ts";
import { shuffle } from "../../../utils/functions.ts";

const props = defineProps<{
  question: IQuestion;
}>();

const emit = defineEmits(['answerQuestion'])

const { answer, questionText, isAnswerAvailable, answerQuestion } = useQuestionBase({
  props,
  emit
});

const allAnswers = computed(() => {
  return questions.value.map((question) => {
    return question[answerKey.value];
  });
});

const correctAnswers = computed(() => {
  return props.question[answerKey.value];
});

const answers = computed(() => {
  const variants = shuffle(allAnswers.value).filter((item) => {
    return item !== correctAnswers.value;
  }).splice(0, 2);
  variants.push(correctAnswers.value);
  return shuffle(variants);
});

const selectAnswer = (selectedAnswer: string) => {
  answer.value = selectedAnswer;
}

const selectedAnswer = (selectedAnswer: string) => {
  return answer.value === selectedAnswer ? "primary" : "";
};

</script>

<template>
  <div>
    <h4 class="text-h4 text-center mb-10">{{ questionText }}</h4>

    <ul>
      <li v-for="answerOptions in answers"
          :key="answerOptions"
      >
        <v-btn
          @click="selectAnswer(answerOptions)"
          type="button"
          class="my-2"
          width="100%"
          :text="answerOptions"
          :color="selectedAnswer(answerOptions)"
          variant="elevated"
        />
      </li>
    </ul>

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