# Cipherline — Password Manager

A web-based password manager built for a beginner-friendly cybersecurity hackathon. Users can securely store and manage passwords in their own encrypted vault with four security features.

---

## Team

| Profile | Name | GitHub | ID | Role |
|---------|------|--------|----|------|
| [<img src="https://github.com/wunnakueleon.png?size=20" width="20" height="20" alt="Wunna" style="border-radius:50%; vertical-align:middle;" />](https://github.com/wunnakueleon) | [Wunna Moe San](https://github.com/wunnakueleon) | [wunnakueleon](https://github.com/wunnakueleon) | 68130500835 | DevLead — Auth + Vault + Breach Check + Shared |
| [<img src="https://github.com/YuukinoTakkashi1998.png?size=20" width="20" height="20" alt="Min Thuta" style="border-radius:50%; vertical-align:middle;" />](https://github.com/YuukinoTakkashi1998) | [Min Thuta](https://github.com/YuukinoTakkashi1998) | [YuukinoTakkashi1998](https://github.com/YuukinoTakkashi1998) | 68130500839 | Feature — Password Expiry Tracker |
| [<img src="https://github.com/KyiPhyuThiriKhaing.png?size=20" width="20" height="20" alt="Kyi" style="border-radius:50%; vertical-align:middle;" />](https://github.com/KyiPhyuThiriKhaing) | [Kyi Phyu Thiri Khaing](https://github.com/KyiPhyuThiriKhaing) | [KyiPhyuThiriKhaing](https://github.com/KyiPhyuThiriKhaing) | 68130500851 | Feature — Password Strength Checker |
| [<img src="https://github.com/laurahsu-loop.png?size=20" width="20" height="20" alt="Nan" style="border-radius:50%; vertical-align:middle;" />](https://github.com/laurahsu-loop) | [Nan Thiri Htet Su](https://github.com/laurahsu-loop) | [laurahsu-loop](https://github.com/laurahsu-loop) | 68130500853 | Feature — Duplicate Password Detector |

---

## Feature Assignment

| Feature | Branch | Owner | Frontend | Backend |
|---------|--------|-------|----------|---------|
| Auth (Login/Signup) | `feature/auth` | Wunna | `modules/auth/` | `modules/auth/` |
| Vault | `feature/vault` | Wunna | `modules/vault/` | `modules/vault/` |
| Breach Check | `feature/breach-check` | Wunna | `modules/breach-check/` | `modules/breach-check/` |
| Password Strength Checker | `feature/strength-checker` | Kyi Phyu | `modules/strength-checker/` | `modules/strength-checker/` |
| Duplicate Password Detector | `feature/duplicate-detector` | Nan | `modules/duplicate-detector/` | `modules/duplicate-detector/` |
| Password Expiry Tracker | `feature/expiry-tracker` | Min Thuta | `modules/expiry-tracker/` | `modules/expiry-tracker/` |

> Each person owns their folder end-to-end — frontend UI + backend router/controller/service. Do not touch another person's folder.

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
│           ├── auth/               # Wunna
│           ├── vault/              # Wunna
│           ├── breach-check/       # Wunna
│           ├── strength-checker/   # Kyi Phyu
│           ├── duplicate-detector/ # Nan
│           └── expiry-tracker/     # Min Thuta
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
            ├── auth/               # Wunna
            ├── vault/              # Wunna
            ├── breach-check/       # Wunna
            ├── strength-checker/   # Kyi Phyu
            ├── duplicate-detector/ # Nan
            └── expiry-tracker/     # Min Thuta
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

Replace `<your-feature>` with your branch name from the table above.

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

Do this at the start of each session to stay up to date:

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
- **Never modify shared files** without checking with Wunna first:
  - `prisma/schema.prisma`
  - `src/index.ts`
  - `src/routers.ts`
  - `src/db.ts`
  - `api.ts`, `App.tsx`, `routers.tsx`, `main.tsx`
- **Always pull from main before starting work** each session
- **Do not delete your branch** after merging

---

## Shared Files — Do Not Modify

These files are owned by the DevLead. If you need a change in these files (e.g. a new route registered, a schema field added), **ask Wunna**.

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
| `npm start` | Run compiled server |
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
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
