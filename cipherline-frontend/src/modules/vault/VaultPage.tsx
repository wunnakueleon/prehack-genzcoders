import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { ACCOUNTS, CATEGORIES } from "../shared/data";
import { vaultApi, type VaultEntry } from "./vault.api";
import AccountModal, { type AccountData } from "../shared/modal";
import { CategoryTag, StrengthPill, ToastStack } from "../shared/ui";
import { analyzeStrength, buildAudit, getExpiryStatus, mockBreachCheck } from "../shared/utils";

type Account = AccountData & { id: string; lastUsed: string };

const DEMO_USER_ID = localStorage.getItem("userId") ?? "";

function entryToAccount(e: VaultEntry): Account {
  return {
    id: e.id,
    name: e.siteName,
    domain: e.siteUrl ?? "",
    email: e.usernameForSite,
    username: e.usernameForSite,
    password: e.encryptedPassword,
    note: "",
    category: "personal",
    tags: [],
    color: "oklch(0.82 0.14 215)",
    initial: e.siteName.trim().charAt(0).toUpperCase() || "?",
    lastUsed: new Date(e.updatedAt).toLocaleDateString(),
    daysOld: Math.floor((Date.now() - new Date(e.createdAt).getTime()) / 86400000),
    expiryDays: e.expiryDate ? 90 : 0,
    breachStatus: e.breachStatus,
    breachCount: 0,
  };
}
type ModalState =
  | { mode: "new" }
  | { mode: "edit"; account: Account }
  | { mode: "confirm-delete"; account: Account }
  | null;

function StatusBadge({
  kind, label, icon, onClick, className,
}: {
  kind: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      className={"status-badge " + kind + (className ? " " + className : "")}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      {icon}{label}
    </Comp>
  );
}

function AccountCard({
  acc, isDuplicate, onCopy, onEdit, onDelete, onScanBreach, scanningIds,
}: {
  acc: Account;
  isDuplicate: boolean;
  onCopy: (msg: string) => void;
  onEdit: (acc: Account) => void;
  onDelete: (acc: Account) => void;
  onScanBreach: (acc: Account) => void;
  scanningIds: Set<string>;
}) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const strength = useMemo(() => analyzeStrength(acc.password), [acc.password]);
  const expiry = useMemo(() => getExpiryStatus(acc), [acc]);
  const scanning = scanningIds.has(acc.id);

  const copy = async (field: string, val: string) => {
    await navigator.clipboard?.writeText(val).catch(() => {});
    onCopy(`${field} copied`);
    setCopied(field);
    setTimeout(() => setCopied(null), 700);
  };

  const masked = "•".repeat(Math.min(14, acc.password.length));
  const cardCls =
    "card" +
    (isDuplicate ? " dup-glow" : "") +
    (acc.breachStatus === "compromised" ? " breach-glow" : "");

  return (
    <div
      className={cardCls}
      style={{ "--card-glow": `color-mix(in oklch, ${acc.color} 14%, transparent)` } as React.CSSProperties}
    >
      <div className="card-head flex items-center gap-3 p-[16px_16px_12px] border-b border-[var(--border)]">
        <div
          className="brand-icon"
          style={{ background: `linear-gradient(135deg, ${acc.color}, color-mix(in oklch, ${acc.color} 60%, oklch(0.15 0.02 245)))` }}
        >
          {acc.initial}
        </div>
        <div className="card-title-block min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold m-0 tracking-[-0.005em]">{acc.name}</h3>
          <div className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5 tracking-[0.02em] truncate">{acc.domain}</div>
        </div>
        <button className="card-menu-btn" aria-label="More"><MoreHorizontal /></button>
      </div>

      <div className="status-strip flex gap-1.5 items-center flex-wrap p-[0_16px_12px]">
        {acc.breachStatus === "compromised" ? (
          <StatusBadge kind="compromised" label={`Pwned · ${acc.breachCount.toLocaleString()}`} icon={<Zap />} />
        ) : acc.breachStatus === "safe" ? (
          <StatusBadge kind="safe" label="Breach-clear" icon={<Shield />} />
        ) : (
          <button
            className={"inline-scan " + (scanning ? "scanning" : "")}
            onClick={() => onScanBreach(acc)}
            disabled={scanning}
          >
            {scanning ? <RefreshCw style={{ animation: "spin 1s linear infinite" }} /> : <Search />}
            {scanning ? "Hashing…" : "Run breach scan"}
          </button>
        )}
        {expiry.kind === "expired" && <StatusBadge kind="expired"   label={expiry.label}   icon={<Zap />} />}
        {expiry.kind === "soon"    && <StatusBadge kind="soon"       label={expiry.label}   icon={<RefreshCw />} />}
        {strength.score < 3        && <StatusBadge kind="weak"       label="Weak password"  icon={<Shield />} />}
        {isDuplicate               && <StatusBadge kind="duplicate"  label="Reused"         icon={<Copy />} />}
      </div>

      <div className="card-body p-[14px_16px_12px]">
        <div className="cred-row flex items-center gap-2.5 py-1.5 min-w-0">
          <span className="label font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-dim)] w-[62px] shrink-0">Email</span>
          <span className="val flex-1 font-mono text-[13px] text-[var(--text)] truncate min-w-0 tracking-[0.02em]">{acc.email}</span>
          <span className="actions-mini">
            <button className={"mini-btn " + (copied === "Email" ? "copied" : "")} onClick={() => copy("Email", acc.email)} aria-label="Copy email">
              {copied === "Email" ? <Check /> : <Copy />}
            </button>
          </span>
        </div>
        <div className="cred-row flex items-center gap-2.5 py-1.5 min-w-0">
          <span className="label font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-dim)] w-[62px] shrink-0">User</span>
          <span className="val flex-1 font-mono text-[13px] text-[var(--text)] truncate min-w-0 tracking-[0.02em]">{acc.username}</span>
          <span className="actions-mini">
            <button className={"mini-btn " + (copied === "Username" ? "copied" : "")} onClick={() => copy("Username", acc.username)} aria-label="Copy username">
              {copied === "Username" ? <Check /> : <Copy />}
            </button>
          </span>
        </div>
        <div className="cred-row password flex items-center gap-2.5 py-1.5 min-w-0">
          <span className="label font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--text-dim)] w-[62px] shrink-0">Pass</span>
          <span className={
            "val flex-1 font-mono text-[13px] truncate min-w-0 " +
            (show ? "text-[var(--text)] tracking-[0.02em]" : "tracking-[0.15em] text-[var(--text-muted)]")
          }>
            {show ? acc.password : masked}
          </span>
          <span className="actions-mini" style={{ opacity: 1 }}>
            <button className="mini-btn" onClick={() => setShow((v) => !v)} aria-label="Toggle password">
              {show ? <EyeOff /> : <Eye />}
            </button>
            <button className={"mini-btn " + (copied === "Password" ? "copied" : "")} onClick={() => copy("Password", acc.password)} aria-label="Copy password">
              {copied === "Password" ? <Check /> : <Copy />}
            </button>
          </span>
        </div>
        {acc.note ? <div className="note">{acc.note}</div> : null}
      </div>

      <div className="card-foot flex items-center justify-between p-[12px_16px] border-t border-[var(--border)] bg-[oklch(0.11_0.018_245/0.4)]">
        <div className="tag-row flex gap-1.5 flex-wrap">
          <CategoryTag category={acc.category} />
          {acc.tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] py-[3px] px-2 rounded-full tracking-[0.06em] uppercase border inline-flex items-center gap-[5px]"
              style={{ color: "var(--text-muted)", borderColor: "var(--border-strong)", background: "oklch(0.18 0.02 245 / 0.5)" }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <StrengthPill score={strength.score} />
          <button className="mini-btn" aria-label="Edit"   onClick={() => onEdit(acc)}><Pencil /></button>
          <button className="mini-btn" aria-label="Delete" onClick={() => onDelete(acc)}><Trash2 /></button>
        </div>
      </div>
    </div>
  );
}

function HealthRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const off = c - (c * value) / 100;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68">
      <circle cx="34" cy="34" r={r} fill="none" stroke="oklch(0.22 0.020 245)" strokeWidth="6" />
      <circle
        cx="34" cy="34" r={r} fill="none" stroke="var(--accent)" strokeWidth="6"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform="rotate(-90 34 34)"
        style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))", transition: "stroke-dashoffset 0.8s cubic-bezier(0.2,0.8,0.2,1)" }}
      />
    </svg>
  );
}

type AuditResult = ReturnType<typeof buildAudit>;

function AuditPanel({
  audit, scanning, filterIssue, setFilterIssue,
}: {
  audit: AuditResult;
  scanning: boolean;
  filterIssue: string | null;
  setFilterIssue: (issue: string | null) => void;
}) {
  const items = [
    { id: "weak",      label: "Weak",    val: audit.weak,                         tone: audit.weak > 0 ? "danger" : "ok",       sub: "score < decent",   icon: <Shield /> },
    { id: "duplicate", label: "Reused",  val: audit.dupCount,                     tone: audit.dupCount > 0 ? "warn" : "ok",     sub: "shared passwords", icon: <Copy /> },
    { id: "expired",   label: "Expired", val: audit.expired + audit.expiringSoon, tone: audit.expired > 0 ? "danger" : audit.expiringSoon > 0 ? "warn" : "ok", sub: "rotation due", icon: <RefreshCw /> },
    { id: "breached",  label: "Pwned",   val: audit.breached,                     tone: audit.breached > 0 ? "danger" : "ok",   sub: "in HIBP",          icon: <Zap /> },
  ];

  return (
    <div className="audit-panel">
      <div className="flex items-center justify-between mb-3.5 relative">
        <h3 className="m-0 text-[14px] font-mono tracking-[0.14em] uppercase text-[var(--text-muted)] flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-[var(--accent)] [box-shadow:0_0_10px_var(--accent-glow)] shrink-0"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          />
          Security audit · live
        </h3>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          {audit.total} entries · {scanning ? "scanning…" : "synced"}
        </span>
      </div>
      <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-2.5">
        {items.map((it) => (
          <button
            key={it.id}
            className={"audit-row tone-" + it.tone + (filterIssue === it.id ? " active" : "")}
            onClick={() => setFilterIssue(filterIssue === it.id ? null : it.id)}
          >
            <div className="ico">{it.icon}</div>
            <div className="body">
              <div className="label">{it.label}</div>
              <div className="val">{it.val}</div>
              <div className="sub">{it.sub}</div>
            </div>
          </button>
        ))}
      </div>
      {scanning && <div className="scan-bar" style={{ marginTop: 14 }}><div className="scan-fill" /></div>}
    </div>
  );
}

export default function VaultPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS as unknown as Account[]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [modal, setModal] = useState<ModalState>(null);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const [filterIssue, setFilterIssue] = useState<string | null>(null);
  const [auditScanning, setAuditScanning] = useState(false);
  const [scanningIds, setScanningIds] = useState<Set<string>>(new Set());

  const pushToast = (text: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t: { id: string; text: string }[]) => [...t, { id, text }]);
    setTimeout(() => setToasts((t: { id: string; text: string }[]) => t.filter((x) => x.id !== id)), 2200);
  };

  useEffect(() => {
    vaultApi.getEntries(DEMO_USER_ID)
      .then((res) => { if (res.data.length > 0) setAccounts(res.data.map(entryToAccount)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const audit = useMemo(() => buildAudit(accounts), [accounts]);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (activeCat !== "all" && a.category !== activeCat) return false;
      if (filterIssue) {
        const strength = analyzeStrength(a.password);
        const expiry = getExpiryStatus(a);
        if (filterIssue === "weak"      && strength.score >= 3) return false;
        if (filterIssue === "duplicate" && !audit.dupSet.has(a.id)) return false;
        if (filterIssue === "expired"   && !(expiry.kind === "expired" || expiry.kind === "soon")) return false;
        if (filterIssue === "breached"  && a.breachStatus !== "compromised") return false;
      }
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.domain.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [accounts, query, activeCat, filterIssue, audit.dupSet]);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = { all: accounts.length };
    accounts.forEach((a) => { m[a.category] = (m[a.category] ?? 0) + 1; });
    return m;
  }, [accounts]);

  const handleSave = async (data: AccountData) => {
    try {
      if (modal?.mode === "new") {
        const res = await vaultApi.createEntry({
          userId: DEMO_USER_ID,
          siteName: data.name,
          usernameForSite: data.username || data.email,
          encryptedPassword: data.password,
          siteUrl: data.domain || undefined,
          expiryDate: data.expiryDays > 0
            ? new Date(Date.now() + data.expiryDays * 86400000).toISOString()
            : undefined,
        });
        setAccounts((arr: Account[]) => [entryToAccount(res.data), ...arr]);
        pushToast("Account added to vault");
      } else if (modal?.mode === "edit") {
        const res = await vaultApi.updateEntry(modal.account.id, {
          siteName: data.name,
          usernameForSite: data.username || data.email,
          encryptedPassword: data.password,
          siteUrl: data.domain || undefined,
          expiryDate: data.expiryDays > 0
            ? new Date(Date.now() + data.expiryDays * 86400000).toISOString()
            : undefined,
          breachStatus: data.breachStatus,
        });
        setAccounts((arr: Account[]) => arr.map((a: Account) => a.id === modal.account.id ? entryToAccount(res.data) : a));
        pushToast("Vault updated");
      }
    } catch {
      pushToast("Save failed — check connection");
    }
    setModal(null);
  };

  const handleDelete = async (data: AccountData) => {
    if (!data.id) return;
    try {
      await vaultApi.deleteEntry(data.id);
      setAccounts((arr: Account[]) => arr.filter((a: Account) => a.id !== data.id));
      pushToast(`${data.name} removed`);
    } catch {
      pushToast("Delete failed — check connection");
    }
    setModal(null);
  };

  const scanOne = async (acc: Account) => {
    setScanningIds((s: Set<string>) => { const n = new Set(s); n.add(acc.id); return n; });
    const r = await mockBreachCheck(acc.password);
    await vaultApi.updateEntry(acc.id, { breachStatus: r.status }).catch(() => {});
    setAccounts((arr: Account[]) =>
      arr.map((a: Account) => a.id === acc.id ? { ...a, breachStatus: r.status, breachCount: r.count } : a),
    );
    setScanningIds((s: Set<string>) => { const n = new Set(s); n.delete(acc.id); return n; });
    pushToast(
      r.status === "compromised"
        ? `${acc.name} found in ${r.count.toLocaleString()} breaches`
        : `${acc.name} is breach-clear`,
    );
  };

  const runFullAudit = async () => {
    setAuditScanning(true);
    for (const a of accounts.filter((a) => a.breachStatus === "unchecked")) {
      await scanOne(a);
    }
    setAuditScanning(false);
    pushToast(`Audit complete · ${accounts.length} entries scanned`);
  };

  const health = accounts.length === 0 ? 0 : Math.round(
    (accounts.reduce((s: number, a: Account) => s + analyzeStrength(a.password).score, 0) / (accounts.length * 4)) * 100,
  );

  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape" && modal) setModal(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal]);

  return (
    <>
      <div className="main">
        <aside className="sidebar">
          <div className="side-card">
            <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--text-muted)] m-0 mb-3 flex items-center justify-between">
              Categories
              <span className="font-mono text-[10px] text-[var(--accent)] py-[2px] px-[7px] rounded-full border border-[oklch(0.86_0.2_142/0.4)] bg-[var(--accent-soft)] tracking-[0.08em]">
                {accounts.length}
              </span>
            </h4>
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className={"cat-item " + (activeCat === c.id ? "active" : "")}
                onClick={() => setActiveCat(c.id)}
              >
                <span className="dot" style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                <span>{c.name}</span>
                <span className="count">{catCounts[c.id] ?? 0}</span>
              </div>
            ))}
          </div>

          <div className="side-card">
            <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--text-muted)] m-0 mb-3 flex items-center justify-between">
              Vault health
            </h4>
            <div className="grid grid-cols-[auto_1fr] gap-3 items-center mb-3">
              <HealthRing value={health} />
              <div>
                <div className="font-mono text-[26px] font-semibold text-[var(--accent)] leading-none">
                  {health}<span style={{ fontSize: 14, opacity: 0.6 }}>%</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] tracking-[0.1em] uppercase mt-1">
                  Strength avg
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-1.5">
              {[
                { name: "Strong", width: `${100 - (audit.weak / audit.total * 100)}%`, color: "var(--accent)", shadow: "0 0 8px var(--accent-glow)", val: audit.total - audit.weak },
                { name: "Reused", width: `${audit.dupCount / audit.total * 100}%`,     color: "var(--magenta)", shadow: undefined,                    val: audit.dupCount },
                { name: "Pwned",  width: `${audit.breached / audit.total * 100}%`,     color: "var(--danger)",  shadow: undefined,                    val: audit.breached },
              ].map((bar) => (
                <div key={bar.name} className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-mono tracking-[0.06em]">
                  <span className="w-14 uppercase">{bar.name}</span>
                  <span className="flex-1 h-1 bg-[oklch(0.2_0.02_245)] rounded-[2px] overflow-hidden">
                    <span className="block h-full rounded-[inherit]" style={{ width: bar.width, background: bar.color, boxShadow: bar.shadow }} />
                  </span>
                  <span className="w-[30px] text-right text-[var(--text)]">{bar.val}</span>
                </div>
              ))}
            </div>
            <button className="scan-btn" onClick={runFullAudit} disabled={auditScanning}>
              {auditScanning ? <RefreshCw style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles />}
              {auditScanning ? "Scanning vault…" : "Run full audit"}
            </button>
            {auditScanning && <div className="scan-bar" style={{ marginTop: 10 }}><div className="scan-fill" /></div>}
          </div>

          <div className="side-card">
            <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--text-muted)] m-0 mb-3 flex items-center justify-between">
              Quick actions
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div className="cat-item" onClick={() => setModal({ mode: "new" })}><Plus /> <span>New credential</span></div>
              <div className="cat-item"><Sparkles /> <span>Generate password</span></div>
              <div className="cat-item" onClick={() => setFilterIssue(filterIssue === "expired" ? null : "expired")}>
                <RefreshCw /> <span>Review expiring</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex flex-col gap-[22px] min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[clamp(28px,3vw,36px)] tracking-[-0.02em] font-semibold m-0">Vault</h1>
              <div className="flex items-center gap-2.5 font-mono text-[11px] text-[var(--text-muted)] tracking-[0.1em] uppercase mt-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] [box-shadow:0_0_8px_var(--accent-glow)] shrink-0"
                  style={{ animation: "pulse 2s ease-in-out infinite" }}
                />
                Synced · 14s ago · {accounts.length} entries · zero-knowledge
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <div className="view-switch max-[720px]:hidden">
                <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><LayoutGrid /></button>
                <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="List view"><List /></button>
              </div>
              <button className="btn-ghost max-[720px]:hidden" onClick={() => setFilterIssue(null)}>
                <Filter /> {filterIssue ? "Clear filter" : "Filter"}
              </button>
              <button className="btn-accent" onClick={() => setModal({ mode: "new" })}>
                <Plus /> New
              </button>
            </div>
          </div>

          <div className="search" style={{ marginBottom: 16, padding: "6px 12px" }}>
            <Search />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vault — accounts, tags, domains…"
            />
            <span className="kbd max-[720px]:hidden">⌘K</span>
          </div>

          <AuditPanel audit={audit} scanning={auditScanning} filterIssue={filterIssue} setFilterIssue={setFilterIssue} />

          <div className="chip-row">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={"chip " + (activeCat === c.id ? "active" : "")} onClick={() => setActiveCat(c.id)}>
                <span className="dot" style={{ background: c.color }} />
                {c.name} <span className="count">{catCounts[c.id] ?? 0}</span>
              </button>
            ))}
          </div>

          {filterIssue && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10,
              border: "1px solid oklch(0.86 0.20 142 / 0.3)",
              background: "var(--accent-soft)", color: "var(--accent)",
              fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em",
            }}>
              <Filter />
              Showing only <strong style={{ color: "var(--accent)", margin: "0 4px" }}>{filterIssue}</strong> entries
              · {filtered.length} match{filtered.length === 1 ? "" : "es"}
              <button style={{ marginLeft: "auto" }} className="mini-btn" onClick={() => setFilterIssue(null)} aria-label="Clear">
                <X />
              </button>
            </div>
          )}

          {loading ? (
            <div className="border border-dashed border-[var(--border-strong)] rounded-[var(--r-lg)] p-[60px_24px] text-center text-[var(--text-muted)] bg-[oklch(0.13_0.018_245/0.4)]">
              <div className="font-mono text-[var(--accent)] mb-2">// fetching vault</div>
              <div className="scan-bar mx-auto max-w-[200px]"><div className="scan-fill" /></div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              border: "1px dashed var(--border-strong)", borderRadius: "var(--r-lg)",
              padding: "60px 24px", textAlign: "center", color: "var(--text-muted)",
              background: "oklch(0.13 0.018 245 / 0.4)",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", marginBottom: 8 }}>// no entries match</div>
              <div>Try clearing filters or search above.</div>
            </div>
          ) : (
            <div className={"cards-grid " + (view === "list" ? "cards-list" : "")}>
              {filtered.map((a) => (
                <AccountCard
                  key={a.id}
                  acc={a}
                  isDuplicate={audit.dupSet.has(a.id)}
                  scanningIds={scanningIds}
                  onScanBreach={scanOne}
                  onCopy={pushToast}
                  onEdit={(acc) => setModal({ mode: "edit", account: acc })}
                  onDelete={(acc) => setModal({ mode: "confirm-delete", account: acc })}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <button className="fab" onClick={() => setModal({ mode: "new" })} aria-label="Add account">
        <Plus />
      </button>

      {modal && (
        <AccountModal
          mode={modal.mode}
          account={modal.mode !== "new" ? modal.account : undefined}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      <ToastStack items={toasts} />
    </>
  );
}
