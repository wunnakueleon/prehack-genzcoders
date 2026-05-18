import express from "express";
import { getExpiryStatus, resetExpiry } from "./expiry.controller.js";

const router = express.Router();

router.get("/", getExpiryStatus);
router.patch("/:id", resetExpiry);

export default router;
