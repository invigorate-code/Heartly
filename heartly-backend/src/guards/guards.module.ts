import { Module } from '@nestjs/common';
import { EnhancedAuthGuard } from './enhanced-auth.guard';
import { FacilityAccessGuard } from './facility-access.guard';
import { RolesGuard } from './roles.guard';
import { TenantContextGuard } from './tenant-context.guard';

@Module({
  providers: [
    EnhancedAuthGuard,
    RolesGuard,
    TenantContextGuard,
    FacilityAccessGuard,
  ],
  exports: [
    EnhancedAuthGuard,
    RolesGuard,
    TenantContextGuard,
    FacilityAccessGuard,
  ],
})
export class GuardsModule {}