import { Module } from '@nestjs/common';
import { PHIModule } from 'src/phi/phi.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { FacilityModule } from './facility/facility.module';
import { FormFieldContributionModule } from './form-field-contribution/form-field-contribution.module';
import { HealthModule } from './health/health.module';
import { PlacementInfoModule } from './placement-info/placement-info.module';
import { TenantModule } from './tenant/tenant.module';
import { UserActionAuditLogController } from './user-action-audit-log/user-action-audit-log.controller';
import { UserActionAuditLogModule } from './user-action-audit-log/user-action-audit-log.module';
import { UserActionAuditLogService } from './user-action-audit-log/user-action-audit-log.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    FacilityModule,
    TenantModule,
    UserModule,
    ClientModule,
    UserActionAuditLogModule,
    AuditLogModule,
    PHIModule,
    PlacementInfoModule,
    FormFieldContributionModule,
  ],
  providers: [UserActionAuditLogService],
  controllers: [UserActionAuditLogController],
})
export class ApiModule {}
