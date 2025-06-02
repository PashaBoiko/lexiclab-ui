<template>
  <div v-if="isGameStatus">
    <div v-if="props.quizComponent">
      <component
        :is="props.quizComponent"
        :quiz-state="quizState"
        :question="currentQuestion"
        @answer-question="answer"
        @skip-question="skipQuestion"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import {
  quizStatus,
  currentQuestion,
  increaseQuestionIndex,
  increaseScore,
  processResult,
  quizState,
  setIncorrectQuestions,
  setStatus,
  saveResult,
} from "@/modules/quiz/logic/quizState.ts";
import { STATUS_GAME, STATUS_SCORE } from "@/modules/quiz/logic/constans.ts";
import { IQuestion } from "@/modules/quiz/types";
import { dictionaryStorage } from "@/storage";
import { toggleErrorToast } from "@/services/notification";
import { IError } from "@/types";
import { statisticRDO } from "@/services/rdo/statistic.ts";

const props = defineProps<{
  quizComponent: any;
}>();

const isGameStatus = computed(() => {
  return quizStatus.value === STATUS_GAME;
});

async function answer(answer: string) {
  // If the answer is correct
  if (currentQuestion.value[quizState.answerKey] == answer) {
    processQuestionResult(currentQuestion.value);
    increaseScore();
  } else {
    setIncorrectQuestions(currentQuestion.value);
  }

  if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
    increaseQuestionIndex();
    return;
  }

  await processGameResult();
}

async function processGameResult() {
  if (!(quizState.currentQuestionIndex >= quizState.questions.length - 1))
    return;

  //The finish of the quiz
  setStatus(STATUS_SCORE);
  try {
    if (quizState.result.length === 0) return;

    //The property is controlled the saving the result of the quiz
    if (!saveResult.value) {
      statisticRDO.post({
        repeat_completed: 1,
      });
      return;
    }

    await dictionaryStorage.quizSave({
      ids: quizState.result,
    });
  } catch (err: unknown) {
    toggleErrorToast((err as IError).message);
  }
}

function processQuestionResult(currentQuestion: IQuestion) {
  processResult(currentQuestion._id);
}

async function skipQuestion() {
  if (quizState.currentQuestionIndex <= quizState.questions.length - 1) {
    setIncorrectQuestions(currentQuestion.value);
    increaseQuestionIndex();
  }

  await processGameResult();
}
</script>
