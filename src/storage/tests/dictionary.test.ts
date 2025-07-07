import {
  getState,
  setState,
  fetchItems,
  quizSave,
  refresh,
  addItem,
  editItem,
  removeItem, IDictionaryState,
} from "../dictionary.ts";
import {dictionaryRDO, IAddDictionaryPayload} from "@/services/rdo/dictionary";
import {IQuizSavePayload, quizRDO} from "@/services/rdo/quiz";
import errorHandler from "@/utils/error-handler";

import { describe, it, expect, vi, Mock, beforeEach } from "vitest";

vi.mock("@/services/rdo/dictionary", () => ({
  dictionaryRDO: {
    get: vi.fn(),
    refresh: vi.fn(),
    add: vi.fn(),
    edit: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/services/rdo/quiz", () => ({
  quizRDO: {
    save: vi.fn(),
  },
}));

vi.mock("@/utils/error-handler", () => ({
  default: vi.fn(),
}));

describe("dictionary-store", () => {
  const mockState: IDictionaryState = {
    _id: "123",
    dictionary: [{ _id: "321", en: "hello", ua: "привет", description: "", iteration: 0 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setState({ _id: "", dictionary: [] });
  });

  it("Sets and gets state", () => {
    setState(mockState);
    expect(getState.value).toEqual(mockState);
  });

  it("Fetches items if not cached", async () => {
    (dictionaryRDO.get as Mock).mockResolvedValue(mockState);

    const result = await fetchItems();
    expect(dictionaryRDO.get).toHaveBeenCalled();
    expect(result).toEqual(mockState);
    expect(getState.value).toEqual(mockState);
  });

  it("Returns cached state if already fetched", async () => {
    setState(mockState);
    const result = await fetchItems();

    expect(dictionaryRDO.get).not.toHaveBeenCalled();
    expect(result).toEqual(mockState);
  });

  it("Calls errorHandler if fetch fails", async () => {
    const error = new Error("fail");
    (dictionaryRDO.get as Mock).mockRejectedValue(error);

    await fetchItems();
    expect(errorHandler).toHaveBeenCalledWith(error);
  });

  it("QuizSave updates state", async () => {
    (quizRDO.save as Mock).mockResolvedValue(mockState);

    await quizSave({} as IQuizSavePayload);
    expect(quizRDO.save).toHaveBeenCalled();
    expect(getState.value).toEqual(mockState);
  });

  it("Refresh updates state", async () => {
    setState({ _id: "id-1", dictionary: [] });
    (dictionaryRDO.refresh as Mock).mockResolvedValue(mockState);

    await refresh("item-1");
    expect(dictionaryRDO.refresh).toHaveBeenCalledWith("id-1", "item-1");
    expect(getState.value).toEqual(mockState);
  });

  it("Calls errorHandler when refresh fails", async () => {
    const error = new Error("Refresh failed");
    setState({ _id: "123", dictionary: [] });
    (dictionaryRDO.refresh as Mock).mockRejectedValue(error);

    await refresh("item-xyz");

    expect(dictionaryRDO.refresh).toHaveBeenCalledWith("123", "item-xyz");
    expect(errorHandler).toHaveBeenCalledWith(error);
  });

  it("AddItem updates state", async () => {
    (dictionaryRDO.add as Mock).mockResolvedValue(mockState);

    await addItem({ en: "test", ua: "тест" } as IAddDictionaryPayload);
    expect(dictionaryRDO.add).toHaveBeenCalled();
    expect(getState.value).toEqual(mockState);
  });

  it("Calls errorHandler when addItem fails", async () => {
    const error = new Error("Add failed");
    (dictionaryRDO.add as Mock).mockRejectedValue(error);

    await addItem({ en: "test", ua: "тест" } as IAddDictionaryPayload);

    expect(dictionaryRDO.add).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(error);
  });

  it("EditItem updates state", async () => {
    setState({ _id: "abc", dictionary: [] });
    (dictionaryRDO.edit as Mock).mockResolvedValue(mockState);

    await editItem({ en: "edit", ua: "ред" } as IAddDictionaryPayload, "id-2");
    expect(dictionaryRDO.edit).toHaveBeenCalledWith(
      { en: "edit", ua: "ред" },
      "abc",
      "id-2"
    );
    expect(getState.value).toEqual(mockState);
  });

  it("Calls errorHandler when editItem fails", async () => {
    const error = new Error("Edit failed");
    setState({ _id: "edit-id", dictionary: [] });
    (dictionaryRDO.edit as Mock).mockRejectedValue(error);

    await editItem({ en: "edit", ua: "правка" } as IAddDictionaryPayload, "item-123");

    expect(dictionaryRDO.edit).toHaveBeenCalledWith(
      { en: "edit", ua: "правка" },
      "edit-id",
      "item-123"
    );
    expect(errorHandler).toHaveBeenCalledWith(error);
  });

  it("RemoveItem updates state", async () => {
    setState({ _id: "rm-id", dictionary: [] });
    (dictionaryRDO.delete as Mock).mockResolvedValue(mockState);

    await removeItem("item-del");
    expect(dictionaryRDO.delete).toHaveBeenCalledWith("rm-id", "item-del");
    expect(getState.value).toEqual(mockState);
  });

  it("Calls errorHandler when removeItem fails", async () => {
    const error = new Error("Delete failed");
    setState({ _id: "remove-id", dictionary: [] });
    (dictionaryRDO.delete as Mock).mockRejectedValue(error);

    await removeItem("item-xyz");

    expect(dictionaryRDO.delete).toHaveBeenCalledWith("remove-id", "item-xyz");
    expect(errorHandler).toHaveBeenCalledWith(error);
  });

  it("Calls errorHandler on any API error", async () => {
    const err = new Error("crash");
    (quizRDO.save as Mock).mockRejectedValue(err);

    await quizSave({} as IQuizSavePayload);
    expect(errorHandler).toHaveBeenCalledWith(err);
  });
});