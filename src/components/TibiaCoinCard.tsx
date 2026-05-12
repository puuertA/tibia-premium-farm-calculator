import type { MarketPriceResult } from "../types/tibia";
import { MarketCard } from "./MarketCard";

interface TibiaCoinCardProps {
  world: string;
  marketPrice: MarketPriceResult | null;
  manualPrice: number;
  effectivePrice: number;
  loading: boolean;
  error: string | null;
}

export const TibiaCoinCard = (props: TibiaCoinCardProps) => <MarketCard {...props} />;
