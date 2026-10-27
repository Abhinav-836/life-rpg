// Integration tests against a real Postgres database.
//
// They create and delete their own users, but run them against a
// separate test database, never production:
//   DATABASE_URL=postgresql://.../life_rpg_test npx prisma migrate deploy
//   DATABASE_URL=postgresql://.../life_rpg_test RUN_DB_TESTS=1 npm test
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-test-secret-test-secret';

const test = require('node:test');
const assert = require('node:assert/strict');

const enabled = process.env.RUN_DB_TESTS === '1';

test('database integration', { skip: !enabled && 'set RUN_DB_TESTS=1 and DATABASE_URL to a test database' }, async (t) => {
  const prisma = require('../src/config/database');
  const authService = require('../src/services/auth.service');
  const taskService = require('../src/services/task.service');
  const inventoryService = require('../src/services/inventory.service');
  const settingsService = require('../src/services/settings.service');

  const createdUserIds = [];
  async function newPlayer(gold = 0) {
    const email = `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    const { user } = await authService.signup({ name: 'Tester', email, password: 'password123' });
    createdUserIds.push(user.id);
    if (gold) await prisma.character.update({ where: { userId: user.id }, data: { gold } });
    return user;
  }

  t.after(async () => {
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    await prisma.$disconnect();
  });

  await t.test('rewards are clamped to the difficulty range even if validation is bypassed', async () => {
    const user = await newPlayer();
    const task = await taskService.createTask(user.id, {
      title: 'Exploit attempt', category: 'coding', difficulty: 'easy', xp: 999999999, gold: 999999999,
    });
    assert.equal(task.xpReward, 50);
    assert.equal(task.goldReward, 15);
  });

  await t.test('double-completing a quest pays out exactly once', async () => {
    const user = await newPlayer();
    const task = await taskService.createTask(user.id, {
      title: 'Double click', category: 'fitness', difficulty: 'hard', xp: 200, gold: 60,
    });

    const results = await Promise.allSettled(
      Array.from({ length: 8 }, () => taskService.completeTask(user.id, task.id, { timeZone: 'Asia/Kolkata' })),
    );

    const ok = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');
    assert.equal(ok.length, 1);
    assert.equal(rejected.length, 7);
    assert.ok(rejected.every((r) => r.reason.status === 409));

    const character = await prisma.character.findUnique({ where: { userId: user.id } });
    assert.equal(character.gold, 60);
    // 200 XP: 100 pays for level 1 -> 2, 100 carries over. Paid once, not 8 times.
    assert.equal(character.level, 2);
    assert.equal(character.xp, 100);
  });

  await t.test('completing different quests at the same moment loses no XP', async () => {
    const user = await newPlayer();
    const tasks = await Promise.all(
      Array.from({ length: 6 }, (_, i) => taskService.createTask(user.id, {
        title: `Parallel ${i}`, category: 'study', difficulty: 'normal', xp: 100, gold: 10,
      })),
    );

    await Promise.all(tasks.map((task) => taskService.completeTask(user.id, task.id)));

    const character = await prisma.character.findUnique({ where: { userId: user.id } });
    const totalXpSpent = (() => {
      let spent = 0;
      for (let level = 1; level < character.level; level += 1) spent += Math.floor(100 * Math.pow(level, 1.5));
      return spent + character.xp;
    })();
    assert.equal(totalXpSpent, 600);
    assert.equal(character.gold, 60);

    const attribute = await prisma.attribute.findFirst({ where: { character: { userId: user.id }, name: 'study' } });
    let attributeXp = attribute.xp;
    for (let level = 1; level < attribute.level; level += 1) attributeXp += Math.floor(100 * Math.pow(level, 1.5));
    assert.equal(attributeXp, 600);
  });

  await t.test('parallel purchases can never take gold below zero', async () => {
    const user = await newPlayer(100);
    const potion = await prisma.inventoryItem.create({
      data: { name: `Test Potion ${Date.now()}`, cost: 60, rarity: 'common', type: 'consumable' },
    });

    try {
      const results = await Promise.allSettled(
        Array.from({ length: 5 }, () => inventoryService.purchaseItem(user.id, potion.id)),
      );
      assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);

      const character = await prisma.character.findUnique({ where: { userId: user.id } });
      assert.equal(character.gold, 40);
      const owned = await prisma.userInventory.findUnique({ where: { userId_itemId: { userId: user.id, itemId: potion.id } } });
      assert.equal(owned.quantity, 1);
    } finally {
      await prisma.inventoryItem.delete({ where: { id: potion.id } });
    }
  });

  await t.test('equipping an item unequips the other item of the same type', async () => {
    const user = await newPlayer(1000);
    const [swordA, swordB] = await Promise.all([
      prisma.inventoryItem.create({ data: { name: `Sword A ${Date.now()}`, cost: 1, type: 'equipment' } }),
      prisma.inventoryItem.create({ data: { name: `Sword B ${Date.now()}`, cost: 1, type: 'equipment' } }),
    ]);
    try {
      await inventoryService.purchaseItem(user.id, swordA.id);
      await inventoryService.purchaseItem(user.id, swordB.id);
      await inventoryService.setEquipped(user.id, swordA.id, true);
      await inventoryService.setEquipped(user.id, swordB.id, true);

      const owned = await inventoryService.listOwnedByUser(user.id);
      const byItem = Object.fromEntries(owned.map((o) => [o.itemId, o.equipped]));
      assert.equal(byItem[swordA.id], false);
      assert.equal(byItem[swordB.id], true);
    } finally {
      await prisma.inventoryItem.deleteMany({ where: { id: { in: [swordA.id, swordB.id] } } });
    }
  });

  await t.test('settings and timezone persist in the database', async () => {
    const user = await newPlayer();
    await settingsService.updateSettings(user.id, { soundEnabled: false, timezone: 'Asia/Kolkata', notifications: { streakWarning: false } });
    const settings = await settingsService.getSettings(user.id);
    assert.equal(settings.soundEnabled, false);
    assert.equal(settings.timezone, 'Asia/Kolkata');
    assert.equal(settings.notifications.streakWarning, false);
    assert.equal(settings.theme, 'dark-fantasy');
  });

  await t.test('each demo visitor gets a private account with starter quests', async () => {
    const a = await authService.guestLogin();
    const b = await authService.guestLogin();
    createdUserIds.push(a.user.id, b.user.id);

    assert.notEqual(a.user.id, b.user.id);
    assert.equal(a.user.isGuest, true);
    assert.equal(await prisma.task.count({ where: { userId: a.user.id } }), 4);

    await assert.rejects(
      authService.login({ email: a.user.email, password: 'anything' }),
      (err) => err.status === 401,
    );
  });

  await t.test('emails are case-insensitive', async () => {
    const email = `Mixed-${Date.now()}@Example.com`;
    const { user } = await authService.signup({ name: 'Case', email, password: 'password123' });
    createdUserIds.push(user.id);
    assert.equal(user.email, email.toLowerCase());
    const session = await authService.login({ email: email.toUpperCase(), password: 'password123' });
    assert.equal(session.user.id, user.id);
    await assert.rejects(authService.signup({ name: 'Dup', email: email.toLowerCase(), password: 'password123' }), (e) => e.status === 409);
  });
});