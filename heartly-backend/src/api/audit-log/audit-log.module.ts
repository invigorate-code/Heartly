import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { DataAuditLog } from '../../common/entities/data-audit-log.entity';
import { UserEntity } from '../user/entities/user.entity';
import { FacilityEntity } from '../facility/entities/facility.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataAuditLog,
      UserEntity,
      FacilityEntity,
    ]),
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}