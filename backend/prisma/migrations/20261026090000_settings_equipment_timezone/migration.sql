-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "UserInventory" ADD COLUMN     "equipped" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Task_userId_isCompleted_idx" ON "Task"("userId", "isCompleted");

-- The old shared demo account becomes a guest account, so it is cleaned
-- up with the others instead of living forever.
UPDATE "User" SET "isGuest" = true WHERE "email" = 'guest@liferpg.app';