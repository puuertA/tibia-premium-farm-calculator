import { apiFetch } from "./apiClient";
import type { TibiaCoinPriceRecord } from "../types/backend";

export const tibiaCoinApi = {
  history: (token: string, params?: { characterId?: string; world?: string }) => {
    const query = new URLSearchParams();
    if (params?.characterId) query.set("characterId", params.characterId);
    if (params?.world) query.set("world", params.world);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiFetch<{ records: TibiaCoinPriceRecord[] }>(`/tibia-coin/history${suffix}`, { method: "GET" }, token);
  },
  latest: (token: string) =>
    apiFetch<{ record: TibiaCoinPriceRecord | null }>("/tibia-coin/latest", { method: "GET" }, token),
  updatePrice: (
    token: string,
    payload: {
      characterId?: string | null;
      world?: string | null;
      unitPrice: number;
      price250Tc: number;
      source: string;
    }
  ) => apiFetch<{ record: TibiaCoinPriceRecord }>("/tibia-coin/update-price", { method: "POST", body: payload }, token)
};
