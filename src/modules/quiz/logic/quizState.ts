import { reactive, computed, ComputedRef } from "vue";
import { DEFAULT_GAME_STATE } from "./constans.ts";
import { IQuizState, IQuestion, IQuizStatuses, IQuestions } from "../types";
import { STATUS_PENDING } from "./constans.ts";
import { ILanguages } from "@/types";

const quizState: IQuizState = reactive({ ...DEFAULT_GAME_STATE });

const quizStatus: ComputedRef<string> = computed(() => quizState.status);

const questions: ComputedRef<IQuestions> = computed(() => {
  return quizState.questions;
});

const allQuestions: ComputedRef<IQuestions> = computed(() => {
  return quizState.allQuestions;
});

const currentQuestion: ComputedRef<IQuestion> = computed(() => {
  return quizState.questions[quizState.currentQuestionIndex];
});

const questionKey: ComputedRef<ILanguages> = computed(() => {
  return quizState.questionKey;
});

const answerKey: ComputedRef<ILanguages> = computed(() => {
  return quizState.answerKey;
});

const currentQuestionText = computed(() => {
  return currentQuestion.value[quizState.questionKey];
});

const quizType = computed(() => {
  return quizState.quizType;
});

const incorrectQuestions = computed(() => {
  return quizState.incorrectQuestions;
});

const saveResult = computed(() => {
  return quizState.saveResult;
});

const showDescription = computed(() => {
  return quizState.showDescription;
});

const setStatus = (status: IQuizStatuses) => {
  quizState.status = status;
};

const setQuestionKey = (questionKey: ILanguages) => {
  quizState.questionKey = questionKey;
};

const setAnswerKey = (answerKey: ILanguages) => {
  quizState.answerKey = answerKey;
};

const setQuestions = (questions: IQuestions) => {
  quizState.questions = questions;
};

const setAllQuestions = (questions: IQuestions) => {
  quizState.allQuestions = questions;
};

const setQuizType = (quizType: string) => {
  quizState.quizType = quizType;
};

const setQuizSaveResult = (saveResult: boolean) => {
  quizState.saveResult = saveResult;
};

const setShowDescription = (showDescription: boolean) => {
  quizState.showDescription = showDescription;
};

const increaseScore = () => {
  quizState.score++;
};

const increaseQuestionIndex = () => {
  quizState.currentQuestionIndex++;
};

const processResult = (id: string) => {
  quizState.result.push(id);
};

const setIncorrectQuestions = (item: IQuestion) => {
  quizState.incorrectQuestions.push(item);
};

const resetQuiz = () => {
  quizState.questionKey = DEFAULT_GAME_STATE.questionKey;
  quizState.answerKey = DEFAULT_GAME_STATE.answerKey;
  quizState.status = STATUS_PENDING;
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.incorrectQuestions = [];
  quizState.result = [];
  quizState.saveResult = true;
  quizState.showDescription = false;
};

export {
  quizState,
  quizStatus,
  questions,
  allQuestions,
  currentQuestion,
  questionKey,
  answerKey,
  currentQuestionText,
  quizType,
  incorrectQuestions,
  saveResult,
  showDescription,
  setStatus,
  setQuestionKey,
  setAnswerKey,
  setQuestions,
  setAllQuestions,
  setQuizType,
  setQuizSaveResult,
  increaseScore,
  increaseQuestionIndex,
  processResult,
  setIncorrectQuestions,
  resetQuiz,
  setShowDescription,
};
