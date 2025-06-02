<template>
  <div class="text-center" v-if="isPendingState">
    <h3 class="text-h4 mb-6">Quiz</h3>

    <template v-if="props.quizAvailability">
      <Variant
        class="mb-8"
        @swap-languages="swapLanguages"
        @select-quiz-type="selectQuizType"
        @trigger-description="triggerDescription"
      />

      <v-btn @click="startTheGame">Start Quiz</v-btn>
    </template>
    <template v-else>
      <h3 class="text-h6 text-center">
        {{ unavailableQuizMessage }}
      </h3>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { quizStatus } from "@/modules/quiz/logic/quizState.ts";
import {
  QUIZ_COLLECTION,
  STATUS_PENDING,
} from "@/modules/quiz/logic/constans.ts";
import Variant from "@/modules/quiz/components/Variant.vue";
import { authorizedUser } from "@/services/auth/auth.ts";

const { questionsInQuiz, questionsInQuizRepeat } = authorizedUser;

const props = defineProps<{
  quizAvailability: boolean;
  quizQuestionSet: string;
}>();

const emit = defineEmits([
  "swapLanguages",
  "selectQuizType",
  "startTheGame",
  "triggerDescription",
]);

const isPendingState = computed(() => {
  return quizStatus.value === STATUS_PENDING;
});

const unavailableQuizMessage = computed(() => {
  if (props.quizQuestionSet === QUIZ_COLLECTION["ARCHIVE"])
    return `For starting quiz you need to have at least ${questionsInQuizRepeat} words in archive section`;
  if (props.quizQuestionSet === QUIZ_COLLECTION["DICTIONARY"])
    return `For starting quiz you need to add at least ${questionsInQuiz} words to dictionary section`;
});

const swapLanguages = (params: unknown) => emit("swapLanguages", params);
const selectQuizType = (type: string) => emit("selectQuizType", type);
const startTheGame = () => emit("startTheGame");
const triggerDescription = (value: boolean) =>
  emit("triggerDescription", value);
</script>
