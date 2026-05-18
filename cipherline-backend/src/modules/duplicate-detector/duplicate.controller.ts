import type { Request, Response } from "express";
import { findDuplicates } from "./duplicate.service.js";

export async function detectDuplicates(req: Request, res: Response) {
  const result = await findDuplicates(req.body);
  res.json(result);
}
