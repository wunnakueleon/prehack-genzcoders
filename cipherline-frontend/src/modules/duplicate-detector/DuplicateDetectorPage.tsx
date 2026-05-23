import { useMemo, useState } from "react";
import { Ic } from "../shared/icon";
import { PageHero, PageShell } from "../shared/ui";
import { generatePassword } from "../shared/utils";
import { ACCOUNTS } from "../shared/data";

function DuplicateDetectorPage() {
  const [accounts, setAccounts] = useState(ACCOUNTS);

  const clusters = useMemo(() => {
    const buckets: Record<string, (typeof accounts)[number][]> = {};
    accounts.forEach((a) => {
      if (!buckets[a.password]) buckets[a.password] = [];
      buckets[a.password].push(a);
    });
    return Object.entries(buckets)
      .filter(([, items]) => items.length > 1)
      .map(([pw, items]) => ({ pw, items }));
  }, [accounts]);

  const dupCount = useMemo(
    () => clusters.reduce((s, c) => s + c.items.length, 0),
    [clusters],
  );
  const uniqueCount = accounts.length - dupCount;

  const rotate = (acc: (typeof ACCOUNTS)[number]) => {
    setAccounts((arr) =>
      arr.map((a) =>
        a.id === acc.id
          ? {
            ...a,
            password: generatePassword(18),
            breachStatus: "unchecked",
            daysOld: 0,
          }
          : a,
      ),
    );
  };

  const rotateCluster = (cluster: {
    pw: string;
    items: (typeof ACCOUNTS)[number][];
  }) => {
    setAccounts((arr) =>
      arr.map((a) => {
        if (cluster.items.find((x) => x.id === a.id)) {
          return {
            ...a,
            password: generatePassword(18),
            breachStatus: "unchecked",
            daysOld: 0,
          };
        }
        return a;
      }),
    );
  };

  return (
    <PageShell>
      <PageHero
        tone="magenta"
        icon={<Ic.copy />}
        kicker="Security · Duplicate Detector"
        title="One leak compromises all of them"
        sub="When the same password is reused across multiple accounts, a single breach cascades. We've identified the clusters — give each one a unique key."
      />

      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <div className="p-4 rounded-[var(--r-md)] border border-[oklch(0.76_0.18_340/0.3)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Duplicate clusters</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--magenta)]">{clusters.length}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">groups detected</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[oklch(0.76_0.18_340/0.3)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Affected accounts</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--magenta)]">{dupCount}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">sharing passwords</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Unique passwords</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--accent)]">{uniqueCount}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">no reuse detected</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Total entries</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--cyan)]">{accounts.length}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">in this vault</div>
        </div>
      </div>

      {clusters.length === 0 ? (
        <div className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[oklch(0.14_0.018_245/0.55)] [backdrop-filter:blur(14px)] p-[60px_22px] relative text-center">
          <div className="inline-grid place-items-center w-[70px] h-[70px] rounded-[16px] bg-[var(--accent-soft)] text-[var(--accent)] border border-[oklch(0.86_0.20_142/0.3)] mb-4 [box-shadow:0_0_24px_oklch(0.86_0.20_142/0.18)]">
            <Ic.shield size={28} />
          </div>
          <div className="text-[18px] font-semibold mb-1.5">
            No duplicates detected
          </div>
          <div className="text-[var(--text-muted)] text-[13px] font-mono tracking-[0.04em]">
            Every entry in your vault uses a unique password. Keep it that way.
          </div>
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[oklch(0.14_0.018_245/0.55)] [backdrop-filter:blur(14px)] p-[22px] relative">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="m-0 text-[15px] font-mono font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)] flex items-center gap-2">
              <span
                className="w-[7px] h-[7px] rounded-full shrink-0"
                style={{
                  background: "var(--magenta)",
                  boxShadow: "0 0 8px oklch(0.76 0.18 340 / 0.5)",
                }}
              />
              Detected clusters
            </h3>
            <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.08em]">
              {clusters.length} group{clusters.length === 1 ? "" : "s"}
            </span>
          </div>

          {clusters.map((cluster, idx) => (
            <div key={idx} className="dup-cluster">
              <div className="flex items-center gap-[14px] flex-wrap mb-[14px] relative">
                <span className="font-mono text-[11px] py-1 px-[10px] rounded-full text-[var(--magenta)] bg-[oklch(0.76_0.18_340/0.12)] border border-[oklch(0.76_0.18_340/0.3)] tracking-[0.08em] uppercase">
                  Cluster {idx + 1}
                </span>
                <span className="text-[var(--text-muted)] font-mono text-[12px] tracking-[0.06em]">
                  shared password →
                </span>
                <span className="font-mono text-[14px] text-[var(--magenta)] py-1.5 px-[10px] rounded-[6px] bg-[oklch(0.76_0.18_340/0.12)] border border-[oklch(0.76_0.18_340/0.3)] tracking-[0.06em]">
                  {"•".repeat(Math.min(14, cluster.pw.length))}
                </span>
                <span className="font-mono text-[11px] py-1 px-[10px] rounded-full text-[var(--magenta)] bg-[oklch(0.76_0.18_340/0.12)] border border-[oklch(0.76_0.18_340/0.3)] tracking-[0.08em] uppercase">
                  {cluster.items.length} accounts
                </span>
                <button
                  className="btn-ghost ml-auto"
                  style={{ padding: "8px 12px", fontSize: 11 }}
                  onClick={() => rotateCluster(cluster)}
                >
                  <Ic.refresh /> Rotate all
                </button>
              </div>
              <div className="grid [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))] gap-[10px] relative">
                {cluster.items.map((a) => (
                  <div key={a.id} className="dup-cluster-node">
                    <div
                      className="icon-mini"
                      style={{
                        background: `linear-gradient(135deg, ${a.color}, color-mix(in oklch, ${a.color} 60%, oklch(0.15 0.02 245)))`,
                      }}
                    >
                      {a.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium">{a.name}</div>
                      <div className="font-mono text-[10px] text-[var(--text-muted)]">{a.domain}</div>
                    </div>
                    <button
                      className="mini-btn"
                      aria-label="Rotate"
                      onClick={() => rotate(a)}
                    >
                      <Ic.refresh />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default DuplicateDetectorPage;
