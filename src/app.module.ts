import { Module } from '@nestjs/common';
import { UserModule } from './infra/modules/user/user.module';
import { AuthModule } from './infra/modules/auth/auth.module';
import { PrismaModule } from './infra/database/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
