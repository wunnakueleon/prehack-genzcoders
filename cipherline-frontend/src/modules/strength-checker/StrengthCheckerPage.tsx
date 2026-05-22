import { useEffect, useMemo, useState } from "react";
import { Ic } from "../shared/icon";
import { PageHero, PageShell, StrengthPill } from "../shared/ui";
import { analyzeStrength, generatePassword } from "../shared/utils";
import { ACCOUNTS } from "../shared/data";
import PasswordInput from "./components/PasswordInput";
import StrengthMeter from "./components/StrengthMeter";
import StrengthRecommendations from "./components/StrengthRecommendations";
import type { StrengthAnalysis } from "./strength.types";
import api from "../../api";

function StrengthCheckerPage() {
  const [pw, setPw] = useState("");
  const [analysis, setAnalysis] = useState<StrengthAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounced API call to backend /api/strength
  useEffect(() => {
    if (!pw) {
      return;
    }

    const timer = setTimeout(() => {
      api
        .post<StrengthAnalysis>("/strength", { password: pw })
        .then((res) => {
          setAnalysis(res.data);
        })
        .catch((err) => {
          console.warn("Backend strength API failed or unreachable, falling back to local analysis", err);
          // Local fallback analysis for offline resilience
          const localResult = analyzeStrength(pw);
          setAnalysis(localResult);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 150); // 150ms debounce

    return () => clearTimeout(timer);
  }, [pw]);

  const handlePasswordChange = (value: string) => {
    setPw(value);
    if (!value) {
      setAnalysis(null);
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  const generateSample = () => {
    handlePasswordChange(generatePassword(18));
  };

  const ranked = useMemo(() => {
    return ACCOUNTS.map((a) => ({
      ...a,
      strength: analyzeStrength(a.password),
    })).sort((a, b) => a.strength.score - b.strength.score);
  }, []);

  const counts = useMemo(() => {
    const c = { weak: 0, decent: 0, strong: 0 };
    ranked.forEach((a) => {
      if (a.strength.score < 2) c.weak++;
      else if (a.strength.score < 3) c.decent++;
      else c.strong++;
    });
    return c;
  }, [ranked]);

  return (
    <PageShell>
      <div className="flex flex-col gap-6 sm:gap-7 px-1 sm:px-0">
        <div className="[&_.page-hero]:flex-col sm:[&_.page-hero]:flex-row [&_.page-hero]:items-start sm:[&_.page-hero]:items-center [&_.page-hero]:gap-4 sm:[&_.page-hero]:gap-5 [&_.page-hero]:p-4 sm:[&_.page-hero]:p-[22px] [&_.page-hero>div:first-child]:w-[52px] [&_.page-hero>div:first-child]:h-[52px] sm:[&_.page-hero>div:first-child]:w-[60px] sm:[&_.page-hero>div:first-child]:h-[60px]">
        <PageHero
          tone="accent"
          icon={<Ic.shield />}
          kicker="Security · Strength Checker"
          title="How strong is your password?"
          sub="Type or paste any password to see its entropy, charset coverage, weak patterns, and estimated time to crack — calculated in real-time by the backend API with instant client-side fallback."
        />
        </div>

        <div className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[oklch(0.14_0.018_245/0.55)] [backdrop-filter:blur(14px)] p-5 sm:p-[22px] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h3 className="m-0 text-[15px] font-mono font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_8px_var(--accent-glow)] shrink-0" />
              Password tester
            </h3>
            <button className="btn-ghost w-full sm:w-auto justify-center" onClick={generateSample}>
              <Ic.sparkle /> Generate sample
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4 sm:gap-5 items-start">
            <div className="min-w-0">
              <PasswordInput
                value={pw}
                onChange={handlePasswordChange}
                onGenerate={generateSample}
              />

              {pw ? (
                <StrengthMeter
                  password={pw}
                  analysis={analysis}
                  loading={loading}
                />
              ) : (
                <div className="mt-5 p-[22px_16px] sm:p-[30px_20px] text-center text-[var(--text-muted)] border border-dashed border-[var(--border-strong)] rounded-[var(--r-md)] bg-[oklch(0.12_0.018_245/0.4)] font-mono text-[11px] sm:text-[12px] tracking-[0.08em]">
                  // start typing to see live analysis
                </div>
              )}
            </div>

            <StrengthRecommendations analysis={analysis} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-3">
          <div className="p-4 sm:p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
            <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Weak in vault</div>
            <div className="font-mono text-[26px] sm:text-[28px] font-semibold leading-none mt-1 mb-1 text-[var(--danger)]">{counts.weak}</div>
            <div className="text-[11px] text-[var(--text-dim)] font-mono">below decent threshold</div>
          </div>
          <div className="p-4 sm:p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
            <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Decent</div>
            <div className="font-mono text-[26px] sm:text-[28px] font-semibold leading-none mt-1 mb-1 text-[var(--warn)]">{counts.decent}</div>
            <div className="text-[11px] text-[var(--text-dim)] font-mono">could be stronger</div>
          </div>
          <div className="p-4 sm:p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
            <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Strong / Hardened</div>
            <div className="font-mono text-[26px] sm:text-[28px] font-semibold leading-none mt-1 mb-1 text-[var(--accent)]">{counts.strong}</div>
            <div className="text-[11px] text-[var(--text-dim)] font-mono">passes all checks</div>
          </div>
          <div className="p-4 sm:p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
            <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Total entries</div>
            <div className="font-mono text-[26px] sm:text-[28px] font-semibold leading-none mt-1 mb-1 text-[var(--cyan)]">{ranked.length}</div>
            <div className="text-[11px] text-[var(--text-dim)] font-mono">in this vault</div>
          </div>
        </div>

        <div className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[oklch(0.14_0.018_245/0.55)] [backdrop-filter:blur(14px)] p-5 sm:p-[22px] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-4">
            <h3 className="m-0 text-[15px] font-mono font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_8px_var(--accent-glow)] shrink-0" />
              Vault rankings · weakest first
            </h3>
            <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.08em]">
              {ranked.length} entries · sorted by score
            </span>
          </div>

          {ranked.map((a) => (
            <div
              key={a.id}
              className="row-item !p-4 sm:!p-[12px_14px] !gap-x-4 !gap-y-2 !items-start sm:!items-center"
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
                <div className="meta">{a.domain}</div>
              </div>
              <div className="pw">
                {"•".repeat(Math.min(14, a.password.length))}{" "}
                <span className="text-[var(--text-dim)]">
                  {" "}
                  · {a.password.length} chars
                </span>
              </div>
              <div className="meta-cell flex flex-col items-start sm:items-end gap-1">
                <StrengthPill score={a.strength.score} />
                <span className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.08em]">
                  {a.strength.entropy} bits
                </span>
              </div>
              <div className="actions-cell flex items-start sm:items-center justify-end">
                <button className="mini-btn" aria-label="Rotate">
                  <Ic.refresh />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default StrengthCheckerPage;
