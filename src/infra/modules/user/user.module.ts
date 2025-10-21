import { Module } from "@nestjs/common";
import { CreateUserController } from "./controllers/create-user.controller";
import { CreateUserUseCase } from "src/core/application/use-cases/create-user.usecase";
import { PrismaUserRepository } from "src/infra/database/repositories/prisma-user.repository";
import { UserRepository } from "src/core/application/repositories/user.repository";
import { PrismaModule } from "src/infra/database/prisma.module";
import { DeleteUserUseCase } from "src/core/application/use-cases/delete-user.usecase";
import { DeleteUserController } from "./controllers/delete-user.controller";
import { GetUserByIdController } from "./controllers/get-user-by-id.controller";
import { GetUserByIdUseCase } from "src/core/application/use-cases/get-user-by-id.usecase";
import { GetUsersController } from "./controllers/get-users.controller";
import { GetUsersUseCase } from "src/core/application/use-cases/get-users.usecase";
import { UpdateUserController } from "./controllers/update-user.controller";
import { UpdateUserUseCase } from "src/core/application/use-cases/update-user.usecase";

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    GetUsersController,
    UpdateUserController,
  ],
  providers: [
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserByIdUseCase,
    GetUsersUseCase,
    UpdateUserUseCase,
    //Repositorio de Usuários
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    }
  ],
})
export class UserModule { }