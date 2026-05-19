import { useMemo, useState } from "react";
import { Ic } from "../shared/icon";
import { PageHero, PageShell } from "../shared/ui";
import { ACCOUNTS } from "../shared/data";
import { mockBreachCheck } from "../shared/utils";

const SCAN_CARD_BASE =
  "p-5 rounded-[var(--r-md)] border flex items-center gap-4 relative overflow-hidden transition-all duration-300 mt-4";

function BreachCheckPage() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    count: number;
  } | null>(null);
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [scanAllRunning, setScanAllRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const checkOne = async () => {
    if (!pw) return;
    setScanning(true);
    setResult(null);
    const r = await mockBreachCheck(pw);
    setResult(r);
    setScanning(false);
  };

  const scanAll = async () => {
    setScanAllRunning(true);
    setProgress({ done: 0, total: accounts.length });
    for (let i = 0; i < accounts.length; i++) {
      const a = accounts[i];
      const r = await mockBreachCheck(a.password);
      setAccounts((arr) =>
        arr.map((x) =>
          x.id === a.id
            ? { ...x, breachStatus: r.status, breachCount: r.count }
            : x,
        ),
      );
      setProgress({ done: i + 1, total: accounts.length });
    }
    setScanAllRunning(false);
  };

  const stats = useMemo(() => {
    let c = 0,
      s = 0,
      u = 0;
    accounts.forEach((a) => {
      if (a.breachStatus === "compromised") c++;
      else if (a.breachStatus === "safe") s++;
      else u++;
    });
    return { compromised: c, safe: s, unchecked: u };
  }, [accounts]);

  const sorted = useMemo(() => {
    const order: Record<string, number> = {
      compromised: 0,
      unchecked: 1,
      safe: 2,
    };
    return [...accounts].sort(
      (a, b) => (order[a.breachStatus] || 3) - (order[b.breachStatus] || 3),
    );
  }, [accounts]);

  return (
    <PageShell>
      <PageHero
        tone="danger"
        icon={<Ic.bolt />}
        kicker="Security · Breach Check"
        title="Has your password been pwned?"
        sub="Test any password against the public breach corpus. Only the first 5 characters of its SHA-1 hash leave your device (k-anonymity), so the password itself is never transmitted."
      />

      <div className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[oklch(0.14_0.018_245/0.55)] [backdrop-filter:blur(14px)] p-[22px] relative">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="m-0 text-[15px] font-mono font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)] flex items-center gap-2">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_8px_var(--accent-glow)] shrink-0" />
            Single password lookup
          </h3>
          <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.08em]">
            via HIBP k-anonymity API
          </span>
        </div>

        <div className="big-input">
          <span className="leading">
            <Ic.lock />
          </span>
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setResult(null);
            }}
            placeholder="Enter a password to check…"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") checkOne();
            }}
          />
          <button className="trail-btn" onClick={() => setShow((v) => !v)}>
            {show ? <Ic.eyeOff /> : <Ic.eye />}
            {show ? "Hide" : "Show"}
          </button>
          <button
            className="trail-btn"
            style={{
              color: "var(--accent)",
              borderColor: "oklch(0.86 0.20 142 / 0.4)",
            }}
            onClick={checkOne}
            disabled={!pw || scanning}
          >
            {scanning ? (
              <Ic.refresh style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Ic.search />
            )}
            {scanning ? "Hashing" : "Scan"}
          </button>
        </div>

        {scanning ? (
          <div className="mt-[14px]">
            <div className="scan-bar">
              <div className="scan-fill" />
            </div>
            <div className="mt-2 font-mono text-[11px] text-[var(--text-muted)] tracking-[0.06em]">
              // hashing locally · sending hash prefix only · awaiting response…
            </div>
          </div>
        ) : result ? (
          <div
            className={`${SCAN_CARD_BASE} ${
              result.status === "compromised"
                ? "text-[var(--danger)] border-[oklch(0.7_0.2_25/0.4)] bg-[var(--danger-soft)]"
                : "text-[var(--accent)] border-[oklch(0.86_0.2_142/0.4)] bg-[var(--accent-soft)]"
            }`}
          >
            <div className="w-14 h-14 rounded-[14px] grid place-items-center bg-[oklch(0.13_0.018_245/0.6)] shrink-0">
              {result.status === "compromised" ? (
                <Ic.bolt size={28} />
              ) : (
                <Ic.shield size={28} />
              )}
            </div>
            <div>
              <div className="text-[18px] font-semibold">
                {result.status === "compromised"
                  ? "Compromised"
                  : "Not seen in any known breach"}
              </div>
              <div className="text-[13px] text-[var(--text-muted)] mt-1 font-mono tracking-[0.04em]">
                {result.status === "compromised" ? (
                  <>
                    Found in <b>{result.count.toLocaleString()}</b> public
                    breaches · do not use this password.
                  </>
                ) : (
                  "This password hasn't appeared in any leaked credential dataset we know of."
                )}
              </div>
            </div>
          </div>
        ) : pw ? null : (
          <div
            className={`${SCAN_CARD_BASE} text-[var(--text-muted)] border-[var(--border)] bg-[oklch(0.14_0.018_245/0.5)]`}
          >
            <div className="w-14 h-14 rounded-[14px] grid place-items-center bg-[oklch(0.13_0.018_245/0.6)] shrink-0">
              <Ic.search size={28} />
            </div>
            <div>
              <div className="text-[18px] font-semibold text-[var(--text)]">
                Waiting for input
              </div>
              <div className="text-[13px] text-[var(--text-muted)] mt-1 font-mono tracking-[0.04em]">
                Type a password and click <b>Scan</b> to check it against known
                breaches.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Compromised</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--danger)]">{stats.compromised}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">found in breaches</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Breach-clear</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--accent)]">{stats.safe}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">verified safe</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Unchecked</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--warn)]">{stats.unchecked}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">need scanning</div>
        </div>
        <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[oklch(0.13_0.018_245/0.6)]">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Total entries</div>
          <div className="font-mono text-[28px] font-semibold leading-none mt-1 mb-0.5 text-[var(--cyan)]">{accounts.length}</div>
          <div className="text-[11px] text-[var(--text-dim)] font-mono">in this vault</div>
        </div>
      </div>

      <div className="border border-[var(--border)] rounded-[var(--r-lg)] bg-[oklch(0.14_0.018_245/0.55)] [backdrop-filter:blur(14px)] p-[22px] relative">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="m-0 text-[15px] font-mono font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)] flex items-center gap-2">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_8px_var(--accent-glow)] shrink-0" />
            Vault scan
          </h3>
          <button
            className="btn-accent"
            onClick={scanAll}
            disabled={scanAllRunning}
          >
            {scanAllRunning ? (
              <Ic.refresh style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Ic.sparkle />
            )}
            {scanAllRunning
              ? `Scanning ${progress.done}/${progress.total}`
              : "Scan entire vault"}
          </button>
        </div>

        {scanAllRunning ? (
          <div className="mb-4">
            <div className="scan-bar">
              <div
                className="scan-fill"
                style={{
                  width: `${(progress.done / progress.total) * 100}%`,
                  background: "var(--accent)",
                  animation: "none",
                  boxShadow: "0 0 12px var(--accent-glow)",
                }}
              />
            </div>
          </div>
        ) : null}

        {sorted.map((a) => {
          const isComp = a.breachStatus === "compromised";
          const isSafe = a.breachStatus === "safe";
          return (
            <div
              key={a.id}
              className="row-item"
              style={{
                borderColor: isComp
                  ? "oklch(0.70 0.20 25 / 0.3)"
                  : isSafe
                    ? "oklch(0.86 0.20 142 / 0.25)"
                    : "var(--border)",
                background: isComp
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
                <div className="meta">{a.domain}</div>
              </div>
              <div className="pw">{a.email}</div>
              <div className="meta-cell text-right">
                {isComp ? (
                  <span
                    className="status-badge compromised"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Ic.bolt /> {a.breachCount.toLocaleString()} hits
                  </span>
                ) : isSafe ? (
                  <span className="status-badge safe">
                    <Ic.shield /> Clear
                  </span>
                ) : (
                  <span className="status-badge unchecked">
                    <Ic.search /> Pending
                  </span>
                )}
              </div>
              <div className="actions-cell">
                <button
                  className="mini-btn"
                  aria-label="Rescan"
                  onClick={async () => {
                    const r = await mockBreachCheck(a.password);
                    setAccounts((arr) =>
                      arr.map((x) =>
                        x.id === a.id
                          ? {
                              ...x,
                              breachStatus: r.status,
                              breachCount: r.count,
                            }
                          : x,
                      ),
                    );
                  }}
                >
                  <Ic.refresh />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

export default BreachCheckPage;
