<script setup lang="ts">
import { computed } from "vue";
import { IQuizState } from "../types";
import { STATUS_GAME } from "@/modules/quiz/logic/constans.ts";

const props = defineProps<{
  quizState: IQuizState;
}>();

const currentQuestionIndex = computed(
  () => props.quizState.currentQuestionIndex,
);

const quizStatus = computed(() => props.quizState.status);

const questionsLength = computed(() => props.quizState.questions.length);

const percent = computed(() =>
  Math.round((currentQuestionIndex.value * 100) / questionsLength.value),
);
</script>

<template>
  <v-progress-linear
    v-if="quizStatus === STATUS_GAME"
    bg-color="#3A3F51"
    color="#f07f1c"
    :model-value="percent"
    height="6"
    class="mb-4"
  ></v-progress-linear>
</template>
