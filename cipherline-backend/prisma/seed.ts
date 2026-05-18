import db from "../src/db.js";
import bcrypt from "bcrypt";

async function main() {
  const hashed = await bcrypt.hash("password123", 10);

  const alice = await db.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: { username: "alice", email: "alice@example.com", password: hashed },
  });

  await db.passwordEntry.createMany({
    data: [
      {
        userId: alice.id,
        siteName: "GitHub",
        siteUrl: "https://github.com",
        usernameForSite: "alice",
        encryptedPassword: "encrypted_abc123",
        breachStatus: "safe",
      },
      {
        userId: alice.id,
        siteName: "Gmail",
        siteUrl: "https://gmail.com",
        usernameForSite: "alice@gmail.com",
        encryptedPassword: "encrypted_abc123",
        breachStatus: "unchecked",
      },
    ],
  });

  console.log("Seeded: alice with 2 password entries");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
