import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid token" });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as { userId: string };
    (req as Request & { userId: string }).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Token expired or invalid" });
  }
}
