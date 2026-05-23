import type { Request, Response } from "express";
import { analyzeStrength, rotatePasswordStrength } from "./strength.service.js";

export async function checkStrength(req: Request, res: Response): Promise<void> {
  try {
    const password = req.body?.password;

    if (password === undefined || password === null) {
      res.status(400).json({ error: "Password is required" });
      return;
    }

    if (typeof password !== "string") {
      res.status(400).json({ error: "Password must be a string" });
      return;
    }

    const result = await analyzeStrength(req.body);
    res.json(result);
  } catch (error) {
    console.error("Error checking password strength:", error);
    res.status(500).json({ error: "Internal server error during strength analysis" });
  }
}

export async function rotateStrengthPassword(req: Request, res: Response): Promise<void> {
  try {
    const accountId = req.body?.accountId;

    if (accountId !== undefined && typeof accountId !== "string") {
      res.status(400).json({ error: "Account id must be a string" });
      return;
    }

    const result = await rotatePasswordStrength(req.body);
    res.json(result);
  } catch (error) {
    console.error("Error rotating password strength sample:", error);
    res.status(500).json({ error: "Internal server error during password rotation" });
  }
}
