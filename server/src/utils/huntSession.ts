type HuntSessionRecord = {
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
  killedMonstersJson: Array<{ name: string; count: number }>;
  lootedItemsJson: Array<{ name: string; count: number }>;
  createdAt: string;
};

type HuntSessionRow = {
  id: string;
  user_id: string;
  character_id: string | null;
  source_file_name: string | null;
  session_start: string | null;
  session_end: string | null;
  session_length: string;
  balance: number;
  loot: number;
  supplies: number;
  xp_gain: number;
  xp_per_hour: number;
  profit_per_hour: number;
  damage: number;
  damage_per_hour: number;
  healing: number;
  healing_per_hour: number;
  total_monsters_killed: number;
  most_killed_monster: string | null;
  total_looted_items: number;
  killed_monsters_json: unknown;
  looted_items_json: unknown;
  created_at: string;
};

const parseJsonField = <T>(value: unknown, fallback: T): T => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  if (value && typeof value === "object") {
    return value as T;
  }

  return fallback;
};

const parseDateField = (value: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
};

export const mapHuntSessionRow = (row: HuntSessionRow): HuntSessionRecord => ({
  id: row.id,
  userId: row.user_id,
  characterId: row.character_id,
  sourceFileName: row.source_file_name,
  sessionStart: parseDateField(row.session_start),
  sessionEnd: parseDateField(row.session_end),
  sessionLength: row.session_length,
  balance: row.balance,
  loot: row.loot,
  supplies: row.supplies,
  xpGain: row.xp_gain,
  xpPerHour: row.xp_per_hour,
  profitPerHour: row.profit_per_hour,
  damage: row.damage,
  damagePerHour: row.damage_per_hour,
  healing: row.healing,
  healingPerHour: row.healing_per_hour,
  totalMonstersKilled: row.total_monsters_killed,
  mostKilledMonster: row.most_killed_monster,
  totalLootedItems: row.total_looted_items,
  killedMonstersJson: parseJsonField(row.killed_monsters_json, []),
  lootedItemsJson: parseJsonField(row.looted_items_json, []),
  createdAt: new Date(row.created_at).toISOString()
});