import { Injectable } from '@nestjs/common';
import { User } from 'src/core/domain/entities/user.entity';
import { UserRepository, CreateUserData } from 'src/core/application/repositories/user.repository';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UserRole } from 'src/core/domain/enums/user-role-enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  findMany(page: number, perPage: number): Promise<User[]> {
    const usersFromDb = this.prisma.user.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return usersFromDb.then(users => users.map(user => new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      document: user.document,
      phone: user.phone,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })));
  }

  count(): Promise<number> {
    return this.prisma.user.count();
  }

  async create(userData: CreateUserData): Promise<User> {

    const createdUser = await this.prisma.user.create({
      data: userData,
    });

    return new User({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      password: createdUser.password,
      document: createdUser.document,
      phone: createdUser.phone,
      role: createdUser.role as UserRole,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      document: user.document,
      phone: user.phone,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByDocument(document: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { document },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      document: user.document,
      phone: user.phone,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      document: user.document,
      phone: user.phone,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async update(id: string, userData: Partial<CreateUserData>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    return new User({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      document: updatedUser.document,
      phone: updatedUser.phone,
      role: updatedUser.role as UserRole,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}