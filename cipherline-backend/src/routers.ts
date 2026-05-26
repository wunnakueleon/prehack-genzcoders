import express from "express";
import authRouter from "./modules/auth/auth.router.js";
import strengthRouter from "./modules/strength-checker/strength.router.js";
import duplicateRouter from "./modules/duplicate-detector/duplicate.router.js";
import expiryTrackerRouter from "./modules/expiry-tracker/router.js";
import breachRouter from "./modules/breach-check/breach.router.js";
import vaultRouter from "./modules/vault/vault.router.js";
import { requireAuth } from "./middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/strength",       requireAuth, strengthRouter);
router.use("/duplicates",     requireAuth, duplicateRouter);
router.use("/expiry-tracker", requireAuth, expiryTrackerRouter);
router.use("/breach",         requireAuth, breachRouter);
router.use("/vault",          requireAuth, vaultRouter);

export default router;
