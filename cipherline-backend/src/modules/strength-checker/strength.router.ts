import express from "express";
import { checkStrength } from "./strength.controller.js";

const router = express.Router();

router.post("/", checkStrength);

export default router;
