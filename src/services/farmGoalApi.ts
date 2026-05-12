import { apiFetch } from "./apiClient";
import type { FarmGoalRecord } from "../types/backend";

export const farmGoalApi = {
  history: (token: string, characterId?: string) =>
    apiFetch<{ records: FarmGoalRecord[] }>(
      `/farm-goal/history${characterId ? `?characterId=${characterId}` : ""}`,
      { method: "GET" },
      token
    ),
  latest: (token: string) =>
    apiFetch<{ record: FarmGoalRecord | null }>("/farm-goal/latest", { method: "GET" }, token),
  update: (
    token: string,
    payload: {
      characterId?: string | null;
      currentGold: number;
      targetTcAmount: number;
      unitTcPrice: number;
      requiredGold: number;
      missingGold: number;
      remainingDays: number;
      goldPerDay: number;
      goldPerHour: number;
      hoursPerDay: number;
      status: string;
    }
  ) => apiFetch<{ record: FarmGoalRecord }>("/farm-goal/update", { method: "POST", body: payload }, token)
};
