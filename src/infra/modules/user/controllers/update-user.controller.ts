import { Controller, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/core/application/dtos/update-user.dto';
import { UpdateUserUseCase } from 'src/core/application/use-cases/update-user.usecase';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UpdateUserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase
  ) { }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar usuário',
    description: `
    Permite atualizar dados do usuário com as seguintes regras:
    - Usuários podem atualizar apenas seu próprio perfil
    - Administradores podem atualizar qualquer perfil
    - Apenas administradores podem alterar o campo 'role'
    - Email e documento devem ser únicos no sistema
    `
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser atualizado',
    example: 'clq3r4s5t6u7v8w9x0y1z2'
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados para atualização (todos os campos são opcionais)',
    examples: {
      userUpdate: {
        summary: 'Atualização por usuário comum',
        description: 'Usuário comum atualizando próprio perfil',
        value: {
          name: 'João Silva Santos',
          email: 'joao.santos@email.com',
          phone: '11987654321'
        }
      },
      adminUpdate: {
        summary: 'Atualização por admin',
        description: 'Admin pode alterar role e outros campos',
        value: {
          name: 'Maria Admin Silva',
          email: 'maria.admin@email.com',
          role: 'ADMIN'
        }
      },
      passwordUpdate: {
        summary: 'Atualização de senha',
        description: 'Alteração de senha com critérios de segurança',
        value: {
          password: 'NovaSenha@123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    schema: {
      example: {
        id: 'clq3r4s5t6u7v8w9x0y1z2',
        name: 'João Silva Santos',
        email: 'joao.santos@email.com',
        document: '12345678901',
        phone: '11987654321',
        role: 'USER',
        createdAt: '2025-10-21T14:30:00.000Z',
        updatedAt: '2025-10-21T15:45:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para esta operação',
    schema: {
      example: {
        statusCode: 403,
        message: 'Você só pode atualizar seu próprio perfil',
        error: 'Forbidden'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: "Usuário com ID 'clq3r4s5t6u7v8w9x0y1z2' não encontrado",
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Email ou documento já existe',
    schema: {
      example: {
        statusCode: 409,
        message: "Email 'joao@email.com' já está em uso por outro usuário",
        error: 'Conflict'
      }
    }
  })
  async execute(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: any
  ) {
    const context = {
      requesterId: request.user.id,
      requesterRole: request.user.role
    };

    return this.updateUserUseCase.execute(userId, updateUserDto, context);
  }
}