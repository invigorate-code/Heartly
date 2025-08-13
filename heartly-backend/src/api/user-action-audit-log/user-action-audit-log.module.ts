import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperTokensRolesModule } from '../../utils/supertokens/roles.module';
import { CommonModule } from '../../common/common.module';
import { UserActionAuditLogEntity } from './entities/user-action-audit-log.entity';
import { UserActionAuditLogController } from './user-action-audit-log.controller';
import { UserActionAuditLogService } from './user-action-audit-log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserActionAuditLogEntity]),
    CommonModule, // Import CommonModule to access RlsContextService
    SuperTokensRolesModule,
  ],
  controllers: [UserActionAuditLogController],
  providers: [UserActionAuditLogService],
  exports: [UserActionAuditLogService, TypeOrmModule],
})
export class UserActionAuditLogModule {}
