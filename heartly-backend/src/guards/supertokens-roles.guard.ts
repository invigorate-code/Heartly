import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionContainer } from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';
import { UserRole } from '../api/user/entities/user.entity';
import { SuperTokensRolesService } from '../utils/supertokens/roles.service';

@Injectable()
export class SuperTokensRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: SuperTokensRolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
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

      // Get user roles from SuperTokens
      const { roles: userRoles } = await UserRoles.getRolesForUser(
        tenantId,
        userId,
      );

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role),
      );

      if (!hasRequiredRole) {
        throw new ForbiddenException(
          `User does not have required roles: ${requiredRoles.join(', ')}`,
        );
      }

      // Also verify the role matches what's in the session payload
      const payload = session.getAccessTokenPayload();
      const sessionRole = payload.role;

      // Ensure session role is in sync
      if (sessionRole && !userRoles.includes(sessionRole)) {
        throw new ForbiddenException(
          'Session role does not match user roles. Please re-authenticate.',
        );
      }

      return true;
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify user roles');
    }
  }
}
