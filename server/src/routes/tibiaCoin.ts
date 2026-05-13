import { Router } from "express";
import { z } from "zod";
import prisma from "../prisma.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const updateSchema = z.object({
  characterId: z.string().optional(),
  world: z.string().optional(),
  unitPrice: z.number().positive(),
  price250Tc: z.number().positive(),
  source: z.string().min(1)
});

router.get("/history", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const characterId = typeof req.query.characterId === "string" ? req.query.characterId : undefined;
  const world = typeof req.query.world === "string" ? req.query.world : undefined;

  const records = await prisma.tibiaCoinPriceHistory.findMany({
    where: {
      userId,
      characterId,
      world
    },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ records });
});

router.get("/latest", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const latest = await prisma.tibiaCoinPriceHistory.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ record: latest ?? null });
});

router.post("/update-price", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos.", errors: parsed.error.flatten() });
  }

  const userId = (req as AuthRequest).userId;
  const data = parsed.data;

  const record = await prisma.tibiaCoinPriceHistory.create({
    data: {
      userId,
      characterId: data.characterId,
      world: data.world,
      unitPrice: data.unitPrice,
      price250Tc: data.price250Tc,
      source: data.source
    }
  });

  return res.status(201).json({ record });
});

export default router;
