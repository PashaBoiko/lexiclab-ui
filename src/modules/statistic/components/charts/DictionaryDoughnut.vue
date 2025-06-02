<template>
  <canvas id="pieBar" width="200px" height="200px"></canvas>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

const props = defineProps({
  amountWordsInDictionary: Number,
  amountWordsInArchive: Number,
});

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title);

onMounted(() => {
  const data = {
    labels: ["Dictionary", "Archive"],
    datasets: [
      {
        data: [props.amountWordsInDictionary, props.amountWordsInArchive],
        backgroundColor: ["#3573e5", "#198754"],
        hoverBackgroundColor: ["#3573e5", "#198754"],
      },
    ],
  };

  const ctx = (
    document.getElementById("pieBar") as HTMLCanvasElement
  ).getContext("2d") as CanvasRenderingContext2D;

  new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
    },
  });
});
</script>
