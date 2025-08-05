import { SessionContextService } from '@/common/services/session-context.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to initialize the SessionContextService with the current request
 * This must run after SuperTokens middleware but before any route handlers
 * that might need session context.
 */
@Injectable()
export class SessionContextInitMiddleware implements NestMiddleware {
  constructor(private readonly moduleRef: ModuleRef) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Resolve the request-scoped SessionContextService for this specific request
      const sessionContextService = await this.moduleRef.resolve(
        SessionContextService,
      );
      await sessionContextService.initializeFromRequest(req, res);
    } catch (error) {
      // Log error but don't block request - allow unauthenticated routes
      console.warn('Session context initialization error:', error.message);
    }

    next();
  }
}
