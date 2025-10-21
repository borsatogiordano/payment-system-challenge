import { Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/core/domain/entities/user.entity';
import { UserRepository, CreateUserData } from 'src/core/application/repositories/user.repository';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  findMany(page: number, perPage: number): Promise<User[]> {
    const usersFromDb = this.prisma.user.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return usersFromDb.then(users => users.map(user => new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.document,
      user.phone,
      user.role as UserRole,
      user.createdAt,
      user.updatedAt,
    )));
  }

  count(): Promise<number> {
    return this.prisma.user.count();
  }

  async create(userData: CreateUserData): Promise<User> {

    const createdUser = await this.prisma.user.create({
      data: userData,
    });

    return new User(
      createdUser.id,
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.document,
      createdUser.phone,
      createdUser.role as UserRole,
      createdUser.createdAt,
      createdUser.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.document,
      user.phone,
      user.role as UserRole,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByDocument(document: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { document },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.document,
      user.phone,
      user.role as UserRole,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.document,
      user.phone,
      user.role as UserRole,
      user.createdAt,
      user.updatedAt,
    );
  }

  async update(id: string, userData: Partial<CreateUserData>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
      updatedUser.document,
      updatedUser.phone,
      updatedUser.role as UserRole,
      updatedUser.createdAt,
      updatedUser.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}