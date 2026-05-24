import db from "../../db.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type ExpiryEntry = {
  id: string;
  siteName: string;
  siteUrl: string | null;
  usernameForSite: string;
  breachStatus: string;
  // expiryDays: number | null;
  // lastRotatedAt: Date | null;
  expiryDate: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

function computeDaysOld(entry: ExpiryEntry): number {
  const diffMs = Date.now() - entry.updatedAt.getTime();
  return Math.max(0, Math.floor(diffMs / MS_PER_DAY));
}

function computeExpiryDays(entry: ExpiryEntry): number | null {
  if (!entry.expiryDate) return null;
  const diffMs = entry.expiryDate.getTime() - entry.updatedAt.getTime();
  return Math.ceil(diffMs / MS_PER_DAY);
}

function formatEntry(entry: ExpiryEntry) {
  const daysOld = computeDaysOld(entry);
  return {
    id: entry.id,
    siteName: entry.siteName,
    siteUrl: entry.siteUrl,
    usernameForSite: entry.usernameForSite,
    breachStatus: entry.breachStatus,
    // expiryDays: entry.expiryDays,
    // lastRotatedAt: entry.lastRotatedAt,
    expiryDate: entry.expiryDate,
    updatedAt: entry.updatedAt,
    createdAt: entry.createdAt,
    daysOld,
    expiryDays: computeExpiryDays(entry),
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
      // expiryDays: true,
      // lastRotatedAt: true,
      expiryDate: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return entries.map((entry) => formatEntry(entry));
}

export async function rotateExpiryEntry(id: string | undefined) {
  if (!id) throw new Error("id is required");

  const entry = await db.passwordEntry.update({
    where: { id },
    data: { breachStatus: "unchecked" },
    select: {
      id: true,
      siteName: true,
      siteUrl: true,
      usernameForSite: true,
      breachStatus: true,
      // expiryDays: true,
      // lastRotatedAt: true,
      expiryDate: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return formatEntry(entry);
}
