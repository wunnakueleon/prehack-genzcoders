import db from "../src/db.js";
import bcrypt from "bcrypt";

async function main() {
  const hashed = await bcrypt.hash("password123", 10);

  const demo = await db.user.upsert({
    where: { email: "demo@cipherline.dev" },
    update: {},
    create: { id: "cipherline-demo", username: "demo", email: "demo@cipherline.dev", password: hashed },
  });

  // Clear existing entries so re-running seed stays clean
  await db.passwordEntry.deleteMany({ where: { userId: demo.id } });

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000);

  await db.passwordEntry.createMany({
    data: [
      {
        userId: demo.id,
        siteName: "Wunna Moe San",
        siteUrl: "https://github.com",
        usernameForSite: "wunnamoesan",
        encryptedPassword: "rT9$mZeq!4kVc8L",
        breachStatus: "safe",
        expiryDate: daysFromNow(72),   // set 18 days ago, expires in 72 (90-day policy)
        createdAt: daysAgo(18),
      },
      {
        userId: demo.id,
        siteName: "Gloria",
        siteUrl: "https://figma.com",
        usernameForSite: "gloria.design",
        encryptedPassword: "Summer2024!",
        breachStatus: "compromised",
        expiryDate: daysAgo(52),       // already expired (set 142d ago, 90-day policy)
        createdAt: daysAgo(142),
      },
      {
        userId: demo.id,
        siteName: "Min Thuta",
        siteUrl: "https://notion.so",
        usernameForSite: "min.thuta",
        encryptedPassword: "Q7p#Lz!93B$mVxq2",
        breachStatus: "safe",
        expiryDate: daysFromNow(5),    // expiring soon (set 55d ago, 60-day policy)
        createdAt: daysAgo(55),
      },
      {
        userId: demo.id,
        siteName: "Nan",
        siteUrl: "https://instagram.com",
        usernameForSite: "nan.social",
        encryptedPassword: "wH4!pT7nQz#m2Rb9",
        breachStatus: "unchecked",
        expiryDate: daysFromNow(52),   // 8 days in, 60-day policy
        createdAt: daysAgo(8),
      },
    ],
  });

  console.log("Seeded: demo user with 4 password entries (Wunna, Gloria, Min Thuta, Nan)");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
