<template>
  <div class="text-center" v-if="isScoreStatus">
    <result
      :question-key="questionKey"
      :answer-key="answerKey"
      :incorrect-questions="incorrectQuestions"
      :questions="questions"
    ></result>

    <v-btn @click="resetQuiz">Try again</v-btn>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { STATUS_SCORE } from "@/modules/quiz/logic/constans.ts";
import {
  answerKey,
  questionKey,
  incorrectQuestions,
  questions,
  resetQuiz,
} from "@/modules/quiz/logic/quizState.ts";

import Result from "@/modules/quiz/components/Result.vue";

const props = defineProps<{
  quizStatus: string;
}>();

const isScoreStatus = computed(() => {
  return props.quizStatus === STATUS_SCORE;
});
</script>
