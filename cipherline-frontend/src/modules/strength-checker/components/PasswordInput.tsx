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
    <div className="big-input">
      <span className="leading">
        <Ic.lock />
      </span>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
      />
      <button
        type="button"
        className="trail-btn"
        onClick={() => setShow((v) => !v)}
        title={show ? "Hide password" : "Show password"}
      >
        {show ? <Ic.eyeOff /> : <Ic.eye />}
        {show ? "Hide" : "Show"}
      </button>

      {value ? (
        <button
          type="button"
          className="trail-btn"
          onClick={() => onChange("")}
          title="Clear field"
        >
          <Ic.x /> Clear
        </button>
      ) : null}

      {onGenerate ? (
        <button
          type="button"
          className="trail-btn"
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
  );
}
