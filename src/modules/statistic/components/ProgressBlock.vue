<template>
  <div>
    <v-tabs v-model="tabState" align-tabs="center">
      <v-tab value="quiz">Quiz</v-tab>
      <v-tab value="newWords">New words</v-tab>
    </v-tabs>

    <div class="pa-6">
      <v-window v-model="tabState">
        <v-window-item value="newWords">
          <words-progress-bar v-if="dataFetched" />
        </v-window-item>

        <v-window-item value="quiz"
          ><quiz-progress-bar v-if="dataFetched"
        /></v-window-item>

        <v-window-item value="archive"> Archive </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { statisticStorage } from "@/storage";
import { toggleErrorToast } from "@/services/notification";
import WordsProgressBar from "@/modules/statistic/components/charts/WordsProgressBar.vue";
import QuizProgressBar from "@/modules/statistic/components/charts/QuizProgressBar.vue";

const dataFetched = ref(false);
const tabState = ref("quiz");

const created = async () => {
  try {
    dataFetched.value = !!(await statisticStorage.fetchItems());
  } catch (err: unknown) {
    toggleErrorToast(err as string);
  }
};

created();
</script>
