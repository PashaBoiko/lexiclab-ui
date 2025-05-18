import { ILanguages } from "../../types";

export type IQuizStatuses = "game" | "score" | "pending";

export interface IQuestion {
  _id: string;
  en: string;
  ua: string;
  iteration: number;
}

export type IQuestions = IQuestion[];

export interface IQuizState {
  status: IQuizStatuses;
  score: number;
  currentQuestionIndex: number;
  quizType: string;
  questionKey: ILanguages;
  answerKey: ILanguages;
  questions: IQuestions;
  result: string[];
}