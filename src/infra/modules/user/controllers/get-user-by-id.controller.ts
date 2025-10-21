import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetUserByIdUseCase } from "src/core/application/use-cases/get-user-by-id.usecase";

@Controller('users')
@ApiTags('Users')
export class GetUserByIdController {

  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) { }

  @ApiOperation({
    summary: 'Obter usuário por ID',
    description: 'Recupera os detalhes de um usuário específico com base no seu ID único.'
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do usuário recuperados com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário com o ID fornecido não foi encontrado',
  })
  @Get(':id')
  async execute(@Param('id') userId: string) {
    return this.getUserByIdUseCase.execute(userId);
  }
}