const formatShort = (value: number, suffix: string) => {
  const rounded = Number(value.toFixed(1));
  const text = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toString();
  return `${text}${suffix}`;
};

export const formatGold = (value: number): string => {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return formatShort(value / 1_000_000_000, "kkk");
  }

  if (absValue >= 1_000_000) {
    return formatShort(value / 1_000_000, "kk");
  }

  if (absValue >= 1_000) {
    return formatShort(value / 1_000, "k");
  }

  return value.toString();
};
