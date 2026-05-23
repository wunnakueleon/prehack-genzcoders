import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { BrandMark, TextField } from "../shared/ui";
import { Ic } from "../shared/icon";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("jenny@cipherline.dev");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);
      navigate("/vault");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 items-center justify-items-center p-[32px_20px] relative min-[980px]:grid-cols-[1.1fr_0.9fr] min-[980px]:max-w-[1400px] min-[980px]:mx-auto min-[980px]:gap-[60px] min-[980px]:p-[40px_64px] page-enter">
      <div className="hidden min-[980px]:flex flex-col justify-between relative self-stretch py-[40px]">
        <BrandMark />
        <div>
          <div className="text-[var(--text-muted)] text-[12px] font-mono tracking-[0.18em] uppercase" style={{ marginTop: 28 }}>
            End-to-end encrypted · Zero knowledge
          </div>
          <h1 className="text-[clamp(36px,4.4vw,64px)] leading-[0.96] tracking-[-0.025em] m-[28px_0_18px] font-semibold">
            Your secrets,
            <br />
            <span className="text-[var(--accent)]">sealed</span>{" "}
            <span className="text-transparent [-webkit-text-stroke:1.2px_var(--accent)]">offline</span>,<br />
            available everywhere.
          </h1>
          <p className="text-[var(--text-muted)] text-[16px] max-w-[460px] leading-[1.55] m-0">
            Cipherline keeps every credential behind a single hardware-bound
            master key. No server ever sees your vault in the clear — not even
            ours.
          </p>

          <div className="grid grid-cols-3 gap-[14px] mt-9 max-w-[460px]">
            <div className="border border-[var(--border)] rounded-[var(--r-md)] p-[14px] [backdrop-filter:blur(14px)] bg-[var(--surface)]">
              <div className="font-mono text-[22px] font-semibold text-[var(--accent)]">
                256<span className="opacity-60 text-[14px]"> bit</span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] tracking-[0.12em] uppercase mt-1">AES-GCM</div>
            </div>
            <div className="border border-[var(--border)] rounded-[var(--r-md)] p-[14px] [backdrop-filter:blur(14px)] bg-[var(--surface)]">
              <div className="font-mono text-[22px] font-semibold text-[var(--accent)]">0ms</div>
              <div className="text-[11px] text-[var(--text-muted)] tracking-[0.12em] uppercase mt-1">Sync drift</div>
            </div>
            <div className="border border-[var(--border)] rounded-[var(--r-md)] p-[14px] [backdrop-filter:blur(14px)] bg-[var(--surface)]">
              <div className="font-mono text-[22px] font-semibold text-[var(--accent)]">14k+</div>
              <div className="text-[11px] text-[var(--text-muted)] tracking-[0.12em] uppercase mt-1">Teams</div>
            </div>
          </div>

          <div className="mt-[44px] font-mono text-[12px] border border-[var(--border)] rounded-[var(--r-md)] p-[14px_16px] max-w-[460px] bg-[oklch(0.1_0.018_245/0.7)] [backdrop-filter:blur(10px)]">
            <div className="text-[var(--text-muted)]">
              <span className="text-[var(--accent)]">$</span> cipherline auth --unlock
            </div>
            <div className="text-[var(--text-muted)]">
              {" "}
              <span className="text-[var(--cyan)]">→ resolving vault [shard 04/08]</span>
            </div>
            <div className="text-[var(--text-muted)]">
              {" "}
              <span className="text-[var(--cyan)]">→ awaiting master key</span>
              <span
                className="inline-block w-[7px] h-[14px] bg-[var(--accent)] [vertical-align:-2px] ml-1"
                style={{ animation: "blink 1s steps(1) infinite" }}
              />
            </div>
          </div>
        </div>
      </div>

      <form className="auth-card" onSubmit={submit}>
        <div className="flex items-center justify-between mb-[26px]">
          <div className="flex items-center gap-[10px] min-[980px]:hidden">
            <BrandMark />
          </div>
          <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.18em] uppercase flex items-center">
            <span
              className="inline-block w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_12px_var(--accent-glow)] mr-2 [vertical-align:1px]"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
            Unlock · 01
          </div>
        </div>

        <h2 className="text-[30px] font-semibold tracking-[-0.02em] m-0 mb-1.5">Unlock vault</h2>
        <p className="text-[var(--text-muted)] text-[14px] m-0 mb-7">
          Sign in with your master credentials. We never store them.
        </p>

        <div className="flex items-center gap-[10px] p-[10px_12px] rounded-[var(--r-md)] bg-[var(--accent-soft)] border border-[oklch(0.86_0.2_142/0.25)] text-[var(--accent)] font-mono text-[11px] tracking-[0.08em] mb-[22px]">
          <Ic.shield /> Connection sealed · TLS 1.3 · Pinned cert verified
        </div>

        {error && (
          <div className="mb-[16px] p-[10px_12px] rounded-[var(--r-md)] bg-[oklch(0.25_0.08_15/0.5)] border border-[oklch(0.5_0.18_15/0.4)] text-[oklch(0.75_0.18_15)] font-mono text-[12px] tracking-[0.04em]">
            {error}
          </div>
        )}

        <TextField
          label="Email"
          leading={<Ic.mail />}
          value={email}
          onChange={setEmail}
          placeholder="you@domain.com"
          type="text"
          autoComplete="username"
        />
        <TextField
          label="Master password"
          hint="case-sensitive"
          leading={<Ic.lock />}
          value={password}
          onChange={setPassword}
          placeholder="••••••••••••••"
          type="password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between mt-1.5 mb-[22px]">
          <label className="check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="box">
              <Ic.check />
            </span>
            <span>Keep this device unlocked for 7 days</span>
          </label>
          <button
            type="button"
            className="bg-transparent border-0 p-0 text-[var(--accent)] font-mono text-[12px] tracking-[0.06em] cursor-pointer no-underline relative hover:[text-shadow:0_0_12px_var(--accent-glow)]"
          >
            Recover
          </button>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          <Ic.lock /> {loading ? "Unlocking…" : "Unlock vault"}
          {!loading && <Ic.arrow />}
        </button>

        <div className="mt-[22px] text-center text-[13px] text-[var(--text-muted)]">
          New to Cipherline?
          <button
            type="button"
            className="bg-transparent border-0 p-0 text-[var(--accent)] font-sans text-[13px] cursor-pointer no-underline relative ml-1.5 hover:[text-shadow:0_0_12px_var(--accent-glow)]"
            onClick={() => navigate("/signup")}
          >
            Create a vault →
          </button>
        </div>
      </form>
    </div>
  );
}
