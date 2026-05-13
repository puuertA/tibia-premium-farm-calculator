export type CoinType = "gold" | "platinum" | "crystal";

interface CoinStack {
  coin: CoinType;
  count: number;
  label: string;
  pluralLabel: string;
}

const MIN_STACK = 1;

const toStackCount = (amount: number, divisor: number) =>
  Math.max(MIN_STACK, Math.floor(amount / divisor));

export const getCoinStack = (amount: number): CoinStack => {
  const safeAmount = Math.max(0, Math.floor(amount));

  if (safeAmount >= 10_000) {
    return {
      coin: "crystal",
      count: toStackCount(safeAmount, 10_000),
      label: "Moeda de Cristal",
      pluralLabel: "Moedas de Cristal"
    };
  }

  if (safeAmount >= 1_000) {
    return {
      coin: "platinum",
      count: toStackCount(safeAmount, 100),
      label: "Moeda de Platina",
      pluralLabel: "Moedas de Platina"
    };
  }

  return {
    coin: "gold",
    count: toStackCount(safeAmount, 100),
    label: "Moeda de Ouro",
    pluralLabel: "Moedas de Ouro"
  };
};
