import { Injectable, NotFoundException } from "@nestjs/common";
import { ChargeRepository } from "../repositories/charges.repository";

@Injectable()
export class DeleteChargeByIdUseCase {
  constructor(
    private readonly chargeRepo: ChargeRepository
  ) { }

  async execute(chargeId: string) {
    if (await this.chargeRepo.findById(chargeId) === null) {
      throw new NotFoundException(`Cobrança com ID '${chargeId}' não encontrada`);
    }
    await this.chargeRepo.delete(chargeId);
  }
}