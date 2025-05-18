import { IQuizState } from "./types.ts";

export const STATUS_GAME = "game";
export const STATUS_SCORE = "score";
export const STATUS_PENDING = "pending";

export const DEFAULT_GAME_STATE: IQuizState = {
  status: STATUS_PENDING,
  score: 0,
  currentQuestionIndex: 0,
  quizType: "",
  questionKey: "en",
  answerKey: "ua",
  questions: [],
  result: [],
}

export const QUIZ_COMPONENT_MATCH = [
  {
    key: "inputQuestion"
  }
]