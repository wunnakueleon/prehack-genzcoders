import db from "../../db.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type ExpiryEntry = {
  id: string;
  siteName: string;
  siteUrl: string | null;
  usernameForSite: string;
  breachStatus: string;
  expiryDate: Date | null;
  updatedAt: Date;
};

function computeExpiryDays(entry: ExpiryEntry): number | null {
  if (!entry.expiryDate) return null;
  const diffMs = entry.expiryDate.getTime() - entry.updatedAt.getTime();
  return Math.ceil(diffMs / MS_PER_DAY);
}

function computeDaysOld(entry: ExpiryEntry): number {
  const diffMs = Date.now() - entry.updatedAt.getTime();
  return Math.max(0, Math.floor(diffMs / MS_PER_DAY));
}

function formatEntry(entry: ExpiryEntry) {
  return {
    id: entry.id,
    siteName: entry.siteName,
    siteUrl: entry.siteUrl,
    usernameForSite: entry.usernameForSite,
    breachStatus: entry.breachStatus,
    expiryDate: entry.expiryDate,
    updatedAt: entry.updatedAt,
    expiryDays: computeExpiryDays(entry),
    daysOld: computeDaysOld(entry),
  };
}

export async function listExpiryEntries(userId: string | undefined) {
  if (!userId) throw new Error("userId is required");

  const entries = await db.passwordEntry.findMany({
    where: { userId },
    select: {
      id: true,
      siteName: true,
      siteUrl: true,
      usernameForSite: true,
      breachStatus: true,
      expiryDate: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return entries.map((entry) => formatEntry(entry));
}

export async function rotateExpiryEntry(id: string | undefined) {
  if (!id) throw new Error("id is required");

  const entry = await db.passwordEntry.findUnique({
    where: { id },
    select: {
      id: true,
      siteName: true,
      siteUrl: true,
      usernameForSite: true,
      breachStatus: true,
      expiryDate: true,
      updatedAt: true,
    },
  });

  if (!entry) throw new Error("Entry not found");

  const now = Date.now();
  let nextExpiryDate = entry.expiryDate;

  if (entry.expiryDate) {
    const cycleDays = computeExpiryDays(entry);
    const safeCycle = cycleDays && cycleDays > 0 ? cycleDays : 1;
    nextExpiryDate = new Date(now + safeCycle * MS_PER_DAY);
  }

  const updated = await db.passwordEntry.update({
    where: { id },
    data: {
      expiryDate: nextExpiryDate,
      breachStatus: "unchecked",
    },
  });

  return formatEntry({
    id: updated.id,
    siteName: updated.siteName,
    siteUrl: updated.siteUrl,
    usernameForSite: updated.usernameForSite,
    breachStatus: updated.breachStatus,
    expiryDate: updated.expiryDate,
    updatedAt: updated.updatedAt,
  });
}
