import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
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

  async execute(data: CreateChargeDto) {

    const idempotencyHash = this.generateIdempotencyHash(data);

    const existingTransaction = await this.idempotencyKeyRepo.findByHash(idempotencyHash);
    if (existingTransaction) {
      console.log(`⚠️ Requisição duplicada detectada! Retornando cobrança já criada.`);
      return existingTransaction.response;
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

    const response = this.sanitizeChargeData(createdCharge);

    await this.idempotencyKeyRepo.create(idempotencyHash, JSON.parse(JSON.stringify(response)));

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

  private sanitizeChargeData(charge: Charge) {
    const publicData = {
      id: charge.id,
      customerId: charge.customerId,
      amount: charge.amount,
      currency: charge.currency,
      method: charge.method,
      status: charge.status,
      createdAt: charge.createdAt,
      updatedAt: charge.updatedAt,
    };

    switch (charge.method) {
      case PaymentMethod.PIX:
        return { ...publicData, pixKey: charge.pixKey };

      case PaymentMethod.CREDIT_CARD:
        return {
          ...publicData,
          cardNumber: this.maskCardNumber(charge.cardNumber!),
          cardHolderName: charge.cardHolderName,
          installments: charge.installments,
        };

      case PaymentMethod.BANK_SLIP:
        return { ...publicData, dueDate: charge.dueDate };

      default:
        return publicData;
    }
  }

  private maskCardNumber(cardNumber: string): string {
    if (cardNumber.length < 4) return '****';
    return '**** **** **** ' + cardNumber.slice(-4);
  }

  private generateIdempotencyHash(data: CreateChargeDto): string {

    const baseData = {
      userId: data.userId.trim(),
      amount: Math.round(data.amount * 100).toString(),
      currency: (data.currency || 'BRL').toUpperCase(),
      method: data.method,
      ...(data.description && { description: data.description.trim() })
    };

    let methodSpecificData = {};

    switch (data.method) {
      case PaymentMethod.PIX:
        methodSpecificData = {
          pixKey: this.normalizePixKey(data.pixKey!)
        };
        break;

      case PaymentMethod.CREDIT_CARD:
        methodSpecificData = {
          cardNumber: this.normalizeCardNumber(data.cardNumber!),
          cardHolderName: data.cardHolderName!.trim().toUpperCase(),
          installments: data.installments!
        };
        break;

      case PaymentMethod.BANK_SLIP:
        methodSpecificData = {
          dueDate: new Date(data.dueDate!).toISOString().split('T')[0]
        };
        break;
    }


    const allData = { ...baseData, ...methodSpecificData };

    const sortedKeys = Object.keys(allData).sort();

    const keyValuePairs = sortedKeys.map(key => `${key}=${allData[key]}`);
    const hashableString = keyValuePairs.join('|');

    const hash = createHash('sha256').update(hashableString, 'utf8').digest('hex');

    return hash;
  }

  private normalizePixKey(pixKey: string): string {
    return pixKey.trim().toLowerCase();
  }
  private normalizeCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\D/g, '');
  }
}