import http from "../http";
import { authorizedUserStorage } from "@/services/auth/auth.ts";
import errorHandler from "@/utils/error-handler.ts";

export interface IDictionaryModel {
  _id: string;
  en: string;
  ua: string;
  description: string;
  iteration: number;
}

export interface IDictionaryResponse {
  _id: string;
  dictionary: IDictionaryModel[];
}

export type IAddDictionaryPayload = Omit<IDictionaryModel, "_id">;

class DictionaryRDO {
  private static instance: DictionaryRDO;

  constructor() {
    if (DictionaryRDO.instance) {
      return DictionaryRDO.instance;
    }
    DictionaryRDO.instance = this;
  }

  public async get(): Promise<IDictionaryResponse> {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.get("/dictionary", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    } catch (err: unknown) {
      errorHandler(err);
    }
  }

  public async add(data: IAddDictionaryPayload): Promise<IDictionaryResponse> {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.post("/dictionary", {
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

  public async edit(
    data: IAddDictionaryPayload,
    id: string,
    itemId: string,
  ): Promise<IDictionaryResponse> {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.put(`/dictionary/${id}/${itemId}`, {
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

  public async refresh(
    id: string,
    itemId: string,
  ): Promise<IDictionaryResponse> {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.get(`/dictionary/refresh/${id}/${itemId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err: unknown) {
      errorHandler(err);
    }
  }

  public async delete(id: string, itemId: string) {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");
      return await http.delete(`/dictionary/${id}/${itemId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err: unknown) {
      errorHandler(err);
    }
  }

  public async import(data: any) {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");
      return await http.post(`/dictionary/import`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: data,
      });
    } catch (err: unknown) {
      errorHandler(err);
    }
  }
}

export const dictionaryRDO = new DictionaryRDO();
