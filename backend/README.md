# Life RPG — Backend

Node.js + Express + PostgreSQL (via Prisma) API for the Life RPG hackathon project.

## Setup

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init   # creates tables from prisma/schema.prisma
npx prisma db seed          # loads starter rewards, shop items, and badges
npm run dev                 # starts on http://localhost:5000
```

`DATABASE_URL` should point at a real Postgres instance — Railway, Render, Supabase, or Neon all give you a free one with a connection string in under a minute.

## Deploy checklist (do this FIRST, not last)

1. Push this repo to GitHub (public).
2. Create a Postgres database on Railway/Render.
3. Deploy this backend, set the same env vars as `.env.example` in the host's dashboard.
4. Run `npx prisma migrate deploy` against the production database (or add it as a build step).
5. Hit `https://your-api-url/health` — it should return `{"ok": true, "db": "connected"}`.

If step 5 works, your deployment risk for the zero-tolerance rules is gone. Do this before building more features.

## API overview

All routes are prefixed `/api`. Every route except `/auth/*` and `/health` requires:
`Authorization: Bearer <token>` (returned from signup/login).

| Method | Route | Description |
|---|---|---|
| POST | /auth/signup | Create account (creates Character + Streak too) |
| POST | /auth/login | Returns JWT |
| GET | /users/me | Current user |
| GET | /character/me | Character + attributes + xpToNextLevel |
| GET | /tasks | List own tasks (`?completed=true/false`) |
| POST | /tasks | Create task `{ title, category, difficulty }` |
| PATCH | /tasks/:id | Edit own task |
| DELETE | /tasks/:id | Delete own task |
| POST | /tasks/:id/complete | Awards XP/gold, updates streak & badges |
| GET | /streak/me | Current streak |
| GET | /rewards | List redeemable rewards |
| GET | /rewards/mine | Own redemption history |
| POST | /rewards/redeem | `{ rewardId }` |
| GET | /inventory | Shop items |
| GET | /inventory/mine | Owned items |
| POST | /inventory/purchase | `{ itemId }` |
| GET | /badges | All badge definitions |
| GET | /badges/mine | Own earned badges |

## Design notes

- **XP/level math is server-only** (`src/services/xp.service.js`) — the frontend never sends xp/level, only "complete this task id". This satisfies the PDF's anti-cheat requirement.
- **Ownership checks** happen in `task.service.js`'s `getOwnedTaskOrThrow` — every task query is scoped to the JWT's `userId`.
- **Non-linear leveling**: `xpRequiredForLevel(level) = floor(100 * level^1.5)`. Tune `XP_BASE`/`XP_EXPONENT` in `xp.service.js` to change pacing.
- **Streaks** compare UTC calendar days, not timestamps, to avoid timezone edge cases.
- Gold-spending routes (`rewards/redeem`, `inventory/purchase`) use `prisma.$transaction` so a request can never deduct gold without completing the purchase.
