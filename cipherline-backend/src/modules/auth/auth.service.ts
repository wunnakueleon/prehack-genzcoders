import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../db.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export async function loginUser(body: unknown) {
  const { email, password } = body as { email: string; password: string };
  if (!email || !password) throw new Error("Email and password are required");

  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  return { userId: user.id, username: user.username, token: signToken(user.id) };
}

export async function signupUser(body: unknown) {
  const { email, username, password } = body as { email: string; username: string; password: string };
  if (!email || !username || !password) throw new Error("Email, username, and password are required");

  const existing = await db.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) throw new Error("Email or username already in use");

  const hashed = await bcrypt.hash(password, 12);
  const user = await db.user.create({ data: { email, username, password: hashed } });

  return { userId: user.id, username: user.username, token: signToken(user.id) };
}
