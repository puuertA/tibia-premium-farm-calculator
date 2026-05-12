import type { FarmGoal } from "../types/tibia";
import { calculateTimeRemaining } from "./parsePremiumText";

interface FarmGoalParams {
  currentGold: number;
  targetGold: number;
  expiresAt?: Date;
  balanceDays?: number;
}

export const calculateFarmGoal = ({
  currentGold,
  targetGold,
  expiresAt,
  balanceDays
}: FarmGoalParams): FarmGoal => {
  const missingGold = Math.max(0, targetGold - currentGold);

  let daysRemaining = 0;
  let hoursRemaining = 0;

  if (expiresAt) {
    const time = calculateTimeRemaining(expiresAt);
    daysRemaining = time.days;
    hoursRemaining = time.totalHours;
  } else if (balanceDays && balanceDays > 0) {
    daysRemaining = balanceDays;
    hoursRemaining = balanceDays * 24;
  }

  const goldPerDay = daysRemaining > 0 ? missingGold / daysRemaining : 0;
  const goldPerHour = hoursRemaining > 0 ? missingGold / hoursRemaining : 0;

  return {
    currentGold,
    targetGold,
    missingGold,
    daysRemaining,
    hoursRemaining,
    goldPerDay,
    goldPerHour,
    hasEnoughGold: missingGold <= 0
  };
};
