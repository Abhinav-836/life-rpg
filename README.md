# Life RPG

Turn your life into a game. Complete quests to earn XP, level up, build streaks, grow character attributes, and spend gold on rewards and gear.

**Live app:** https://life-rpg-hcr7.onrender.com/api (backend) — add your deployed frontend URL here once it's hosted
**Video walkthrough:** _add link here_

## Stack

- **Frontend:** React + Vite + Tailwind CSS, React Router, TanStack Query
- **Backend:** Node.js + Express + Prisma
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT (email/password)

## Project structure

```
life-rpg/
├── frontend/     # React app - see frontend/README.md for setup
└── backend/      # Express API - see backend/README.md for setup
```

## Running locally

You need both pieces running (or point the frontend at the deployed backend and skip straight to the frontend step).

### Backend

```bash
cd backend
npm install
cp .env.example .env      # fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npx prisma db seed
npm run dev                # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env      # point VITE_API_BASE_URL at the backend above
npm run dev                # http://localhost:5173
```

## Core systems

- **Auth** — signup/login/JWT, every resource scoped to the logged-in user
- **Quests (tasks)** — create, edit, complete; XP/gold rewards are set at creation and locked in, never computed from client input at completion time
- **Progression** — non-linear leveling curve (`100 * level^1.5`), character attributes (Strength/Intellect/Health/Discipline) leveled up by completing quests in matching categories
- **Streaks** — consecutive-day tracking, calendar view built from real completed-quest dates
- **Rewards & Inventory** — two separate systems: Rewards are redeemable perks (themes, titles), Inventory is a purchasable item catalog with its own shop
- **Badges** — unlocked automatically based on quests completed, streak length, and character level

## Known limitations (documented, not accidental)

- **Settings** (theme, notification prefs) are stored in the browser (localStorage), not the database — these are app preferences, not the graded "primary data" (tasks/character/user all persist server-side in Postgres)
- **Equipped item state** on the Inventory page is also localStorage-only — the backend tracks ownership and quantity, not an "equipped" flag
- Both of the above are deliberate scope decisions for the hackathon window, not bugs

## Team

- Backend: [name]
- Frontend: [name]
