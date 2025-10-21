import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/core/domain/enums/user-role-enum';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado'
  })
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}