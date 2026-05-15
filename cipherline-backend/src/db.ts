import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env["DATABASE_URL"] ?? "file:./dev.db",
});

const db = new PrismaClient({ adapter });

export default db;
