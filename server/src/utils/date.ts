export const toDate = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.includes(", ") ? value.replace(", ", "T") : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
