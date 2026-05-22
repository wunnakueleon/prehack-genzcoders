import { useState } from "react";
import { Ic } from "../../shared/icon";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onGenerate?: () => void;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Type a password to analyze…",
  onGenerate,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="big-input flex-wrap gap-2 sm:gap-3">
      <span className="leading shrink-0">
        <Ic.lock />
      </span>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="min-w-[140px]"
        style={{ fontSize: "clamp(15px, 4vw, 18px)" }}
      />
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto justify-end">
        <button
          type="button"
          className="trail-btn flex-1 sm:flex-none justify-center"
          onClick={() => setShow((v) => !v)}
          title={show ? "Hide password" : "Show password"}
        >
          {show ? <Ic.eyeOff /> : <Ic.eye />}
          <span className="hidden sm:inline">{show ? "Hide" : "Show"}</span>
        </button>

        {value ? (
          <button
            type="button"
            className="trail-btn flex-1 sm:flex-none justify-center"
            onClick={() => onChange("")}
            title="Clear field"
          >
            <Ic.x /> <span className="hidden sm:inline">Clear</span>
          </button>
        ) : null}

        {onGenerate ? (
          <button
            type="button"
            className="trail-btn flex-1 sm:flex-none justify-center"
            style={{
              color: "var(--accent)",
              borderColor: "oklch(0.86 0.20 142 / 0.4)",
            }}
            onClick={onGenerate}
            title="Generate strong password"
          >
            <Ic.sparkle /> Generate
          </button>
        ) : null}
      </div>
    </div>
  );
}
