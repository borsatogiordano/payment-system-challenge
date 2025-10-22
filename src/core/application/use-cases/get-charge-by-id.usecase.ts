import { Injectable, NotFoundException } from "@nestjs/common";
import { ChargeRepository } from "../repositories/charges.repository";

@Injectable()
export class GetChargeByIdUseCase {
  constructor(
    private readonly chargeRepo: ChargeRepository
  ) { }
  async execute(chargeId: string) {
    const charge = await this.chargeRepo.findById(chargeId);
    if (!charge) {
      throw new NotFoundException(`Cobrança com ID '${chargeId}' não encontrada`);
    }
    return charge.toPublic();
  }
}