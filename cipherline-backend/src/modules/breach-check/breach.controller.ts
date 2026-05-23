import type { Request, Response } from "express";
import { runBreachCheck, clearBreachResult } from "./breach.service.js";

export async function checkBreach(req: Request, res: Response) {
  try {
    const result = await runBreachCheck(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function clearBreach(req: Request, res: Response) {
  try {
    const result = await clearBreachResult(req.params["id"] as string | undefined);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
