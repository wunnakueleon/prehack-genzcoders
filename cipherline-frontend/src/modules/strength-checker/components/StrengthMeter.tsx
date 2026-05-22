import { useMemo } from "react";

interface StrengthAnalysis {
  score: number;
  label: string;
  entropy: number;
  length: number;
  charset: number;
  issues: string[];
}

interface StrengthMeterProps {
  password: string;
  analysis: StrengthAnalysis | null;
  loading?: boolean;
}

export default function StrengthMeter({
  password,
  analysis,
  loading = false,
}: StrengthMeterProps) {
  const colors = [
    "oklch(0.70 0.20 25)",   // 0: Crackable (Red)
    "oklch(0.78 0.18 50)",   // 1: Weak (Orange/Red)
    "oklch(0.82 0.16 75)",   // 2: Decent (Yellow)
    "oklch(0.86 0.20 142)",  // 3: Strong (Green)
    "oklch(0.86 0.20 142)",  // 4: Hardened (Green with glow)
  ];

  const glow = [
    "oklch(0.70 0.20 25 / 0.5)",
    "oklch(0.78 0.18 50 / 0.5)",
    "oklch(0.82 0.16 75 / 0.5)",
    "oklch(0.86 0.20 142 / 0.5)",
    "oklch(0.86 0.20 142 / 0.5)",
  ];

  const score = analysis?.score ?? 0;
  const label = analysis?.label ?? "No password";
  const entropy = analysis?.entropy ?? 0;
  const charset = analysis?.charset ?? 0;
  const issues = analysis?.issues ?? ["Empty"];

  const activeColor = colors[score];
  const activeGlow = glow[score];

  const timeToCrack = useMemo(() => {
    if (!entropy) return "—";
    const seconds = Math.pow(2, entropy) / 1e10;
    if (seconds < 1) return "instant";
    if (seconds < 60) return Math.round(seconds) + "s";
    if (seconds < 3600) return Math.round(seconds / 60) + "m";
    if (seconds < 86400) return Math.round(seconds / 3600) + "h";
    if (seconds < 31536000) return Math.round(seconds / 86400) + "d";
    if (seconds < 31536000 * 1000) return Math.round(seconds / 31536000) + "y";
    return "centuries";
  }, [entropy]);

  const entropyFeedback = useMemo(() => {
    if (entropy === 0) return "No entropy";
    if (entropy < 28) return "Very weak";
    if (entropy < 48) return "Weak";
    if (entropy < 64) return "Reasonable";
    if (entropy < 80) return "Strong";
    return "Military-grade";
  }, [entropy]);

  const checks = [
    {
      ok: password.length >= 12,
      label:
        password.length >= 14
          ? `${password.length} characters — long`
          : password.length >= 12
            ? `${password.length} characters — good`
            : `${password.length} characters — too short (min 12)`,
    },
    {
      ok: /[A-Z]/.test(password) && /[a-z]/.test(password),
      label: "Mixed letter case (upper & lowercase)",
    },
    { ok: /\d/.test(password), label: "Contains digits (0-9)" },
    { ok: /[^A-Za-z0-9]/.test(password), label: "Contains symbols (!@#$…)" },
    { ok: !issues.includes("Common word"), label: "No common dictionary words" },
    {
      ok: !issues.some((x) => x.toLowerCase().includes("sequential") || x.toLowerCase().includes("keyboard")),
      label: "No keyboard pattern runs (e.g. qwerty)",
    },
    {
      ok: !issues.includes("Repeating pattern"),
      label: "No repeating character sequences (e.g. aaaa)",
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-[var(--r-md)] bg-[oklch(0.13_0.018_245/0.7)] border border-[var(--border)] mt-4 transition-all duration-300 relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-[oklch(0.13_0.018_245/0.4)] backdrop-filter blur-[1px] flex items-center justify-center z-10">
          <div className="scan-bar w-[80%]">
            <div className="scan-fill" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mb-3.5">
        <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
          Strength Analysis
        </span>
        <span
          className="font-mono text-[14px] font-bold tracking-[0.08em] transition-colors duration-300"
          style={{ color: password ? activeColor : "var(--text-dim)" }}
        >
          {password ? label.toUpperCase() : "NO PASSWORD"}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-4 sm:mb-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1.5 sm:h-2 rounded-[4px] transition-all duration-300"
            style={
              i <= score && password
                ? { background: activeColor, boxShadow: `0 0 12px ${activeGlow}` }
                : { background: "oklch(0.22 0.02 245)" }
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4 sm:mb-5">
        {[
          {
            v: password ? entropy : "0",
            l: "Entropy",
            suffix: " bits",
            sub: password ? entropyFeedback : "N/A",
          },
          {
            v: password ? charset : "0",
            l: "Charset size",
            suffix: "",
            sub: password ? `from ${charset} chars` : "N/A",
          },
          {
            v: password ? timeToCrack : "—",
            l: "Time to crack",
            suffix: "",
            sub: password ? "offline guess" : "N/A",
          },
        ].map((s) => (
          <div
            key={s.l}
            className="border border-[var(--border)] rounded-lg p-3.5 bg-[oklch(0.16_0.02_245/0.5)] transition-all hover:border-[var(--border-strong)]"
          >
            <div className="font-mono text-[18px] sm:text-[20px] font-bold text-[var(--text)] leading-none">
              {s.v}
              {s.suffix ? (
                <span className="text-[11px] font-normal opacity-60 ml-0.5">{s.suffix}</span>
              ) : null}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] tracking-[0.1em] uppercase mt-1">
              {s.l}
            </div>
            <div className="text-[11px] text-[var(--text-dim)] font-mono mt-1">
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border)]">
        <h4 className="font-mono text-[11px] tracking-[0.12em] text-[var(--text-muted)] uppercase m-0 mb-1">
          Security Checklists
        </h4>
        {checks.map((ch, i) => (
          <div
            key={i}
            className={
              "flex items-center gap-3 text-[12px] sm:text-[13px] font-mono py-1.5 px-3 rounded-lg transition-colors " +
              (password ? (ch.ok ? "text-[var(--accent)] bg-[oklch(0.86_0.2_142/0.04)]" : "text-[var(--danger)] bg-[oklch(0.70_0.2_25/0.04)]") : "text-[var(--text-muted)] bg-[oklch(0.16_0.02_245/0.2)]")
            }
          >
            <span
              className={
                "w-2 h-2 rounded-full shrink-0 " +
                (password ? (ch.ok ? "bg-[var(--accent)] [box-shadow:0_0_8px_var(--accent)]" : "bg-[var(--danger)] [box-shadow:0_0_8px_var(--danger)]") : "bg-[var(--text-dim)]")
              }
            />
            <span className="font-semibold w-4">{password ? (ch.ok ? "✓" : "✗") : "•"}</span>
            <span className="flex-1 break-words sm:truncate">{ch.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
