import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { calculatePaginationMetadata } from "../types/pagination.types";

@Injectable()
export class GetUsersUseCase {

  constructor(
    private readonly usersRepo: UserRepository,
  ) { }

  async execute(params: { page: string; perPage: string }) {

    const page = Math.max(1, parseInt(params.page) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(params.perPage) || 10));

    const [users, totalItems] = await Promise.all([
      this.usersRepo.findMany(page, perPage),
      this.usersRepo.count()
    ]);

    const publicUsers = users.map(user => user.toPublic());

    const metadata = calculatePaginationMetadata(totalItems, page, perPage);

    return {
      data: publicUsers,
      metadata
    };
  }
}