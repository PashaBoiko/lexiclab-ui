import { computed, reactive } from "vue";
import { statisticRDO } from "@/services/rdo/statistic.ts";
import errorHandler from "@/utils/error-handler.ts";

export interface IStatisticModel {
  word: number;
  quiz_completed: number;
  repeat_completed: number;
  date: Date;
}

interface IStatisticState {
  _id: string;
  statistics: IStatisticModel[];
}

const state: IStatisticState = reactive({
  _id: "",
  statistics: [],
});

export const getState = computed(() => {
  return state;
});

export const setState = (payload: IStatisticState) => {
  const { _id, statistics } = payload;
  state._id = _id;
  state.statistics = statistics;
};

export const fetchItems = async () => {
  try {
    const data = await statisticRDO.get();
    if ("statistics" in data) {
      setState(data);
    }
    return state;
  } catch (err: unknown) {
    errorHandler(err);
  }
};
