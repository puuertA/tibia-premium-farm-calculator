import type { PremiumInfo } from "../types/tibia";
import { PremiumCard } from "./PremiumCard";

interface PremiumTimeCardProps {
  premiumInfo: PremiumInfo;
  className?: string;
}

export const PremiumTimeCard = ({ premiumInfo, className }: PremiumTimeCardProps) => (
  <PremiumCard premiumInfo={premiumInfo} className={className} />
);
