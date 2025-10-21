import { IdempotencyKey } from "@prisma/client";

export abstract class IdempotencyKeyRepository {
  abstract findByHash(hash: string): Promise<IdempotencyKey | null>;
  abstract create(hash: string, response: JSON): Promise<IdempotencyKey>;
}