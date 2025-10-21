import { UserRepository } from "../repositories/user.repository";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly usersRepo: UserRepository) { }


  async execute(userId: string): Promise<void> {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuário com ID '${userId}' não encontrado`);
    }
    await this.usersRepo.delete(userId);
  }
}