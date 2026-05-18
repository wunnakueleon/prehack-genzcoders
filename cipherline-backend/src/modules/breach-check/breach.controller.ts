import type { Request, Response } from "express";
import { runBreachCheck, clearBreachResult } from "./breach.service.js";

export async function checkBreach(req: Request, res: Response) {
  const result = await runBreachCheck(req.body);
  res.json(result);
}

export async function clearBreach(req: Request, res: Response) {
  const result = await clearBreachResult(req.params["id"]);
  res.json(result);
}
