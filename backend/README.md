# Life RPG — API

Node.js + Express + PostgreSQL (via Prisma) API for Life RPG.

## Setup

```bash
npm install
cp .env.example .env          # fill in DATABASE_URL and JWT_SECRET
npx prisma migrate deploy     # creates/updates tables
npm run seed                  # rewards, shop items and badges (safe to re-run)
npm run dev                   # http://localhost:5000
```

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `JWT_SECRET` | yes | Long random string; the server refuses to start without it |
| `JWT_EXPIRES_IN` | no | Default `7d` |
| `CLIENT_ORIGIN` | no | Allowed frontend origin(s), comma-separated. Default `*` |
| `PORT` | no | Default `5000` |

## Deploying

1. Set the variables above on your host.
2. Run `npx prisma migrate deploy` as part of the build, so new migrations are applied before the new code starts.
3. Check `GET /health`. It should return `{"ok": true, "db": "connected"}`.

## API

All routes are prefixed with `/api`. Everything except `/auth/*` needs `Authorization: Bearer <token>`. The frontend also sends `X-Timezone` (an IANA name such as `Asia/Kolkata`), which decides when a streak day starts.

Responses are `{ "success": true, "data": ... }` or `{ "success": false, "message": "...", "details": [...] }`.

| Method | Route | Description |
|---|---|---|
| POST | /auth/signup | Create an account (also creates the character and streak) |
| POST | /auth/login | Returns a JWT |
| POST | /auth/guest | Creates a private demo account with starter quests |
| GET | /users/me | Current user |
| PATCH | /users/me | Update name / email |
| DELETE | /users/me | Delete account and all data (`{ password }`) |
| POST | /users/me/password | Change password |
| GET | /users/me/settings | Preferences (theme, sound, reminders, timezone) |
| PATCH | /users/me/settings | Update preferences |
| GET | /character/me | Character, attributes and `xpToNextLevel` |
| GET | /tasks | Own quests (`?completed=true/false`) |
| POST | /tasks | Create a quest `{ title, category, difficulty, xp?, gold?, dueDate? }` |
| PATCH | /tasks/:id | Edit an open quest |
| DELETE | /tasks/:id | Delete a quest |
| POST | /tasks/:id/complete | Pays out XP/gold, updates streak and badges |
| GET | /streak/me | Current streak (0 if a day was missed), longest, `activeToday` |
| GET | /rewards | Reward store |
| GET | /rewards/mine | Redemption history |
| POST | /rewards/redeem | `{ rewardId }` |
| GET | /inventory | Shop items |
| GET | /inventory/mine | Owned items, with `equipped` |
| POST | /inventory/purchase | `{ itemId }` |
| POST | /inventory/:itemId/equip | Equip (unequips other items of the same type) |
| POST | /inventory/:itemId/unequip | Unequip |
| GET | /badges | All badges |
| GET | /badges/mine | Earned badges |

## Game rules

All rules live in `src/config/game.js`.

| Difficulty | XP range | Gold range | Default |
|---|---|---|---|
| easy | 5–50 | 0–15 | 20 XP, 5 gold |
| normal | 10–100 | 0–30 | 30 XP, 8 gold |
| hard | 20–200 | 0–60 | 50 XP, 13 gold |

- **Levels:** `xpRequiredForLevel(level) = floor(100 × level^1.5)`. Leftover XP carries over, so one big reward can grant several levels.
- **Attributes:** each quest category levels up on the same curve.
- **Streaks:** counted in calendar days in the user's timezone. Completing a quest on consecutive days extends the streak, and missing a day resets it.

## Integrity

- Quest completion runs in one transaction. A conditional `UPDATE ... WHERE isCompleted = false` means only one request can claim a quest. The character row is locked (`SELECT ... FOR UPDATE`) while XP is applied, so parallel completions never overwrite each other.
- Spending gold is a single conditional update (`WHERE gold >= cost`), so parallel purchases can't push the balance below zero.
- Every query is scoped to the user ID from the verified JWT.
- Demo accounts can't log in with a password, can't change email or password, and are deleted after 7 days.

## Tests

```bash
npm test                                                   # unit tests
DATABASE_URL=<test db> RUN_DB_TESTS=1 npm test             # + integration tests
```

Run the integration tests against a separate test database. They create and clean up their own users, but never point them at production.