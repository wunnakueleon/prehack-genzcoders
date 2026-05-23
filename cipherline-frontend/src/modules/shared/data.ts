// Mock data — fictional entries to demonstrate the UI
// Dates are days-ago so we can compute expiry status realistically.

const CATEGORIES = [
  { id: "all", name: "All Vaults", color: "oklch(0.86 0.20 142)" },
  { id: "work", name: "Work", color: "oklch(0.86 0.20 142)" },
  { id: "personal", name: "Personal", color: "oklch(0.82 0.14 215)" },
  { id: "finance", name: "Finance", color: "oklch(0.82 0.16 75)" },
  { id: "dev", name: "Developer", color: "oklch(0.76 0.18 290)" },
  { id: "social", name: "Social", color: "oklch(0.76 0.18 340)" },
];

// breachStatus: "safe" | "compromised" | "unchecked"
// daysOld: how long ago the password was set (for expiry math)
// expiryDays: 30/60/90/never

const ACCOUNTS = [
  {
    id: "acc-01",
    name: "Wunna Moe San",
    domain: "github.com",
    email: "wunna@cipherline.dev",
    username: "wunnamoesan",
    password: "rT9$mZeq!4kVc8L",
    note: "Dev lead account. Token scoped to private org repos — rotate every quarter.",
    category: "dev",
    tags: ["2FA", "Token"],
    color: "oklch(0.76 0.18 290)",
    initial: "W",
    lastUsed: "12m ago",
    daysOld: 18,
    expiryDays: 90,
    breachStatus: "safe",
    breachCount: 0,
  },
  {
    id: "acc-02",
    name: "Gloria",
    domain: "figma.com",
    email: "gloria@cipherline.dev",
    username: "gloria.design",
    password: "Summer2024!",
    note: "Shared design seat. Keep drafts archived before handoff.",
    category: "work",
    tags: ["Shared"],
    color: "oklch(0.76 0.18 340)",
    initial: "G",
    lastUsed: "3d ago",
    daysOld: 142,
    expiryDays: 90,
    breachStatus: "compromised",
    breachCount: 47,
  },
  {
    id: "acc-03",
    name: "Min Thuta",
    domain: "notion.so",
    email: "minthuta@cipherline.dev",
    username: "min.thuta",
    password: "Q7p#Lz!93B$mVxq2",
    note: "Team workspace. Invite link should not be shared externally.",
    category: "work",
    tags: ["2FA"],
    color: "oklch(0.86 0.20 142)",
    initial: "M",
    lastUsed: "yesterday",
    daysOld: 55,
    expiryDays: 60,
    breachStatus: "safe",
    breachCount: 0,
  },
  {
    id: "acc-04",
    name: "Nan",
    domain: "instagram.com",
    email: "nan@personal.me",
    username: "nan.social",
    password: "wH4!pT7nQz#m2Rb9",
    note: "Personal account. Recovery codes stored in notes app.",
    category: "social",
    tags: ["Personal"],
    color: "oklch(0.82 0.14 215)",
    initial: "N",
    lastUsed: "5h ago",
    daysOld: 8,
    expiryDays: 60,
    breachStatus: "unchecked",
    breachCount: 0,
  },
];

export { CATEGORIES, ACCOUNTS };
