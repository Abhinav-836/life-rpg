# Life RPG — Frontend

A gamified productivity app: real tasks become quests, completing them earns XP and gold,
and your character levels up on a non-linear XP curve. Built for the Life RPG hackathon brief.

This repo is **frontend only**. It runs entirely on an in-memory mock service layer so it's
fully functional standalone — no backend required to develop or demo it. A teammate will wire
it up to a real Node/Express + PostgreSQL/Supabase backend by swapping the internals of
`src/services/*.api.js` for real `fetch` calls (see "Connecting the real backend" below).

## Stack

- React 18 + Vite
- React Router v6
- TanStack Query (data fetching/caching/mutations)
- Tailwind CSS (dark-fantasy design system — see `tailwind.config.js`)

## Getting started

```bash
npm install
npm run dev       # starts the dev server at http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run test      # run the smoke test
npm run lint      # eslint
```

Copy `.env.example` to `.env` if you haven't already (already done in this checkout).
`VITE_USE_MOCKS=true` keeps the app on mock data regardless of `VITE_API_BASE_URL`.

## Demo login

The app ships with a seeded character. On the login screen, any email/password with a
password of 6+ characters works, or use **"Continue as guest"** for a one-click demo login.
Signup works with any valid-looking email and an 8+ character password.

## Project structure

```
src/
  pages/        One folder per route; each has its own components/ and page.css
  components/   Shared UI: Navbar, Sidebar, MobileNav, LevelUp modal, common/ (Button, Modal, etc.)
  layouts/      MainLayout (authenticated app shell) and AuthLayout (login/signup)
  services/     Mock API layer — one file per domain, real-API-shaped function signatures
  context/      AuthContext, ThemeContext
  hooks/        TanStack Query hooks wrapping the services
  routes/       AppRoutes, ProtectedRoute, PublicRoute
  utils/        formatDate, formatXP, formatGold, errorHandler, sound
  config/       env.js (VITE_* passthrough), constants.js (categories, priorities, XP curve)
```

## How progression works

- `config/constants.js` → `xpForLevel(level)` defines the non-linear XP curve (each level
  needs more XP than the last).
- `services/mockDb.js` → `applyXPAndGold()` is the single place that mutates XP/gold and
  rolls levels over; `registerActivityToday()` handles the streak increment/reset logic.
- Completing a quest (`services/task.api.js` → `completeQuest`) is the only path that touches
  these — it applies XP/gold, bumps the relevant attribute (via each quest's category →
  attribute mapping in `constants.js`), and registers the day's activity.

## Connecting the real backend

Every file in `src/services/` exports the same function signatures a real API client would
(`listQuests()`, `completeQuest(id)`, `redeemReward(id)`, etc.). To connect the Express/Supabase
backend:

1. Set `VITE_API_BASE_URL` and set `VITE_USE_MOCKS=false` in `.env`.
2. Replace each service file's body with calls to `services/api.js` → `request(path, options)`,
   keeping the same exported function names and return shapes so no page/hook code changes.
3. Real auth: swap `AuthContext`'s calls to `auth.api.js` for real login/signup/session
   endpoints and store the returned token (currently kept in memory only).

No secrets are read on the frontend beyond `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`
placeholders in `.env.example` — the anon key is safe for client-side use; nothing else
Supabase-related should ever be exposed here.

## Notes

- `public/assets/sounds/*.mp3` are empty placeholders — swap in real short SFX; playback
  (`src/utils/sound.js`) fails silently if a file is missing, so the app works either way.
- Accessibility: visible focus rings, semantic form labels, `aria-live` regions on toasts/loaders,
  keyboard-operable modals (Escape to close), and `prefers-reduced-motion` support are built in.
