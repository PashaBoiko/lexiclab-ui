import http from "@/services/http";
import { authorizedUserStorage } from "@/services/auth/auth.ts";
import errorHandler from "../../utils/error-handler.ts";

import { IStatisticModel } from "@/storage/statistic.ts";

interface IStatisticPayload {
  word?: number;
  quiz_completed?: number;
  repeat_completed?: number;
}

interface IStatisticResponse {
  _id: string;
  statistics: IStatisticModel[];
}

class StatisticRDO {
  private static instance: StatisticRDO;

  constructor() {
    if (StatisticRDO.instance) {
      return StatisticRDO.instance;
    }
    StatisticRDO.instance = this;
  }

  public async get(): Promise<IStatisticResponse> {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.get("/statistic", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err: unknown) {
      errorHandler(err);
    }
  }

  public async post(data: IStatisticPayload): Promise<IStatisticResponse> {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.post("/statistic", {
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

export const statisticRDO = new StatisticRDO();
