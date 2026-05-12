import { apiFetch } from "./apiClient";
import type { DashboardSummary } from "../types/backend";

export const dashboardApi = {
  summary: (token: string) => apiFetch<DashboardSummary>("/dashboard/summary", { method: "GET" }, token)
};
