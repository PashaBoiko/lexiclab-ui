import http from "../http";
import { IError, IUserData } from "../../types";
import { authorizedUserStorage } from "../auth/auth.ts";

export interface ILoginPayload {
  email: string;
  password: string;
}

export type IServerLoginResponse =
  | IServerAuthResponse
  | IServerAuthRestrictedResponse;

export interface IServerAuthResponse {
  token: string;
  user: IUserData;
}

export interface IServerAuthRestrictedResponse {
  message: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  nativeLanguage: string;
  foreignLanguage: string;
  password: string;
}

export interface IChangePasswordPayload {
  password: string;
  repeatPassword: string;
}

export interface IResetPasswordPayload {
  email: string;
}

class AuthRDO {
  private static instance: AuthRDO;

  constructor() {
    if (AuthRDO.instance) {
      return AuthRDO.instance;
    }
    AuthRDO.instance = this;
  }

  public async save(data: IRegisterPayload) {
    try {
      return await http.post("/auth", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err: unknown) {
      throw new Error((err as IError).message);
    }
  }

  public async authorize(data: ILoginPayload) {
    try {
      return (await http.post("/auth/login", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })) as IServerAuthResponse;
    } catch (err: unknown) {
      throw new Error((err as IError).message);
    }
  }

  public async unauthorize(user: IServerAuthResponse) {
    try {
      return await http.post("/auth/logout", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err: unknown) {
      throw new Error((err as IError).message);
    }
  }

  public async changePassword(data: IChangePasswordPayload) {
    try {
      const user = authorizedUserStorage.get();

      if (!user) throw Error("The user is not defined");

      return await http.post("/auth/change-password", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err: unknown) {
      throw new Error((err as IError).message);
    }
  }

  public async resetPassword(data: IResetPasswordPayload) {
    try {
      return await http.post("/auth/reset-password", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err: unknown) {
      throw new Error((err as IError).message);
    }
  }
}

export const authRDO = new AuthRDO();
