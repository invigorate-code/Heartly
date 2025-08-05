import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RlsContextCleanupMiddleware,
  RlsContextMiddleware,
} from '../utils/middleware/rls-context.middleware';
import { SessionContextInitMiddleware } from '../utils/middleware/session-context-init.middleware';
import { FormFieldContributionEntity } from './entities/form-field-contribution.entity';
import { MetadataEntity } from './entities/form-metadata.entity';
import { BaseTenantService } from './services/base-tenant.service';
import { FormFieldContributionService } from './services/form-field-contribution.service';
import { FormRegistryService } from './services/form-registry.service';
import { RlsContextService } from './services/rls-context.service';
import { SessionContextService } from './services/session-context.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormFieldContributionEntity, MetadataEntity]),
  ],
  providers: [
    FormRegistryService,
    FormFieldContributionService,
    BaseTenantService,
    RlsContextService,
    SessionContextService,
    RlsContextMiddleware,
    RlsContextCleanupMiddleware,
    SessionContextInitMiddleware,
  ],
  exports: [
    FormRegistryService,
    FormFieldContributionService,
    BaseTenantService,
    RlsContextService,
    SessionContextService,
    RlsContextMiddleware,
    RlsContextCleanupMiddleware,
    SessionContextInitMiddleware,
    TypeOrmModule.forFeature([FormFieldContributionEntity, MetadataEntity]), // Export repositories
  ],
})
export class CommonModule {}
