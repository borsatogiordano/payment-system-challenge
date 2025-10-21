import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    const isAuthRoute = request.url?.includes('/auth/');
    const hasAuthHeader = request.headers.authorization;

    let customMessage: string;

    if (isAuthRoute) {
      customMessage = 'Credenciais inválidas. Verifique seu email e senha.';
    } else if (!hasAuthHeader) {
      customMessage = 'Token de acesso necessário. Faça login primeiro.';
    } else {
      customMessage = 'Token de acesso inválido ou expirado. Faça login novamente.';
    }

    const errorResponse = {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: customMessage,
      error: 'Unauthorized',
    };

    response.status(HttpStatus.UNAUTHORIZED).send(errorResponse);
  }
}