const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

export const getAssetUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
