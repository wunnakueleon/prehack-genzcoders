import db from "../../db.js";

type RawEntry = {
  id: string;
  siteName: string;
  siteUrl: string | null;
  usernameForSite: string;
  encryptedPassword: string;
  breachStatus: string;
  createdAt: Date;
  updatedAt: Date;
};

type EntrySnapshot = Omit<RawEntry, "encryptedPassword">;

type DuplicateCluster = {
  passwordLength: number;
  count: number;
  entries: EntrySnapshot[];
};

type DuplicateResult = {
  clusters: DuplicateCluster[];
  totalEntries: number;
  affectedCount: number;
  uniqueCount: number;
};

export async function findDuplicates(userId: string | undefined): Promise<DuplicateResult> {
  if (!userId) throw new Error("userId is required");

  const entries: RawEntry[] = await db.passwordEntry.findMany({
    where: { userId },
    select: {
      id: true,
      siteName: true,
      siteUrl: true,
      usernameForSite: true,
      encryptedPassword: true,
      breachStatus: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const buckets = new Map<string, RawEntry[]>();
  for (const entry of entries) {
    const group = buckets.get(entry.encryptedPassword) ?? [];
    group.push(entry);
    buckets.set(entry.encryptedPassword, group);
  }

  const clusters: DuplicateCluster[] = [];
  for (const [pw, group] of buckets) {
    if (group.length > 1) {
      clusters.push({
        passwordLength: pw.length,
        count: group.length,
        entries: group.map(({ id, siteName, siteUrl, usernameForSite, breachStatus, createdAt, updatedAt }) => ({
          id,
          siteName,
          siteUrl,
          usernameForSite,
          breachStatus,
          createdAt,
          updatedAt,
        })),
      });
    }
  }

  clusters.sort((a, b) => b.count - a.count);

  const affectedCount = clusters.reduce((sum, c) => sum + c.count, 0);

  return {
    clusters,
    totalEntries: entries.length,
    affectedCount,
    uniqueCount: entries.length - affectedCount,
  };
}
