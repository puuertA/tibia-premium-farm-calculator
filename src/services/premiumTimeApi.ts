import { apiFetch } from "./apiClient";
import type { PremiumTimeRecord } from "../types/backend";

export const premiumTimeApi = {
  history: (token: string, characterId?: string) =>
    apiFetch<{ records: PremiumTimeRecord[] }>(
      `/premium-time/history${characterId ? `?characterId=${characterId}` : ""}`,
      { method: "GET" },
      token
    ),
  latest: (token: string) =>
    apiFetch<{ record: PremiumTimeRecord | null }>("/premium-time/latest", { method: "GET" }, token),
  update: (
    token: string,
    payload: {
      characterId?: string | null;
      originalText: string;
      expiresAt?: string | null;
      balanceDays?: number | null;
      remainingTimeText?: string | null;
    }
  ) => apiFetch<{ record: PremiumTimeRecord }>("/premium-time/update", { method: "POST", body: payload }, token)
};
