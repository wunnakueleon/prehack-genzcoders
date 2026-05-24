import { useNavigate } from "react-router-dom";
import { BrandMark } from "../shared/ui";
import { Ic } from "../shared/icon";

const FEATURES = [
  {
    icon: <Ic.lock />,
    title: "Zero-knowledge vault",
    desc: "Your master password never leaves your device. We derive every key locally — the server only ever sees ciphertext.",
  },
  {
    icon: <Ic.shield />,
    title: "Breach detection",
    desc: "Every credential is checked against 10 billion leaked passwords via k-anonymity — without sending your password anywhere.",
  },
  {
    icon: <Ic.check />,
    title: "Password health",
    desc: "Spot weak, reused, and expiring passwords at a glance. Cipherline surfaces risk before attackers do.",
  },
  {
    icon: <Ic.mail />,
    title: "Expiry tracker",
    desc: "Get ahead of stale credentials. Cipherline flags passwords nearing expiry so you rotate before they become a liability.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-[40px_20px] page-enter">
      <div className="w-full max-w-[860px] flex flex-col items-center text-center gap-[48px]">

        {/* Brand */}
        <div className="flex flex-col items-center gap-[20px]">
          <BrandMark />
          <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.22em] uppercase flex items-center gap-2">
            <span
              className="inline-block w-[7px] h-[7px] rounded-full bg-[var(--accent)] [box-shadow:0_0_12px_var(--accent-glow)]"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
            End-to-end encrypted · Zero knowledge
          </div>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center gap-[18px]">
          <h1 className="text-[clamp(40px,6vw,76px)] leading-[0.94] tracking-[-0.03em] font-semibold m-0">
            Your secrets,{" "}
            <span className="text-[var(--accent)]">sealed</span>.
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_var(--accent)]">
              Everywhere safe.
            </span>
          </h1>
          <p className="text-[var(--text-muted)] text-[17px] leading-[1.6] max-w-[580px] m-0">
            Cipherline is a hardware-bound password vault built for teams and
            individuals who take security seriously. One master key unlocks
            everything — and no one else ever sees it.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-[14px]">
          <button
            className="btn-primary"
            style={{ minWidth: 180 }}
            onClick={() => navigate("/signup")}
          >
            <Ic.shield /> Create a vault
            <Ic.arrow />
          </button>
          <button
            className="border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] rounded-[var(--r-md)] px-[22px] py-[10px] text-[14px] font-semibold tracking-[-0.01em] cursor-pointer flex items-center gap-2 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            onClick={() => navigate("/login")}
          >
            <Ic.lock /> Sign in
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[900px]:grid-cols-4 gap-[14px] w-full">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="border border-[var(--border)] rounded-[var(--r-md)] p-[20px] bg-[var(--surface)] text-left flex flex-col gap-[12px]"
            >
              <div className="w-[38px] h-[38px] rounded-[10px] grid place-items-center bg-[var(--accent-soft)] border border-[oklch(0.86_0.2_142/0.25)] text-[var(--accent)] [&_svg]:w-[18px] [&_svg]:h-[18px]">
                {icon}
              </div>
              <div>
                <div className="font-semibold text-[14px] text-[var(--text)] mb-1">{title}</div>
                <div className="text-[13px] text-[var(--text-muted)] leading-[1.55]">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.12em] opacity-50">
          Built for the next generation of security-conscious teams.
        </div>

      </div>
    </div>
  );
}
