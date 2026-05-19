import express from "express";
import { getEntries, createEntry, updateEntry, deleteEntry } from "./vault.controller.js";

const router = express.Router();

router.get("/", getEntries);
router.post("/", createEntry);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router;
