import { computed, reactive } from "vue";

interface INotificationState {
  state: boolean;
  type: "success" | "info" | "warning" | "error";
  title: string;
  text: string;
}

function setDefaultState(): INotificationState {
  return {
    state: false,
    type: "success",
    title: "",
    text: "",
  };
}

const CLOSING_TIMEOUT = 5000;
const alertState: INotificationState = reactive(setDefaultState());
const toastState: INotificationState = reactive(setDefaultState());

const isAlertAvailable = computed(() => {
  return Boolean(alertState.title || alertState.text);
});

const isToastAvaliable = computed(() => {
  return Boolean(toastState.title || toastState.text);
});

function setAlertState(state: INotificationState = setDefaultState()) {
  alertState.type = state.type;
  alertState.title = state.title;
  alertState.text = state.text;
}

function setNotificationState(state: INotificationState = setDefaultState()) {
  toastState.state = state.state;
  toastState.type = state.type;
  toastState.title = state.title;
  toastState.text = state.text;
}

function toggleAlertSTate(state: INotificationState) {
  setAlertState(state);

  setTimeout(() => {
    setAlertState();
  }, CLOSING_TIMEOUT);
}

function toggleSuccessAlert(text: string) {
  toggleAlertSTate({
    state: true,
    type: "success",
    title: "Success",
    text,
  });
}

function toggleInfoAlert(text: string) {
  toggleAlertSTate({
    state: true,
    type: "info",
    title: "info",
    text,
  });
}

function toggleErrorAlert(text: string) {
  toggleAlertSTate({
    state: true,
    type: "error",
    title: "Error",
    text,
  });
}

function toggleSuccessToast(text: string) {
  setNotificationState({
    state: true,
    type: "success",
    title: "Success",
    text,
  });
}

function toggleInfoToast(text: string) {
  setNotificationState({
    state: true,
    type: "success",
    title: "Success",
    text,
  });
}

function toggleErrorToast(text: string) {
  setNotificationState({
    state: true,
    type: "error",
    title: "Error",
    text,
  });
}

export {
  alertState,
  isAlertAvailable,
  toggleAlertSTate,
  toggleSuccessAlert,
  toggleInfoAlert,
  toggleErrorAlert,
  toastState,
  isToastAvaliable,
  setNotificationState,
  toggleSuccessToast,
  toggleInfoToast,
  toggleErrorToast,
};
