import { Injectable, NotFoundException } from "@nestjs/common";
import { ChargeRepository } from "../repositories/charges.repository";
import { ChargeStatus } from "src/core/domain/enums/charge-status.enum";

@Injectable()
export class ChangeStatusOfChargeUseCase {

  constructor(
    private readonly chargeRepo: ChargeRepository
  ) { }

  async execute(chargeId: string, status: ChargeStatus) {
    const charge = await this.chargeRepo.findById(chargeId);
    if (!charge) {
      throw new NotFoundException(`Cobrança com ID '${chargeId}' não encontrada`);
    }

    switch (status) {
      case ChargeStatus.PAID:
        charge.markAsPaid();
        break;
      case ChargeStatus.FAILED:
        charge.markAsFailed();
        break;
      case ChargeStatus.EXPIRED:
        charge.markAsExpired();
        break;
      case ChargeStatus.CANCELLED:
        charge.markAsCancelled();
        break;
      default:
        break;
    }

    const updatedCharge = await this.chargeRepo.update(charge);
    return updatedCharge.toPublic()
  }
}