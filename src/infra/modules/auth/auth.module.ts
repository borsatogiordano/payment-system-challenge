import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { LoginUseCase } from 'src/core/application/use-cases/login-usecase';
import { JwtStrategy } from 'src/infra/auth/strategies/jwt.strategy';
import { UserRepository } from 'src/core/application/repositories/user.repository';
import { PrismaUserRepository } from 'src/infra/database/repositories/prisma-user.repository';
import { PrismaModule } from 'src/infra/database/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}