import { Router } from "express";
import { z } from "zod";
import prisma from "../prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router = Router();

const updateSchema = z.object({
  characterId: z.string().optional(),
  currentGold: z.number().nonnegative(),
  targetTcAmount: z.number().int().positive(),
  unitTcPrice: z.number().positive(),
  requiredGold: z.number().nonnegative(),
  missingGold: z.number().nonnegative(),
  remainingDays: z.number().int().nonnegative(),
  goldPerDay: z.number().nonnegative(),
  goldPerHour: z.number().nonnegative(),
  hoursPerDay: z.number().nonnegative(),
  status: z.string().min(1)
});

router.get("/history", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const characterId = typeof req.query.characterId === "string" ? req.query.characterId : undefined;

  const records = await prisma.farmGoalHistory.findMany({
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
  const latest = await prisma.farmGoalHistory.findFirst({
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

  const record = await prisma.farmGoalHistory.create({
    data: {
      userId,
      characterId: data.characterId,
      currentGold: data.currentGold,
      targetTcAmount: data.targetTcAmount,
      unitTcPrice: data.unitTcPrice,
      requiredGold: data.requiredGold,
      missingGold: data.missingGold,
      remainingDays: data.remainingDays,
      goldPerDay: data.goldPerDay,
      goldPerHour: data.goldPerHour,
      hoursPerDay: data.hoursPerDay,
      status: data.status
    }
  });

  return res.status(201).json({ record });
});

export default router;
