import { useState, useMemo } from "react";
import { Ic } from "./icon";
import { CATEGORIES } from "./data";

function BrandMark() {
  return (
    <div className="inline-flex items-center gap-3 font-mono font-semibold tracking-[0.02em] text-[18px]">
      <img src="/cipherline.png" alt="cipherline" width="20" height="20" style={{ objectFit: "contain" }} />
      <span className="hidden min-[720px]:inline">
        cipherline<span style={{ color: "var(--accent)" }}>.</span>
      </span>
    </div>
  );
}

function PasswordStrength({ value }: { value: string }) {
  const score = useMemo(() => {
    if (!value) return 0;
    let s = 0;
    if (value.length >= 8) s++;
    if (value.length >= 14) s++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) s++;
    if (/\d/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return Math.min(s, 5);
  }, [value]);

  const labels = [
    "No password",
    "Crackable",
    "Weak",
    "Decent",
    "Strong",
    "Hardened",
  ];
  const colors = [
    "oklch(0.3 0.02 245)",
    "oklch(0.70 0.20 25)",
    "oklch(0.78 0.18 50)",
    "oklch(0.82 0.16 75)",
    "oklch(0.86 0.20 142)",
    "oklch(0.86 0.20 142)",
  ];

  return (
    <div className="mt-2.5 flex items-center gap-2.5 font-mono text-[11px] text-[var(--text-muted)] tracking-[0.08em]">
      <div className="flex-1 h-1 rounded-[2px] bg-[oklch(0.22_0.02_245)] overflow-hidden">
        <div
          className="strength-fill"
          style={{ width: `${score * 20}%`, background: colors[score] }}
        />
      </div>
      <span style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

function TextField({
  label,
  hint,
  leading,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  mono,
}: {
  label: string;
  hint?: string;
  leading?: React.ReactNode;
  type?: "text" | "password";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  mono?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div className="block mb-4">
      <label className="flex items-center justify-between text-[11px] font-mono tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
        <span>{label}</span>
        {hint ? (
          <span className="text-[var(--text-dim)] normal-case tracking-normal font-sans">
            {hint}
          </span>
        ) : null}
      </label>
      <div className="input-wrap">
        {leading ? <div className="leading">{leading}</div> : null}
        <input
          type={isPw && !show ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={mono || isPw ? "mono" : ""}
        />
        {isPw ? (
          <button
            type="button"
            className="trailing-btn"
            onClick={() => setShow((v) => !v)}
            aria-label="Toggle visibility"
          >
            {show ? <Ic.eyeOff /> : <Ic.eye />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Toast({ msg }: { msg: string }) {
  return (
    <div className="toast">
      <span className="ico">
        <Ic.check />
      </span>
      {msg}
    </div>
  );
}

function ToastStack({ items }: { items: { id: string; text: string }[] }) {
  return (
    <div className="toast-stack">
      {items.map((t) => (
        <Toast key={t.id} msg={t.text} />
      ))}
    </div>
  );
}

function CategoryTag({ category }: { category: string }) {
  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  return (
    <span
      className="font-mono text-[10px] py-[3px] px-2 rounded-full tracking-[0.06em] uppercase border inline-flex items-center gap-[5px]"
      style={{
        color: cat.color,
        background: `color-mix(in oklch, ${cat.color} 12%, transparent)`,
        borderColor: `color-mix(in oklch, ${cat.color} 35%, transparent)`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }}
      />
      {cat.name}
    </span>
  );
}

function StrengthPill({ score }: { score: number }) {
  const label = score >= 4 ? "Strong" : score >= 3 ? "Decent" : "Weak";
  const onCls =
    score >= 4
      ? "bg-[var(--accent)] [box-shadow:0_0_6px_var(--accent-glow)]"
      : score >= 3
        ? "bg-[var(--warn)] [box-shadow:0_0_6px_oklch(0.82_0.16_75/0.5)]"
        : "bg-[var(--danger)] [box-shadow:0_0_6px_oklch(0.7_0.2_25/0.5)]";
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-muted)] tracking-[0.08em] uppercase">
      <span className="flex gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[3px] h-[10px] rounded-[1px] ${i < score ? onCls : "bg-[oklch(0.25_0.02_245)]"}`}
          />
        ))}
      </span>
      {label}
    </span>
  );
}

export {
  BrandMark,
  PasswordStrength,
  TextField,
  ToastStack,
  CategoryTag,
  StrengthPill,
};

// ============================================================
// SHARED PAGE SHELL — for security feature pages
// ============================================================

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 grid grid-cols-1 max-w-[1480px] w-full mx-auto p-6 lg:p-[28px_28px_60px]">
      <main className="flex flex-col gap-[22px]">{children}</main>
    </div>
  );
}

const TONE_ICO: Record<string, string> = {
  accent:  "text-[var(--accent)] bg-[var(--accent-soft)] border-[oklch(0.86_0.2_142/0.35)] [box-shadow:0_0_24px_oklch(0.86_0.2_142/0.18)]",
  cyan:    "text-[var(--cyan)] bg-[var(--cyan-soft)] border-[oklch(0.82_0.14_215/0.35)] [box-shadow:0_0_24px_oklch(0.82_0.14_215/0.18)]",
  warn:    "text-[var(--warn)] bg-[oklch(0.82_0.16_75/0.12)] border-[oklch(0.82_0.16_75/0.35)] [box-shadow:0_0_24px_oklch(0.82_0.16_75/0.18)]",
  magenta: "text-[var(--magenta)] bg-[oklch(0.76_0.18_340/0.12)] border-[oklch(0.76_0.18_340/0.35)] [box-shadow:0_0_24px_oklch(0.76_0.18_340/0.18)]",
  danger:  "text-[var(--danger)] bg-[var(--danger-soft)] border-[oklch(0.7_0.2_25/0.35)] [box-shadow:0_0_24px_oklch(0.7_0.2_25/0.18)]",
};

function PageHero({
  icon,
  kicker,
  title,
  sub,
  tone = "accent",
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  sub: string;
  tone?: string;
}) {
  return (
    <div className="page-hero">
      <div className={`w-[60px] h-[60px] rounded-[14px] grid place-items-center shrink-0 border relative [&_svg]:w-[26px] [&_svg]:h-[26px] ${TONE_ICO[tone] ?? TONE_ICO.accent}`}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.18em] uppercase">
          {kicker}
        </div>
        <h1 className="text-[clamp(26px,3vw,34px)] font-semibold tracking-[-0.02em] mt-1 mb-1.5 text-[var(--text)]">
          {title}
        </h1>
        <p className="m-0 text-[var(--text-muted)] text-sm leading-[1.5] max-w-[640px]">
          {sub}
        </p>
      </div>
    </div>
  );
}

export { PageShell, PageHero };
