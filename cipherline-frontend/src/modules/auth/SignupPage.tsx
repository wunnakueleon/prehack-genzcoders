import { useState } from "react";
import { BrandMark, PasswordStrength, TextField } from "../shared/ui";
import { Ic } from "../shared/icon";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(true);

  const match = password && confirm && password === confirm;
  const mismatch = confirm && password !== confirm;

  return (
    <div className="min-h-screen grid grid-cols-1 items-center justify-items-center p-[32px_20px] relative min-[980px]:grid-cols-[1.1fr_0.9fr] min-[980px]:max-w-[1400px] min-[980px]:mx-auto min-[980px]:gap-[60px] min-[980px]:p-[40px_64px] page-enter">
      <div className="hidden min-[980px]:flex flex-col justify-between relative self-stretch py-[40px]">
        <BrandMark />
        <div>
          <div className="text-[var(--text-muted)] text-[12px] font-mono tracking-[0.18em] uppercase" style={{ marginTop: 28 }}>
            Bootstrap your vault
          </div>
          <h1 className="text-[clamp(36px,4.4vw,64px)] leading-[0.96] tracking-[-0.025em] m-[28px_0_18px] font-semibold">
            One master key.
            <br />
            <span className="text-[var(--accent)]">Infinite</span>{" "}
            <span className="text-transparent [-webkit-text-stroke:1.2px_var(--accent)]">identities</span>.
          </h1>
          <p className="text-[var(--text-muted)] text-[16px] max-w-[460px] leading-[1.55] m-0">
            Choose a master passphrase you'll remember forever — long, weird,
            personal. Cipherline derives every other secret from it via Argon2id
            and stores the rest as ciphertext.
          </p>

          <div className="grid grid-cols-3 gap-[14px] mt-9 max-w-[460px]">
            <div className="border border-[var(--border)] rounded-[var(--r-md)] p-[14px] [backdrop-filter:blur(14px)] bg-[var(--surface)]">
              <div className="font-mono text-[22px] font-semibold text-[var(--accent)]">Argon2id</div>
              <div className="text-[11px] text-[var(--text-muted)] tracking-[0.12em] uppercase mt-1">KDF</div>
            </div>
            <div className="border border-[var(--border)] rounded-[var(--r-md)] p-[14px] [backdrop-filter:blur(14px)] bg-[var(--surface)]">
              <div className="font-mono text-[22px] font-semibold text-[var(--accent)]">AES-256</div>
              <div className="text-[11px] text-[var(--text-muted)] tracking-[0.12em] uppercase mt-1">Vault cipher</div>
            </div>
            <div className="border border-[var(--border)] rounded-[var(--r-md)] p-[14px] [backdrop-filter:blur(14px)] bg-[var(--surface)]">
              <div className="font-mono text-[22px] font-semibold text-[var(--accent)]">SOC 2</div>
              <div className="text-[11px] text-[var(--text-muted)] tracking-[0.12em] uppercase mt-1">Type II</div>
            </div>
          </div>

          <div className="mt-[44px] font-mono text-[12px] border border-[var(--border)] rounded-[var(--r-md)] p-[14px_16px] max-w-[460px] bg-[oklch(0.1_0.018_245/0.7)] [backdrop-filter:blur(10px)]">
            <div className="text-[var(--text-muted)]">
              <span className="text-[var(--accent)]">$</span> cipherline init --new-vault
            </div>
            <div className="text-[var(--text-muted)]">
              {" "}
              <span className="text-[var(--cyan)]">→ generating recovery shards</span>
            </div>
            <div className="text-[var(--text-muted)]">
              {" "}
              <span className="text-[var(--cyan)]">→ derive key (argon2id · 4 iter · 64MB)</span>
            </div>
            <div className="text-[var(--text-muted)]">
              {" "}
              <span className="text-[var(--cyan)]">→ awaiting passphrase</span>
              <span
                className="inline-block w-[7px] h-[14px] bg-[var(--accent)] [vertical-align:-2px] ml-1"
                style={{ animation: "blink 1s steps(1) infinite" }}
              />
            </div>
          </div>
        </div>
      </div>

      <form className="auth-card" onSubmit={() => {}}>
        <div className="flex items-center justify-between mb-[26px]">
          <div className="flex items-center gap-[10px] min-[980px]:hidden">
            <BrandMark />
          </div>
          <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.18em] uppercase flex items-center">
            <span
              className="inline-block w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_12px_var(--accent-glow)] mr-2 [vertical-align:1px]"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
            Provision · 01
          </div>
        </div>

        <h2 className="text-[30px] font-semibold tracking-[-0.02em] m-0 mb-1.5">Create vault</h2>
        <p className="text-[var(--text-muted)] text-[14px] m-0 mb-7">
          No email confirmation, no surveys — just one strong key.
        </p>

        <TextField
          label="Display name"
          leading={<Ic.user />}
          value={name}
          onChange={setName}
          placeholder="What should we call you?"
        />
        <TextField
          label="Email"
          leading={<Ic.mail />}
          value={email}
          onChange={setEmail}
          placeholder="you@domain.com"
          type="text"
          autoComplete="email"
        />
        <TextField
          label="Master password"
          hint="14+ chars recommended"
          leading={<Ic.lock />}
          value={password}
          onChange={setPassword}
          placeholder="A passphrase only you know"
          type="password"
          autoComplete="new-password"
        />
        <PasswordStrength value={password} />

        <div className="h-[14px]" />

        <TextField
          label="Confirm password"
          leading={<Ic.shield />}
          value={confirm}
          onChange={setConfirm}
          placeholder="Type it again"
          type="password"
          autoComplete="new-password"
        />

        {mismatch ? (
          <div className="mt-2 p-[8px_12px] rounded-[var(--r-md)] text-[12px] font-mono text-[var(--danger)] bg-[var(--danger-soft)] border border-[oklch(0.70_0.20_25/0.3)] tracking-[0.06em]">
            ✗ Passwords do not match
          </div>
        ) : match ? (
          <div className="mt-2 p-[8px_12px] rounded-[var(--r-md)] text-[12px] font-mono text-[var(--accent)] bg-[var(--accent-soft)] border border-[oklch(0.86_0.20_142/0.3)] tracking-[0.06em]">
            ✓ Passwords match
          </div>
        ) : null}

        <div className="flex items-center justify-between mt-[18px] mb-[22px]">
          <label className="check">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span className="box">
              <Ic.check />
            </span>
            <span>I understand the master password is unrecoverable</span>
          </label>
        </div>

        <button type="submit" className="btn-primary">
          <Ic.shield /> Provision vault
          <Ic.arrow />
        </button>

        <div className="mt-[22px] text-center text-[13px] text-[var(--text-muted)]">
          Already have a vault?
          <button
            type="button"
            className="bg-transparent border-0 p-0 text-[var(--accent)] font-sans text-[13px] cursor-pointer no-underline relative ml-1.5 hover:[text-shadow:0_0_12px_var(--accent-glow)]"
            onClick={() => {}}
          >
            Sign in →
          </button>
        </div>
      </form>
    </div>
  );
}
