import { Router } from "express";
import { z } from "zod";
import prisma from "../prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { toDate } from "../utils/date";

const router = Router();

const updateSchema = z.object({
  characterId: z.string().optional(),
  originalText: z.string().min(4, "Informe o texto original."),
  expiresAt: z.string().datetime().optional(),
  balanceDays: z.number().int().nonnegative().optional(),
  remainingTimeText: z.string().optional()
});

router.get("/history", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const characterId = typeof req.query.characterId === "string" ? req.query.characterId : undefined;

  const records = await prisma.premiumTimeRecord.findMany({
    where: {
      userId,
      characterId
    },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ records });
});

router.get("/latest", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const latest = await prisma.premiumTimeRecord.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ record: latest ?? null });
});

router.post("/update", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos.", errors: parsed.error.flatten() });
  }

  const userId = (req as AuthRequest).userId;
  const data = parsed.data;

  const record = await prisma.premiumTimeRecord.create({
    data: {
      userId,
      characterId: data.characterId,
      originalText: data.originalText,
      expiresAt: toDate(data.expiresAt) ?? undefined,
      balanceDays: data.balanceDays,
      remainingTimeText: data.remainingTimeText
    }
  });

  return res.status(201).json({ record });
});

export default router;
