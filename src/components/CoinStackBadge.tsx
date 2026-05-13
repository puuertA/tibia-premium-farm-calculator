import { useMemo } from "react";
import { getCoinStack } from "../utils/coinStack";
import goldCoin1 from "../assets/coins/goldcoin_1.png";
import goldCoin50 from "../assets/coins/goldcoin_50.png";
import goldCoin100 from "../assets/coins/goldcoin_100.png";
import platCoin1 from "../assets/coins/platcoin_1.png";
import platCoin50 from "../assets/coins/platcoin_50.png";
import platCoin100 from "../assets/coins/platcoin_100.png";
import crystalCoin1 from "../assets/coins/crystalcoin_1.png";
import crystalCoin50 from "../assets/coins/crystalcoin_50.png";
import crystalCoin100 from "../assets/coins/crystalcoin_100.png";

interface CoinStackBadgeProps {
  amount: number;
  compactLabel?: boolean;
  showCount?: boolean;
}

const coinAssetMap = {
  gold: [goldCoin1, goldCoin50, goldCoin100],
  platinum: [platCoin1, platCoin50, platCoin100],
  crystal: [crystalCoin1, crystalCoin50, crystalCoin100]
} as const;

const getStackAsset = (coin: keyof typeof coinAssetMap, count: number) => {
  if (count >= 100) {
    return coinAssetMap[coin][2];
  }
  if (count >= 50) {
    return coinAssetMap[coin][1];
  }
  return coinAssetMap[coin][0];
};

export const CoinStackBadge = ({ amount, compactLabel = false, showCount = true }: CoinStackBadgeProps) => {
  const stack = getCoinStack(amount);
  const label = stack.count === 1 ? stack.label : stack.pluralLabel;
  const asset = useMemo(() => getStackAsset(stack.coin, stack.count), [stack.coin, stack.count]);

  return (
    <div className="coin-stack" aria-label={`${stack.count} ${label}`}>
      <img
        className="coin-stack__icon"
        src={asset}
        alt={label}
        loading="lazy"
      />
      {showCount && (
        <span className="coin-stack__count">
          {compactLabel ? stack.count : `x${stack.count}`}
        </span>
      )}
    </div>
  );
};
