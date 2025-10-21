import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { GetUsersUseCase } from "src/core/application/use-cases/get-users.usecase";

@ApiTags('Users')
@Controller('users')
export class GetUsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
  ) { }

  @Get()
  @ApiOperation({ 
    summary: 'Listar usuários com paginação',
    description: 'Retorna uma lista paginada de usuários com metadata de paginação'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Número da página (mínimo: 1)',
    example: '1',
    schema: { type: 'string', default: '1' }
  })
  @ApiQuery({ 
    name: 'perPage', 
    required: false, 
    description: 'Itens por página (1-100)',
    example: '10',
    schema: { type: 'string', default: '10' }
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      example: {
        data: [
          {
            id: 'clq3r4s5t6u7v8w9x0y1z2',
            name: 'João Silva',
            email: 'joao@email.com',
            document: '12345678901',
            phone: '11999999999',
            role: 'USER',
            createdAt: '2025-10-21T14:30:00.000Z',
            updatedAt: '2025-10-21T14:30:00.000Z'
          }
        ],
        metadata: {
          currentPage: 1,
          perPage: 10,
          totalItems: 25,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: false
        }
      }
    }
  })
  async execute(@Query() query: { page?: string; perPage?: string }) {
    const page = query.page || '1';
    const perPage = query.perPage || '10';
    return await this.getUsersUseCase.execute({ page, perPage });
  }
}
