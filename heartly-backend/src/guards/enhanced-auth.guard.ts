import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import SessionNode from 'supertokens-node/recipe/session';
import { IS_PUBLIC, IS_AUTH_OPTIONAL } from '@/constants/app.constant';

@Injectable()
export class EnhancedAuthGuard implements CanActivate {
  private readonly logger = new Logger(EnhancedAuthGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Check if endpoint is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Public endpoint accessed', {
        endpoint: `${request.method} ${request.url}`,
      });
      return true;
    }

    // Check if authentication is optional
    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(IS_AUTH_OPTIONAL, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      // Attempt to get SuperTokens session
      const session = await SessionNode.getSession(request, undefined, {
        sessionRequired: !isAuthOptional,
      });

      if (!session) {
        if (isAuthOptional) {
          this.logger.debug('Optional auth endpoint accessed without session', {
            endpoint: `${request.method} ${request.url}`,
          });
          return true;
        }

        this.logger.warn('Authentication failed: No session found', {
          endpoint: `${request.method} ${request.url}`,
          ip: request.ip,
          userAgent: request.get('User-Agent'),
        });
        throw new UnauthorizedException('Authentication required');
      }

      // Validate session and extract user context
      const payload = session.getAccessTokenPayload();
      const userId = session.getUserId();
      const tenantId = payload.tenantId;
      const userRole = payload.role;
      const isEmailVerified = payload['st-ev']?.v || false;

      // Check email verification status
      if (!isEmailVerified) {
        this.logger.warn('Authentication failed: Email not verified', {
          userId,
          tenantId,
          endpoint: `${request.method} ${request.url}`,
        });
        throw new UnauthorizedException('Email verification required');
      }

      // Validate required session data
      if (!tenantId) {
        this.logger.warn('Authentication failed: No tenant context', {
          userId,
          endpoint: `${request.method} ${request.url}`,
        });
        throw new UnauthorizedException('Tenant context required');
      }

      if (!userRole) {
        this.logger.warn('Authentication failed: No user role', {
          userId,
          tenantId,
          endpoint: `${request.method} ${request.url}`,
        });
        throw new UnauthorizedException('User role required');
      }

      // Attach user context to request for downstream use
      request['session'] = session;
      request['userId'] = userId;
      request['tenantId'] = tenantId;
      request['userRole'] = userRole;

      // Log successful authentication
      this.logger.debug('Authentication successful', {
        userId,
        tenantId,
        userRole,
        endpoint: `${request.method} ${request.url}`,
      });

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Log authentication errors
      this.logger.error('Authentication error', {
        error: error.message,
        endpoint: `${request.method} ${request.url}`,
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      });

      if (isAuthOptional) {
        return true;
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }
}