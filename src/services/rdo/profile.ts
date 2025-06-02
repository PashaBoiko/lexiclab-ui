import http from "../http";
import errorHandler from "../../utils/error-handler.ts";
import { authorizedUserStorage } from "../auth/auth.ts";
import { IUserData } from "../../types";

export interface IProfilePayload {
  questionsInQuiz?: number;
}

export interface IProfileAvatarPayload {
  avatar: string;
}

class ProfileRDO {
  private static instance: ProfileRDO;

  constructor() {
    if (ProfileRDO.instance) {
      return ProfileRDO.instance;
    }
    ProfileRDO.instance = this;
  }

  public async update(data: IProfilePayload): Promise<IUserData> {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.post("/profile", {
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

  public async uploadAvatar(data: IProfileAvatarPayload) {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.post("/profile/avatar", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: data,
      });
    } catch (err: unknown) {
      errorHandler(err);
    }
  }

  public async removeAvatar() {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.delete("/profile/avatar", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err: unknown) {
      errorHandler(err);
    }
  }
}

export const profileRDO = new ProfileRDO();
