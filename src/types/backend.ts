export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface CharacterRecord {
  id: string;
  userId: string;
  name: string;
  world?: string | null;
  vocation?: string | null;
  level?: number | null;
  sex?: string | null;
  achievementPoints?: number | null;
  residence?: string | null;
  guild?: string | null;
  skillsJson?: unknown | null;
  lastLogin?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PremiumTimeRecord {
  id: string;
  userId: string;
  characterId?: string | null;
  originalText: string;
  expiresAt?: string | null;
  balanceDays?: number | null;
  remainingTimeText?: string | null;
  createdAt: string;
}

export interface TibiaCoinPriceRecord {
  id: string;
  userId: string;
  characterId?: string | null;
  world?: string | null;
  unitPrice: number;
  price250Tc: number;
  source: string;
  createdAt: string;
}

export interface FarmGoalRecord {
  id: string;
  userId: string;
  characterId?: string | null;
  currentGold: number;
  targetTcAmount: number;
  unitTcPrice: number;
  requiredGold: number;
  missingGold: number;
  remainingDays: number;
  goldPerDay: number;
  goldPerHour: number;
  hoursPerDay: number;
  status: string;
  createdAt: string;
}

export interface HuntMonsterEntry {
  name: string;
  count: number;
}

export interface HuntSessionRecord {
  id: string;
  userId: string;
  characterId?: string | null;
  sourceFileName?: string | null;
  sessionStart?: string | null;
  sessionEnd?: string | null;
  sessionLength: string;
  balance: number;
  loot: number;
  supplies: number;
  xpGain: number;
  xpPerHour: number;
  profitPerHour: number;
  damage: number;
  damagePerHour: number;
  healing: number;
  healingPerHour: number;
  totalMonstersKilled: number;
  mostKilledMonster?: string | null;
  totalLootedItems: number;
  killedMonstersJson: HuntMonsterEntry[];
  lootedItemsJson: HuntMonsterEntry[];
  createdAt: string;
}

export interface DashboardSummary {
  user: UserProfile;
  characters: CharacterRecord[];
  activeCharacter: CharacterRecord | null;
  counts: {
    characters: number;
    premiumRecords: number;
    coinRecords: number;
    farmRecords: number;
    huntRecords: number;
  };
  latest: {
    premiumTime: PremiumTimeRecord | null;
    tibiaCoin: TibiaCoinPriceRecord | null;
    farmGoal: FarmGoalRecord | null;
    huntSession: HuntSessionRecord | null;
  };
  history: {
    premiumTime: PremiumTimeRecord[];
    tibiaCoin: TibiaCoinPriceRecord[];
    farmGoal: FarmGoalRecord[];
    huntSession: HuntSessionRecord[];
  };
}
