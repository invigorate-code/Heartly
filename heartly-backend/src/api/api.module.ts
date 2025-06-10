import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { FacilityModule } from './facility/facility.module';
import { HealthModule } from './health/health.module';
import { SystemAuditLogController } from './system-audit-log/system-audit-log.controller';
import { SystemAuditLogModule } from './system-audit-log/system-audit-log.module';
import { SystemAuditLogService } from './system-audit-log/system-audit-log.service';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    FacilityModule,
    TenantModule,
    UserModule,
    SystemAuditLogModule,
    ClientModule,
  ],
  providers: [SystemAuditLogService],
  controllers: [SystemAuditLogController],
})
export class ApiModule {}
