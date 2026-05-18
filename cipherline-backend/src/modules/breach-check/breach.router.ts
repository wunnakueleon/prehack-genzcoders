import express from "express";
import { checkBreach, clearBreach } from "./breach.controller.js";

const router = express.Router();

router.get("/", checkBreach);
router.delete("/:id", clearBreach);

export default router;
