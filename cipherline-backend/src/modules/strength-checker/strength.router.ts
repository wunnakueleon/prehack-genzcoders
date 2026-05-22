import express from "express";
import { checkStrength, rotateStrengthPassword } from "./strength.controller.js";

const router = express.Router();

router.post("/", checkStrength);
router.post("/rotate", rotateStrengthPassword);

export default router;
