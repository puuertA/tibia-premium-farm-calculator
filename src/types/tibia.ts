export interface CharacterInfo {
  name: string;
  sex?: string;
  vocation?: string;
  level?: number;
  achievementPoints?: number;
  world?: string;
  residence?: string;
  guild?: string;
  lastLogin?: string;
  created?: string;
  outfitUrl?: string;
  skills?: {
    magicLevel?: number;
    fist?: number;
    club?: number;
    sword?: number;
    axe?: number;
    distance?: number;
    shielding?: number;
    fishing?: number;
  };
}

export interface MarketPriceResult {
  world: string;
  itemName: "Tibia Coin";
  unitPrice: number;
  source: string;
  updatedAt: string;
  success: boolean;
  error?: string;
}

export interface PriceHistoryEntry {
  timestamp: string;
  world: string;
  unitPrice: number;
  source: "manual" | "market";
}

export interface PremiumInfo {
  expiresAt?: Date;
  balanceDays?: number;
  rawText: string;
}

export interface FarmGoal {
  currentGold: number;
  targetGold: number;
  missingGold: number;
  daysRemaining: number;
  hoursRemaining: number;
  goldPerDay: number;
  goldPerHour: number;
  hasEnoughGold: boolean;
}

export interface HuntSessionMonster {
  name: string;
  count: number;
}

export interface HuntSessionItem {
  name: string;
  count: number;
}

export interface HuntSessionSummary {
  fileName: string;
  balance: number;
  damage: number;
  damagePerHour: number;
  healing: number;
  healingPerHour: number;
  loot: number;
  supplies: number;
  xpGain: number;
  xpPerHour: number;
  sessionLength: string;
  sessionHours: number;
  sessionStart?: string;
  sessionEnd?: string;
  goldPerHour: number;
  totalMonstersKilled: number;
  mostKilledMonster?: string;
  totalLootedItems: number;
  killedMonsters: HuntSessionMonster[];
  lootedItems: HuntSessionItem[];
}
