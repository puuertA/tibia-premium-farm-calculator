import type { PremiumInfo } from "../types/tibia";

const monthMap: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
};

export const parsePremiumText = (text: string): PremiumInfo => {
  const info: PremiumInfo = { rawText: text };

  const expiresMatch = text.match(
    /expires at\s+([A-Za-z]{3})\s+(\d{2})\s+(\d{4}),\s+(\d{2}:\d{2}:\d{2})\s+CEST/i
  );

  if (expiresMatch) {
    const [, monthStr, dayStr, yearStr, timeStr] = expiresMatch;
    const month = monthMap[monthStr];
    const day = Number(dayStr);
    const year = Number(yearStr);
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);

    if (month !== undefined) {
      const utcDate = new Date(Date.UTC(year, month, day, hours - 2, minutes, seconds));
      if (!Number.isNaN(utcDate.getTime())) {
        info.expiresAt = utcDate;
      }
    }
  }

  const balanceMatch = text.match(/Balance of Premium Time:\s*(\d+)\s*days/i);
  if (balanceMatch) {
    info.balanceDays = Number(balanceMatch[1]);
  }

  return info;
};

export const calculateTimeRemaining = (expiresAt: Date) => {
  const now = new Date();
  const diffMs = Math.max(0, expiresAt.getTime() - now.getTime());
  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  return {
    days,
    hours,
    minutes,
    totalHours
  };
};
