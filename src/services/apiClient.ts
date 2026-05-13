const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export const apiFetch = async <T>(path: string, options: ApiOptions = {}, token?: string) => {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) {
    return null as T;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message ?? `Erro ${response.status}`;
    throw new Error(message);
  }

  return data as T;
};
