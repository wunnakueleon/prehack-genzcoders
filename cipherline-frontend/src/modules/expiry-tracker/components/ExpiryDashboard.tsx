type ExpirySummary = {
  total: number;
  expired: number;
  soon: number;
};

export default function ExpiryDashboard({
  summary,
}: {
  summary?: ExpirySummary;
}) {
  const totals = summary ?? { total: 0, expired: 0, soon: 0 };

  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] gap-3">
      <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Total</div>
        <div className="font-mono text-[24px] font-semibold leading-none mt-1 mb-0.5 text-[var(--cyan)]">
          {totals.total}
        </div>
        <div className="text-[11px] text-[var(--text-dim)] font-mono">tracked entries</div>
      </div>
      <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Expired</div>
        <div className="font-mono text-[24px] font-semibold leading-none mt-1 mb-0.5 text-[var(--danger)]">
          {totals.expired}
        </div>
        <div className="text-[11px] text-[var(--text-dim)] font-mono">overdue now</div>
      </div>
      <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Due soon</div>
        <div className="font-mono text-[24px] font-semibold leading-none mt-1 mb-0.5 text-[var(--warn)]">
          {totals.soon}
        </div>
        <div className="text-[11px] text-[var(--text-dim)] font-mono">within 7 days</div>
      </div>
    </div>
  );
}
