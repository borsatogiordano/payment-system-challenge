import { Body, Controller, Param, Patch } from "@nestjs/common";
import { ChangeStatusOfChargeUseCase } from "src/core/application/use-cases/change-status-charge.usecase";
import { Charge } from "src/core/domain/entities/charge.entity";
import { ChangeChargeStatusDto } from "src/core/application/dtos/change-charge-status.dto";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@Controller('charges/status')
@ApiTags('Charges')
export class ChangeStatusOfChargeController {

  constructor(
    private readonly changeStatusOfChargeUseCase: ChangeStatusOfChargeUseCase
  ) { }

  @Patch(":id")
  @ApiOperation({ summary: 'Alterar status de uma cobrança', description: 'Altera o status de uma cobrança (PENDING / PAID / FAILED / EXPIRED / CANCELLED). Requer autenticação (role ADMIN).' })
  @ApiParam({ name: 'id', description: 'ID da cobrança', required: true, example: 'chg_01F2G3H4I5J6K7L8M9N0' })
  @ApiBody({ type: ChangeChargeStatusDto, description: 'Novo status da cobrança', examples: {
    paid: {
      summary: 'Marcar como paga',
      value: { status: 'PAID' }
    },
    failed: {
      summary: 'Marcar como falha',
      value: { status: 'FAILED' }
    },
    expired: {
      summary: 'Marcar como expirada',
      value: { status: 'EXPIRED' }
    },
    cancelled: {
      summary: 'Marcar como cancelada',
      value: { status: 'CANCELLED' }
    }
  } })
  @ApiOkResponse({ description: 'Cobrança atualizada', schema: { example: {
    id: 'chg_01F2G3H4I5J6K7L8M9N0',
    customerId: 'clq3r4s5t6u7v8w9x0y1z2',
    amount: 150.99,
    currency: 'BRL',
    method: 'PIX',
    status: 'PAID',
    pixKey: 'cliente@email.com',
    createdAt: '2025-10-21T14:30:00.000Z',
    updatedAt: '2025-10-21T15:00:00.000Z'
  } } })
  @ApiBadRequestResponse({ description: 'Requisição inválida (validação do corpo ou regras de negócio)', schema: { example: { statusCode: 400, message: ['status deve ser um dos valores: PENDING, PAID, FAILED, EXPIRED, CANCELLED'], error: 'Bad Request' } } })
  @ApiNotFoundResponse({ description: 'Cobrança não encontrada', schema: { example: { statusCode: 404, message: "Cobrança com ID 'chg_01F2G3H4I5J6K7L8M9N0' não encontrada", error: 'Not Found' } } })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente', schema: { example: { statusCode: 401, message: 'Unauthorized' } } })
  @ApiForbiddenResponse({ description: 'Usuário não tem permissão (role insuficiente)', schema: { example: { statusCode: 403, message: 'Forbidden' } } })
  async execute(@Param("id") chargeId: string, @Body() dto: ChangeChargeStatusDto) {
    return await this.changeStatusOfChargeUseCase.execute(chargeId, dto.status);
  }
}