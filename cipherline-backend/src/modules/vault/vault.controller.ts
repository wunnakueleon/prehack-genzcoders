import type { Request, Response } from "express";
import { listEntries, addEntry, editEntry, removeEntry } from "./vault.service.js";

export async function getEntries(req: Request, res: Response) {
  const result = await listEntries(req.query["userId"] as string);
  res.json(result);
}

export async function createEntry(req: Request, res: Response) {
  const result = await addEntry(req.body);
  res.json(result);
}

export async function updateEntry(req: Request, res: Response) {
  const result = await editEntry(req.params["id"], req.body);
  res.json(result);
}

export async function deleteEntry(req: Request, res: Response) {
  const result = await removeEntry(req.params["id"]);
  res.json(result);
}
