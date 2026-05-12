import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId: string;
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }
  return secret;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token ausente." });
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;

    if (!payload?.sub || typeof payload.sub !== "string") {
      return res.status(401).json({ message: "Token inválido." });
    }

    (req as AuthRequest).userId = payload.sub;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido." });
  }
};
