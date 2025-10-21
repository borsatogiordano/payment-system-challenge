import { IsOptional, IsString, IsEmail, IsEnum, MinLength, Matches, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/core/domain/enums/user-role-enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.santos@email.com',
    required: false
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @ApiProperty({
    description: 'Nova senha do usuário (mínimo 8 caracteres, deve conter: 1 minúscula, 1 maiúscula, 1 número, 1 especial)',
    example: 'NovaSenha@123',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial (@$!%*?&)' }
  )
  password?: string;

  @ApiProperty({
    description: 'Documento (CPF) do usuário - apenas números',
    example: '98765432100',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Documento deve ser uma string' })
  @Matches(/^\d{11}$/, { message: 'Documento deve conter exatamente 11 dígitos' })
  document?: string;

  @ApiProperty({
    description: 'Telefone do usuário no formato brasileiro',
    example: '11987654321',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Matches(/^\d{10,11}$/, { message: 'Telefone deve ter 10 ou 11 dígitos' })
  phone?: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema - APENAS ADMINS podem alterar',
    example: 'ADMIN',
    enum: UserRole,
    required: false
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser USER ou ADMIN' })
  role?: UserRole;
}