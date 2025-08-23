import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import SessionNode from 'supertokens-node/recipe/session';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    
    try {
      // Get SuperTokens session
      const session = await SessionNode.getSession(request, undefined, {
        sessionRequired: true,
      });

      if (!session) {
        this.logger.warn('Role validation failed: No session found', {
          endpoint: `${request.method} ${request.url}`,
          requiredRoles,
        });
        throw new UnauthorizedException('Authentication required');
      }

      // Get user role from session payload
      const payload = session.getAccessTokenPayload();
      const userRole = payload.role;
      const userId = session.getUserId();
      const tenantId = payload.tenantId;

      if (!userRole) {
        this.logger.warn('Role validation failed: No role in session', {
          userId,
          tenantId,
          endpoint: `${request.method} ${request.url}`,
          requiredRoles,
        });
        throw new UnauthorizedException('User role not found');
      }

      // Check if user has required role
      const hasRequiredRole = requiredRoles.includes(userRole);

      if (!hasRequiredRole) {
        this.logger.warn('Role validation failed: Insufficient permissions', {
          userId,
          tenantId,
          userRole,
          requiredRoles,
          endpoint: `${request.method} ${request.url}`,
        });
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Log successful role validation
      this.logger.log('Role validation successful', {
        userId,
        tenantId,
        userRole,
        requiredRoles,
        endpoint: `${request.method} ${request.url}`,
      });

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error('Role validation error', {
        error: error.message,
        endpoint: `${request.method} ${request.url}`,
        requiredRoles,
      });
      throw new UnauthorizedException('Role validation failed');
    }
  }
}
