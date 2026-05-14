import type { HuntSessionRecord } from "../types/backend";

export interface HuntChartPoint {
  id: string;
  createdAt: string;
  label: string;
  profit: number;
  xpPerHour: number;
  profitPerHour: number;
}

export interface HuntMonsterPoint {
  name: string;
  value: number;
}

export interface HuntItemPoint {
  name: string;
  value: number;
}

export interface HuntInsights {
  totalHunts: number;
  totalProfit: number;
  averageProfitPerHour: number;
  totalXp: number;
  averageXpPerHour: number;
  mostProfitableHunt: HuntSessionRecord | null;
  highestXpHunt: HuntSessionRecord | null;
  mostFarmedMonster: HuntMonsterPoint | null;
  topMonsters: HuntMonsterPoint[];
  topItems: HuntItemPoint[];
  chartPoints: HuntChartPoint[];
  averageHuntDurationHours: number;
  estimatedHuntsForTarget: number;
  hoursNeededForTarget: number;
  hoursPerDayNeeded: number;
}

const toChartLabel = (value: string) =>
  new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

export const calculateHuntInsights = (
  records: HuntSessionRecord[],
  goldMissing: number,
  daysRemaining: number
): HuntInsights => {
  const totalHunts = records.length;
  const totalProfit = records.reduce((sum, record) => sum + record.balance, 0);
  const averageProfitPerHour =
    totalHunts > 0 ? records.reduce((sum, record) => sum + record.profitPerHour, 0) / totalHunts : 0;
  const totalXp = records.reduce((sum, record) => sum + record.xpGain, 0);
  const averageXpPerHour = totalHunts > 0 ? records.reduce((sum, record) => sum + record.xpPerHour, 0) / totalHunts : 0;
  const mostProfitableHunt = records.reduce<HuntSessionRecord | null>((current, record) => {
    if (!current || record.balance > current.balance) {
      return record;
    }
    return current;
  }, null);
  const highestXpHunt = records.reduce<HuntSessionRecord | null>((current, record) => {
    if (!current || record.xpPerHour > current.xpPerHour) {
      return record;
    }
    return current;
  }, null);

  const monsterCounts = new Map<string, number>();
  const itemCounts = new Map<string, number>();

  for (const record of records) {
    for (const monster of record.killedMonstersJson) {
      monsterCounts.set(monster.name, (monsterCounts.get(monster.name) ?? 0) + monster.count);
    }

    for (const item of record.lootedItemsJson) {
      itemCounts.set(item.name, (itemCounts.get(item.name) ?? 0) + item.count);
    }
  }

  const topMonsters = [...monsterCounts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);
  const topItems = [...itemCounts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);

  const mostFarmedMonster = topMonsters[0] ?? null;
  const chartPoints = records
    .slice()
    .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime())
    .map((record) => ({
      id: record.id,
      createdAt: record.createdAt,
      label: toChartLabel(record.createdAt),
      profit: record.balance,
      xpPerHour: record.xpPerHour,
      profitPerHour: record.profitPerHour
    }));

  const averageHuntDurationHours =
    totalHunts > 0
      ? records.reduce((sum, record) => {
          const match = record.sessionLength.match(/^(\d+):(\d{2})h$/i);
          if (!match) {
            return sum;
          }
          return sum + Number(match[1]) + Number(match[2]) / 60;
        }, 0) / totalHunts
      : 0;

  const hoursNeededForTarget = averageProfitPerHour > 0 ? goldMissing / averageProfitPerHour : 0;
  const estimatedHuntsForTarget = averageHuntDurationHours > 0 ? hoursNeededForTarget / averageHuntDurationHours : 0;
  const hoursPerDayNeeded = daysRemaining > 0 ? hoursNeededForTarget / daysRemaining : 0;

  return {
    totalHunts,
    totalProfit,
    averageProfitPerHour,
    totalXp,
    averageXpPerHour,
    mostProfitableHunt,
    highestXpHunt,
    mostFarmedMonster,
    topMonsters,
    topItems,
    chartPoints,
    averageHuntDurationHours,
    estimatedHuntsForTarget,
    hoursNeededForTarget,
    hoursPerDayNeeded
  };
};