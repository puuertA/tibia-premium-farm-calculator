import { Router } from "express";
import { z } from "zod";
import prisma from "../prisma.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const updateSchema = z.object({
  name: z.string().min(2, "Informe o nome.").optional(),
  email: z.string().email("E-mail inválido.").optional()
});

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastLoginAt: user.lastLoginAt
});

router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  return res.json({ user: sanitizeUser(user) });
});

router.put("/me", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos.", errors: parsed.error.flatten() });
  }

  const userId = (req as AuthRequest).userId;
  const { name, email } = parsed.data;

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      return res.status(409).json({ message: "E-mail já cadastrado." });
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email
    }
  });

  return res.json({ user: sanitizeUser(updated) });
});

export default router;
