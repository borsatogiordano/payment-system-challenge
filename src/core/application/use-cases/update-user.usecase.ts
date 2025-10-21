import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserRole } from 'src/core/domain/enums/user-role-enum';

export interface UpdateUserContext {
  requesterId: string;
  requesterRole: UserRole;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly usersRepo: UserRepository
  ) { }

  async execute(
    userId: string,
    updateData: UpdateUserDto,
    context: UpdateUserContext
  ) {

    const userToUpdate = await this.usersRepo.findById(userId);
    if (!userToUpdate) {
      throw new NotFoundException(`Usuário com ID '${userId}' não encontrado`);
    }

    await this.validateUpdatePermissions(userId, updateData, context);

    await this.validateUniqueFields(userId, updateData);

    const dataToUpdate = await this.prepareUpdateData(updateData);

    const updatedUser = await this.usersRepo.update(userId, dataToUpdate);

    return updatedUser.toPublic();
  }

  private async validateUpdatePermissions(
    targetUserId: string,
    updateData: UpdateUserDto,
    context: UpdateUserContext
  ): Promise<void> {
    const isOwner = context.requesterId === targetUserId;
    const isAdmin = context.requesterRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Você só pode atualizar seu próprio perfil');
    }

    if (updateData.role && !isAdmin) {
      throw new ForbiddenException('Apenas administradores podem alterar o papel do usuário');
    }

    if (updateData.role === UserRole.ADMIN && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para se tornar administrador');
    }
  }

  private async validateUniqueFields(userId: string, updateData: UpdateUserDto): Promise<void> {
    if (updateData.email) {
      const existingUserByEmail = await this.usersRepo.findByEmail(updateData.email);
      if (existingUserByEmail && existingUserByEmail.id !== userId) {
        throw new ConflictException(`Email '${updateData.email}' já está em uso por outro usuário`);
      }
    }

    if (updateData.document) {
      const existingUserByDocument = await this.usersRepo.findByDocument(updateData.document);
      if (existingUserByDocument && existingUserByDocument.id !== userId) {
        throw new ConflictException(`Documento '${updateData.document}' já está em uso por outro usuário`);
      }
    }
  }

  private async prepareUpdateData(updateData: UpdateUserDto) {
    const dataToUpdate: any = { ...updateData };

    if (updateData.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    return dataToUpdate;
  }
}