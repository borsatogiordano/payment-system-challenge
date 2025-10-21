import { Injectable } from "@nestjs/common";
import { IdempotencyKeyRepository } from "src/core/application/repositories/idempotencyKey.repository";
import { PrismaService } from "../prisma.service";
import { IdempotencyKey } from "@prisma/client";

@Injectable()
export class PrismaIdempotencyKeyRepository implements IdempotencyKeyRepository {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  findByHash(hash: string): Promise<IdempotencyKey | null> {
    return this.prisma.idempotencyKey.findUnique({
      where: { hash },
    });
  }
  create(hash: string, response: any): Promise<IdempotencyKey> {
    return this.prisma.idempotencyKey.create({
      data: {
        hash,
        response,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }
}