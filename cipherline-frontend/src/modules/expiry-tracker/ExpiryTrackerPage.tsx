import { useEffect, useMemo, useState } from "react";
import { Ic } from "../shared/icon";
import { PageHero, PageShell } from "../shared/ui";
import { getExpiryStatus } from "../shared/utils";
import api from "../../api";

const DEMO_USER_ID =
  typeof window !== "undefined"
    ? window.localStorage.getItem("userId") || "cipherline-demo"
    : "cipherline-demo";

type ExpiryEntryResponse = {
  id: string;
  siteName: string;
  siteUrl: string | null;
  usernameForSite: string;
  breachStatus: string;
  expiryDate: string | null;
  updatedAt: string;
  expiryDays: number | null;
  daysOld: number;
};

type ExpiryAccount = {
  id: string;
  name: string;
  domain: string;
  username: string;
  color: string;
  initial: string;
  daysOld: number;
  expiryDays: number | null;
  breachStatus: string;
  breachCount: number;
};

const ACCOUNT_COLORS = [
  "oklch(0.86 0.20 142)",
  "oklch(0.82 0.16 75)",
  "oklch(0.76 0.18 290)",
  "oklch(0.76 0.18 340)",
  "oklch(0.82 0.14 215)",
];

function getDomain(siteUrl: string | null, fallback: string) {
  if (!siteUrl) return fallback;

  try {
    return new URL(siteUrl).hostname.replace(/^www\./, "");
  } catch {
    return siteUrl.replace(/^https?:\/\//, "").replace(/^www\./, "") || fallback;
  }
}

function toExpiryAccount(entry: ExpiryEntryResponse, index: number): ExpiryAccount {
  return {
    id: entry.id,
    name: entry.siteName,
    domain: getDomain(entry.siteUrl, entry.usernameForSite),
    username: entry.usernameForSite,
    color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length] ?? ACCOUNT_COLORS[0],
    initial: entry.siteName.trim().charAt(0).toUpperCase() || "?",
    daysOld: entry.daysOld,
    expiryDays: entry.expiryDays,
    breachStatus: entry.breachStatus,
    breachCount: 0,
  };
}

function ExpiryTrackerPage() {
  const [accounts, setAccounts] = useState<ExpiryAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get<ExpiryEntryResponse[]>("/expiry-tracker/passwords", {
        params: { userId: DEMO_USER_ID },
      })
      .then((res) => {
        if (cancelled) return;
        setAccounts(res.data.map(toExpiryAccount));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("Expiry tracker API failed", err);
        setAccounts([]);
        setError("Unable to load expiry tracker data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const enriched = useMemo(() => {
    return accounts
      .map((a) => ({ ...a, expiry: getExpiryStatus(a) }))
      .sort((a, b) => a.expiry.daysLeft - b.expiry.daysLeft);
  }, [accounts]);

  const stats = useMemo(() => {
    let expired = 0,
      soon = 0,
      fresh = 0;
    enriched.forEach((a) => {
      if (a.expiry.kind === "expired") expired++;
      else if (a.expiry.kind === "soon") soon++;
      else fresh++;
    });
    return { expired, soon, fresh };
  }, [enriched]);

  // timeline: map daysLeft from -60..90 to 0..100%
  const minDay = -60,
    maxDay = 90;
  const pctFor = (d: number) =>
    Math.max(0, Math.min(100, ((d - minDay) / (maxDay - minDay)) * 100));

  const rotate = async (acc: ExpiryAccount) => {
    try {
      const { data } = await api.patch<ExpiryEntryResponse>(
        `/expiry-tracker/passwords/${acc.id}/rotate`,
      );

      setAccounts((arr) =>
        arr.map((item) =>
          item.id === acc.id
            ? {
                ...item,
                name: data.siteName,
                domain: getDomain(data.siteUrl, data.usernameForSite),
                username: data.usernameForSite,
                daysOld: data.daysOld,
                expiryDays: data.expiryDays,
                breachStatus: data.breachStatus,
              }
            : item,
        ),
      );
    } catch (err) {
      console.warn("Rotate expiry failed", err);
    }
  };

  return (
    <PageShell>
      <PageHero
        tone="warn"
        icon={<Ic.refresh />}
        kicker="Security · Expiry Tracker"
        title="Rotation timeline"
        sub="Every credential ages. Track which passwords are due for rotation, which are overdue, and how long until the next rotation cycle hits."
      />

      {loading ? (
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)] font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
          Loading expiry tracker data...
        </div>
      ) : error ? (
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)] font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Expired</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--danger)]">{stats.expired}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">past rotation date</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Expiring ≤ 7d</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--warn)]">{stats.soon}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">rotation due soon</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Fresh</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--accent)]">{stats.fresh}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">healthy lifetime</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Total tracked</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--cyan)]">{enriched.length}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">in this vault</div>
        </div>
      </div>

      <div className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[oklch(0.14_0.018_245/0.55)] [backdrop-filter:blur(14px)] p-[22px] relative">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="m-0 text-[15px] font-mono font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)] flex items-center gap-2">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_8px_var(--accent-glow)] shrink-0" />
            Lifetime timeline
          </h3>
          <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.08em]">
            −60d &nbsp;←&nbsp; now &nbsp;→&nbsp; +90d
          </span>
        </div>

        <div className="timeline-bar">
          {/* "now" line at daysLeft=0 */}
          <div className="now-line" style={{ left: `${pctFor(0)}%` }} />
          {enriched.map((a) => (
            <div
              key={a.id}
              className={"marker " + a.expiry.kind}
              style={{ left: `${pctFor(a.expiry.daysLeft)}%` }}
            >
              <div className="tooltip">
                {a.name} · {a.expiry.label}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-mono text-[10px] text-[var(--text-dim)] tracking-[0.08em] -mt-4 mb-2">
          <span>−60d expired</span>
          <span>−30d</span>
          <span className="text-[oklch(1_0_0/0.7)]">NOW</span>
          <span>+30d</span>
          <span>+60d</span>
          <span>+90d fresh</span>
        </div>
      </div>

      <div className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[oklch(0.14_0.018_245/0.55)] [backdrop-filter:blur(14px)] p-[22px] relative">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="m-0 text-[15px] font-mono font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)] flex items-center gap-2">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_8px_var(--accent-glow)] shrink-0" />
            Rotation queue · most urgent first
          </h3>
        </div>

        {enriched.map((a) => {
          const kind = a.expiry.kind;
          return (
            <div
              key={a.id}
              className="row-item"
              style={{
                borderColor:
                  kind === "expired"
                    ? "oklch(0.70 0.20 25 / 0.3)"
                    : kind === "soon"
                      ? "oklch(0.82 0.16 75 / 0.3)"
                      : "var(--border)",
                background:
                  kind === "expired"
                    ? "oklch(0.70 0.20 25 / 0.06)"
                    : "oklch(0.13 0.018 245 / 0.6)",
              }}
            >
              <div
                className="icon-mini"
                style={{
                  background: `linear-gradient(135deg, ${a.color}, color-mix(in oklch, ${a.color} 60%, oklch(0.15 0.02 245)))`,
                }}
              >
                {a.initial}
              </div>
              <div className="title-block">
                <div className="title">{a.name}</div>
                <div className="meta">
                  Policy: rotate every {a.expiryDays || "—"}d · last set{" "}
                  {a.daysOld}d ago
                </div>
              </div>
              <div
                className="pw"
                style={{
                  color:
                    kind === "expired"
                      ? "var(--danger)"
                      : kind === "soon"
                        ? "var(--warn)"
                        : "var(--text-muted)",
                  fontWeight: kind === "expired" ? 600 : 400,
                }}
              >
                {a.expiry.label}
              </div>
              <div className="meta-cell">
                {kind === "expired" ? (
                  <span className="status-badge expired">
                    <Ic.bolt /> Overdue
                  </span>
                ) : kind === "soon" ? (
                  <span className="status-badge soon">
                    <Ic.refresh /> Due soon
                  </span>
                ) : (
                  <span className="status-badge fresh">
                    <Ic.shield /> Fresh
                  </span>
                )}
              </div>
              <div className="actions-cell">
                <button
                  className="btn-ghost"
                  style={{ padding: "8px 12px", fontSize: 11 }}
                  onClick={() => rotate(a)}
                >
                  <Ic.refresh /> Rotate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

export default ExpiryTrackerPage;
