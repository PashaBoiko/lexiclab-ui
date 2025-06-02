import { Chart } from "chart.js";
import { IStatisticModel } from "@/storage/statistic.ts";
import { getDaysInMonth, getWeekNumberFromStartOfYear } from "@/utils/date.ts";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getAmountDaysOfCurrentMonth = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return getDaysInMonth(currentYear, currentMonth);
};

export const generateYearDataset = (
  statistics: IStatisticModel[],
  keys: string[],
) => {
  if (!keys.length) return [];

  const dataset = Array.from({ length: 12 }, (_) => {
    return keys.reduce((result: Record<string, number>, key: string) => {
      result[key] = 0;
      return result;
    }, {});
  });

  statistics.forEach((item) => {
    const month = new Date(item.date).getMonth();
    keys.forEach((key: string) => {
      dataset[month - 1][key] +=
        item[key as keyof Omit<IStatisticModel, "date">];
    });
  });

  if (keys.length === 1) {
    return dataset.map((item) => item[keys[0]]);
  }

  return dataset;
};

export const generateMonthDataset = (
  statistics: IStatisticModel[],
  keys: string[],
) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const amountDaysInMonth = getAmountDaysOfCurrentMonth();

  const dataset = Array.from({ length: amountDaysInMonth }, (_) => {
    return keys.reduce((result: Record<string, number>, key: string) => {
      result[key] = 0;
      return result;
    }, {});
  });

  statistics.forEach((item) => {
    const statisticDate = new Date(item.date);

    if (
      statisticDate.getMonth() === currentMonth &&
      statisticDate.getFullYear() === currentYear
    ) {
      keys.forEach((key: string) => {
        dataset[statisticDate.getDate() - 1][key] +=
          item[key as keyof Omit<IStatisticModel, "date">];
      });
    }
  });

  if (keys.length === 1) {
    return dataset.map((item) => item[keys[0]]);
  }

  return dataset;
};

export const generateWeekDataset = (
  statistics: IStatisticModel[],
  keys: string[],
) => {
  const currentWeek = getWeekNumberFromStartOfYear(new Date());

  const dataset = Array.from({ length: 7 }, (_) => {
    return keys.reduce((result: Record<string, number>, key: string) => {
      result[key] = 0;
      return result;
    }, {});
  });

  statistics.forEach((item) => {
    const week = getWeekNumberFromStartOfYear(new Date(item.date));
    if (currentWeek === week) {
      keys.forEach((key: string) => {
        dataset[new Date(item.date).getDay()][key] +=
          item[key as keyof Omit<IStatisticModel, "date">];
      });
    }
  });

  if (keys.length === 1) {
    return dataset.map((item) => item[keys[0]]);
  }

  return dataset;
};

export const generateBar = (
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  data: any,
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (chart) chart.destroy();
  return new Chart(ctx, {
    type: "bar",
    data: {
      ...data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    },
  });
};
