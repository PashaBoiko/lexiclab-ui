import { describe, it, expect, vi, beforeEach } from "vitest";
import { getState, setState, fetchItems } from "../statistic";
import { statisticRDO } from "@/services/rdo/statistic";
import errorHandler from "@/utils/error-handler";
import type { IStatisticState } from "../statistic";

vi.mock("@/services/rdo/statistic", () => ({
  statisticRDO: {
    get: vi.fn(),
  },
}));

vi.mock("@/utils/error-handler", () => ({
  default: vi.fn(),
}));

describe("statistic-store", () => {
  const mockData: IStatisticState = {
    _id: "user-123",
    statistics: [
      {
        word: 10,
        quiz_completed: 3,
        repeat_completed: 2,
        date: new Date("2024-01-01"),
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setState({ _id: "", statistics: [] });
  });

  it("Sets state when fetchItems succeeds", async () => {
    (statisticRDO.get as any).mockResolvedValue(mockData);

    const result = await fetchItems();

    expect(statisticRDO.get).toHaveBeenCalled();
    expect(result).toEqual(mockData);
    expect(getState.value).toEqual(mockData);
  });

  it("Calls errorHandler when fetchItems fails", async () => {
    const error = new Error("Failed to fetch stats");
    (statisticRDO.get as any).mockRejectedValue(error);

    const result = await fetchItems();

    expect(statisticRDO.get).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(error);
    expect(result).toBeUndefined();
  });
});
