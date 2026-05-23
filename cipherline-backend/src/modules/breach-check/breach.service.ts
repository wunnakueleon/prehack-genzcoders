import { createHash } from "crypto";
import axios from "axios";
import db from "../../db.js";

export async function runBreachCheck(body: unknown) {
  const { password, entryId } = body as { password: string; entryId: string };
  if (!password || !entryId) throw new Error("password and entryId are required");

  const sha1 = createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const response = await axios.get(
    `https://api.pwnedpasswords.com/range/${prefix}`,
    { headers: { "Add-Padding": "true" } }
  );

  const lines: string[] = response.data.split("\n");
  const match = lines.find((line) => line.split(":")[0]?.trim() === suffix);
  const countStr = match?.split(":")[1]?.trim();
  const count = countStr ? parseInt(countStr, 10) : 0;
  const breachStatus = count > 0 ? "compromised" : "safe";

  await db.passwordEntry.update({
    where: { id: entryId },
    data: { breachStatus },
  });

  return { breachStatus, count };
}

export async function clearBreachResult(id: string | undefined) {
  if (!id) throw new Error("id is required");
  return db.passwordEntry.update({
    where: { id },
    data: { breachStatus: "unchecked" },
  });
}
