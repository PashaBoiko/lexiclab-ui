<script setup lang="ts">
  import { computed } from "vue";
  import { IQuizState } from "../../logic/quiz/types.ts";

  const props = defineProps<{
    quizState: IQuizState;
  }>();

  const score = computed(() => props.quizState.score);

</script>

<template>
  <h2 class="text-h2 text-center mb-16">Correct answers {{ score }}</h2>
</template>