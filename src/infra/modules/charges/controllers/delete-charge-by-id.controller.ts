import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiNoContentResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from "@nestjs/swagger";
import { DeleteChargeByIdUseCase } from "src/core/application/use-cases/delete-charge-by-id.usecase";
import { UserRole } from "src/core/domain/enums/user-role-enum";
import { Roles } from "src/infra/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/infra/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/infra/auth/guards/roles.guard";

@Controller("charges")
@ApiTags("Charges")
export class DeleteChargeByIdController {
  constructor(private readonly deleteChargeByIdUseCase: DeleteChargeByIdUseCase) { }


  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Excluir cobrança', description: 'Remove uma cobrança existente. Requer autenticação (role ADMIN).' })
  @ApiParam({ name: 'id', description: 'ID da cobrança a ser excluída', required: true, example: 'chg_01F2G3H4I5J6K7L8M9N0' })
  @ApiNoContentResponse({ description: 'Cobrança excluída com sucesso', schema: { example: {} } })
  @ApiNotFoundResponse({ description: 'Cobrança não encontrada', schema: { example: { statusCode: 404, message: "Cobrança com ID 'chg_01F2G3H4I5J6K7L8M9N0' não encontrada", error: 'Not Found' } } })
  @ApiUnauthorizedResponse({ description: 'Token de autenticação inválido ou ausente', schema: { example: { statusCode: 401, message: 'Unauthorized' } } })
  @ApiForbiddenResponse({ description: 'Usuário não tem permissão (role insuficiente)', schema: { example: { statusCode: 403, message: 'Forbidden' } } })
  async execute(@Param('id') chargeId: string): Promise<void> {
    await this.deleteChargeByIdUseCase.execute(chargeId);
  }
}