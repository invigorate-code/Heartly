import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';

export enum PasswordResetAction {
  OWNER_SELF_RESET = 'owner_self_reset',
  ADMIN_RESET_OTHERS = 'admin_reset_others',
  VIEW_AUDIT_HISTORY = 'view_audit_history',
}

export const PasswordResetPermissions = Reflector.createDecorator<PasswordResetAction>();

@Injectable()
export class PasswordResetPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAction = this.reflector.get(
      PasswordResetPermissions,
      context.getHandler(),
    );

    if (!requiredAction) {
      return true; // No specific permission required
    }

    const request = context.switchToHttp().getRequest<Request>();
    const session = request['session'] as SessionContainer;

    if (!session) {
      throw new ForbiddenException('Session required');
    }

    const userId = session.getUserId();
    const tenantId = session.getAccessTokenPayload().tenantId || 'public';
    const { roles } = await UserRoles.getRolesForUser(tenantId, userId);

    switch (requiredAction) {
      case PasswordResetAction.OWNER_SELF_RESET:
        return this.checkOwnerPermission(roles);

      case PasswordResetAction.ADMIN_RESET_OTHERS:
        return this.checkAdminOrOwnerPermission(roles, request);

      case PasswordResetAction.VIEW_AUDIT_HISTORY:
        return this.checkAdminOrOwnerPermission(roles, request);

      default:
        return false;
    }
  }

  private checkOwnerPermission(roles: string[]): boolean {
    if (!roles.includes('OWNER')) {
      throw new ForbiddenException('Only OWNER users can perform self-service password reset');
    }
    return true;
  }

  private async checkAdminOrOwnerPermission(roles: string[], request: Request): Promise<boolean> {
    const hasPermission = roles.includes('OWNER') || roles.includes('ADMIN');
    
    if (!hasPermission) {
      throw new ForbiddenException('ADMIN or OWNER role required');
    }

    // Additional check for ADMIN users trying to reset higher-level users
    if (roles.includes('ADMIN') && !roles.includes('OWNER')) {
      const targetUserId = request.body?.targetUserId || request.params?.userId;
      
      if (targetUserId) {
        const targetTenantId = request['session']?.getAccessTokenPayload?.().tenantId || 'public';
        const { roles: targetRoles } = await UserRoles.getRolesForUser(targetTenantId, targetUserId);
        
        if (targetRoles.includes('OWNER') || targetRoles.includes('ADMIN')) {
          throw new ForbiddenException('ADMIN users cannot reset passwords of OWNER or ADMIN users');
        }
      }
    }

    return true;
  }
}