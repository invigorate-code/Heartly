import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import SessionNode from 'supertokens-node/recipe/session';

@Injectable()
export class FacilityAccessGuard implements CanActivate {
  private readonly logger = new Logger(FacilityAccessGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Check if facility access validation is required for this endpoint
    const requiresFacilityAccess = this.reflector.getAllAndOverride<boolean>('requiresFacilityAccess', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If facility access is not required, allow access
    if (!requiresFacilityAccess) {
      return true;
    }

    try {
      // Get SuperTokens session
      const session = await SessionNode.getSession(request, undefined, {
        sessionRequired: true,
      });

      if (!session) {
        this.logger.warn('Facility access validation failed: No session found', {
          endpoint: `${request.method} ${request.url}`,
        });
        throw new UnauthorizedException('Authentication required');
      }

      // Get user context from session payload
      const payload = session.getAccessTokenPayload();
      const userId = session.getUserId();
      const tenantId = payload.tenantId;
      const userRole = payload.role;

      // Extract facility ID from request (could be in params, body, or query)
      const facilityId = this.extractFacilityId(request);

      if (!facilityId) {
        this.logger.warn('Facility access validation failed: No facility ID found', {
          userId,
          tenantId,
          endpoint: `${request.method} ${request.url}`,
        });
        throw new UnauthorizedException('Facility ID required');
      }

      // OWNER and ADMIN roles have access to all facilities in their tenant
      if (userRole === 'OWNER' || userRole === 'ADMIN') {
        this.logger.debug('Facility access granted: Admin/Owner privileges', {
          userId,
          tenantId,
          userRole,
          facilityId,
          endpoint: `${request.method} ${request.url}`,
        });
        return true;
      }

      // For STAFF role, we would need to check facility assignments
      // This would require a database lookup to verify facility access
      // For now, we'll allow STAFF access and implement detailed facility checks later
      if (userRole === 'STAFF') {
        // TODO: Implement database check for staff facility assignments
        this.logger.debug('Facility access granted: Staff role (TODO: implement facility assignment check)', {
          userId,
          tenantId,
          userRole,
          facilityId,
          endpoint: `${request.method} ${request.url}`,
        });
        return true;
      }

      // Unknown role - deny access
      this.logger.warn('Facility access denied: Unknown role', {
        userId,
        tenantId,
        userRole,
        facilityId,
        endpoint: `${request.method} ${request.url}`,
      });
      throw new UnauthorizedException('Insufficient facility access permissions');

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error('Facility access validation error', {
        error: error.message,
        endpoint: `${request.method} ${request.url}`,
      });
      throw new UnauthorizedException('Facility access validation failed');
    }
  }

  private extractFacilityId(request: Request): string | null {
    // Try to extract facility ID from various request locations
    const params = request.params;
    const body = request.body;
    const query = request.query;

    // Check common parameter names
    return (
      params?.facilityId ||
      params?.facility_id ||
      body?.facilityId ||
      body?.facility_id ||
      query?.facilityId ||
      query?.facility_id ||
      null
    );
  }
}