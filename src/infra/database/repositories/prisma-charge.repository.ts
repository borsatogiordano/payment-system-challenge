import { Injectable } from "@nestjs/common";
import { ChargeRepository } from "src/core/application/repositories/charges.repository";
import { Charge } from "src/core/domain/entities/charge.entity";
import { PaymentMethod } from "src/core/domain/enums/payment-method-enum";
import { ChargeStatus } from "src/core/domain/enums/charge-status.enum";
import { PrismaService } from "../prisma.service";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaChargeRepository implements ChargeRepository {

  //TODO: Implement mappers to convert between Prisma models and Domain entities

  constructor(private readonly prisma: PrismaService) { }

  async create(charge: Charge): Promise<Charge> {
    const createdCharge = await this.prisma.charge.create({
      data: {
        userId: charge.userId,
        amount: new Decimal(charge.amount),
        currency: charge.currency,
        method: charge.method as any,
        status: charge.status as any,
        pixKey: charge.pixKey || null,
        cardNumber: charge.cardNumber || null,
        cardHolderName: charge.cardHolderName || null,
        installments: charge.installments || null,
        dueDate: charge.dueDate || null,
        boletoBarCode: charge.boletoBarCode || undefined,
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
      boletoBarCode: createdCharge.boletoBarCode || undefined,
      dueDate: createdCharge.dueDate || undefined,
      createdAt: createdCharge.createdAt,
      updatedAt: createdCharge.updatedAt,
    });
  }

  async findById(id: string): Promise<Charge | null> {
    const charge = await this.prisma.charge.findUnique({
      where: { id },
    })
    if (!charge) return null;

    return new Charge({
      id: charge.id,
      userId: charge.userId,
      amount: charge.amount.toNumber(),
      currency: charge.currency,
      method: charge.method as PaymentMethod,
      status: charge.status as ChargeStatus,
      pixKey: charge.pixKey || undefined,
      cardNumber: charge.cardNumber || undefined,
      cardHolderName: charge.cardHolderName || undefined,
      installments: charge.installments || undefined,
      boletoBarCode: charge.boletoBarCode || undefined,
      dueDate: charge.dueDate || undefined,
      createdAt: charge.createdAt,
      updatedAt: charge.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.charge.delete({
      where: { id },
    })
  }

  async update(charge: Charge): Promise<Charge> {
    const updated = await this.prisma.charge.update({
      where: { id: charge.id },
      data: {
        status: charge.status as ChargeStatus,
        pixKey: charge.pixKey || null,
        cardNumber: charge.cardNumber || null,
        cardHolderName: charge.cardHolderName || null,
        installments: charge.installments || null,
        boletoBarCode: charge.boletoBarCode || null,
        dueDate: charge.dueDate || null,
        amount: new Decimal(charge.amount),
      },
    });

    return new Charge({
      id: updated.id,
      userId: updated.userId,
      amount: updated.amount.toNumber(),
      currency: updated.currency,
      method: updated.method as PaymentMethod,
      status: updated.status as ChargeStatus,
      pixKey: updated.pixKey || undefined,
      cardNumber: updated.cardNumber || undefined,
      cardHolderName: updated.cardHolderName || undefined,
      installments: updated.installments || undefined,
      boletoBarCode: updated.boletoBarCode || undefined,
      dueDate: updated.dueDate || undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  findMany(page: number, perPage: number): Promise<Charge[]> {
    throw new Error("Method not implemented.");
  }
  count(): Promise<number> {
    throw new Error("Method not implemented.");
  }
}