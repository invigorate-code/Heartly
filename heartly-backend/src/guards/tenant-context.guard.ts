import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import SessionNode from 'supertokens-node/recipe/session';

@Injectable()
export class TenantContextGuard implements CanActivate {
  private readonly logger = new Logger(TenantContextGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    try {
      // Get SuperTokens session
      const session = await SessionNode.getSession(request, undefined, {
        sessionRequired: true,
      });

      if (!session) {
        this.logger.warn('Tenant validation failed: No session found', {
          endpoint: `${request.method} ${request.url}`,
        });
        throw new UnauthorizedException('Authentication required');
      }

      // Get tenant context from session payload
      const payload = session.getAccessTokenPayload();
      const tenantId = payload.tenantId;
      const userId = session.getUserId();

      if (!tenantId) {
        this.logger.warn('Tenant validation failed: No tenant in session', {
          userId,
          endpoint: `${request.method} ${request.url}`,
        });
        throw new UnauthorizedException('Tenant context not found');
      }

      // Attach tenant context to request for use in controllers
      request['tenantId'] = tenantId;
      request['userId'] = userId;

      // Log successful tenant validation
      this.logger.debug('Tenant validation successful', {
        userId,
        tenantId,
        endpoint: `${request.method} ${request.url}`,
      });

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error('Tenant validation error', {
        error: error.message,
        endpoint: `${request.method} ${request.url}`,
      });
      throw new UnauthorizedException('Tenant validation failed');
    }
  }
}