<script setup lang="ts">
import { computed } from "vue";
import { IQuestion } from "../types";
import { ILanguages } from "@/types";
import { showDescription } from "@/modules/quiz/logic/quizState.ts";

const props = defineProps<{
  questions: IQuestion[];
  incorrectQuestions: IQuestion[];
  questionKey: ILanguages;
  answerKey: ILanguages;
}>();

const incorrectAnswers = computed(() => {
  return props.incorrectQuestions.length;
});

const correctAnswers = computed(() => {
  return props.questions.length - incorrectAnswers.value;
});
</script>

<template>
  <div>
    <h4 class="text-h4 text-bold mb-6">Result</h4>

    <h5 class="text-h5 mb-6" v-if="correctAnswers">
      Correct answers - <span class="text-green">{{ correctAnswers }}</span>
    </h5>

    <h5 class="text-h5 mb-10" v-if="incorrectAnswers">
      Incorrect answers - <span class="text-red">{{ incorrectAnswers }}</span>
    </h5>

    <ul class="mb-10" v-if="incorrectAnswers">
      <li v-for="question in props.incorrectQuestions">
        <v-row>
          <v-col cols="5" align-self="center">{{
            question[props.questionKey as keyof IQuestion]
          }}</v-col>
          <v-col cols="2" align-self="center">-</v-col>
          <v-col cols="5" align-self="center">
            <template v-if="showDescription">
              {{
                question.description ||
                question[props.answerKey as keyof IQuestion]
              }}
            </template>
            <template v-else>
              {{ question[props.answerKey as keyof IQuestion] }}
            </template>
          </v-col>
        </v-row>
      </li>
    </ul>
  </div>
</template>
