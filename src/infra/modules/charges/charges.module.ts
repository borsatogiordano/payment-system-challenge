import { Module } from "@nestjs/common";
import { CreateChargeController } from "./controllers/create-charge.controller";
import { CreateChargeUseCase } from "src/core/application/use-cases/create-charge.usecase";
import { ChargeRepository } from "src/core/application/repositories/charges.repository";
import { PrismaChargeRepository } from "src/infra/database/repositories/prisma-charge.repository";
import { UserRepository } from "src/core/application/repositories/user.repository";
import { PrismaUserRepository } from "src/infra/database/repositories/prisma-user.repository";
import { IdempotencyKeyRepository } from "src/core/application/repositories/idempotencyKey.repository";
import { PrismaIdempotencyKeyRepository } from "src/infra/database/repositories/prisma-idempotency-key.repository";
import { PrismaModule } from "src/infra/database/prisma.module";
import { GetChargeByIdController } from "./controllers/get-charge-by-id.controller";
import { GetChargeByIdUseCase } from "src/core/application/use-cases/get-charge-by-id.usecase";
import { DeleteChargeByIdController } from "./controllers/delete-charge-by-id.controller";
import { DeleteChargeByIdUseCase } from "src/core/application/use-cases/delete-charge-by-id.usecase";
import { ChangeStatusOfChargeController } from "./controllers/change-status-of-charge.controller";
import { ChangeStatusOfChargeUseCase } from "src/core/application/use-cases/change-status-charge.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateChargeController,
    GetChargeByIdController,
    DeleteChargeByIdController,
    ChangeStatusOfChargeController,
  ],
  providers: [
    CreateChargeUseCase,
    GetChargeByIdUseCase,
    DeleteChargeByIdUseCase,
    ChangeStatusOfChargeUseCase,

    // Repositórios
    {
      provide: ChargeRepository,
      useClass: PrismaChargeRepository
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    {
      provide: IdempotencyKeyRepository,
      useClass: PrismaIdempotencyKeyRepository
    }
  ],
})
export class ChargesModule { }