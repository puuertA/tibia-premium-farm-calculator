import { apiFetch } from "./apiClient";
import type { UserProfile } from "../types/backend";

export const userApi = {
  me: (token: string) => apiFetch<{ user: UserProfile }>("/users/me", { method: "GET" }, token),
  update: (token: string, payload: { name?: string; email?: string }) =>
    apiFetch<{ user: UserProfile }>("/users/me", { method: "PUT", body: payload }, token)
};
