import type { Request, Response } from "express";
import { analyzeStrength } from "./strength.service.js";

export async function checkStrength(req: Request, res: Response) {
  const result = await analyzeStrength(req.body);
  res.json(result);
}
