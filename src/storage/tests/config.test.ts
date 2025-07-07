import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { getState, setState, fetchPublicConfig } from "../config.ts";
import { configRDO } from "@/services/rdo/config";
import errorHandler from "@/utils/error-handler";
import type { IConfigState } from "../config.ts";

vi.mock("@/services/rdo/config", () => ({
  configRDO: {
    get: vi.fn(),
  },
}));

vi.mock("@/utils/error-handler", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("config-storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should set state correctly", () => {
    const payload: IConfigState = {
      languages: [{ key: "en", title: "English" }],
      limitOfCorrectAnswers: 3,
      quizAmountOfQuestions: 10,
      questionTypes: [
        { value: "selectQuestion", title: "Select Question"}
      ]
    };

    setState(payload);

    expect(getState.value).toEqual(payload);
  });

  it("Should fetch config and set state when successful", async () => {
    const mockData = {
      languages: [{ key: "en", title: "English" }],
      limitOfCorrectAnswers: 3,
      quizAmountOfQuestions: 10,
      questionTypes: [
        { value: "selectQuestion", title: "Select Question"}
      ]
    };

    (configRDO.get as Mock).mockResolvedValue(mockData);

    await fetchPublicConfig();

    expect(configRDO.get).toHaveBeenCalled();
    expect(getState.value).toEqual(mockData);
  });

  it("Should call error handler on fetch error", async () => {
    const error = new Error("Fetch failed");
    (configRDO.get as Mock).mockRejectedValue(error);

    await fetchPublicConfig();

    expect(configRDO.get).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(error);
  });
});