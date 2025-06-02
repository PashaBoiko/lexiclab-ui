<template>
  <v-row class="words-progress-bar">
    <v-col cols="12" align-self="center">
      <div class="d-flex justify-center">
        <v-btn @click="generateWeekStatistic" class="mx-2">Week</v-btn>
        <v-btn @click="generateMonthStatistic" class="mx-2">Month</v-btn>
        <v-btn @click="generateYearStatistic" class="mx-2">Year</v-btn>
      </div>
    </v-col>
    <v-col cols="12">
      <div class="d-flex justify-center">
        <canvas id="wordsProgressBar" width="400" height="200"></canvas>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { onMounted } from "vue";
import { statisticStorage } from "@/storage";
import {
  generateYearDataset,
  generateBar,
  WEEKS,
  MONTHS,
  getAmountDaysOfCurrentMonth,
  generateMonthDataset,
  generateWeekDataset,
} from "@/modules/statistic/helpers";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title);

let ctx!: CanvasRenderingContext2D;
let chart!: Chart;

onMounted(() => {
  ctx = (
    document.getElementById("wordsProgressBar") as HTMLCanvasElement
  ).getContext("2d") as CanvasRenderingContext2D;

  generateWeekStatistic();
});

function generateYearStatistic() {
  const { statistics } = statisticStorage.getState.value;

  const dataset = generateYearDataset(statistics, ["word"]);

  const data = {
    labels: MONTHS,
    datasets: [
      {
        data: dataset,
        backgroundColor: "#3573e5",
        label: "Words progress",
      },
    ],
  };

  chart = generateBar(ctx, chart, data);
}

function generateMonthStatistic() {
  const { statistics } = statisticStorage.getState.value;

  const labels = Array.from(
    { length: getAmountDaysOfCurrentMonth() },
    (_, i) => i + 1,
  );

  const dataset = generateMonthDataset(statistics, ["word"]);

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataset,
        backgroundColor: "#3573e5",
        label: "Words progress",
      },
    ],
  };

  chart = generateBar(ctx, chart, data);
}

function generateWeekStatistic() {
  const { statistics } = statisticStorage.getState.value;

  const dataset = generateWeekDataset(statistics, ["word"]);

  const data = {
    labels: WEEKS,
    datasets: [
      {
        data: dataset,
        backgroundColor: "#3573e5",
        label: "Words progress",
      },
    ],
  };

  chart = generateBar(ctx, chart, data);
}
</script>

<style lang="scss">
.words-progress-bar {
  canvas {
    height: 400px !important;
  }
}
</style>
