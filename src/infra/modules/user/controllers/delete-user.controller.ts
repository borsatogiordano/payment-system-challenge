import { Controller, Delete, Param, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DeleteUserUseCase } from "src/core/application/use-cases/delete-user.usecase";
import { UserRole } from "src/core/domain/entities/user.entity";
import { Roles } from "src/infra/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/infra/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/infra/auth/guards/roles.guard";

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeleteUserController {

  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) { }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar usuário (apenas ADMIN)',
    description: 'Remove um usuário do sistema. Apenas administradores podem executar esta operação.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário a ser deletado',
    example: 'clq3r4s5t6u7v8w9x0y1z2'
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de acesso inválido ou expirado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token de acesso inválido ou expirado. Faça login novamente.',
        error: 'Unauthorized',
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão (não é ADMIN)',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async deleteUser(
    @Param('id') id: string,
  ) {
    return this.deleteUserUseCase.execute(id);
  }
}