import db from "../src/db.js";
import bcrypt from "bcrypt";

async function main() {
  const hashed = await bcrypt.hash("password123", 10);

  const alice = await db.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: { username: "alice", email: "alice@example.com", password: hashed },
  });

  const bob = await db.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: { username: "bob", email: "bob@example.com", password: hashed },
  });

  await db.message.createMany({
    data: [
      { content: "Hey Bob!", senderId: alice.id, receiverId: bob.id },
      { content: "Hey Alice!", senderId: bob.id, receiverId: alice.id },
      { content: "How's it going?", senderId: alice.id, receiverId: bob.id },
    ],
  });

  console.log("Seeded: alice, bob, 3 messages");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
