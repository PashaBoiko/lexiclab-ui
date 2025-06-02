import { ILanguages } from "@/types";
import { IDictionaryModel } from "@/services/rdo/dictionary.ts";

export type IQuizStatuses = "game" | "score" | "pending";

export type IQuestion = IDictionaryModel;

export type IQuestions = IQuestion[];

export interface IQuizState {
  status: IQuizStatuses;
  score: number;
  currentQuestionIndex: number;
  quizType: string;
  questionKey: ILanguages;
  answerKey: ILanguages;
  questions: IQuestions;
  allQuestions: IQuestions;
  result: string[];
  incorrectQuestions: IQuestion[];
  saveResult: boolean;
  showDescription: boolean;
}
