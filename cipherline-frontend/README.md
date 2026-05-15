# Cipherline Frontend

React + TypeScript + Vite + Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. Expects the backend at `http://localhost:3000` (set `VITE_API_URL` to override).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

Create a `.env` file in this directory if needed:

```env
VITE_API_URL=http://localhost:3000
```
