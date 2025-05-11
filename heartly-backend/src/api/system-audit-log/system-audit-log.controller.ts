// audit-log.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { CreateSystemAuditLogDto } from './dto/create-system-audit-log.dto';
import { SystemAuditLogEntity } from './entities/system-audit-log.entity';
import { SystemAuditLogService } from './system-audit-log.service';

@ApiTags('system-audit-logs')
@Controller('system-audit-logs')
export class SystemAuditLogController {
  constructor(private readonly systemAuditLogService: SystemAuditLogService) {}

  // Only ADMIN and OWNER roles can view logs
  @Roles('ADMIN', 'OWNER')
  @Get()
  async getLogs(): Promise<SystemAuditLogEntity[]> {
    const logs = await this.systemAuditLogService.getAllLogs();
    return logs;
  }

  // Optional: Endpoint to manually create an audit log
  @Roles('ADMIN', 'OWNER')
  @Post()
  async createLog(
    @Body() dto: CreateSystemAuditLogDto,
  ): Promise<SystemAuditLogEntity> {
    const log = await this.systemAuditLogService.createLog(dto);
    return log;
  }
}
