import { Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import Session, { SessionContainer } from 'supertokens-node/recipe/session';

export interface SessionContext {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
  sessionHandle: string;
}

/**
 * Service to provide consistent access to SuperTokens session context
 * across the application. This service is request-scoped to ensure
 * session data is tied to the current request.
 */
@Injectable({ scope: Scope.REQUEST })
export class SessionContextService {
  private session: SessionContainer | null = null;
  private sessionContext: SessionContext | null = null;

  /**
   * Initialize the session context from the current request
   */
  async initializeFromRequest(req: Request, res?: any): Promise<void> {
    try {
      // Only try to get session if we have both request and response objects
      if (!req) {
        return;
      }

      this.session = await Session.getSession(req, res, {
        sessionRequired: false,
      });

      if (this.session) {
        const userId = this.session.getUserId();
        const payload = this.session.getAccessTokenPayload();

        this.sessionContext = {
          userId,
          tenantId: payload.tenantId || '',
          role: payload.role || '',
          email: payload.email || '',
          sessionHandle: this.session.getHandle(),
        };
      }
    } catch (error) {
      // Log error but don't throw - allow unauthenticated requests
      console.warn('Failed to initialize session context:', error.message);
      // Reset session data on error
      this.session = null;
      this.sessionContext = null;
    }
  }

  /**
   * Get the current session container
   */
  getSession(): SessionContainer | null {
    return this.session;
  }

  /**
   * Get the current session context
   */
  getSessionContext(): SessionContext | null {
    return this.sessionContext;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.session !== null && this.sessionContext !== null;
  }

  /**
   * Get current user ID (throws if not authenticated)
   */
  getUserId(): string {
    if (!this.isAuthenticated() || !this.sessionContext) {
      throw new Error('User not authenticated');
    }
    return this.sessionContext.userId;
  }

  /**
   * Get current tenant ID (throws if not authenticated)
   */
  getTenantId(): string {
    if (!this.isAuthenticated() || !this.sessionContext) {
      throw new Error('User not authenticated');
    }
    return this.sessionContext.tenantId;
  }

  /**
   * Get current user role (throws if not authenticated)
   */
  getUserRole(): string {
    if (!this.isAuthenticated() || !this.sessionContext) {
      throw new Error('User not authenticated');
    }
    return this.sessionContext.role;
  }

  /**
   * Get current user email (throws if not authenticated)
   */
  getUserEmail(): string {
    if (!this.isAuthenticated() || !this.sessionContext) {
      throw new Error('User not authenticated');
    }
    return this.sessionContext.email;
  }

  /**
   * Get session handle for audit purposes (throws if not authenticated)
   */
  getSessionHandle(): string {
    if (!this.isAuthenticated() || !this.sessionContext) {
      throw new Error('User not authenticated');
    }
    return this.sessionContext.sessionHandle;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.isAuthenticated() && this.sessionContext?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return (
      this.isAuthenticated() &&
      this.sessionContext !== null &&
      roles.includes(this.sessionContext.role)
    );
  }
}
