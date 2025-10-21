import { Injectable } from "@nestjs/common";
import { ChargeRepository } from "src/core/application/repositories/charges.repository";
import { Charge } from "src/core/domain/entities/charge.entity";
import { PaymentMethod } from "src/core/domain/enums/payment-method-enum";
import { ChargeStatus } from "src/core/domain/enums/charge-status.enum";
import { PrismaService } from "../prisma.service";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaChargeRepository implements ChargeRepository {

  constructor(private readonly prisma: PrismaService) { }

  async create(charge: Charge): Promise<Charge> {
    console.log('💾 Salvando cobrança no banco de dados...');

    const createdCharge = await this.prisma.charge.create({
      data: {
        userId: charge.customerId,
        amount: new Decimal(charge.amount),
        currency: charge.currency,
        method: charge.method as any,
        status: charge.status as any,
        pixKey: charge.pixKey || null,
        cardNumber: charge.cardNumber || null,
        cardHolderName: charge.cardHolderName || null,
        installments: charge.installments || null,
        dueDate: charge.dueDate || null,
      },
    });

    return new Charge({
      id: createdCharge.id,
      userId: createdCharge.userId,
      amount: createdCharge.amount.toNumber(),
      currency: createdCharge.currency,
      method: createdCharge.method as PaymentMethod,
      status: createdCharge.status as ChargeStatus,
      pixKey: createdCharge.pixKey || undefined,
      cardNumber: createdCharge.cardNumber || undefined,
      cardHolderName: createdCharge.cardHolderName || undefined,
      installments: createdCharge.installments || undefined,
      dueDate: createdCharge.dueDate || undefined,
      createdAt: createdCharge.createdAt,
      updatedAt: createdCharge.updatedAt,
    });
  }
  findById(id: string): Promise<Charge | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findMany(page: number, perPage: number): Promise<Charge[]> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<number> {
    throw new Error("Method not implemented.");
  }

}