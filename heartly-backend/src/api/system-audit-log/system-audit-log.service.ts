// audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSystemAuditLogDto } from './dto/create-system-audit-log.dto';
import { SystemAuditLogEntity } from './entities/system-audit-log.entity';

@Injectable()
export class SystemAuditLogService {
  constructor(
    @InjectRepository(SystemAuditLogEntity)
    private readonly systemAuditLogRepository: Repository<SystemAuditLogEntity>,
  ) {}

  async createLog(dto: CreateSystemAuditLogDto): Promise<SystemAuditLogEntity> {
    const log = this.systemAuditLogRepository.create(dto);
    return await this.systemAuditLogRepository.save(log);
  }

  async getAllLogs(): Promise<SystemAuditLogEntity[]> {
    return await this.systemAuditLogRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
