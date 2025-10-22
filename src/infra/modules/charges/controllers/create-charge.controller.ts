import { Body, Controller, Post, UseGuards, Headers, BadRequestException } from "@nestjs/common";
import { HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { ApiHeader } from '@nestjs/swagger';
import { CreateChargeDto } from "src/core/application/dtos/create-charge.dto";
import { CreateChargeUseCase } from "src/core/application/use-cases/create-charge.usecase";
import { PaymentMethod } from "src/core/domain/enums/payment-method-enum";
import { UserRole } from "src/core/domain/enums/user-role-enum";
import { Roles } from "src/infra/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/infra/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/infra/auth/guards/roles.guard";


@Controller("charges")
@ApiTags("Charges")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CreateChargeController {
  constructor(
    private readonly createChargeUseCase: CreateChargeUseCase,
  ) { }

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova cobrança',
    description: 'Cria uma nova cobrança para um cliente com suporte a PIX, Cartão de Crédito e Boleto. Requer autenticação (role ADMIN) e header Idempotency-Key (UUID) para evitar cobranças duplicadas. A operação é idempotente: requisições duplicadas com mesmos dados retornam a mesma cobrança, mas dados diferentes com mesma chave geram erro.'
  })
  @ApiBody({
    type: CreateChargeDto,
    description: 'Dados para criação da cobrança',
    examples: {
      pix: {
        summary: 'Cobrança via PIX',
        description: 'Exemplo de cobrança usando PIX',
        value: {
          userId: 'clq3r4s5t6u7v8w9x0y1z2',
          amount: 150.99,
          currency: 'BRL',
          method: PaymentMethod.PIX,
          pixKey: 'cliente@email.com',
          description: 'Assinatura mensal'
        }
      },
      credit_card: {
        summary: 'Cobrança com Cartão de Crédito',
        description: 'Exemplo de cobrança parcelada no cartão',
        value: {
          userId: 'clq3r4s5t6u7v8w9x0y1z2',
          amount: 299.90,
          currency: 'BRL',
          method: PaymentMethod.CREDIT_CARD,
          cardNumber: '4111111111111111',
          cardHolderName: 'João Silva',
          installments: 3,
          description: 'Pagamento parcelado'
        }
      },
      bank_slip: {
        summary: 'Cobrança via Boleto',
        description: 'Exemplo de cobrança com boleto bancário',
        value: {
          userId: 'clq3r4s5t6u7v8w9x0y1z2',
          amount: 450.00,
          currency: 'BRL',
          method: PaymentMethod.BANK_SLIP,
          dueDate: '2025-11-15T23:59:59.000Z',
          description: 'Boleto mensal'
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Cobrança criada com sucesso',
    schema: {
      example: {
        id: 'chg_01F2G3H4I5J6K7L8M9N0',
        customerId: 'clq3r4s5t6u7v8w9x0y1z2',
        amount: 150.99,
        currency: 'BRL',
        method: 'PIX',
        status: 'PENDING',
        pixKey: 'cliente@email.com',
        createdAt: '2025-10-21T14:30:00.000Z',
        updatedAt: '2025-10-21T14:30:00.000Z'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou conflito de idempotência',
    schema: {
      example: {
        statusCode: 400,
        message: 'Conflito de idempotência: campos diferentes detectados - amount, method',
        error: 'Bad Request'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação inválido ou ausente',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }
  })
  @ApiForbiddenResponse({
    description: 'Usuário não tem permissão (role insuficiente)',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: "Usuário com ID 'clq3r4s5t6u7v8w9x0y1z2' não encontrado",
        error: 'Not Found'
      }
    }
  })
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Chave de idempotência (UUID v4). Garante que requisições duplicadas não criem cobranças duplicadas. Validade: 2 horas.',
    required: true,
    schema: { 
      type: 'string',
      format: 'uuid',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }
  })
  async execute(@Body() dto: CreateChargeDto, @Headers('Idempotency-Key') idempotencyKey?: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!idempotencyKey || !uuidRegex.test(idempotencyKey.trim())) {
      throw new BadRequestException('Header "Idempotency-Key" é obrigatório e deve ser um UUID válido');
    }

    return this.createChargeUseCase.execute(dto, idempotencyKey.trim());
  }
}