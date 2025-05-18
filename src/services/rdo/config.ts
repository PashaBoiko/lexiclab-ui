import http from "../http";
import errorHandler from "../../utils/error-handler.ts";

export type ILanguageItem = {
  key: string;
  title: string;
}

export interface IQuestionType {
  key: string;
  value: string;
}

export interface IConfigPublicResponse {
  languages: ILanguageItem[];
  limitOfCorrectAnswers: number;
  quizAmountOfQuestions: number;
  questionTypes: IQuestionType[];
}

class ConfigRDO {
  private static instance: ConfigRDO;

  constructor() {
    if (ConfigRDO.instance) {
      return ConfigRDO.instance;
    }
    ConfigRDO.instance = this;
  }

  public async get(): Promise<IConfigPublicResponse> {
    try {
      return await http.get('/config/public', {});
    } catch (err: unknown){
      errorHandler(err);
    }
  }
}

export const configRDO = new ConfigRDO();