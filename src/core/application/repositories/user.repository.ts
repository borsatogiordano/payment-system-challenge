import { User } from "src/core/domain/entities/user.entity";
import { UserRole } from "src/core/domain/enums/user-role-enum";

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
};

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