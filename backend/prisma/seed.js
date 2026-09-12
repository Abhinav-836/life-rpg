// Seeds rewards, shop items, and badges so the frontend has real
// content to display on first run instead of empty pages.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.reward.createMany({
    data: [
      { name: 'Coffee Break Pass', description: 'Take a 30 min guilt-free break', cost: 100, type: 'perk' },
      { name: 'Focus Boost', description: 'Unlock focus music theme', cost: 200, type: 'theme' },
      { name: 'Custom Title', description: 'Choose a unique title', cost: 300, type: 'title' },
      { name: 'Avatar Outfit', description: 'Unlock a new character outfit', cost: 500, type: 'perk' },
    ],
    skipDuplicates: true,
  });

  await prisma.inventoryItem.createMany({
    data: [
      { name: 'Training Sword', description: 'A starter weapon', rarity: 'common', cost: 0, type: 'equipment' },
      { name: 'Health Potion', description: 'Restores focus', rarity: 'uncommon', cost: 50, type: 'consumable' },
      { name: 'Wisdom Crystal', description: 'A rare collectible', rarity: 'epic', cost: 800, type: 'collectible' },
      { name: 'Discipline Medal', description: 'Proof of consistency', rarity: 'rare', cost: 400, type: 'collectible' },
    ],
    skipDuplicates: true,
  });

  await prisma.badge.createMany({
    data: [
      { name: 'First Step', description: 'Complete your first quest', criteriaType: 'tasks_completed', criteriaValue: 1 },
      { name: '7 Day Streak', description: 'Maintain a 7-day streak', criteriaType: 'streak_days', criteriaValue: 7 },
      { name: 'Knowledge Seeker', description: 'Complete 10 quests', criteriaType: 'tasks_completed', criteriaValue: 10 },
      { name: 'Quest Master', description: 'Complete 50 quests', criteriaType: 'tasks_completed', criteriaValue: 50 },
      { name: 'Explorer', description: 'Reach level 5', criteriaType: 'level_reached', criteriaValue: 5 },
    ],
    skipDuplicates: true,
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
