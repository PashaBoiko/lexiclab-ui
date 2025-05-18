import { computed, reactive } from "vue";

interface IAlertState{
  type: "success" | "info" | "warning" | "error";
  title: string;
  text: string;
}

function setDefaultState(): IAlertState{
  return {
    type: "success",
    title: "",
    text: "",
  }
}


const CLOSING_TIMEOUT = 5000;
const alertState: IAlertState = reactive(setDefaultState());

const isAlertAvailable = computed(() => {
  return Boolean(alertState.title || alertState.text);
});

function setAlertState(state: IAlertState = setDefaultState()) {
  alertState.type = state.type;
  alertState.title = state.title;
  alertState.text = state.text;
}

function toggleAlertSTate(state: IAlertState) {
  setAlertState(state);

  setTimeout(() => {
    setAlertState();
  }, CLOSING_TIMEOUT);
}

function toggleSuccessAlert(text: string) {
  toggleAlertSTate({
    type: "success",
    title: "Success",
    text
  })
}

function toggleInfoAlert(text: string) {
  toggleAlertSTate({
    type: "info",
    title: "info",
    text
  });
}

function toggleErrorAlert(text: string) {
  toggleAlertSTate({
    type: "error",
    title: "Error",
    text
  })
}

export {
  alertState,
  isAlertAvailable,
  toggleAlertSTate,
  toggleSuccessAlert,
  toggleInfoAlert,
  toggleErrorAlert
}