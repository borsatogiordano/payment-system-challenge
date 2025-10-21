import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min, Max, ValidateIf, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentMethod } from 'src/core/domain/enums/payment-method-enum';

export class CreateChargeDto {
  @ApiProperty({
    description: 'ID do cliente que receberá a cobrança',
    example: 'clq3r4s5t6u7v8w9x0y1z2'
  })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsString({ message: 'ID do usuário deve ser uma string' })
  userId: string;

  @ApiProperty({
    description: 'Valor da cobrança em reais',
    example: 150.99,
    minimum: 0.01
  })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser um número com no máximo 2 casas decimais' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional({
    description: 'Moeda da cobrança',
    example: 'BRL',
    default: 'BRL'
  })
  @IsOptional()
  @IsString({ message: 'Moeda deve ser uma string' })
  currency?: string;

  @ApiProperty({
    description: 'Método de pagamento',
    enum: PaymentMethod,
    example: PaymentMethod.PIX
  })
  @IsNotEmpty({ message: 'Método de pagamento é obrigatório' })
  @IsEnum(PaymentMethod, { message: 'Método de pagamento deve ser PIX, CREDIT_CARD ou BANK_SLIP' })
  method: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Descrição da cobrança',
    example: 'Pagamento de assinatura mensal'
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  // 🔑 Dados específicos para PIX
  @ApiPropertyOptional({
    description: 'Chave PIX (obrigatório para pagamento PIX)',
    example: 'user@email.com'
  })
  @ValidateIf(o => o.method === PaymentMethod.PIX)
  @IsNotEmpty({ message: 'Chave PIX é obrigatória para pagamento via PIX' })
  @IsString({ message: 'Chave PIX deve ser uma string' })
  pixKey?: string;

  @ApiPropertyOptional({
    description: 'Número do cartão (obrigatório para cartão de crédito)',
    example: '1234567890123456'
  })
  @ValidateIf(o => o.method === PaymentMethod.CREDIT_CARD)
  @IsNotEmpty({ message: 'Número do cartão é obrigatório para pagamento com cartão' })
  @IsString({ message: 'Número do cartão deve ser uma string' })
  cardNumber?: string;

  @ApiPropertyOptional({
    description: 'Nome do portador do cartão (obrigatório para cartão de crédito)',
    example: 'João Silva'
  })
  @ValidateIf(o => o.method === PaymentMethod.CREDIT_CARD)
  @IsNotEmpty({ message: 'Nome do portador é obrigatório para pagamento com cartão' })
  @IsString({ message: 'Nome do portador deve ser uma string' })
  cardHolderName?: string;

  @ApiPropertyOptional({
    description: 'Número de parcelas (1-12, obrigatório para cartão de crédito)',
    example: 3,
    minimum: 1,
    maximum: 12
  })
  @ValidateIf(o => o.method === PaymentMethod.CREDIT_CARD)
  @IsNotEmpty({ message: 'Número de parcelas é obrigatório para pagamento com cartão' })
  @IsNumber({}, { message: 'Parcelas deve ser um número' })
  @Min(1, { message: 'Número de parcelas deve ser no mínimo 1' })
  @Max(12, { message: 'Número de parcelas deve ser no máximo 12' })
  @Type(() => Number)
  installments?: number;

  @ApiPropertyOptional({
    description: 'Data de vencimento do boleto (obrigatório para boleto) - formato ISO 8601',
    example: '2025-11-15T23:59:59.000Z'
  })
  @ValidateIf(o => o.method === PaymentMethod.BANK_SLIP)
  @IsNotEmpty({ message: 'Data de vencimento é obrigatória para boleto bancário' })
  @IsDateString({}, { message: 'Data de vencimento deve estar no formato ISO 8601' })
  dueDate?: string;
}


export class CreatePixChargeDto {
  @ApiProperty({ description: 'ID do cliente', example: 'clq3r4s5t6u7v8w9x0y1z2' })
  customerId: string;

  @ApiProperty({ description: 'Valor da cobrança', example: 150.99 })
  amount: number;

  @ApiProperty({ description: 'Chave PIX', example: 'user@email.com' })
  pixKey: string;

  @ApiPropertyOptional({ description: 'Descrição', example: 'Pagamento PIX' })
  description?: string;
}

export class CreateCreditCardChargeDto {
  @ApiProperty({ description: 'ID do cliente', example: 'clq3r4s5t6u7v8w9x0y1z2' })
  customerId: string;

  @ApiProperty({ description: 'Valor da cobrança', example: 299.90 })
  amount: number;

  @ApiProperty({ description: 'Número do cartão', example: '1234567890123456' })
  cardNumber: string;

  @ApiProperty({ description: 'Nome do portador', example: 'João Silva' })
  cardHolderName: string;

  @ApiProperty({ description: 'Número de parcelas (1-12)', example: 3 })
  installments: number;

  @ApiPropertyOptional({ description: 'Descrição', example: 'Pagamento parcelado' })
  description?: string;
}

export class CreateBankSlipChargeDto {
  @ApiProperty({ description: 'ID do cliente', example: 'clq3r4s5t6u7v8w9x0y1z2' })
  customerId: string;

  @ApiProperty({ description: 'Valor da cobrança', example: 450.00 })
  amount: number;

  @ApiProperty({ description: 'Data de vencimento', example: '2025-11-15T23:59:59.000Z' })
  dueDate: string;

  @ApiPropertyOptional({ description: 'Descrição', example: 'Boleto bancário' })
  description?: string;
}