import type { Request, Response } from "express";
import { getStatuses, resetTimer } from "./expiry.service.js";

export async function getExpiryStatus(req: Request, res: Response) {
  const result = await getStatuses(req.body);
  res.json(result);
}

export async function resetExpiry(req: Request, res: Response) {
  const result = await resetTimer(req.params["id"]);
  res.json(result);
}
