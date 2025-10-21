import { Module } from '@nestjs/common';
import { UserModule } from './infra/modules/user/user.module';
import { AuthModule } from './infra/modules/auth/auth.module';
import { PrismaModule } from './infra/database/prisma.module';
import { ChargesModule } from './infra/modules/charges/charges.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ChargesModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
