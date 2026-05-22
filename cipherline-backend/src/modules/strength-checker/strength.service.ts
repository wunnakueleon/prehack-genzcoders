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

export async function analyzeStrength(body: any) {
  const pw = body?.password || "";
  if (typeof pw !== "string" || !pw) {
    return {
      score: 0,
      label: "No password",
      entropy: 0,
      length: 0,
      charset: 0,
      issues: ["Empty"],
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

  if (len < 8) issues.push("Under 8 characters");
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

  for (const seq of SEQUENCES) {
    for (let i = 0; i < seq.length - 3; i++) {
      const sub = seq.slice(i, i + 4);
      if (pw.toLowerCase().includes(sub)) {
        issues.push("Keyboard / sequential run");
        break;
      }
    }
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

  const labels = ["Crackable", "Weak", "Decent", "Strong", "Hardened"];
  return { score, label: labels[score], entropy, length: len, charset, issues };
}
