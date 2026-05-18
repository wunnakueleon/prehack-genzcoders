# Cipherline — Password Manager

A web-based password manager built for a beginner-friendly cybersecurity hackathon. Users can securely store and manage passwords in their own encrypted vault with four security features.

---

## Team

| Profile | Name | GitHub | ID | Role |
|---------|------|--------|----|------|
| [<img src="https://github.com/wunnakueleon.png?size=20" width="20" height="20" alt="Wunna" style="border-radius:50%; vertical-align:middle;" />](https://github.com/wunnakueleon) | [Wunna Moe San](https://github.com/wunnakueleon) | [wunnakueleon](https://github.com/wunnakueleon) | 68130500835 | DevLead — Auth + Shared UI + Breach Check |
| [<img src="https://github.com/YuukinoTakkashi1998.png?size=20" width="20" height="20" alt="Min" style="border-radius:50%; vertical-align:middle;" />](https://github.com/YuukinoTakkashi1998) | [Min Thuta](https://github.com/YuukinoTakkashi1998) | [YuukinoTakkashi1998](https://github.com/YuukinoTakkashi1998) | 68130500839 | Feature 1 — Password Strength Checker |
| [<img src="https://github.com/KyiPhyuThiriKhaing.png?size=20" width="20" height="20" alt="Kyi" style="border-radius:50%; vertical-align:middle;" />](https://github.com/KyiPhyuThiriKhaing) | [Kyi Phyu Thiri Khaing](https://github.com/KyiPhyuThiriKhaing) | [KyiPhyuThiriKhaing](https://github.com/KyiPhyuThiriKhaing) | 68130500851 | Feature 2 — Duplicate Password Detector |
| [<img src="https://github.com/laurahsu-loop.png?size=20" width="20" height="20" alt="Nan" style="border-radius:50%; vertical-align:middle;" />](https://github.com/laurahsu-loop) | [Nan Thiri Htet Su](https://github.com/laurahsu-loop) | [laurahsu-loop](https://github.com/laurahsu-loop) | 68130500853 | Feature 3 — Password Expiry Tracker |

---

## Feature Assignment

| Feature | Branch | Owner | Frontend | Backend |
|---------|--------|-------|----------|---------|
| Auth + Shared UI | `feature/auth` | Wunna | `modules/auth/`, `App.tsx`, `modules/vault/` | `modules/auth/` |
| Password Strength Checker | `feature/strength-checker` | Min Thuta | `modules/strength-checker/` | `modules/strength-checker/` |
| Duplicate Password Detector | `feature/duplicate-detector` | Kyi Phyu | `modules/duplicate-detector/` | `modules/duplicate-detector/` |
| Password Expiry Tracker | `feature/expiry-tracker` | Nan Thiri | `modules/expiry-tracker/` | `modules/expiry-tracker/` |
| Breach Check | `feature/breach-check` | Wunna | `modules/breach-check/` | `modules/breach-check/` |

> Each person owns their folder end-to-end — frontend UI + backend router/controller/service. Do not touch another person's folder.

---

## Roadmap & Workflow

The project is split into **3 phases**. Phases 1 and 2 run in parallel after Wunna delivers the foundation.

---

### Phase 0 — Foundation (Wunna, before everyone starts)

> Status: **Done** — already pushed to `main`

- [x] Project skeleton — folder structure, shared files
- [x] Prisma schema — `User` + `PasswordEntry` models
- [x] Backend wired — Express, CORS, routers, error handler
- [x] Frontend wired — React Router, `App.tsx`, all routes registered
- [x] Git setup — branch protection, PR rules

---

### Phase 1 — Parallel Work (everyone at the same time)

Everyone branches off `main` and works independently on their own feature. No one needs to wait for anyone else.

---

#### Wunna — `feature/auth`

**Shared UI (delivered first so teammates can reference the design):**
- [ ] Navbar with links to all features + logout
- [ ] `ProtectedRoute` — redirect to `/login` if not logged in
- [ ] Vault page — list all password entries with status badges
- [ ] Add/Edit entry form — site name, URL, username, password, expiry

**Auth:**
- [ ] Login page — email + password form, redirect to vault on success
- [ ] Signup page — username + email + password, validation
- [ ] Backend — `POST /api/auth/login`, `POST /api/auth/signup`
- [ ] Password hashed with bcrypt, JWT token returned

**Breach Check (`feature/breach-check`):**
- [ ] Auto-run when a new password entry is added
- [ ] `GET /api/breach` — view breach status per entry
- [ ] `DELETE /api/breach/:id` — clear a breach result
- [ ] Frontend — breach status badge (Safe / Compromised / Unchecked) on each vault entry
- [ ] Manual re-check button
- [ ] Uses SHA-1 + HIBP k-anonymity API — password never leaves the browser

---

#### Min Thuta — `feature/strength-checker`

- [ ] `StrengthCheckerPage.tsx` — standalone page at `/strength`
- [ ] `PasswordInput.tsx` — password input field with show/hide toggle
- [ ] `StrengthMeter.tsx` — color bar (red → yellow → green) + score 0–100
- [ ] Real-time feedback as user types — no submit needed
- [ ] Feedback tips: "too short", "add symbols", "avoid sequences like 123"
- [ ] Backend — `POST /api/strength` — returns score + feedback (optional, can be fully client-side)
- [ ] Edge cases:
  - Empty input → no meter shown
  - Very long password → handle gracefully
  - Common passwords (e.g. "password123") → flag as weak regardless of length

---

#### Kyi Phyu — `feature/duplicate-detector`

- [ ] `DuplicateDetectorPage.tsx` — page at `/duplicates`
- [ ] `DuplicateList.tsx` — grouped list of duplicate entries by shared password
- [ ] Severity badge — how many sites share the same password
- [ ] Backend — `GET /api/duplicates` — returns grouped duplicate entries for logged-in user
- [ ] Edge cases:
  - Empty vault → "No passwords saved yet"
  - No duplicates found → "All your passwords are unique"
  - Only 1 entry → nothing to compare, show clear message

---

#### Nan Thiri — `feature/expiry-tracker`

- [ ] `ExpiryTrackerPage.tsx` — dashboard at `/expiry`
- [ ] `ExpiryDashboard.tsx` — color-coded list: red (expired), yellow (expiring soon), green (fresh)
- [ ] Filter buttons — All / Expired / Expiring Soon / Fresh
- [ ] Backend — `GET /api/expiry` — returns entries with days remaining calculated
- [ ] Backend — `PATCH /api/expiry/:id` — reset expiry timer
- [ ] Edge cases:
  - No expiry date set → show as "No expiry"
  - Empty vault → "No passwords to track"
  - All fresh → "All passwords are up to date"
  - All expired → prominent warning

---

### Phase 2 — Integration & Polish

After each feature PR is merged into `main`, everyone pulls and verifies their feature still works with the others.

- [ ] Vault page shows breach badge + expiry badge per entry (Wunna wires in)
- [ ] Add/Edit form triggers strength check inline (Min's component reused)
- [ ] Add/Edit form triggers breach check on save (Wunna's service called)
- [ ] Toast notifications on all actions — save, delete, error, success
- [ ] Loading states — spinner while API calls are in flight
- [ ] Error states — "Something went wrong" fallback
- [ ] Empty states on every page

---

### Phase 3 — Final Review

- [ ] All PRs merged to `main`
- [ ] Full end-to-end test — signup → add password → check strength → check breach → check expiry → detect duplicates
- [ ] README updated with final notes

---

## Project Structure

```
prehack-genzcoders/
├── cipherline-frontend/        # React + Vite + Tailwind
│   └── src/
│       ├── api.ts              # shared — axios instance (do not modify)
│       ├── App.tsx             # shared — Navbar + Outlet layout
│       ├── routers.tsx         # shared — all route definitions
│       ├── main.tsx            # shared — app entry point
│       └── modules/
│           ├── auth/           # Wunna — Login + Signup
│           ├── vault/          # Wunna — main dashboard, add/edit entries
│           ├── strength-checker/   # Min Thuta
│           ├── duplicate-detector/ # Kyi Phyu
│           ├── expiry-tracker/     # Nan Thiri
│           └── breach-check/       # Wunna
│
└── cipherline-backend/         # Express + Prisma + SQLite
    ├── prisma/
    │   ├── schema.prisma       # shared — DB models (do not modify)
    │   └── seed.ts             # shared — test data
    └── src/
        ├── index.ts            # shared — Express app entry
        ├── routers.ts          # shared — mounts all module routers
        ├── db.ts               # shared — Prisma client
        └── modules/
            ├── auth/           # Wunna
            ├── strength-checker/   # Min Thuta
            ├── duplicate-detector/ # Kyi Phyu
            ├── expiry-tracker/     # Nan Thiri
            └── breach-check/       # Wunna
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/wunnakueleon/prehack-genzcoders.git
cd prehack-genzcoders
```

### 2. Install dependencies

```bash
# Backend
cd cipherline-backend
npm install

# Frontend (open a new terminal)
cd cipherline-frontend
npm install
```

### 3. Set up environment

```bash
cd cipherline-backend
cp .env.example .env
```

`.env` already has the right defaults — no changes needed for local dev.

### 4. Set up the database

```bash
cd cipherline-backend
npx prisma migrate dev --name init
npm run seed
```

### 5. Run the app

```bash
# Backend (terminal 1) — http://localhost:3000
cd cipherline-backend
npm run dev

# Frontend (terminal 2) — http://localhost:5173
cd cipherline-frontend
npm run dev
```

---

## Git Workflow

### Branch off from main

```bash
git checkout main
git pull origin main
git checkout -b feature/<your-feature>
```

Replace `<your-feature>` with your branch name from the feature assignment table.

### Work and commit

```bash
git add .
git commit -m "feat: description of what you did"
git push origin feature/<your-feature>
```

### Open a Pull Request

1. Go to the repo on GitHub
2. Click **"Compare & pull request"**
3. Add a clear title and description
4. Request a review from **Wunna**
5. Wait for approval → merge

### Pull latest changes from main

Do this at the start of every session:

```bash
git checkout main
git pull origin main
git checkout feature/<your-feature>
git merge main
```

---

## Rules

- **Never push directly to `main`** — all changes go through PRs
- **Never touch another person's module folder**
- **Never modify shared files** without checking with Wunna first
- **Always pull from main before starting work** each session
- **Do not delete your branch** after merging
- **Commit often** — small commits are easier to review and fix

---

## Shared Files — Do Not Modify

If you need a change in these files (e.g. a new route, a schema field), ask Wunna.

| File | Purpose |
|------|---------|
| `cipherline-backend/prisma/schema.prisma` | Database models |
| `cipherline-backend/src/index.ts` | Express app, CORS, middleware |
| `cipherline-backend/src/routers.ts` | Mounts all module routers |
| `cipherline-backend/src/db.ts` | Prisma client instance |
| `cipherline-frontend/src/api.ts` | Axios base instance |
| `cipherline-frontend/src/App.tsx` | Layout — Navbar + Outlet |
| `cipherline-frontend/src/routers.tsx` | All frontend routes |
| `cipherline-frontend/src/main.tsx` | App entry point |

---

## Backend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run seed` | Seed database with test data |
| `npx prisma migrate dev` | Create and apply a migration |
| `npx prisma generate` | Regenerate Prisma client after schema change |
| `npx prisma studio` | Visual database browser |

## Frontend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
