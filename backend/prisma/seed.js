// Seeds rewards, shop items and badges so a fresh database has content
// to show. Safe to run more than once: rows are matched by name, so
// re-running updates them instead of creating duplicates.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const REWARDS = [
  { name: 'Coffee Break Pass', description: 'Take a 30 min guilt-free break', cost: 100, type: 'perk' },
  { name: 'Focus Boost', description: 'Unlock focus music theme', cost: 200, type: 'theme' },
  { name: 'Custom Title', description: 'Choose a unique title', cost: 300, type: 'title' },
  { name: 'Avatar Outfit', description: 'Unlock a new character outfit', cost: 500, type: 'perk' },
];

const ITEMS = [
  { name: 'Training Sword', description: 'A starter weapon', rarity: 'common', cost: 0, type: 'equipment' },
  { name: 'Health Potion', description: 'Restores focus', rarity: 'uncommon', cost: 50, type: 'consumable' },
  { name: 'Discipline Medal', description: 'Proof of consistency', rarity: 'rare', cost: 400, type: 'collectible' },
  { name: 'Wisdom Crystal', description: 'A rare collectible', rarity: 'epic', cost: 800, type: 'collectible' },
];

const BADGES = [
  { name: 'First Step', description: 'Complete your first quest', criteriaType: 'tasks_completed', criteriaValue: 1 },
  { name: 'Knowledge Seeker', description: 'Complete 10 quests', criteriaType: 'tasks_completed', criteriaValue: 10 },
  { name: 'Quest Master', description: 'Complete 50 quests', criteriaType: 'tasks_completed', criteriaValue: 50 },
  { name: '7 Day Streak', description: 'Maintain a 7-day streak', criteriaType: 'streak_days', criteriaValue: 7 },
  { name: 'Explorer', description: 'Reach level 5', criteriaType: 'level_reached', criteriaValue: 5 },
];

async function upsertByName(model, rows) {
  for (const row of rows) {
    const existing = await model.findFirst({ where: { name: row.name }, select: { id: true } });
    if (existing) await model.update({ where: { id: existing.id }, data: row });
    else await model.create({ data: row });
  }
}

async function main() {
  await upsertByName(prisma.reward, REWARDS);
  await upsertByName(prisma.inventoryItem, ITEMS);
  await upsertByName(prisma.badge, BADGES);
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());