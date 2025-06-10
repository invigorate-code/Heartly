import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FacilityModule } from './facility/facility.module';
import { HealthModule } from './health/health.module';
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
    UserActionAuditLogModule,
  ],
  providers: [UserActionAuditLogService],
  controllers: [UserActionAuditLogController],
})
export class ApiModule {}
