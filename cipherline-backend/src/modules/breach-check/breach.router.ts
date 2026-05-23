import express from "express";
import { checkBreach, clearBreach } from "./breach.controller.js";

const router = express.Router();

router.post("/", checkBreach);
router.delete("/:id", clearBreach);

export default router;
