import { apiFetch } from "./apiClient";
import type { CharacterRecord } from "../types/backend";

export const charactersApi = {
  list: (token: string) => apiFetch<{ characters: CharacterRecord[] }>("/characters", { method: "GET" }, token),
  create: (token: string, payload: Omit<CharacterRecord, "id" | "userId" | "createdAt" | "updatedAt">) =>
    apiFetch<{ character: CharacterRecord }>("/characters", { method: "POST", body: payload }, token),
  update: (token: string, id: string, payload: Partial<Omit<CharacterRecord, "id" | "userId" | "createdAt" | "updatedAt">>) =>
    apiFetch<{ character: CharacterRecord }>(`/characters/${id}`, { method: "PUT", body: payload }, token),
  remove: (token: string, id: string) =>
    apiFetch<void>(`/characters/${id}`, { method: "DELETE" }, token),
  setActive: (token: string, id: string) =>
    apiFetch<{ message: string }>(`/characters/${id}/set-active`, { method: "PUT" }, token)
};
