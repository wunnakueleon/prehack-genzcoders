import type { Request, Response } from "express";
import { loginUser, signupUser } from "./auth.service.js";

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const result = await signupUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
