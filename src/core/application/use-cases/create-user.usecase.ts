import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRole } from "src/core/domain/entities/user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserRepository, CreateUserData } from "../repositories/user.repository";

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersRepo: UserRepository
  ) { }

  async execute(userData: CreateUserDto) {

    const existingUserByEmail = await this.usersRepo.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new ConflictException(`Usuário com email '${userData.email}' já existe`);
    }

    const existingUserByDocument = await this.usersRepo.findByDocument(userData.document);
    if (existingUserByDocument) {
      throw new ConflictException(`Usuário com documento '${userData.document}' já existe`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUserData: CreateUserData = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      document: userData.document,
      phone: userData.phone,
      role: userData.role || UserRole.USER,
    };

    const createdUser = await this.usersRepo.create(newUserData);
    return createdUser.toPublic();
  }
}