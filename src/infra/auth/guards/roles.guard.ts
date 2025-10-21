import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/core/domain/enums/user-role-enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Sem roles definidas = acesso liberado
    }

    const { user } = context.switchToHttp().getRequest();
    
    // 🔒 Verificar se o usuário existe (JWT deve ter sido validado antes)
    if (!user) {
      console.log('❌ RolesGuard: Usuário não encontrado na requisição');
      return false;
    }

    // 🔍 Verificar se o usuário tem uma das roles necessárias
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRequiredRole) {
      console.log(`❌ RolesGuard: Usuário ${user.email} não tem role necessária. Requerida: [${requiredRoles}], Atual: ${user.role}`);
    }
    
    return hasRequiredRole;
  }
}