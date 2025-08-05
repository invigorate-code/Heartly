import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Session from 'supertokens-node/recipe/session';
import { DataSource, QueryRunner } from 'typeorm';

interface RlsRequest extends Request {
  rlsQueryRunner?: QueryRunner;
}

@Injectable()
export class RlsContextMiddleware implements NestMiddleware {
  constructor(private readonly dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check if user is authenticated using SuperTokens session
      const session = await Session.getSession(req, res, {
        sessionRequired: false, // Don't throw error for unauthenticated requests
      });

      if (session) {
        // Get user information from session payload
        const userId = session.getUserId();
        const userPayload = session.getAccessTokenPayload();

        // Extract tenant and role information from the enhanced session payload
        const tenantId = userPayload.tenantId;
        const userRole = userPayload.role;

        if (tenantId && userRole) {
          // Set database context for RLS policies and audit logging
          await this.dataSource.query(
            `SELECT set_config('app.tenant_id', $1, true)`,
            [tenantId],
          );
          await this.dataSource.query(
            `SELECT set_config('app.user_id', $1, true)`,
            [userId],
          );
          await this.dataSource.query(
            `SELECT set_config('app.user_role', $1, true)`,
            [userRole],
          );

          // Set additional context for audit logging
          const sessionId = session.getHandle();
          const ipAddress =
            req.ip || req.connection?.remoteAddress || 'unknown';
          const userAgent = req.get('User-Agent') || 'unknown';

          await this.dataSource.query(
            `SELECT set_config('app.session_id', $1, true)`,
            [sessionId],
          );
          await this.dataSource.query(
            `SELECT set_config('app.ip_address', $1, true)`,
            [ipAddress],
          );
          await this.dataSource.query(
            `SELECT set_config('app.user_agent', $1, true)`,
            [userAgent],
          );
        }
      }
    } catch (error) {
      // Log error but don't block request for non-authenticated routes
      console.warn('RLS Context Middleware error:', error.message);
    }

    next();
  }
}

// Cleanup middleware to release query runner
@Injectable()
export class RlsContextCleanupMiddleware implements NestMiddleware {
  use(req: RlsRequest, res: Response, next: NextFunction): void {
    // Add cleanup logic when response finishes
    res.on('finish', async () => {
      const queryRunner = req.rlsQueryRunner;
      if (queryRunner) {
        try {
          await queryRunner.release();
        } catch (error) {
          console.warn('Error releasing RLS query runner:', error.message);
        }
      }
    });

    next();
  }
}
