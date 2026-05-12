import type { HuntSessionItem, HuntSessionMonster, HuntSessionSummary } from "../types/tibia";

type UnknownRecord = Record<string, unknown>;

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const parseNumber = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const normalized = value.match(/-?\d+/g)?.join("") ?? "";
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const readField = (source: UnknownRecord, key: string) => {
  const normalized = normalizeKey(key);
  return Object.entries(source).find(([entryKey]) => normalizeKey(entryKey) === normalized)?.[1];
};

const parseArrayItems = (value: unknown): HuntSessionMonster[] | HuntSessionItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const record = entry as Record<string, unknown>;
      const name = typeof record.Name === "string" ? record.Name : typeof record.name === "string" ? record.name : "";
      const count = parseNumber(record.Count ?? record.count);

      if (!name) {
        return null;
      }

      return {
        name,
        count
      };
    })
    .filter((entry): entry is HuntSessionMonster | HuntSessionItem => Boolean(entry));
};

const parseSessionLength = (value: unknown) => {
  if (typeof value !== "string") {
    return { label: "00:00h", hours: 0 };
  }

  const match = value.trim().match(/^(\d+):(\d{2})h$/i);

  if (!match) {
    return { label: value.trim(), hours: 0 };
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const totalHours = hours + minutes / 60;

  return {
    label: `${match[1].padStart(2, "0")}:${match[2]}h`,
    hours: totalHours
  };
};

export const parseHuntSessionJson = (input: string, fileName: string): HuntSessionSummary => {
  const parsed = JSON.parse(input) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("O arquivo não contém um JSON de hunt válido.");
  }

  const source = parsed as UnknownRecord;
  const balance = parseNumber(readField(source, "Balance"));
  const damage = parseNumber(readField(source, "Damage"));
  const healing = parseNumber(readField(source, "Healing"));
  const loot = parseNumber(readField(source, "Loot"));
  const supplies = parseNumber(readField(source, "Supplies"));
  const xpGain = parseNumber(readField(source, "XP Gain"));
  const xpPerHour = parseNumber(readField(source, "XP/h"));
  const damagePerHour = parseNumber(readField(source, "Damage/h"));
  const healingPerHour = parseNumber(readField(source, "Healing/h"));
  const sessionStart = readField(source, "Session start");
  const sessionEnd = readField(source, "Session end");
  const sessionLength = parseSessionLength(readField(source, "Session length"));
  const killedMonsters = parseArrayItems(readField(source, "Killed Monsters")) as HuntSessionMonster[];
  const lootedItems = parseArrayItems(readField(source, "Looted Items")) as HuntSessionItem[];
  const goldPerHour = sessionLength.hours > 0 ? balance / sessionLength.hours : 0;
  const totalMonstersKilled = killedMonsters.reduce((sum, monster) => sum + monster.count, 0);
  const mostKilledMonster = killedMonsters.reduce<HuntSessionMonster | null>((current, monster) => {
    if (!current || monster.count > current.count) {
      return monster;
    }

    return current;
  }, null);
  const totalLootedItems = lootedItems.reduce((sum, item) => sum + item.count, 0);

  const hasRelevantData =
    balance !== 0 ||
    damage !== 0 ||
    healing !== 0 ||
    loot !== 0 ||
    supplies !== 0 ||
    xpGain !== 0 ||
    xpPerHour !== 0 ||
    killedMonsters.length > 0 ||
    lootedItems.length > 0;

  if (!hasRelevantData) {
    throw new Error("O JSON não parece ser um relatório de hunt compatível.");
  }

  return {
    fileName,
    balance,
    damage,
    healing,
    loot,
    supplies,
    xpGain,
    xpPerHour,
    sessionLength: sessionLength.label,
    sessionHours: sessionLength.hours,
    sessionStart: typeof sessionStart === "string" ? sessionStart : undefined,
    sessionEnd: typeof sessionEnd === "string" ? sessionEnd : undefined,
    goldPerHour,
    damagePerHour,
    healingPerHour,
    totalMonstersKilled,
    mostKilledMonster: mostKilledMonster?.name,
    totalLootedItems,
    killedMonsters,
    lootedItems
  };
};