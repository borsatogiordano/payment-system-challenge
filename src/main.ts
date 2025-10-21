import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UnauthorizedExceptionFilter } from './infra/filters/unauthorized-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('API de Pagamentos')
    .setDescription('API RESTful para sistema de pagamentos - Desafio COLMEIA.IO')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Operações de autenticação')
    .addTag('Users', 'Operações relacionadas aos usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
