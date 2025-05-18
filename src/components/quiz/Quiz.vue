<script setup lang="ts">
  import { computed, ref, onMounted } from "vue";
  import { ILanguages } from "../../types";
  import { STATUS_SCORE, STATUS_GAME, STATUS_PENDING } from "../../logic/quiz/constans.ts";
  import { IQuestion } from "../../logic/quiz/types.ts";
  import BaseQuestion from "./questions/BaseQuestion.vue";
  import SelectQuestion from "./questions/SelectQuestion.vue";
  import Variant from "./Variant.vue";
  import Stepper from "./Stepper.vue";
  import { fetchItems } from "../../storage/dictionary.ts";
  import * as configStorage from "../../storage/config.ts";
  import { dictionaryStorage } from "../../storage";
  import {toggleErrorAlert} from "../../services/alert";
  import { IError } from "../../types/error.ts";
  import { shuffle } from "../../utils/functions.ts";

  import {
    quizState,
    quizStatus,
    currentQuestion,
    quizType,
    setStatus,
    setQuestionKey,
    setAnswerKey,
    setQuestions,
    setQuizType,
    increaseScore,
    increaseQuestionIndex,
    resetQuiz,
    processResult
  } from "../../logic/quiz/quizState.ts";

  const { quizAmountOfQuestions } = configStorage.getState.value;

  const quizAvailability = ref(true);

  const quizComponent = computed(() => {
    const matchComponents = [
      {
        key: "inputQuestion",
        component: BaseQuestion,
      },
      {
        key: "selectQuestion",
        component: SelectQuestion,
      }
    ];
    const result = matchComponents.find((item) => item.key === quizType.value);

    if (result) return result.component;

    return null;
  });

  onMounted(() => {
    resetQuiz();
  });

  async function swapLanguages({ questionKey, answerKey}: { questionKey: ILanguages; answerKey: ILanguages }) {
    setQuestionKey(questionKey);
    setAnswerKey(answerKey);
  }

  function selectQuizType(quizType: string) {
    setQuizType(quizType);
  }

  async function answer(answer: string) {
    // If the answer is correct
    if (currentQuestion.value[quizState.answerKey] == answer) {
      processQuestionResult(currentQuestion.value);
      increaseScore();
    }

    if (quizState.currentQuestionIndex < quizState.questions.length-1) {
      increaseQuestionIndex();
      return;
    }

    //The finish of the quiz
    setStatus(STATUS_SCORE)
    await processGameResult();
  }

  function processQuestionResult(currentQuestion: IQuestion) {
    processResult(currentQuestion._id);
  }

  async function processGameResult() {
    try {
      if (quizState.result.length === 0) return;

      await dictionaryStorage.quizSave({
        ids: quizState.result
      });

    } catch (err) {
      toggleErrorAlert((err as IError).message);
    }
  }

  async function startTheGame() {
    try {
      const { dictionary } = await fetchItems();

      if (dictionary.length < quizAmountOfQuestions) {
        quizAvailability.value = false;
        return;
      }

      const { limitOfCorrectAnswers } = configStorage.getState.value;
      const filteredQuestions = dictionary.filter((item) => {
        return item.iteration < limitOfCorrectAnswers;
      });
      const questions = shuffle(filteredQuestions).slice(0, quizAmountOfQuestions);

      setStatus(STATUS_GAME)
      setQuestions(questions);
    } catch (err) {
      toggleErrorAlert((err as IError).message);
    }
  }
</script>

<template>
  <v-row align="center"
         justify="center"
  >
    <v-col
        cols="12"
        lg="6"
        md="8"
        align-self="center"
    >
      <div v-if="quizStatus !== STATUS_PENDING">

        <stepper :quiz-state="quizState"></stepper>

        <div v-if="quizStatus !== STATUS_SCORE">
          <div v-if="quizComponent">
            <component :is="quizComponent"
                       :quiz-state="quizState"
                       :question="currentQuestion"
                       @answer-question="answer"
            />
          </div>
        </div>
        <div class="text-center" v-else>
          <v-btn @click="resetQuiz">Reset</v-btn>
        </div>
      </div>

      <div class="text-center" v-if="quizStatus === STATUS_PENDING">
        <h3 class="text-h4 mb-6">Quiz</h3>

        <template v-if="quizAvailability">
          <Variant
            class="mb-8"
            @swap-languages="swapLanguages"
            @select-quiz-type="selectQuizType"
          />

          <v-btn @click="startTheGame">Start Quiz</v-btn>
        </template>
        <template v-else>
          <h3 class="text-h6 text-center">For starting quiz you need to add at least 8 words in dictionary section</h3>
        </template>
      </div>
    </v-col>
  </v-row>
</template>

