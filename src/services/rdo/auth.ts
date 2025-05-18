import http from "../http";
import { IError } from "../../types/error.ts";

export interface ILoginPayload {
  email: string;
  password: string;
}

export type IServerLoginResponse = IServerAuthResponse | IServerAuthRestrictedResponse;

export interface IServerAuthResponse {
  token: string;
  user: {
    name: string;
    email: string;
    nativeLanguage: string;
    foreignLanguage: string;
    createdAt: string;
  }
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

class AuthRDO {
  private static instance: AuthRDO;

  constructor() {
    if(AuthRDO.instance) {
      return AuthRDO.instance;
    }
    AuthRDO.instance = this;
  }

  public async save(data: IRegisterPayload){
    try{
      return await http.post('/auth', {
        body: JSON.stringify(data)
      })
    } catch (err: unknown){
      throw new Error((err as IError).message);
    }
  }

  public async authorize(data: ILoginPayload) {
    try {
      return await http.post('/auth/login', {
        body: JSON.stringify(data)
      }) as IServerAuthResponse;
    } catch (err: unknown) {
      throw new Error((err as IError).message);
    }
  }

  public async unauthorize(user: IServerAuthResponse) {
    try {
      return await http.post('/auth/logout', {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
    } catch (err: unknown) {
      throw new Error((err as IError).message);
    }
  }
}

export const authRDO = new AuthRDO();