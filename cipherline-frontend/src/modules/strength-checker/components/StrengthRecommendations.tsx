import type { StrengthAnalysis } from "../strength.types";

interface StrengthRecommendationsProps {
  analysis: StrengthAnalysis | null;
}

export default function StrengthRecommendations({
  analysis,
}: StrengthRecommendationsProps) {
  const suggestions = analysis?.suggestions?.length
    ? analysis.suggestions
    : ["Type a password to get practical hardening tips."];
  const passedChecks = analysis?.checks?.filter((check) => check.passed).length ?? 0;
  const totalChecks = analysis?.checks?.length ?? 0;

  return (
    <aside className="border border-[var(--border)] rounded-[var(--r-md)] bg-[oklch(0.13_0.018_245/0.72)] p-4 sm:p-5 h-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
            Hardening tips
          </div>
          <h3 className="m-0 mt-1 text-[18px] font-semibold text-[var(--text)]">
            {analysis ? `${analysis.label} verdict` : "Waiting for input"}
          </h3>
        </div>
        <div className="font-mono text-[11px] text-[var(--accent)] border border-[oklch(0.86_0.20_142/0.35)] rounded-full px-2.5 py-1 bg-[var(--accent-soft)] whitespace-nowrap">
          {totalChecks ? `${passedChecks}/${totalChecks}` : "0/0"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-[var(--r-sm)] border border-[var(--border)] bg-[oklch(0.16_0.02_245/0.48)] p-3">
          <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.1em]">
            Length
          </div>
          <div className="font-mono text-[20px] leading-none mt-1 text-[var(--text)]">
            {analysis?.length ?? 0}
          </div>
        </div>
        <div className="rounded-[var(--r-sm)] border border-[var(--border)] bg-[oklch(0.16_0.02_245/0.48)] p-3">
          <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.1em]">
            Crack time
          </div>
          <div className="font-mono text-[14px] leading-tight mt-1 text-[var(--text)] break-words">
            {analysis?.crackTime?.label ?? "--"}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {suggestions.slice(0, 4).map((suggestion) => (
          <div
            key={suggestion}
            className="text-[12px] sm:text-[13px] leading-[1.45] text-[var(--text-muted)] border border-[var(--border)] rounded-[var(--r-sm)] bg-[oklch(0.16_0.02_245/0.34)] p-3"
          >
            {suggestion}
          </div>
        ))}
      </div>
    </aside>
  );
}
