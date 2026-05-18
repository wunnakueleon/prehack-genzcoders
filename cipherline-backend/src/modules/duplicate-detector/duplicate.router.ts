import express from "express";
import { detectDuplicates } from "./duplicate.controller.js";

const router = express.Router();

router.get("/", detectDuplicates);

export default router;
