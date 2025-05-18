import { ref, Ref } from "vue";

import {authRDO, IServerAuthResponse, IRegisterPayload, ILoginPayload, IServerLoginResponse} from "../rdo/auth.ts";
import StorageManager from "../../utils/storage-manager.ts";
import {IError} from "../../types/error.ts";

const authorized: Ref<boolean> = ref(false);
const authorizedUser = new StorageManager<IServerAuthResponse>("localStorage", "auth");

function authorizationStatus() {
  const auth = authorizedUser.get();
  if (auth) {
    authorized.value = true;
  }
  return authorized.value;
}

async function authorize(data: ILoginPayload) {
  try {
    const response = await authRDO.authorize(data) as IServerLoginResponse;
    if ("token" in response) {
      authorizedUser.save(response);
      authorized.value = true;
      return response;
    }
    if ("message" in response) {
      return response;
    }
    throw new Error("The user token is empty");
  } catch (err: unknown) {
    throw new Error((err as IError).message);
  }
}

async function register(data: IRegisterPayload) {
  try {
    const response = await authRDO.save(data) as IServerLoginResponse;

    if ("token" in response) {
      authorizedUser.save(response);
      authorized.value = true;
    }

    if ("message" in response) {
      return response;
    }

    throw new Error("The user token is empty");
  } catch (err: unknown) {
    throw new Error((err as IError).message);
  }
}

async function logout() {
  const user = authorizedUser.get();
  if (!user) return;
  try {
    await authRDO.unauthorize(user);
    authorized.value = false;
    authorizedUser.remove();
  } catch (e) {
    console.log(e);
  }
}

export {
  authorized,
  authorizationStatus,
  authorizedUser,
  authorize,
  register,
  logout
}
