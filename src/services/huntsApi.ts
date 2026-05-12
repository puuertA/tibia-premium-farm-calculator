import type { HuntSessionRecord } from "../types/backend";
import { apiFetch } from "./apiClient";

export const huntsApi = {
  history: (token: string, characterId?: string) =>
    apiFetch<{ records: HuntSessionRecord[] }>(
      `/hunts/history${characterId ? `?characterId=${characterId}` : ""}`,
      { method: "GET" },
      token
    ),
  importSession: (
    token: string,
    payload: {
      characterId?: string | null;
      sourceFileName?: string | null;
      sessionStart?: string | null;
      sessionEnd?: string | null;
      sessionLength: string;
      balance: number;
      loot: number;
      supplies: number;
      xpGain: number;
      xpPerHour: number;
      damage: number;
      damagePerHour: number;
      healing: number;
      healingPerHour: number;
      totalMonstersKilled: number;
      mostKilledMonster?: string | null;
      totalLootedItems: number;
      killedMonstersJson: Array<{ name: string; count: number }>;
      lootedItemsJson: Array<{ name: string; count: number }>;
    }
  ) => apiFetch<{ record: HuntSessionRecord }>("/hunts/import", { method: "POST", body: payload }, token)
};