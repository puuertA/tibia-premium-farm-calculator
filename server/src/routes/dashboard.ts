import { Router } from "express";
import prisma from "../prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { mapHuntSessionRow } from "../utils/huntSession";

const router = Router();

router.get("/summary", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;

  const [user, characters, activeCharacter, premiumLatest, coinLatest, farmLatest] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.character.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    prisma.character.findFirst({ where: { userId, isActive: true } }),
    prisma.premiumTimeRecord.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.tibiaCoinPriceHistory.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.farmGoalHistory.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } })
  ]);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  const [premiumHistory, coinHistory, farmHistory] = await Promise.all([
    prisma.premiumTimeRecord.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.tibiaCoinPriceHistory.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.farmGoalHistory.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 })
  ]);

  const huntLatestRows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT *
    FROM hunt_session_history
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const huntHistoryRows = await prisma.$queryRaw<Array<Record<string, unknown>>>`
    SELECT *
    FROM hunt_session_history
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 120
  `;

  const huntLatest = huntLatestRows[0] ? mapHuntSessionRow(huntLatestRows[0] as never) : null;
  const huntHistory = huntHistoryRows.map((record: Record<string, unknown>) => mapHuntSessionRow(record as never));

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt
    },
    characters,
    activeCharacter,
    counts: {
      characters: characters.length,
      premiumRecords: premiumHistory.length,
      coinRecords: coinHistory.length,
      farmRecords: farmHistory.length,
      huntRecords: huntHistory.length
    },
    latest: {
      premiumTime: premiumLatest ?? null,
      tibiaCoin: coinLatest ?? null,
      farmGoal: farmLatest ?? null,
      huntSession: huntLatest ?? null
    },
    history: {
      premiumTime: premiumHistory,
      tibiaCoin: coinHistory,
      farmGoal: farmHistory,
      huntSession: huntHistory
    }
  });
});

export default router;
