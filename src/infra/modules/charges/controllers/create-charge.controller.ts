import { Body, Controller, Post, UseGuards } from "@nestjs/common";
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
    description: `Cria uma nova cobrança para um cliente.
    - Requer autenticação (Bearer token).
    - Apenas usuários com role ADMIN podem criar cobranças para qualquer cliente.
    - A operação é idempotente: requisições duplicadas (mesmos dados) retornam a mesma cobrança já criada.
    `,
  })
  @ApiBody({
    type: CreateChargeDto,
    description: 'Dados necessários para criação da cobrança',
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
          description: 'Assinatura mensal - PIX'
        }
      },
      credit_card: {
        summary: 'Cobrança com cartão de crédito',
        description: 'Exemplo de cobrança parcelada no cartão',
        value: {
          userId: 'clq3r4s5t6u7v8w9x0y1z2',
          amount: 299.9,
          currency: 'BRL',
          method: PaymentMethod.CREDIT_CARD,
          cardNumber: '4111111111111111',
          cardHolderName: 'João Silva',
          installments: 3,
          description: 'Pagamento parcelado'
        }
      },
      bank_slip: {
        summary: 'Cobrança via boleto (bank slip)',
        description: 'Exemplo de cobrança via boleto bancário',
        value: {
          userId: 'clq3r4s5t6u7v8w9x0y1z2',
          amount: 450.0,
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
    description: 'Dados inválidos fornecidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Valor é obrigatório',
          'Chave PIX é obrigatória para pagamento via PIX',
          'Parcelas devem ser entre 1 e 12'
        ],
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
    description: 'Usuário não tem permissão para criar cobranças (role insuficiente)',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Usuário destino da cobrança não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: "Usuário com ID 'clq3r4s5t6u7v8w9x0y1z2' não encontrado",
        error: 'Not Found'
      }
    }
  })
  async execute(@Body() dto: CreateChargeDto) {
    return this.createChargeUseCase.execute(dto);
  }
}