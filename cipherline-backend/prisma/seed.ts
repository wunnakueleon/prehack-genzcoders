import db from "../src/db.js";
import bcrypt from "bcrypt";

async function main() {
  const hashed = await bcrypt.hash("password123", 10);

  const jenny = await db.user.upsert({
    where: { email: "jenny@cipherline.dev" },
    update: {},
    create: { id: "cipherline-demo", username: "jenny", email: "jenny@cipherline.dev", password: hashed },
  });

  // Clear existing entries so re-running seed stays clean
  await db.passwordEntry.deleteMany({ where: { userId: jenny.id } });

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000);

  await db.passwordEntry.createMany({
    data: [
      {
        userId: jenny.id,
        siteName: "GitHub",
        siteUrl: "https://github.com",
        usernameForSite: "jenny_dev",
        encryptedPassword: "Gh7#mPx!K9vR2z",
        breachStatus: "safe",
        expiryDate: daysFromNow(72),  // 18d old, 90d policy → 72d left
        createdAt: daysAgo(18),
      },
      {
        userId: jenny.id,
        siteName: "Netflix",
        siteUrl: "https://netflix.com",
        usernameForSite: "jenny@email.com",
        encryptedPassword: "Summer2024!",
        breachStatus: "compromised",
        expiryDate: daysAgo(52),      // 142d old, 90d policy → expired 52d ago
        createdAt: daysAgo(142),
      },
      {
        userId: jenny.id,
        siteName: "Notion",
        siteUrl: "https://notion.so",
        usernameForSite: "jenny_dev",
        encryptedPassword: "N0t!0nK9xQz#mR",
        breachStatus: "safe",
        expiryDate: daysFromNow(3),   // 57d old, 60d policy → expires in 3d
        createdAt: daysAgo(57),
      },
      {
        userId: jenny.id,
        siteName: "Figma",
        siteUrl: "https://figma.com",
        usernameForSite: "jenny.design",
        encryptedPassword: "Summer2024!",  // same as Netflix → duplicate
        breachStatus: "unchecked",
        expiryDate: null,
        createdAt: daysAgo(30),
      },
      {
        userId: jenny.id,
        siteName: "Dropbox",
        siteUrl: "https://dropbox.com",
        usernameForSite: "jenny_backup",
        encryptedPassword: "Dr0pB0x!7kQzXm",
        breachStatus: "unchecked",
        expiryDate: null,
        createdAt: daysAgo(5),
      },
      {
        userId: jenny.id,
        siteName: "LinkedIn",
        siteUrl: "https://linkedin.com",
        usernameForSite: "jenny@email.com",
        encryptedPassword: "L!nk3dIn9xQzMr",
        breachStatus: "compromised",
        expiryDate: null,
        createdAt: daysAgo(8),
      },
    ],
  });

  console.log("Seeded: jenny with 6 entries — breach, expiry, duplicate all demo-ready");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
