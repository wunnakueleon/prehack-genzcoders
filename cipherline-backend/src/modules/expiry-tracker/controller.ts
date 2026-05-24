import type { Request, Response } from "express";
import { listExpiryEntries, rotateExpiryEntry } from "./service.js";

export async function getExpiryEntries(req: Request, res: Response) {
  const result = await listExpiryEntries(req.query["userId"] as string);
  res.json(result);
}

export async function rotateExpiryPassword(req: Request, res: Response) {
  const result = await rotateExpiryEntry(req.params["id"]);
  res.json(result);
}
