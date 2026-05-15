import express from "express";
import db from "./db.js";

const router = express.Router();

router.get("/users", async (_req, res) => {
  const users = await db.user.findMany({
    select: { id: true, username: true, email: true, createdAt: true },
  });
  res.json(users);
});

router.get("/messages", async (_req, res) => {
  const messages = await db.message.findMany({
    include: {
      sender: { select: { username: true } },
      receiver: { select: { username: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

export default router;
