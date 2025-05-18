import { reactive, computed, ComputedRef } from "vue";
import { DEFAULT_GAME_STATE } from "./constans.ts";
import { IQuizState, IQuestion, IQuizStatuses, IQuestions } from "./types";
import { STATUS_PENDING } from "./constans.ts";
import { ILanguages } from "../../types";

const quizState: IQuizState = reactive({...DEFAULT_GAME_STATE});

const quizStatus: ComputedRef<string> = computed(() => quizState.status);

const questions: ComputedRef<IQuestions> = computed(() => {
  return quizState.questions;
});

const currentQuestion: ComputedRef<IQuestion> = computed(() => {
  return quizState.questions[quizState.currentQuestionIndex];
});

const questionKey: ComputedRef<ILanguages> = computed(() => {
  return quizState.questionKey;
});

const answerKey: ComputedRef<ILanguages> = computed(() => {
  return quizState.answerKey;
})

const currentQuestionText = computed(() => {
  return currentQuestion.value[quizState.questionKey];
});

const quizType = computed(() => {
  return quizState.quizType;
})

const setStatus = (status: IQuizStatuses) => {
  quizState.status = status;
}

const setQuestionKey = (questionKey: ILanguages) => {
  quizState.questionKey = questionKey;
}

const setAnswerKey = (answerKey: ILanguages) => {
  quizState.answerKey = answerKey;
}

const setQuestions = (questions: IQuestions) => {
  quizState.questions = questions;
}

const setQuizType = (quizType: string) => {
  quizState.quizType = quizType;
}

const increaseScore = () => {
  quizState.score++;
}

const increaseQuestionIndex = () => {
  quizState.currentQuestionIndex ++;
}

const processResult = (id: string) => {
  quizState.result.push(id);
}

const resetQuiz = () => {
  quizState.status = STATUS_PENDING;
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.result = [];
}

export {
  quizState,
  quizStatus,
  questions,
  currentQuestion,
  questionKey,
  answerKey,
  currentQuestionText,
  quizType,
  setStatus,
  setQuestionKey,
  setAnswerKey,
  setQuestions,
  setQuizType,
  increaseScore,
  increaseQuestionIndex,
  processResult,
  resetQuiz
}