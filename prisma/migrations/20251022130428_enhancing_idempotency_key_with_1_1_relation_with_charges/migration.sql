/*
  Warnings:

  - You are about to drop the column `createdAt` on the `idempotency_keys` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `idempotency_keys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idempotencyKeyId]` on the table `charges` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chargeId]` on the table `idempotency_keys` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "charges" ADD COLUMN     "idempotencyKeyId" TEXT;

-- AlterTable
ALTER TABLE "idempotency_keys" DROP COLUMN "createdAt",
DROP COLUMN "response",
ADD COLUMN     "chargeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "charges_idempotencyKeyId_key" ON "charges"("idempotencyKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_chargeId_key" ON "idempotency_keys"("chargeId");

-- AddForeignKey
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "idempotency_keys_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "charges"("id") ON DELETE SET NULL ON UPDATE CASCADE;
