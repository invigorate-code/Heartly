import { Module } from '@nestjs/common';
import { PHIModule } from 'src/phi/phi.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
// import { PasswordResetModule } from './auth/password-reset.module';
import { ClientModule } from './client/client.module';
import { FacilityModule } from './facility/facility.module';
import { FormFieldContributionModule } from './form-field-contribution/form-field-contribution.module';
import { HealthModule } from './health/health.module';
import { PlacementInfoModule } from './placement-info/placement-info.module';
import { CustomRoleModule } from './role/custom-role.module';
import { TenantModule } from './tenant/tenant.module';
import { UserActionAuditLogModule } from './user-action-audit-log/user-action-audit-log.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    // PasswordResetModule, // Temporarily disabled due to bcrypt native module issue
    FacilityModule,
    TenantModule,
    UserModule,
    ClientModule,
    CustomRoleModule,
    UserActionAuditLogModule, // The module itself handles providers and controllers
    AuditLogModule,
    PHIModule,
    PlacementInfoModule,
    FormFieldContributionModule,
  ],
  // Removed duplicate providers and controllers - they're handled by UserActionAuditLogModule
})
export class ApiModule {}
