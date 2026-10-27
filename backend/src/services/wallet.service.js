// Spends gold with a single conditional UPDATE: the row only changes if
// the balance still covers the cost at the moment of the write.
//
// Reading the balance first and then subtracting is not safe, even inside
// a transaction: with Postgres' default isolation, two purchases sent at
// the same moment both read the old balance, both pass the check, and both
// subtract - leaving the player with negative gold. Here the second one
// matches zero rows and is rejected.
async function spendGold(tx, userId, amount, message = 'Not enough gold') {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error(`Invalid gold amount: ${amount}`);
  }

  const result = await tx.character.updateMany({
    where: { userId, gold: { gte: amount } },
    data: { gold: { decrement: amount } },
  });

  if (result.count === 0) {
    const err = new Error(message);
    err.status = 400;
    throw err;
  }

  return tx.character.findUnique({ where: { userId } });
}

module.exports = { spendGold };