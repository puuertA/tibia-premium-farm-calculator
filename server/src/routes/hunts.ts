import { Router } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import prisma from "../prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { toDate } from "../utils/date";
import { mapHuntSessionRow } from "../utils/huntSession";

const router = Router();

const monsterSchema = z.object({
  name: z.string().min(1),
  count: z.number().nonnegative()
});

const importSchema = z.object({
  characterId: z.string().optional().nullable(),
  sourceFileName: z.string().optional().nullable(),
  sessionStart: z.string().optional().nullable(),
  sessionEnd: z.string().optional().nullable(),
  sessionLength: z.string().min(1),
  balance: z.number(),
  loot: z.number(),
  supplies: z.number(),
  xpGain: z.number(),
  xpPerHour: z.number(),
  damage: z.number(),
  damagePerHour: z.number(),
  healing: z.number(),
  healingPerHour: z.number(),
  totalMonstersKilled: z.number().int().nonnegative(),
  mostKilledMonster: z.string().optional().nullable(),
  totalLootedItems: z.number().int().nonnegative(),
  killedMonstersJson: z.array(monsterSchema),
  lootedItemsJson: z.array(monsterSchema)
});

const parseSessionLengthHours = (value: string) => {
  const match = value.trim().match(/^(\d+):(\d{2})h$/i);
  if (!match) {
    return 0;
  }

  return Number(match[1]) + Number(match[2]) / 60;
};

router.get("/history", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const characterId = typeof req.query.characterId === "string" ? req.query.characterId : undefined;

  const records = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT *
    FROM hunt_session_history
    WHERE user_id = ${userId}
      AND (${characterId ?? null} IS NULL OR character_id = ${characterId ?? null})
    ORDER BY created_at DESC
  `;

<<<<<<< HEAD
  return res.json({ records: records.map((record: Record<string, unknown>) => mapHuntSessionRow(record as never)) });
=======
  return res.json({ records: records.map((record) => mapHuntSessionRow(record as never)) });
>>>>>>> 98fe8a8 (feat: initialize project with React, TypeScript, and Tailwind CSS)
});

router.post("/import", requireAuth, async (req, res) => {
  const parsed = importSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos.", errors: parsed.error.flatten() });
  }

  const userId = (req as AuthRequest).userId;
  const data = parsed.data;
  const sessionLengthHours = parseSessionLengthHours(data.sessionLength);
  const profitPerHour = sessionLengthHours > 0 ? data.balance / sessionLengthHours : data.balance;
  await prisma.$executeRaw`
    INSERT INTO hunt_session_history (
      id,
      user_id,
      character_id,
      source_file_name,
      session_start,
      session_end,
      session_length,
      balance,
      loot,
      supplies,
      xp_gain,
      xp_per_hour,
      profit_per_hour,
      damage,
      damage_per_hour,
      healing,
      healing_per_hour,
      total_monsters_killed,
      most_killed_monster,
      total_looted_items,
      killed_monsters_json,
      looted_items_json,
      created_at
    ) VALUES (
      ${randomUUID()},
      ${userId},
      ${data.characterId ?? null},
      ${data.sourceFileName ?? null},
      ${toDate(data.sessionStart)},
      ${toDate(data.sessionEnd)},
      ${data.sessionLength},
      ${data.balance},
      ${data.loot},
      ${data.supplies},
      ${data.xpGain},
      ${data.xpPerHour},
      ${profitPerHour},
      ${data.damage},
      ${data.damagePerHour},
      ${data.healing},
      ${data.healingPerHour},
      ${data.totalMonstersKilled},
      ${data.mostKilledMonster ?? null},
      ${data.totalLootedItems},
      ${JSON.stringify(data.killedMonstersJson)},
      ${JSON.stringify(data.lootedItemsJson)},
      CURRENT_TIMESTAMP
    )
  `;

  const [record] = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT *
    FROM hunt_session_history
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return res.status(201).json({ record: mapHuntSessionRow(record as never) });
});

export default router;