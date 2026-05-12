import { apiFetch } from "./apiClient";
import type { UserProfile } from "../types/backend";

interface AuthResponse {
  token: string;
  user: UserProfile;
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string; confirmPassword: string }) =>
    apiFetch<AuthResponse>("/auth/register", { method: "POST", body: payload }),
  login: (payload: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body: payload }),
  me: (token: string) => apiFetch<{ user: UserProfile }>("/auth/me", { method: "GET" }, token)
};
