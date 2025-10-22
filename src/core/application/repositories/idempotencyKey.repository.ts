import { Charge } from "src/core/domain/entities/charge.entity";

export type IdempotencyRecord = {
  charge: Charge;
  expiresAt: Date;
}

export abstract class IdempotencyKeyRepository {

  abstract findByHash(hash: string): Promise<IdempotencyRecord | null>;
  abstract create(hash: string, chargeId: string): Promise<Charge>;
}