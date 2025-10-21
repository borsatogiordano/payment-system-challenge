import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { CreateUserDto } from "src/core/application/dtos/create-user.dto";
import { CreateUserUseCase } from "src/core/application/use-cases/create-user.usecase";

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Criar novo usuário', 
    description: 'Cria um novo usuário no sistema com email e documento únicos.' 
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Dados para criação do usuário',
    examples: {
      admin: {
        summary: 'Usuário Administrador',
        description: 'Exemplo de criação de um usuário com role ADMIN',
        value: {
          name: 'João Silva Admin',
          email: 'admin@email.com',
          password: 'MinhaSenh@123',
          document: '12345678901',
          phone: '11999999999',
          role: 'ADMIN'
        }
      },
      user: {
        summary: 'Usuário Comum',
        description: 'Exemplo de criação de um usuário comum (role USER)',
        value: {
          name: 'Maria Santos',
          email: 'maria@email.com',
          password: 'MinhaSenh@456',
          document: '98765432109',
          phone: '11888888888'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: 'clq3r4s5t6u7v8w9x0y1z2',
        name: 'João Silva',
        email: 'joao@email.com',
        document: '12345678901',
        phone: '11999999999',
        role: 'USER',
        createdAt: '2025-10-21T14:30:00.000Z',
        updatedAt: '2025-10-21T14:30:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Nome deve ter pelo menos 2 caracteres',
          'Email deve ter um formato válido',
          'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
        ],
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Email ou documento já existe',
    schema: {
      example: {
        statusCode: 409,
        message: "Usuário com email 'joao@email.com' já existe",
        error: 'Conflict'
      }
    }
  })
  async execute(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}