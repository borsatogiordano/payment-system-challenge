import { Charge } from "src/core/domain/entities/charge.entity";

export abstract class ChargeRepository {
  abstract create(charge: Charge): Promise<Charge>;
  abstract findById(id: string): Promise<Charge | null>;
  abstract delete(id: string): Promise<void>;
  abstract findMany(page: number, perPage: number): Promise<Charge[]>;
  abstract count(): Promise<number>;
}