# Cipherline

A full-stack password manager — React frontend + Express/Prisma backend.

## Structure

```
prehack-genzcoders/
├── cipherline-frontend/   # React + Vite + Tailwind
└── cipherline-backend/    # Express + Prisma + SQLite
```

## Getting Started

### 1. Backend

```bash
cd cipherline-backend
npm install

# Copy env and set your DATABASE_URL
cp .env.example .env

# Run migrations and generate Prisma client
npx prisma migrate dev --name init

# Seed the database with test data
npm run seed

# Start dev server (http://localhost:3000)
npm run dev
```

### 2. Frontend

```bash
cd cipherline-frontend
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

## Backend Commands

| Command | Description |
|---|---|
| `npm run dev` | Start server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled output |
| `npm run seed` | Seed database with test data |
| `npx prisma migrate dev` | Create and apply a new migration |
| `npx prisma migrate deploy` | Apply migrations in production |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | Open Prisma visual DB browser |

## Frontend Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
test
