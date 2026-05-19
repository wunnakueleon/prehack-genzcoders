// Add / edit modal — with full strength breakdown + breach check

import { useMemo, useState } from "react";
import { analyzeStrength, generatePassword, mockBreachCheck } from "./utils";
import { CATEGORIES } from "./data";
import { Ic } from "./icon";
import { StrengthPill, TextField } from "./ui";

export function StrengthBreakdown({ password }: { password: string }) {
  const a = useMemo(() => analyzeStrength(password), [password]);
  const colors = [
    "oklch(0.70 0.20 25)",
    "oklch(0.78 0.18 50)",
    "oklch(0.82 0.16 75)",
    "oklch(0.86 0.20 142)",
    "oklch(0.86 0.20 142)",
  ];
  const glow = [
    "oklch(0.70 0.20 25 / 0.5)",
    "oklch(0.78 0.18 50 / 0.5)",
    "oklch(0.82 0.16 75 / 0.5)",
    "oklch(0.86 0.20 142 / 0.5)",
    "oklch(0.86 0.20 142 / 0.5)",
  ];
  const c = colors[a.score];
  const cg = glow[a.score];

  const ttc = useMemo(() => {
    if (!a.entropy) return "—";
    const seconds = Math.pow(2, a.entropy) / 1e10;
    if (seconds < 1) return "instant";
    if (seconds < 60) return Math.round(seconds) + "s";
    if (seconds < 3600) return Math.round(seconds / 60) + "m";
    if (seconds < 86400) return Math.round(seconds / 3600) + "h";
    if (seconds < 31536000) return Math.round(seconds / 86400) + "d";
    if (seconds < 31536000 * 1000) return Math.round(seconds / 31536000) + "y";
    return "centuries";
  }, [a.entropy]);

  const checks = [
    {
      ok: a.length >= 12,
      label:
        a.length >= 14
          ? `${a.length} characters — long`
          : a.length >= 12
            ? `${a.length} characters — good`
            : `${a.length} characters — too short`,
    },
    {
      ok: /[A-Z]/.test(password) && /[a-z]/.test(password),
      label: "Mixed letter case",
    },
    { ok: /\d/.test(password), label: "Contains digits" },
    { ok: /[^A-Za-z0-9]/.test(password), label: "Contains symbols" },
    { ok: !a.issues.includes("Common word"), label: "No dictionary words" },
    {
      ok: !a.issues.some(
        (x) => x.includes("sequential") || x.includes("Keyboard"),
      ),
      label: "No keyboard patterns",
    },
  ];

  return (
    <div className="p-3.5 rounded-[var(--r-md)] bg-[oklch(0.13_0.018_245/0.7)] border border-[var(--border)] mt-2">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
          Strength analysis
        </span>
        <span className="font-mono text-[13px] font-semibold tracking-[0.06em]" style={{ color: c }}>
          {a.label.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1 mb-3.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1.5 rounded-[3px] transition-[background,box-shadow] duration-300"
            style={
              i <= a.score && password
                ? { background: c, boxShadow: `0 0 10px ${cg}` }
                : { background: "oklch(0.22 0.02 245)" }
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-3">
        {[
          { v: a.entropy, l: "Entropy", suffix: " bits" },
          { v: a.charset, l: "Charset", suffix: "" },
          { v: ttc, l: "To crack", suffix: "" },
        ].map((s) => (
          <div
            key={s.l}
            className="border border-[var(--border)] rounded-lg p-[8px_10px] bg-[oklch(0.16_0.02_245/0.5)]"
          >
            <div className="font-mono text-[16px] font-semibold text-[var(--text)]">
              {s.v}
              {s.suffix ? (
                <span style={{ fontSize: 10, opacity: 0.6 }}>{s.suffix}</span>
              ) : null}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] tracking-[0.1em] uppercase mt-0.5">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {checks.map((ch, i) => (
          <div key={i} className={"issue " + (ch.ok ? "ok" : "bad")}>
            <span className="dot" />
            {ch.ok ? "✓ " : "✗ "}
            {ch.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export type AccountData = {
  id?: string;
  name: string;
  domain: string;
  email: string;
  username: string;
  password: string;
  note: string;
  category: string;
  tags: string[];
  color: string;
  initial: string;
  daysOld: number;
  expiryDays: number;
  breachStatus: string;
  breachCount: number;
  lastUsed?: string;
};

function AccountModal({
  mode,
  account,
  onClose,
  onSave,
  onDelete,
}: {
  mode: "new" | "edit" | "confirm-delete";
  account?: AccountData;
  onClose: () => void;
  onSave: (data: AccountData) => void;
  onDelete: (data: AccountData) => void;
}) {
  const isEdit = mode === "edit";
  const isDelete = mode === "confirm-delete";

  const [form, setForm] = useState(
    () =>
      account || {
        name: "",
        domain: "",
        email: "",
        username: "",
        password: generatePassword(18),
        note: "",
        category: "personal",
        tags: ["New"],
        color: "oklch(0.86 0.20 142)",
        initial: "?",
        daysOld: 0,
        expiryDays: 90,
        breachStatus: "unchecked",
        breachCount: 0,
      },
  );
  const [showPw, setShowPw] = useState(false);
  const [scanning, setScanning] = useState(false);

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const regenerate = () => {
    const pw = generatePassword(18);
    setForm((f) => ({
      ...f,
      password: pw,
      breachStatus: "unchecked",
      breachCount: 0,
      daysOld: 0,
    }));
  };

  const runScan = async () => {
    setScanning(true);
    const r = await mockBreachCheck(form.password);
    setForm((f) => ({ ...f, breachStatus: r.status, breachCount: r.count }));
    setScanning(false);
  };

  const compute = useMemo(() => {
    const initial = (form.name || "?").trim().charAt(0).toUpperCase() || "?";
    const cat = CATEGORIES.find((c) => c.id === form.category) || CATEGORIES[0];
    return { initial, color: cat.color };
  }, [form.name, form.category]);

  const strengthScore = useMemo(
    () => analyzeStrength(form.password).score,
    [form.password],
  );

  const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ ...form, ...compute });
  };

  if (isDelete) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-card"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: 420 }}
        >
          <div className="flex items-start justify-between mb-[22px]">
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.02em] m-0">
                Delete{" "}
                <span style={{ color: "var(--danger)" }}>{account!.name}</span>?
              </h2>
              <div className="text-[var(--text-muted)] text-[13px] mt-1">
                This entry will be shredded from your vault. You can't undo this
                from any device.
              </div>
            </div>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <Ic.x />
            </button>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: "var(--r-md)",
              border: "1px solid oklch(0.70 0.20 25 / 0.3)",
              background: "var(--danger-soft)",
              color: "var(--danger)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
            }}
          >
            <Ic.trash /> &nbsp; Will purge: credentials, tags, notes, breach
            history.
          </div>

          <div className="flex gap-2.5 justify-end mt-[26px] pt-[18px] border-t border-[var(--border)]">
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-danger" onClick={() => onDelete(account!)}>
              <Ic.trash /> Shred entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="flex items-start justify-between mb-[22px]">
          <div>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] m-0">
              {isEdit ? "Edit credential" : "New credential"}
            </h2>
            <div className="text-[var(--text-muted)] text-[13px] mt-1">
              {isEdit
                ? "Changes encrypt locally before sync."
                : "Encrypted client-side. Sealed before transit."}
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <Ic.x />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 22,
            padding: 14,
            borderRadius: "var(--r-md)",
            background: "oklch(0.13 0.018 245 / 0.7)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="brand-icon"
            style={{
              background: `linear-gradient(135deg, ${compute.color}, color-mix(in oklch, ${compute.color} 60%, oklch(0.15 0.02 245)))`,
              width: 52,
              height: 52,
              fontSize: 20,
            }}
          >
            {compute.initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Preview
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>
              {form.name || "Untitled credential"}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              {form.domain || "no-domain.set"}
            </div>
          </div>
          <StrengthPill score={strengthScore} />
        </div>

        <div className="grid grid-cols-2 max-[540px]:grid-cols-1 gap-3">
          <TextField
            label="Name"
            leading={<Ic.globe />}
            value={form.name}
            onChange={(v) => update("name", v)}
            placeholder="e.g. Helix Cloud"
          />
          <TextField
            label="Domain"
            leading={<Ic.globe />}
            value={form.domain}
            onChange={(v) => update("domain", v)}
            placeholder="example.com"
            mono
          />
        </div>

        <TextField
          label="Email"
          leading={<Ic.mail />}
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="you@example.com"
        />
        <TextField
          label="Username"
          leading={<Ic.user />}
          value={form.username}
          onChange={(v) => update("username", v)}
          placeholder="handle"
        />

        <div className="block mb-4">
          <label className="flex items-center justify-between text-[11px] font-mono tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
            <span>Password</span>
            <span style={{ color: "var(--accent)" }} className="normal-case tracking-normal font-sans">
              auto-generated · client-side
            </span>
          </label>
          <div className="input-wrap">
            <div className="leading">
              <Ic.lock />
            </div>
            <input
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="mono"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              className="trailing-btn"
              onClick={() => setShowPw((v) => !v)}
            >
              {showPw ? <Ic.eyeOff /> : <Ic.eye />}
            </button>
          </div>
          <div className="flex gap-2 items-center mt-2 p-2.5 rounded-[10px] bg-[oklch(0.13_0.018_245/0.6)] border border-[var(--border)]">
            <Ic.sparkle />
            <span className="flex-1 font-mono text-[13px] text-[var(--accent)] overflow-hidden text-ellipsis whitespace-nowrap tracking-[0.04em]">
              {form.password}
            </span>
            <button
              type="button"
              className="mini-btn"
              onClick={regenerate}
              aria-label="Regenerate"
            >
              <Ic.refresh />
            </button>
          </div>

          <StrengthBreakdown password={form.password} />
        </div>

        <div className="block mb-4">
          <label className="flex items-center justify-between text-[11px] font-mono tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
            <span>Breach check</span>
            <span className="text-[var(--text-dim)] normal-case tracking-normal font-sans">
              via HIBP k-anonymity · only SHA-1 prefix sent
            </span>
          </label>
          <div
            style={{
              padding: 12,
              borderRadius: "var(--r-md)",
              border:
                "1px solid " +
                (form.breachStatus === "compromised"
                  ? "oklch(0.70 0.20 25 / 0.4)"
                  : form.breachStatus === "safe"
                    ? "oklch(0.86 0.20 142 / 0.4)"
                    : "var(--border)"),
              background:
                form.breachStatus === "compromised"
                  ? "var(--danger-soft)"
                  : form.breachStatus === "safe"
                    ? "var(--accent-soft)"
                    : "oklch(0.13 0.018 245 / 0.6)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "all 0.3s",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                display: "grid",
                placeItems: "center",
                background: "oklch(0.13 0.018 245 / 0.6)",
                color:
                  form.breachStatus === "compromised"
                    ? "var(--danger)"
                    : form.breachStatus === "safe"
                      ? "var(--accent)"
                      : "var(--text-muted)",
              }}
            >
              {scanning ? (
                <Ic.refresh
                  style={{ animation: "spin 1.2s linear infinite" }}
                />
              ) : form.breachStatus === "compromised" ? (
                <Ic.bolt />
              ) : form.breachStatus === "safe" ? (
                <Ic.shield />
              ) : (
                <Ic.search />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    form.breachStatus === "compromised"
                      ? "var(--danger)"
                      : form.breachStatus === "safe"
                        ? "var(--accent)"
                        : "var(--text)",
                }}
              >
                {scanning
                  ? "Hashing & querying HIBP…"
                  : form.breachStatus === "compromised"
                    ? `Found in ${form.breachCount.toLocaleString()} breaches`
                    : form.breachStatus === "safe"
                      ? "Not seen in any known breach"
                      : "Not yet checked"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  marginTop: 2,
                  letterSpacing: "0.06em",
                }}
              >
                {scanning
                  ? "// only the first 5 chars of SHA-1 leave your device"
                  : form.breachStatus === "compromised"
                    ? "Rotate this password immediately."
                    : form.breachStatus === "safe"
                      ? `last verified · just now`
                      : "Click scan to verify against public breach corpus."}
              </div>
              {scanning ? (
                <div className="scan-bar" style={{ marginTop: 8 }}>
                  <div className="scan-fill" />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={runScan}
              disabled={scanning}
              style={{ fontSize: 11 }}
            >
              <Ic.refresh /> {scanning ? "Scanning" : "Scan"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 max-[540px]:grid-cols-1 gap-3">
          <div className="block mb-4">
            <label className="flex items-center justify-between text-[11px] font-mono tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
              <span>Expiry policy</span>
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { v: 30, l: "30 days" },
                { v: 60, l: "60 days" },
                { v: 90, l: "90 days" },
                { v: 0, l: "Never" },
              ].map((o) => (
                <span
                  key={o.v}
                  className={
                    "chip " + (form.expiryDays === o.v ? "active" : "")
                  }
                  onClick={() => update("expiryDays", o.v)}
                >
                  {o.l}
                </span>
              ))}
            </div>
          </div>
          <div className="block mb-4">
            <label className="flex items-center justify-between text-[11px] font-mono tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
              <span>Category</span>
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <span
                  key={c.id}
                  className={"chip " + (form.category === c.id ? "active" : "")}
                  onClick={() => update("category", c.id)}
                  style={
                    form.category === c.id
                      ? {
                          color: c.color,
                          borderColor: `color-mix(in oklch, ${c.color} 45%, transparent)`,
                          background: `color-mix(in oklch, ${c.color} 14%, transparent)`,
                        }
                      : {}
                  }
                >
                  <span className="dot" style={{ background: c.color }} />
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="block mb-4">
          <label className="flex items-center justify-between text-[11px] font-mono tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2">
            <span>Note</span>
            <span className="text-[var(--text-dim)] normal-case tracking-normal font-sans">
              optional · encrypted
            </span>
          </label>
          <textarea
            className="txt"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Recovery codes, MFA hints, context…"
          />
        </div>

        <div className="flex gap-2.5 justify-end mt-[26px] pt-[18px] border-t border-[var(--border)]">
          {isEdit ? (
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(account!)}
              style={{ marginRight: "auto" }}
            >
              <Ic.trash /> Delete
            </button>
          ) : null}
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-accent">
            <Ic.check /> {isEdit ? "Save changes" : "Add to vault"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountModal;
