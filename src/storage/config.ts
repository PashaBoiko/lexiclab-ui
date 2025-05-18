import { reactive, computed, ComputedRef } from "vue";
import { configRDO, IQuestionType } from "../services/rdo/config.ts";
import errorHandler from "../utils/error-handler.ts";
import { ILanguageItem } from "../services/rdo/config.ts";

interface IConfigState {
  languages: ILanguageItem[];
  limitOfCorrectAnswers: number;
  quizAmountOfQuestions: number;
  questionTypes: IQuestionType[];
}

const state: IConfigState = reactive({
  languages: [],
  limitOfCorrectAnswers: 0,
  quizAmountOfQuestions: 0,
  questionTypes: [],
});

export const getState: ComputedRef<IConfigState> = computed(() => state);

export const setState = (payload: IConfigState) => {
  const { languages, limitOfCorrectAnswers, quizAmountOfQuestions, questionTypes } = payload;
  state.languages = languages;
  state.limitOfCorrectAnswers = limitOfCorrectAnswers;
  state.quizAmountOfQuestions = quizAmountOfQuestions;
  state.questionTypes = questionTypes;
}

export const fetchPublicConfig = async () => {
  try {
    const data = await configRDO.get();
    if ("languages" in data) {
      setState(data);
    }
  } catch (err) {
    errorHandler(err);
  }
}