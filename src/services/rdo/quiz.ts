import http from "../http";
import { authorizedUserStorage } from "@/services/auth/auth.ts";
import errorHandler from "@/utils/error-handler.ts";

import { IDictionaryResponse } from "./dictionary.ts";

export interface IQuizSavePayload {
  ids: string[];
}

class QuizRDO {
  private static instance: QuizRDO;

  constructor() {
    if (QuizRDO.instance) {
      return QuizRDO.instance;
    }
    QuizRDO.instance = this;
  }

  public async save(data: IQuizSavePayload): Promise<IDictionaryResponse> {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.post("/quiz", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err: unknown) {
      errorHandler(err);
    }
  }
}

export const quizRDO = new QuizRDO();
