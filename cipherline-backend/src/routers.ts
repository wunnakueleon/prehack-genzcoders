import express from "express";
import authRouter from "./modules/auth/auth.router.js";
import strengthRouter from "./modules/strength-checker/strength.router.js";
import duplicateRouter from "./modules/duplicate-detector/duplicate.router.js";
import expiryRouter from "./modules/expiry-tracker/expiry.router.js";
import expiryTrackerRouter from "./modules/expiry-tracker/router.js";
import breachRouter from "./modules/breach-check/breach.router.js";
import vaultRouter from "./modules/vault/vault.router.js";

const router = express.Router();

router.use("/auth",       authRouter);
router.use("/strength",   strengthRouter);
router.use("/duplicates", duplicateRouter);
router.use("/expiry",     expiryRouter);
router.use("/expiry-tracker", expiryTrackerRouter);
router.use("/breach",     breachRouter);
router.use("/vault",      vaultRouter);

export default router;
