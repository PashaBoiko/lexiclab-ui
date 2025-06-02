<template>
  <div>
    <v-row>
      <v-col cols="4" align-self="center">
        <div class="l-statistic-summary_item">
          <div class="l-statistic-summary_icon">
            <i class="fa-solid fa-chart-line"></i>
          </div>
          <div>
            <p class="l-statistic-summary_number">
              {{ amountWordsInDictionary }}
            </p>
            <span class="l-statistic-summary_text">Dictionary</span>
          </div>
        </div>
      </v-col>
      <v-col cols="4" align-self="center">
        <div class="l-statistic-summary_item">
          <div class="l-statistic-summary_icon">
            <i class="fa-solid fa-chart-column"></i>
          </div>
          <div>
            <p class="l-statistic-summary_number">
              {{ amountWordsInArchive }}
            </p>
            <span class="l-statistic-summary_text"> Archive </span>
          </div>
        </div>
      </v-col>
      <v-col cols="4" align-self="center">
        <div v-if="isDictionaryStateAvailable">
          <dictionary-doughnut
            :amount-words-in-dictionary="amountWordsInDictionary"
            :amount-words-in-archive="amountWordsInArchive"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { dictionaryStorage, configStorage } from "@/storage";
import { toggleErrorToast } from "@/services/notification";
import { computed } from "vue";
import DictionaryDoughnut from "@/modules/statistic/components/charts/DictionaryDoughnut.vue";

const { limitOfCorrectAnswers } = configStorage.getState.value;
const dictionaryState = dictionaryStorage.getState.value;

const amountWordsInDictionary = computed(() => {
  return dictionaryState.dictionary.filter((item) => {
    return item.iteration < limitOfCorrectAnswers;
  }).length;
});

const amountWordsInArchive = computed(() => {
  return dictionaryState.dictionary.length - amountWordsInDictionary.value;
});

const isDictionaryStateAvailable = computed(() => {
  return amountWordsInDictionary.value || amountWordsInArchive.value;
});

const created = async () => {
  try {
    await dictionaryStorage.fetchItems();
  } catch (err: unknown) {
    toggleErrorToast(err as string);
  }
};

created();
</script>
