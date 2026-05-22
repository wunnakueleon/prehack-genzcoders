type StrengthCheck = {
  id: string;
  label: string;
  passed: boolean;
};

type StrengthAnalysis = {
  score: number;
  label: string;
  entropy: number;
  length: number;
  charset: number;
  issues: string[];
  checks: StrengthCheck[];
  suggestions: string[];
  crackTime: {
    seconds: number;
    label: string;
  };
};

const MAX_PASSWORD_LENGTH = 256;

const COMMON_PATTERNS = [
  /password/i,
  /qwerty/i,
  /asdf/i,
  /letmein/i,
  /admin/i,
  /welcome/i,
  /summer|winter|spring|autumn/i,
  /monkey/i,
  /dragon/i,
  /master/i,
  /iloveyou/i,
];
const SEQUENCES = [
  "0123456789",
  "abcdefghijklmnopqrstuvwxyz",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

const SUGGESTIONS: Record<string, string> = {
  "Under 12 characters": "Use at least 12 characters; 16 or more is better for important accounts.",
  "No uppercase": "Add uppercase letters so the password uses more than one letter case.",
  "No lowercase": "Add lowercase letters so the password is not all caps or numeric.",
  "No digits": "Add at least one number away from predictable endings like 123.",
  "No symbols": "Add a symbol such as !, ?, #, or % to widen the search space.",
  "Common word": "Avoid dictionary words, names, seasons, and common phrases.",
  "Keyboard / sequential run": "Remove keyboard walks and simple sequences like qwerty or 1234.",
  "Repeating pattern": "Avoid repeated characters or repeated pairs such as aaaa or abab.",
};

function estimateCrackTime(entropy: number) {
  const seconds = entropy > 0 ? Math.pow(2, entropy) / 1e10 : 0;

  if (seconds < 1) return { seconds, label: "instant" };
  if (seconds < 60) return { seconds, label: `${Math.round(seconds)} seconds` };
  if (seconds < 3600) return { seconds, label: `${Math.round(seconds / 60)} minutes` };
  if (seconds < 86400) return { seconds, label: `${Math.round(seconds / 3600)} hours` };
  if (seconds < 31536000) return { seconds, label: `${Math.round(seconds / 86400)} days` };
  if (seconds < 31536000 * 1000) {
    return { seconds, label: `${Math.round(seconds / 31536000)} years` };
  }

  return { seconds, label: "centuries" };
}

function includesSequence(password: string): boolean {
  const lowerPassword = password.toLowerCase();

  return SEQUENCES.some((seq) => {
    for (let i = 0; i < seq.length - 3; i++) {
      const forward = seq.slice(i, i + 4);
      const backward = forward.split("").reverse().join("");

      if (lowerPassword.includes(forward) || lowerPassword.includes(backward)) {
        return true;
      }
    }

    return false;
  });
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export async function analyzeStrength(body: unknown): Promise<StrengthAnalysis> {
  const password = typeof body === "object" && body !== null && "password" in body
    ? (body as { password?: unknown }).password
    : "";
  const pw = typeof password === "string" ? password.slice(0, MAX_PASSWORD_LENGTH) : "";

  if (!pw) {
    return {
      score: 0,
      label: "No password",
      entropy: 0,
      length: 0,
      charset: 0,
      issues: ["Empty"],
      checks: [],
      suggestions: ["Type a password to get a strength report."],
      crackTime: { seconds: 0, label: "instant" },
    };
  }

  const len = pw.length;
  let charset = 0;
  if (/[a-z]/.test(pw)) charset += 26;
  if (/[A-Z]/.test(pw)) charset += 26;
  if (/\d/.test(pw)) charset += 10;
  if (/[^A-Za-z0-9]/.test(pw)) charset += 32;
  const entropy = Math.round(len * Math.log2(charset || 2));

  const issues: string[] = [];
  let bonus = 0;

  if (len < 12) issues.push("Under 12 characters");
  if (!/[A-Z]/.test(pw)) issues.push("No uppercase");
  if (!/[a-z]/.test(pw)) issues.push("No lowercase");
  if (!/\d/.test(pw)) issues.push("No digits");
  if (!/[^A-Za-z0-9]/.test(pw)) issues.push("No symbols");

  for (const re of COMMON_PATTERNS) {
    if (re.test(pw)) {
      issues.push("Common word");
      break;
    }
  }

  if (includesSequence(pw)) {
    issues.push("Keyboard / sequential run");
  }

  if (/^(.)\1{3,}/.test(pw) || /(.)(.)\1\2/.test(pw)) {
    issues.push("Repeating pattern");
  }

  if (len >= 14 && issues.length <= 1) bonus = 1;

  let score = 0;
  if (entropy >= 28) score = 1;
  if (entropy >= 48) score = 2;
  if (entropy >= 64) score = 3;
  if (entropy >= 80 && issues.length === 0) score = 4;
  if (issues.includes("Common word")) score = Math.min(score, 1);
  score = Math.min(
    4,
    Math.max(0, score + (bonus ? 1 : 0) - (issues.length > 3 ? 1 : 0)),
  );

  const labels: string[] = ["Crackable", "Weak", "Decent", "Strong", "Hardened"];
  const checks = [
    { id: "length", label: "At least 12 characters", passed: len >= 12 },
    { id: "case", label: "Uses uppercase and lowercase letters", passed: /[A-Z]/.test(pw) && /[a-z]/.test(pw) },
    { id: "digits", label: "Contains at least one digit", passed: /\d/.test(pw) },
    { id: "symbols", label: "Contains at least one symbol", passed: /[^A-Za-z0-9]/.test(pw) },
    { id: "common", label: "Avoids common words", passed: !issues.includes("Common word") },
    { id: "sequence", label: "Avoids keyboard or numeric sequences", passed: !issues.includes("Keyboard / sequential run") },
    { id: "repeat", label: "Avoids repeated patterns", passed: !issues.includes("Repeating pattern") },
  ];
  const suggestions = unique(
    issues
      .map((issue) => SUGGESTIONS[issue])
      .filter((suggestion): suggestion is string => Boolean(suggestion)),
  );

  return {
    score,
    label: labels[score] ?? "Crackable",
    entropy,
    length: len,
    charset,
    issues,
    checks,
    suggestions: suggestions.length ? suggestions : ["This password passes the strength checklist."],
    crackTime: estimateCrackTime(entropy),
  };
}
