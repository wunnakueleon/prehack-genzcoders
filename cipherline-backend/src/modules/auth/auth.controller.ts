import type { Request, Response } from "express";
import { loginUser, signupUser } from "./auth.service.js";

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body);
  res.json(result);
}

export async function signup(req: Request, res: Response) {
  const result = await signupUser(req.body);
  res.json(result);
}
