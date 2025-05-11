import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAuditLogEntity } from './entities/system-audit-log.entity';
import { SystemAuditLogController } from './system-audit-log.controller';
import { SystemAuditLogService } from './system-audit-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemAuditLogEntity])],
  controllers: [SystemAuditLogController],
  providers: [SystemAuditLogService],
  exports: [SystemAuditLogService, TypeOrmModule],
})
export class SystemAuditLogModule {}
