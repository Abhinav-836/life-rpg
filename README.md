# Life RPG

Turn your life into a game. Real tasks become quests: finish them to earn XP and gold, level up your character, grow four attributes, keep a daily streak alive, unlock badges and spend gold in the shop.

**Live app:** https://life-rpg-eight-rose.vercel.app
**API:** https://life-rpg-hcr7.onrender.com (health check at `/health`)

Hit **"Try the demo"** on the login page to get your own private demo account with a few starter quests. No sign-up needed.

## Features

- **Quests.** Create, edit, schedule and complete quests in six categories (coding, fitness, wellness, study, chores, creative) at three priorities. Each priority has its own reward range.
- **Progression.** Levels follow a non-linear curve (`100 × level^1.5`). Every category feeds one of four attributes: Strength, Intellect, Health and Discipline.
- **Streaks.** Consecutive-day tracking in *your* timezone, so the day ends at your local midnight. Includes a month calendar, a 5-week heatmap and an optional "streak at risk" warning.
- **Economy.** Gold buys perks in the Rewards store and items in the Shop. Equip gear (one item per slot), and your loadout follows you across devices.
- **Badges.** Unlocked automatically for quests completed, streak length and level reached.
- **Account.** Profile, password change, sound effects toggle, and account deletion.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, TanStack Query |
| Backend | Node.js, Express, Prisma |
| Database | PostgreSQL |
| Auth | JWT (email + password, bcrypt hashing) |
| Hosting | Vercel (frontend), Render (API) |

## How it stays fair

Everything that affects progress is decided by the server, never the browser:

- **Rewards are bounded.** A quest's XP and gold must fall inside the range for its priority. The API rejects anything outside it and clamps as a second safeguard.
- **Each quest pays out once.** Completion is a single conditional update inside a transaction. Double-clicks or two tabs can't claim the same reward twice.
- **No lost or duplicated XP.** Each player's character row is locked while a reward is applied, so simultaneous completions are applied one after another.
- **Gold can't go negative.** Purchases subtract gold only where the balance still covers the price, in one statement.
- **Players can only touch their own data.** Every query is scoped to the user ID in the verified JWT.

These are covered by integration tests against a real Postgres database (`backend/tests/db.test.js`), including concurrency tests that fire parallel requests.

## Project structure

```
life-rpg/
├── frontend/   React app (see frontend/README.md)
└── backend/    Express API + Prisma schema (see backend/README.md)
```

## Running locally

You need Node 18+ and a PostgreSQL database (local, or a free one from Neon, Supabase, Railway or Render).

**Backend**

```bash
cd backend
npm install
cp .env.example .env          # set DATABASE_URL and JWT_SECRET
npx prisma migrate deploy
npm run seed
npm run dev                   # http://localhost:5000
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_BASE_URL=http://localhost:5000/api
npm run dev                   # http://localhost:5173
```

## Tests

```bash
cd backend && npm test        # unit tests (no database needed)

# integration tests: use a separate, empty test database
DATABASE_URL=postgresql://.../life_rpg_test npx prisma migrate deploy
DATABASE_URL=postgresql://.../life_rpg_test RUN_DB_TESTS=1 npm test

cd frontend && npm test && npm run lint
```

## Author

Built by [Abhinav Ashutosh](https://github.com/Abhinav-836).