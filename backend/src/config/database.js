const { PrismaClient } = require('@prisma/client');

// Single shared Prisma instance - reused across the whole app
const prisma = new PrismaClient();

module.exports = prisma;
