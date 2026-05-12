import { Router } from "express";
import { z } from "zod";
import prisma from "../prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { toDate } from "../utils/date";

const router = Router();

const baseSchema = z.object({
  name: z.string().min(2, "Informe o nome."),
  world: z.string().optional(),
  vocation: z.string().optional(),
  level: z.number().int().nonnegative().optional(),
  sex: z.string().optional(),
  achievementPoints: z.number().int().nonnegative().optional(),
  residence: z.string().optional(),
  guild: z.string().optional(),
  skillsJson: z.any().optional(),
  lastLogin: z.string().datetime().optional(),
  isActive: z.boolean().optional()
});

router.get("/", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const characters = await prisma.character.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
  return res.json({ characters });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = baseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos.", errors: parsed.error.flatten() });
  }

  const userId = (req as AuthRequest).userId;
  const data = parsed.data;
  const lastLogin = toDate(data.lastLogin);

  if (data.isActive) {
    const [created] = await prisma.$transaction([
      prisma.character.updateMany({
        where: { userId },
        data: { isActive: false }
      }),
      prisma.character.create({
        data: {
          userId,
          name: data.name,
          world: data.world,
          vocation: data.vocation,
          level: data.level,
          sex: data.sex,
          achievementPoints: data.achievementPoints,
          residence: data.residence,
          guild: data.guild,
          skillsJson: data.skillsJson,
          lastLogin: lastLogin ?? undefined,
          isActive: true
        }
      })
    ]);

    return res.status(201).json({ character: created });
  }

  const character = await prisma.character.create({
    data: {
      userId,
      name: data.name,
      world: data.world,
      vocation: data.vocation,
      level: data.level,
      sex: data.sex,
      achievementPoints: data.achievementPoints,
      residence: data.residence,
      guild: data.guild,
      skillsJson: data.skillsJson,
      lastLogin: lastLogin ?? undefined,
      isActive: data.isActive ?? false
    }
  });

  return res.status(201).json({ character });
});

router.get("/:id", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const id = String(req.params.id);
  const character = await prisma.character.findFirst({
    where: { id, userId }
  });
  if (!character) {
    return res.status(404).json({ message: "Personagem não encontrado." });
  }

  return res.json({ character });
});

router.put("/:id", requireAuth, async (req, res) => {
  const parsed = baseSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos.", errors: parsed.error.flatten() });
  }

  const userId = (req as AuthRequest).userId;
  const id = String(req.params.id);
  const existing = await prisma.character.findFirst({
    where: { id, userId }
  });
  if (!existing) {
    return res.status(404).json({ message: "Personagem não encontrado." });
  }

  const data = parsed.data;
  const lastLogin = toDate(data.lastLogin);

  if (data.isActive) {
    await prisma.character.updateMany({
      where: { userId },
      data: { isActive: false }
    });
  }

  const updated = await prisma.character.update({
    where: { id },
    data: {
      name: data.name,
      world: data.world,
      vocation: data.vocation,
      level: data.level,
      sex: data.sex,
      achievementPoints: data.achievementPoints,
      residence: data.residence,
      guild: data.guild,
      skillsJson: data.skillsJson,
      lastLogin: lastLogin ?? undefined,
      isActive: data.isActive
    }
  });

  return res.json({ character: updated });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const id = String(req.params.id);
  const existing = await prisma.character.findFirst({
    where: { id, userId }
  });
  if (!existing) {
    return res.status(404).json({ message: "Personagem não encontrado." });
  }

  await prisma.character.delete({ where: { id } });
  return res.status(204).send();
});

router.put("/:id/set-active", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const id = String(req.params.id);
  const existing = await prisma.character.findFirst({
    where: { id, userId }
  });
  if (!existing) {
    return res.status(404).json({ message: "Personagem não encontrado." });
  }

  await prisma.$transaction([
    prisma.character.updateMany({
      where: { userId },
      data: { isActive: false }
    }),
    prisma.character.update({
      where: { id },
      data: { isActive: true }
    })
  ]);

  return res.json({ message: "Personagem ativo atualizado." });
});

export default router;
