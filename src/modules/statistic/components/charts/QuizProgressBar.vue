<template>
  <v-row class="words-progress-bar">
    <v-col cols="12" align-self="center">
      <div class="d-flex justify-center">
        <v-btn class="mx-2" @click="generateWeekStatistic">Week</v-btn>
        <v-btn class="mx-2" @click="generateMonthStatistic">Month</v-btn>
        <v-btn class="mx-2" @click="generateYearStatistic">Year</v-btn>
      </div>
    </v-col>
    <v-col cols="12">
      <div class="d-flex justify-center">
        <canvas id="quizProgressBar" width="400" height="200"></canvas>
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

import { statisticStorage } from "@/storage";
import { onMounted } from "vue";
import {
  getAmountDaysOfCurrentMonth,
  generateYearDataset,
  generateMonthDataset,
  generateWeekDataset,
  generateBar,
  MONTHS,
  WEEKS,
} from "@/modules/statistic/helpers";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title);

let ctx!: CanvasRenderingContext2D;
let chart!: Chart;

onMounted(() => {
  ctx = (
    document.getElementById("quizProgressBar") as HTMLCanvasElement
  ).getContext("2d") as CanvasRenderingContext2D;

  generateWeekStatistic();
});

function generateYearStatistic() {
  const { statistics } = statisticStorage.getState.value;

  const dataset = generateYearDataset(statistics, [
    "quiz_completed",
    "repeat_completed",
  ]);

  console.log(dataset);

  const data = {
    labels: MONTHS,
    datasets: [
      {
        // @ts-ignore
        data: dataset.map((item) => item["quiz_completed"]),
        backgroundColor: "#198754",
        label: "Quiz completed",
      },
      {
        // @ts-ignore
        data: dataset.map((item) => item["repeat_completed"]),
        backgroundColor: "#3573e5",
        label: "Repeat completed",
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

  const dataset = generateMonthDataset(statistics, [
    "quiz_completed",
    "repeat_completed",
  ]);

  const data = {
    labels: labels,
    datasets: [
      {
        // @ts-ignore
        data: dataset.map((item) => item["quiz_completed"]),
        backgroundColor: "#198754",
        label: "Quiz completed",
      },
      {
        // @ts-ignore
        data: dataset.map((item) => item["repeat_completed"]),
        backgroundColor: "#3573e5",
        label: "Repeat completed",
      },
    ],
  };

  chart = generateBar(ctx, chart, data);
}

function generateWeekStatistic() {
  const { statistics } = statisticStorage.getState.value;

  const dataset = generateWeekDataset(statistics, [
    "quiz_completed",
    "repeat_completed",
  ]);

  const data = {
    labels: WEEKS,
    datasets: [
      {
        // @ts-ignore
        data: dataset.map((item) => item["quiz_completed"]),
        backgroundColor: "#198754",
        label: "Quiz completed",
      },
      {
        // @ts-ignore
        data: dataset.map((item) => item["repeat_completed"]),
        backgroundColor: "#3573e5",
        label: "Repeat completed",
      },
    ],
  };

  chart = generateBar(ctx, chart, data);
}
</script>
