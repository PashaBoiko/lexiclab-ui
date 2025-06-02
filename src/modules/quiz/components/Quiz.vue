<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ILanguages } from "@/types";
import {
  QUIZ_COLLECTION,
  STATUS_GAME,
  STATUS_PENDING,
} from "../logic/constans.ts";
//import BaseQuestion from "./questions/BaseQuestion.vue";
import SelectQuestion from "./questions/SelectQuestion.vue";
import PendingState from "@/modules/quiz/components/PendingState.vue";
import Stepper from "./Stepper.vue";

import { fetchItems } from "@/storage/dictionary.ts";
import * as configStorage from "@/storage/config.ts";
import { toggleErrorToast } from "@/services/notification";
import { IError } from "@/types/error.ts";
import { shuffle } from "@/utils/functions.ts";

import {
  quizState,
  quizStatus,
  quizType,
  resetQuiz,
  setAllQuestions,
  setAnswerKey,
  setQuestionKey,
  setQuestions,
  setQuizType,
  setShowDescription,
  setStatus,
} from "@/modules/quiz/logic/quizState.ts";
import { authorizedUser } from "@/services/auth/auth.ts";
import ScoreState from "@/modules/quiz/components/ScoreState.vue";
import GameState from "@/modules/quiz/components/GameState.vue";
import Breadcrumbs, { ICrumb } from "@/components/Breadcrumbs.vue";
import { IDictionaryModel } from "@/services/rdo/dictionary.ts";

const { questionsInQuiz, questionsInQuizRepeat } = authorizedUser;

const breadcrumbsItems: ICrumb[] = [
  {
    title: "Dictionary",
    to: "/dictionary",
  },
  {
    title: "Quiz",
    disabled: true,
  },
];

const quizAvailability = ref(true);
const quizQuestionSet = ref(QUIZ_COLLECTION["DICTIONARY"]);

const quizComponent = computed(() => {
  const matchComponents = [
    // {
    //   key: "inputQuestion",
    //   component: BaseQuestion,
    // },
    {
      key: "selectQuestion",
      component: SelectQuestion,
    },
  ];
  const result = matchComponents.find((item) => item.key === quizType.value);

  if (result) return result.component;

  return SelectQuestion;
});

onMounted(() => {
  resetQuiz();
});

async function swapLanguages({
  questionKey,
  answerKey,
}: {
  questionKey: ILanguages;
  answerKey: ILanguages;
}) {
  setQuestionKey(questionKey);
  setAnswerKey(answerKey);
}

function selectQuizType(quizType: string) {
  if (!quizType) throw Error("[Quiz]: quiz type is empty");
  setQuizType(quizType);
}

function filterQuestions(dictionary: IDictionaryModel[]) {
  const { limitOfCorrectAnswers } = configStorage.getState.value;

  if (quizQuestionSet.value === QUIZ_COLLECTION.DICTIONARY) {
    return dictionary.filter((item: IDictionaryModel) => {
      return item.iteration < limitOfCorrectAnswers;
    });
  }

  return dictionary.filter((item: IDictionaryModel) => {
    return item.iteration >= limitOfCorrectAnswers;
  });
}

function finalSetOfQuestions(questions: IDictionaryModel[]) {
  if (quizQuestionSet.value === QUIZ_COLLECTION.DICTIONARY) {
    return shuffle(questions).slice(0, questionsInQuiz);
  }

  if (quizQuestionSet.value === QUIZ_COLLECTION.ARCHIVE) {
    return shuffle(questions).slice(0, questionsInQuizRepeat);
  }

  return [];
}

async function startRepeatQuiz() {
  //Take collection from the ARCHIVE
  quizQuestionSet.value = QUIZ_COLLECTION.ARCHIVE;
  //Prevent saving the result
  quizState.saveResult = false;

  await startTheQuiz();
}

function triggerDescription(value: boolean) {
  setShowDescription(value);
}

async function startTheQuiz() {
  try {
    const { dictionary } = await fetchItems();

    if (dictionary.length < questionsInQuiz) {
      quizAvailability.value = false;
      return;
    }

    const filteredQuestions = filterQuestions(dictionary);

    if (filteredQuestions.length < questionsInQuiz) {
      quizAvailability.value = false;
      return;
    }

    const allQuestions = shuffle(filteredQuestions);
    let questions = finalSetOfQuestions(filteredQuestions);

    setStatus(STATUS_GAME);
    setQuestions(questions);
    setAllQuestions(allQuestions);
  } catch (err: unknown) {
    toggleErrorToast((err as IError).message);
  }
}
</script>

<template>
  <breadcrumbs :items="breadcrumbsItems" v-if="quizStatus === STATUS_PENDING" />
  <stepper :quiz-state="quizState"></stepper>
  <v-row class="flex-grow-0" v-if="quizStatus === STATUS_PENDING">
    <v-col cols="12" class="text-right">
      <v-btn @click="startRepeatQuiz">Repeat</v-btn>
    </v-col>
  </v-row>
  <v-row align="center">
    <v-col cols="12">
      <v-row justify="center">
        <v-col cols="12" lg="6" md="8">
          <div v-if="quizStatus !== STATUS_PENDING">
            <game-state :quiz-component="quizComponent" />
          </div>

          <pending-state
            :quiz-availability="quizAvailability"
            :quiz-question-set="quizQuestionSet"
            @swap-languages="swapLanguages"
            @select-quiz-type="selectQuizType"
            @start-the-game="startTheQuiz"
            @trigger-description="triggerDescription"
          />
        </v-col>
      </v-row>
      <v-row v-if="quizStatus !== STATUS_PENDING" justify="center">
        <v-col cols="12" lg="8" md="10">
          <score-state :quiz-status="quizStatus" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
