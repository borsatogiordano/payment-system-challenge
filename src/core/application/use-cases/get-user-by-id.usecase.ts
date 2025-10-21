import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    private readonly usersRepo: UserRepository
  ) { }

  async execute(userId: string) {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuário com ID '${userId}' não encontrado`);
    }
    return user.toPublic();
  }
}