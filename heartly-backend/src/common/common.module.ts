import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormFieldContributionEntity } from './entities/form-field-contribution.entity';
import { MetadataEntity } from './entities/form-metadata.entity';
import { BaseTenantService } from './services/base-tenant.service';
import { FormFieldContributionService } from './services/form-field-contribution.service';
import { FormRegistryService } from './services/form-registry.service';
import { RlsContextService } from './services/rls-context.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormFieldContributionEntity, MetadataEntity]),
  ],
  providers: [
    FormRegistryService,
    FormFieldContributionService,
    BaseTenantService,
    RlsContextService,
  ],
  exports: [
    FormRegistryService,
    FormFieldContributionService,
    BaseTenantService,
    RlsContextService,
    TypeOrmModule.forFeature([FormFieldContributionEntity, MetadataEntity]), // Export repositories
  ],
})
export class CommonModule {}
