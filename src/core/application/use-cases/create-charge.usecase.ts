import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Charge } from "src/core/domain/entities/charge.entity";
import { PaymentMethod } from "src/core/domain/enums/payment-method-enum";
import { ChargeStatus } from "src/core/domain/enums/charge-status.enum";
import { ChargeRepository } from "../repositories/charges.repository";
import { UserRepository } from "../repositories/user.repository";
import { CreateChargeDto } from "../dtos/create-charge.dto";
import { IdempotencyKeyRepository } from "../repositories/idempotencyKey.repository";
import { createHash } from "crypto";

@Injectable()
export class CreateChargeUseCase {
  constructor(
    private readonly chargeRepo: ChargeRepository,
    private readonly userRepo: UserRepository,
    private readonly idempotencyKeyRepo: IdempotencyKeyRepository,
  ) { }

  async execute(data: CreateChargeDto, idempotencyKey: string) {

    const idempotencyHash = idempotencyKey

    const existingRecord = await this.idempotencyKeyRepo.findByHash(idempotencyHash);
    if (existingRecord) {
      const now = new Date();
      const expiresAt = new Date(existingRecord.expiresAt);

      if (expiresAt > now) {
        const conflictFields: string[] = [];

        if (existingRecord.charge.amount !== data.amount) conflictFields.push('amount');
        if ((existingRecord.charge.currency || 'BRL') !== (data.currency || 'BRL')) conflictFields.push('currency');
        if (existingRecord.charge.method !== data.method) conflictFields.push('method');

        switch (data.method) {
          case PaymentMethod.PIX:
            if (Charge.normalizePixKey(existingRecord.charge.pixKey || '') !== Charge.normalizePixKey(data.pixKey || '')) {
              conflictFields.push('pixKey');
            }
            break;

          case PaymentMethod.CREDIT_CARD:
            if (Charge.normalizeCardNumber(existingRecord.charge.cardNumber || '') !== Charge.normalizeCardNumber(data.cardNumber || '')) {
              conflictFields.push('cardNumber');
            }
            if ((existingRecord.charge.cardHolderName || '').trim().toUpperCase() !== (data.cardHolderName || '').trim().toUpperCase()) {
              conflictFields.push('cardHolderName');
            }
            if ((existingRecord.charge.installments || 1) !== (data.installments || 1)) {
              conflictFields.push('installments');
            }
            break;

          case PaymentMethod.BANK_SLIP:
            const existingDue = existingRecord.charge.dueDate ? new Date(existingRecord.charge.dueDate).toISOString().split('T')[0] : '';
            const incomingDue = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '';
            if (existingDue !== incomingDue) {
              conflictFields.push('dueDate');
            }
            break;
        }

        if (conflictFields.length > 0) {
          throw new BadRequestException(`Conflito de idempotência: campos diferentes detectados - ${conflictFields.join(', ')}, por favor, utilize uma chave de idempotência diferente para criar uma nova cobrança.`);
        }

        const existingCharge = existingRecord.charge.toPublic();
        return existingCharge;
      }
      throw new BadRequestException(
        'A chave de idempotência fornecida expirou. Por favor, utilize uma chave de idempotência diferente para criar uma nova cobrança.'
      );
    }

    const user = await this.userRepo.findById(data.userId);
    if (!user) {
      throw new NotFoundException(`Usuário com ID '${data.userId}' não encontrado`);
    }

    const validationErrors = this.validatePaymentMethodData(data);
    if (validationErrors.length > 0) {
      throw new BadRequestException(`Dados inválidos: ${validationErrors.join(', ')}`);
    }

    const charge = this.createChargeByMethod(data);
    const createdCharge = await this.chargeRepo.create(charge);

    const response = createdCharge.toPublic();

    await this.idempotencyKeyRepo.create(idempotencyHash, createdCharge.id);

    return response;
  }

  private createChargeByMethod(data: CreateChargeDto): Charge {
    const baseChargeData = {
      id: '',
      userId: data.userId,
      amount: data.amount,
      currency: data.currency || 'BRL',
      method: data.method,
      status: ChargeStatus.PENDING,
    };


    switch (data.method) {
      case PaymentMethod.PIX:
        return new Charge({
          ...baseChargeData,
          pixKey: data.pixKey!,
        });

      case PaymentMethod.CREDIT_CARD:
        return new Charge({
          ...baseChargeData,
          cardNumber: data.cardNumber!,
          cardHolderName: data.cardHolderName!,
          installments: data.installments!,
        });

      case PaymentMethod.BANK_SLIP:
        return new Charge({
          ...baseChargeData,
          dueDate: new Date(data.dueDate!),
        });

      default:
        throw new BadRequestException('Método de pagamento não suportado');
    }
  }

  private validatePaymentMethodData(data: CreateChargeDto): string[] {
    const errors: string[] = [];

    switch (data.method) {
      case PaymentMethod.PIX:
        if (!data.pixKey) {
          errors.push('Chave PIX é obrigatória');
        }
        break;

      case PaymentMethod.CREDIT_CARD:
        if (!data.cardNumber) errors.push('Número do cartão é obrigatório');
        if (!data.cardHolderName) errors.push('Nome do portador é obrigatório');
        if (!data.installments || data.installments < 1 || data.installments > 12) {
          errors.push('Parcelas devem ser entre 1 e 12');
        }
        break;

      case PaymentMethod.BANK_SLIP:
        if (!data.dueDate) {
          errors.push('Data de vencimento é obrigatória para boleto');
        } else if (new Date(data.dueDate) <= new Date()) {
          errors.push('Data de vencimento deve ser futura');
        }
        break;
    }

    return errors;
  }

}