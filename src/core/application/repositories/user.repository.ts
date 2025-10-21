import { User } from "src/core/domain/entities/user.entity";

export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'toPublic'>;

export abstract class UserRepository {
  abstract create(userData: CreateUserData): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByDocument(document: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(id: string, userData: Partial<CreateUserData>): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract findMany(page: number, perPage: number): Promise<User[]>;
  abstract count(): Promise<number>;
}