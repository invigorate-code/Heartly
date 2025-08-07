import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class SuperTokensPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const session: SessionContainer = request.session;

    // Check if session exists
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    try {
      // Get user ID and tenant ID from session
      const userId = session.getUserId();
      const tenantId = await session.getTenantId();

      // Get user permissions from SuperTokens
      const { permissions: userPermissions } =
        await UserRoles.getPermissionsForUser(tenantId, userId);

      // Check if user has all required permissions
      const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasAllRequiredPermissions) {
        const missingPermissions = requiredPermissions.filter(
          (permission) => !userPermissions.includes(permission),
        );
        throw new ForbiddenException(
          `User lacks required permissions: ${missingPermissions.join(', ')}`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify user permissions');
    }
  }
}