import { computed, reactive } from "vue";
import {
  authRDO,
  IServerAuthResponse,
  IRegisterPayload,
  ILoginPayload,
  IServerLoginResponse,
  IChangePasswordPayload,
  IResetPasswordPayload,
} from "../rdo/auth.ts";
import {
  profileRDO,
  IProfilePayload,
  IProfileAvatarPayload,
} from "@/services/rdo/profile.ts";
import StorageManager from "@/utils/storage-manager.ts";
import { IError, IUserData } from "@/types";
import errorHandler from "@/utils/error-handler.ts";

const DEFAULT_USER: IUserData = {
  name: "",
  email: "",
  foreignLanguage: "",
  nativeLanguage: "",
  questionsInQuiz: 0,
  questionsInQuizRepeat: 0,
  avatar: {
    name: "",
    path: "",
  },
  createdAt: "",
};

const authorizedUserStorage = new StorageManager<IServerAuthResponse>(
  "localStorage",
  "auth",
);

let authorizedUser: IUserData = reactive({ ...DEFAULT_USER });

const isAuthorized = computed(() => {
  return Boolean(authorizedUser.email);
});

function setUserData(user: IUserData, token: string = "") {
  Object.keys(DEFAULT_USER).forEach((key) => {
    if (key in DEFAULT_USER && key in user) {
      //@ts-ignore
      authorizedUser[key] = user[key];
    }
  });

  const savedUser = authorizedUserStorage.get();

  if (!savedUser) {
    authorizedUserStorage.save({
      user,
      token,
    });
    return;
  }

  if (user.email) {
    authorizedUserStorage.save({
      user: {
        ...savedUser.user,
        ...user,
      },
      token: token ? token : savedUser.token,
    });
    return;
  }

  authorizedUserStorage.remove();
}

function authorizationStatus() {
  const auth = authorizedUserStorage.get();
  if (auth) {
    setUserData(auth.user);
  }
  return isAuthorized.value;
}

async function authorize(data: ILoginPayload) {
  try {
    const response = (await authRDO.authorize(data)) as IServerLoginResponse;
    if ("token" in response) {
      setUserData(response.user, response.token);
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
    const response = (await authRDO.save(data)) as IServerLoginResponse;

    if ("token" in response) {
      setUserData(response.user, response.token);
    }

    if ("message" in response) {
      return response;
    }

    throw new Error("The user token is empty");
  } catch (err: unknown) {
    throw new Error((err as IError).message);
  }
}

async function updateProfile(data: IProfilePayload) {
  const user = authorizedUserStorage.get();
  if (!user) return;

  try {
    const user = await profileRDO.update(data);
    setUserData(user);
  } catch (err: unknown) {
    errorHandler(err);
  }
}

async function uploadAvatar(data: IProfileAvatarPayload) {
  const user = authorizedUserStorage.get();
  if (!user) return;

  try {
    const user = await profileRDO.uploadAvatar(data);
    setUserData(user);
  } catch (err: unknown) {
    errorHandler(err);
  }
}

async function removeAvatar() {
  const user = authorizedUserStorage.get();
  if (!user) return;

  try {
    const user = await profileRDO.removeAvatar();
    setUserData(user);
  } catch (err: unknown) {
    errorHandler(err);
  }
}

async function changePassword(data: IChangePasswordPayload) {
  const user = authorizedUserStorage.get();

  if (!user) return;

  try {
    await authRDO.changePassword(data);
  } catch (err: unknown) {
    errorHandler(err);
  }
}

async function resetPassword(data: IResetPasswordPayload) {
  try {
    const response = await authRDO.resetPassword(data);

    if ("message" in response) {
      return response;
    }
  } catch (err: unknown) {
    errorHandler(err);
  }
}

async function logout() {
  const user = authorizedUserStorage.get();
  if (!user) return;
  try {
    await authRDO.unauthorize(user);
    clearUserData();
  } catch (err: unknown) {
    errorHandler(err);
  }
}

function clearUserData() {
  setUserData(DEFAULT_USER);
}

export {
  isAuthorized,
  authorizationStatus,
  authorizedUserStorage,
  authorizedUser,
  authorize,
  register,
  logout,
  changePassword,
  resetPassword,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  clearUserData,
};
