import {
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import SessionNode from 'supertokens-node/recipe/session';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Try to get tenant context from SuperTokens session first
      const session = await SessionNode.getSession(req, res, {
        sessionRequired: false, // Don't require session for public endpoints
      });

      if (session) {
        const payload = session.getAccessTokenPayload();
        const tenantId = payload.tenantId;
        const userId = session.getUserId();

        if (tenantId) {
          // Attach tenant context from session
          req['tenantId'] = tenantId;
          req['userId'] = userId;
          req['userRole'] = payload.role;
          
          this.logger.debug('Tenant context from session', {
            userId,
            tenantId,
            endpoint: `${req.method} ${req.url}`,
          });
        }
      } else {
        // Fallback to header-based tenant identification for public endpoints
        const headerTenantId = req.headers['x-tenant-id'];
        
        if (headerTenantId) {
          req['tenantId'] = headerTenantId.toString();
          
          this.logger.debug('Tenant context from header', {
            tenantId: headerTenantId,
            endpoint: `${req.method} ${req.url}`,
          });
        }
      }

      next();
    } catch (error) {
      // Log error but don't block request - let other middleware handle auth
      this.logger.warn('Tenant middleware error', {
        error: error.message,
        endpoint: `${req.method} ${req.url}`,
      });
      next();
    }
  }
}
