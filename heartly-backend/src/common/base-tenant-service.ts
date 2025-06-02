import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import UserMetadata from 'supertokens-node/recipe/usermetadata';

@Injectable()
export class BaseTenantService {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Verifies user has access to the requested tenant and returns the user's tenantId
   * @protected
   */
  protected async verifyTenantAccess(
    session: SessionContainer,
    requestedTenantId?: string,
  ): Promise<string> {
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;

    if (!userTenantId || typeof userTenantId !== 'string') {
      this.logger.error(`User ${userId} has no valid tenant ID in metadata`);
      throw new Error('Valid tenant ID not found in user metadata');
    }

    // If requestedTenantId is provided, verify it matches the user's tenant
    if (requestedTenantId && userTenantId !== requestedTenantId) {
      this.logger.warn(
        `Tenant mismatch: User ${userId} from tenant ${userTenantId} attempted to access tenant ${requestedTenantId}`,
      );
      throw new ForbiddenException(
        'You do not have permission to access resources for this tenant',
      );
    }

    return userTenantId;
  }
}
