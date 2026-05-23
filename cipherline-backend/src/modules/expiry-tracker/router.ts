import express from "express";
import { getExpiryEntries, rotateExpiryPassword } from "./controller.js";

const router = express.Router();

router.get("/passwords", getExpiryEntries);
router.patch("/passwords/:id/rotate", rotateExpiryPassword);

export default router;
