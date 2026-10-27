// Options for every interactive transaction (prisma.$transaction(async tx => ...)).
//
// Prisma's defaults are 2s to get a connection (maxWait) and 5s for the
// whole transaction (timeout). Those are tuned for an app sitting next to
// its database. Life RPG talks to a hosted Postgres (Supabase, Neon...)
// where every query is a network round trip, and quest completion runs
// about ten queries while holding a lock on the player's character. When
// a player completes several quests at once, those transactions queue up
// behind each other, and with the defaults the later ones were cancelled
// with "Transaction already closed" instead of simply waiting their turn.
const TX_OPTIONS = {
  maxWait: 10000, // ms to wait for a free connection from the pool
  timeout: 20000, // ms the transaction may run, including waiting for locks
};

module.exports = { TX_OPTIONS };