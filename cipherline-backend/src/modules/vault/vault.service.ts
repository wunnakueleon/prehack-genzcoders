import db from "../../db.js";

export async function listEntries(userId: string | undefined) {
  if (!userId) throw new Error("userId is required");
  return db.passwordEntry.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function addEntry(body: unknown) {
  const { userId, siteName, usernameForSite, encryptedPassword, siteUrl, expiryDate } =
    body as {
      userId: string;
      siteName: string;
      usernameForSite: string;
      encryptedPassword: string;
      siteUrl?: string;
      expiryDate?: string;
    };

  if (!userId || !siteName || !usernameForSite || !encryptedPassword) {
    throw new Error("userId, siteName, usernameForSite, and encryptedPassword are required");
  }

  return db.passwordEntry.create({
    data: {
      userId,
      siteName,
      usernameForSite,
      encryptedPassword,
      siteUrl: siteUrl ?? null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    },
  });
}

export async function editEntry(id: string | undefined, body: unknown) {
  if (!id) throw new Error("id is required");
  const { siteName, usernameForSite, encryptedPassword, siteUrl, expiryDate, breachStatus } =
    body as {
      siteName?: string;
      usernameForSite?: string;
      encryptedPassword?: string;
      siteUrl?: string;
      expiryDate?: string | null;
      breachStatus?: string;
    };

  return db.passwordEntry.update({
    where: { id },
    data: {
      ...(siteName !== undefined && { siteName }),
      ...(usernameForSite !== undefined && { usernameForSite }),
      ...(encryptedPassword !== undefined && { encryptedPassword }),
      ...(siteUrl !== undefined && { siteUrl }),
      ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
      ...(breachStatus !== undefined && { breachStatus }),
    },
  });
}

export async function removeEntry(id: string | undefined) {
  if (!id) throw new Error("id is required");
  return db.passwordEntry.delete({ where: { id } });
}
