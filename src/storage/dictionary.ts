import { computed, reactive } from "vue";
import {
  dictionaryRDO,
  IDictionaryModel,
  IAddDictionaryPayload,
} from "../services/rdo/dictionary";
import errorHandler from "../utils/error-handler.ts";
import { quizRDO, IQuizSavePayload } from "../services/rdo/quiz.ts";

interface IDictionaryState {
  _id: string;
  dictionary: IDictionaryModel[];
}

const state: IDictionaryState = reactive({
  _id: "",
  dictionary: [],
});

export const getState = computed(() => state);

export const setState = (payload: IDictionaryState) => {
  const { dictionary, _id } = payload;
  state._id = _id;
  state.dictionary = dictionary;
};

export const fetchItems = async () => {
  try {
    if (state._id) return state;

    const data = await dictionaryRDO.get();
    if ("dictionary" in data) {
      setState(data);
    }
    return state;
  } catch (err: unknown) {
    errorHandler(err);
  }
};

export const quizSave = async (payload: IQuizSavePayload) => {
  try {
    const data = await quizRDO.save(payload);

    if ("dictionary" in data) {
      setState(data);
    }
  } catch (err: unknown) {
    errorHandler(err);
  }
};

export const refresh = async (itemId: string) => {
  try {
    const data = await dictionaryRDO.refresh(state._id, itemId);
    if ("dictionary" in data) {
      setState(data);
    }
  } catch (err: unknown) {
    errorHandler(err);
  }
};

export const addItem = async (payload: IAddDictionaryPayload) => {
  try {
    const data = await dictionaryRDO.add(payload);
    if ("dictionary" in data) {
      setState(data);
    }
  } catch (err: unknown) {
    errorHandler(err);
  }
};

export const editItem = async (
  payload: IAddDictionaryPayload,
  itemId: string,
) => {
  try {
    const data = await dictionaryRDO.edit(payload, state._id, itemId);
    if ("dictionary" in data) {
      setState(data);
    }
  } catch (err: unknown) {
    errorHandler(err);
  }
};

export const removeItem = async (itemId: string) => {
  try {
    const data = await dictionaryRDO.delete(state._id, itemId);
    if ("dictionary" in data) {
      setState(data);
    }
  } catch (err: unknown) {
    errorHandler(err);
  }
};
