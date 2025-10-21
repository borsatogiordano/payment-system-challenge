import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 32
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(32, { message: 'Nome deve ter no máximo 32 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@email.com'
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    minLength: 8
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
  })
  password: string;

  @ApiProperty({
    description: 'Documento do usuário (CPF ou CNPJ)',
    example: '12345678901'
  })
  @IsNotEmpty({ message: 'Documento é obrigatório' })
  @IsString({ message: 'Documento deve ser uma string' })
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido'
  })
  document: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '11999999999'
  })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsString({ message: 'Telefone deve ser uma string' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve ter 10 ou 11 dígitos'
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Tipo de usuário',
    enum: UserRole,
    default: UserRole.USER
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser ADMIN ou USER' })
  role?: UserRole;
}