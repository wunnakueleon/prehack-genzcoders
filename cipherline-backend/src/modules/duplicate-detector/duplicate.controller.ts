import type { Request, Response } from "express";
import { findDuplicates } from "./duplicate.service.js";

export async function detectDuplicates(req: Request, res: Response) {
  try {
    const userId = req.query["userId"] as string | undefined;
    const result = await findDuplicates(userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
