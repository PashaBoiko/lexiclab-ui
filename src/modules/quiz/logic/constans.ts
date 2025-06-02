import { IQuizState } from "../types";

export const STATUS_GAME = "game";
export const STATUS_SCORE = "score";
export const STATUS_PENDING = "pending";

export enum QUIZ_COLLECTION {
  "ARCHIVE" = "archive",
  "DICTIONARY" = "dictionary",
}

export const DEFAULT_GAME_STATE: IQuizState = {
  status: STATUS_PENDING,
  score: 0,
  currentQuestionIndex: 0,
  quizType: "",
  questionKey: "en",
  answerKey: "ua",
  questions: [],
  allQuestions: [],
  result: [],
  incorrectQuestions: [],
  saveResult: true,
  showDescription: false,
};

export const QUIZ_COMPONENT_MATCH = [
  {
    key: "inputQuestion",
  },
];
