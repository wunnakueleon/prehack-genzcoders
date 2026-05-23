import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

async function listExpiryStatuses(_req: Request, res: Response) {
  res.status(501).json({ message: "Not implemented" });
}

async function rotatePassword(_req: Request, res: Response) {
  res.status(501).json({ message: "Not implemented" });
}

router.get("/passwords", listExpiryStatuses);
router.patch("/passwords/:id/rotate", rotatePassword);

export default router;
