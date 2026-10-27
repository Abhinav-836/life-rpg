# Life RPG — Frontend

React app for Life RPG: real tasks become quests, completing them earns XP and gold, and your character levels up on a non-linear XP curve.

## Stack

- React 18 + Vite
- React Router v6
- TanStack Query (data fetching, caching, mutations)
- Tailwind CSS (dark-fantasy design system, see `tailwind.config.js`)

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL
npm run dev            # http://localhost:5173
npm run build          # production build to dist/
npm run preview        # preview the production build
npm test               # tests
npm run lint           # eslint
```

`VITE_API_BASE_URL` is the API base including `/api`, e.g. `http://localhost:5000/api` for a local backend.

## Project structure

```
src/
  pages/        One folder per route, each with its own components/
  components/   Shared UI: Navbar, Sidebar, MobileNav, LevelUp modal, common/ (Button, Modal, ...)
  layouts/      MainLayout (signed-in app shell) and AuthLayout (login/signup)
  services/     API client: one file per domain, all going through services/api.js
  context/      AuthContext, ThemeContext
  hooks/        TanStack Query hooks wrapping the services
  routes/       AppRoutes, ProtectedRoute, PublicRoute
  utils/        dates, formatting, error handling, sound effects
  config/       env.js, constants.js (categories, priorities, reward limits, XP curve)
```

## Notes

- **Server-side game logic.** All XP, gold, level, streak and badge logic runs on the server. The client only says "complete quest X" and renders the result.
- **Shared constants.** `config/constants.js` mirrors the server's reward limits and XP curve, so forms and previews match what the server enforces.
- **Local dates.** Dates are keyed by the player's local day (`utils/dates.js`), and the browser's timezone is sent with every request.
- **Clean account switching.** The query cache is cleared on every sign-in and sign-out, so switching accounts never shows the previous player's data.
- **Accessibility.** Visible focus rings, labelled form fields, `aria-live` toasts and loaders, keyboard-operable modals (Escape closes) and `prefers-reduced-motion` support.