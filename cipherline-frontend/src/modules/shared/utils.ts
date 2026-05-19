export function generatePassword(len = 18): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

// Security feature helpers — strength, duplicates, expiry, breach (mocked HIBP-style)

// ===== STRENGTH (entropy + patterns) =====
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

function analyzeStrength(pw: string) {
  if (!pw)
    return {
      score: 0,
      label: "No password",
      entropy: 0,
      length: 0,
      charset: 0,
      issues: ["Empty"],
    };
  const len = pw.length;
  let charset = 0;
  if (/[a-z]/.test(pw)) charset += 26;
  if (/[A-Z]/.test(pw)) charset += 26;
  if (/\d/.test(pw)) charset += 10;
  if (/[^A-Za-z0-9]/.test(pw)) charset += 32;
  const entropy = Math.round(len * Math.log2(charset || 2));

  const issues = [];
  let bonus = 0;
  if (len < 8) issues.push("Under 8 characters");
  if (!/[A-Z]/.test(pw)) issues.push("No uppercase");
  if (!/[a-z]/.test(pw)) issues.push("No lowercase");
  if (!/\d/.test(pw)) issues.push("No digits");
  if (!/[^A-Za-z0-9]/.test(pw)) issues.push("No symbols");
  for (const re of COMMON_PATTERNS)
    if (re.test(pw)) {
      issues.push("Common word");
      break;
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
  if (/^(.)\1{3,}/.test(pw) || /(.)(.)\1\2/.test(pw))
    issues.push("Repeating pattern");
  if (len >= 14 && issues.length <= 1) bonus = 1;

  // 0..4 score
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

// ===== EXPIRY =====
function getExpiryStatus(acc: { expiryDays?: number; daysOld?: number }) {
  if (!acc.expiryDays)
    return { kind: "fresh", daysLeft: Infinity, label: "Never expires" };
  const left = acc.expiryDays - (acc.daysOld || 0);
  if (left <= 0)
    return {
      kind: "expired",
      daysLeft: left,
      label: `Expired ${Math.abs(left)}d ago`,
    };
  if (left <= 7)
    return { kind: "soon", daysLeft: left, label: `Expires in ${left}d` };
  return { kind: "fresh", daysLeft: left, label: `${left}d remaining` };
}

// ===== DUPLICATES =====
function findDuplicates(accounts: { id: string; password: string }[]) {
  const buckets: { [key: string]: string[] } = {};
  for (const a of accounts) {
    if (!buckets[a.password]) buckets[a.password] = [];
    buckets[a.password].push(a.id);
  }
  const dupSet = new Set<string>();
  Object.values(buckets).forEach((ids: string[]) => {
    if (ids.length > 1) ids.forEach((id) => dupSet.add(id));
  });
  return dupSet;
}

// ===== AUDIT SUMMARY =====
function buildAudit(
  accounts: {
    id: string;
    password: string;
    expiryDays?: number;
    daysOld?: number;
    breachStatus?: string;
  }[],
) {
  const dups = findDuplicates(accounts);
  let weak = 0,
    expired = 0,
    expiringSoon = 0,
    breached = 0,
    unchecked = 0;
  for (const a of accounts) {
    const s = analyzeStrength(a.password).score;
    if (s < 3) weak++;
    const ex = getExpiryStatus(a);
    if (ex.kind === "expired") expired++;
    else if (ex.kind === "soon") expiringSoon++;
    if (a.breachStatus === "compromised") breached++;
    if (a.breachStatus === "unchecked") unchecked++;
  }
  return {
    dupSet: dups,
    dupCount: dups.size,
    weak,
    expired,
    expiringSoon,
    breached,
    unchecked,
    total: accounts.length,
  };
}

// ===== HIBP-style breach check (mocked) =====
// In a real frontend integration this would SHA-1 the password and POST first 5 chars
// to https://api.pwnedpasswords.com/range/<5> (k-anonymity).
function mockBreachCheck(
  pw: string,
): Promise<{ status: string; count: number }> {
  return new Promise<{ status: string; count: number }>((resolve) => {
    setTimeout(
      () => {
        const known = [
          "password",
          "summer2024!",
          "qwerty",
          "letmein",
          "admin",
          "12345678",
          "iloveyou",
        ];
        const hit = known.includes(pw.toLowerCase());
        resolve(
          hit
            ? {
                status: "compromised",
                count: Math.floor(Math.random() * 10000) + 50,
              }
            : { status: "safe", count: 0 },
        );
      },
      900 + Math.random() * 700,
    );
  });
}

export {
  analyzeStrength,
  getExpiryStatus,
  findDuplicates,
  buildAudit,
  mockBreachCheck,
};
