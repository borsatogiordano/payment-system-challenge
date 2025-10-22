import { Injectable } from "@nestjs/common";
import { IdempotencyKeyRepository, IdempotencyRecord } from "src/core/application/repositories/idempotencyKey.repository";
import { PrismaService } from "../prisma.service";
import { Charge } from "src/core/domain/entities/charge.entity";
import { PaymentMethod } from "src/core/domain/enums/payment-method-enum";
import { ChargeStatus } from "src/core/domain/enums/charge-status.enum";

@Injectable()
export class PrismaIdempotencyKeyRepository implements IdempotencyKeyRepository {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async findByHash(hash: string): Promise<IdempotencyRecord | null> {
    const idempotency = await this.prisma.idempotencyKey.findUnique({
      where: { hash },
      include: { charge: true },
    });

    if (!idempotency || !idempotency.charge) return null;

    const c = idempotency.charge;
    const chargeEntity = new Charge({
      id: c.id,
      userId: c.userId,
      amount: c.amount.toNumber(),
      currency: c.currency,
      method: c.method as PaymentMethod,
      status: c.status as ChargeStatus,
      pixKey: c.pixKey || undefined,
      cardNumber: c.cardNumber || undefined,
      cardHolderName: c.cardHolderName || undefined,
      installments: c.installments || undefined,
      dueDate: c.dueDate || undefined,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    });

    return { charge: chargeEntity, expiresAt: idempotency.expiresAt };
  }

  async create(hash: string, chargeId: string): Promise<Charge> {

    if (!chargeId) throw new Error('Idempotency.create: response must include charge id');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const existingCharge = await this.prisma.idempotencyKey.create({
      data: {
        hash,
        chargeId,
        expiresAt,
      },
      select: { charge: true }
    });

    if (!existingCharge) throw new Error('Idempotency.create: linked charge not found');

    return new Charge({
      id: existingCharge.charge?.id!,
      userId: existingCharge.charge?.userId!,
      amount: existingCharge.charge?.amount.toNumber()!,
      currency: existingCharge.charge?.currency!,
      method: existingCharge.charge?.method as PaymentMethod,
      status: existingCharge.charge?.status as ChargeStatus,
      pixKey: existingCharge.charge?.pixKey || undefined,
      cardNumber: existingCharge.charge?.cardNumber || undefined,
      cardHolderName: existingCharge.charge?.cardHolderName || undefined,
      installments: existingCharge.charge?.installments || undefined,
      dueDate: existingCharge.charge?.dueDate || undefined,
      createdAt: existingCharge.charge?.createdAt!,
      updatedAt: existingCharge.charge?.updatedAt!,
    });
  }
}