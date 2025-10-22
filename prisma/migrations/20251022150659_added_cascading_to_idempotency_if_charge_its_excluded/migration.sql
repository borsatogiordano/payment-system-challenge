-- DropForeignKey
ALTER TABLE "public"."idempotency_keys" DROP CONSTRAINT "idempotency_keys_chargeId_fkey";

-- AddForeignKey
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "idempotency_keys_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "charges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
