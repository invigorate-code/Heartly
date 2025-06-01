// audit-log.service.ts
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SessionContainer } from 'supertokens-node/recipe/session';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { Repository } from 'typeorm';
import { CreateUserActionAuditLogDto } from './dto/create-user-action-audit-log.dto';
import { QueryUserActionAuditLogDto } from './dto/query-user-action-audit-log.dto';
import { UserActionAuditLogResDto } from './dto/user-action-audit-log.res.dto';
import { UserActionAuditLogEntity } from './entities/user-action-audit-log.entity';

@Injectable()
export class UserActionAuditLogService {
  private readonly logger = new Logger(UserActionAuditLogService.name);
  constructor(
    @InjectRepository(UserActionAuditLogEntity)
    private readonly userActionAuditLogRepository: Repository<UserActionAuditLogEntity>,
  ) {}

  /**
   * Verifies user has access to the requested tenant and returns the user's tenantId
   * @private
   */
  private async verifyTenantAccess(
    session: SessionContainer,
    requestedTenantId: string,
  ): Promise<string> {
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;

    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

    if (userTenantId !== requestedTenantId) {
      throw new ForbiddenException(
        'You do not have permission to access audit logs for this tenant',
      );
    }

    return userTenantId;
  }

  async createUserActionAuditLog(
    dto: CreateUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogEntity> {
    try {
      await this.verifyTenantAccess(session, dto.targetTenantId);

      const log = this.userActionAuditLogRepository.create({
        userId: dto.userId,
        action: dto.action,
        targetFacilityId: dto.targetFacilityId,
        targetTenantId: dto.targetTenantId,
        // clientId: dto.clientId,
        targetUserId: dto.targetUserId,
        details: dto.details,
      });

      return await this.userActionAuditLogRepository.save(log);
    } catch (error) {
      this.logger.warn('Audit log failed to save', error);
      throw error;
    }
  }

  /**
   * Fire-and-forget variant for internal use: returns void
   */
  async logUserAction(dto: CreateUserActionAuditLogDto): Promise<void> {
    try {
      const log = this.userActionAuditLogRepository.create({
        userId: dto.userId,
        action: dto.action,
        targetFacilityId: dto.targetFacilityId,
        targetTenantId: dto.targetTenantId,
        // clientId: opts?.clientId,
        targetUserId: dto.targetUserId,
        details: dto.details,
      });
      await this.userActionAuditLogRepository.save(log);
    } catch (err) {
      this.logger.warn('Fire-and-forget audit log failed', err);
    }
  }

  /**
   * Internal helper to apply optional filters
   */
  private buildLogQuery(
    filters: {
      userId?: string;
      clientId?: string;
      targetUserId?: string;
      targetFacilityId?: string;
    },
    query: QueryUserActionAuditLogDto,
  ) {
    const qb = this.userActionAuditLogRepository.createQueryBuilder('log');

    // Always filter by tenant ID for security
    qb.andWhere('log.targetTenantId = :tenantId', {
      tenantId: query.targetTenantId,
    });

    if (filters.userId)
      qb.andWhere('log.userId = :userId', { userId: filters.userId });
    if (filters.clientId)
      qb.andWhere('log.clientId = :clientId', { clientId: filters.clientId });
    if (filters.targetUserId)
      qb.andWhere('log.targetUserId = :targetUserId', {
        targetUserId: filters.targetUserId,
      });
    if (filters.targetFacilityId)
      qb.andWhere('log.targetFacilityId = :facilityId', {
        facilityId: filters.targetFacilityId,
      });
    if (query.action)
      qb.andWhere('log.action = :action', { action: query.action });
    if (query.keyword)
      qb.andWhere('log.details::text ILIKE :kw', { kw: `%${query.keyword}%` });
    return qb.orderBy('log.createdAt', 'DESC');
  }

  /** Get all logs with optional filters */
  async getLogs(
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    // Verify tenant access and continue only if authorized
    await this.verifyTenantAccess(session, query.targetTenantId);

    const entities = await this.buildLogQuery({}, query).getMany();
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /** Logs by actor */
  async getLogsByUser(
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    const userId = session.getUserId();
    await this.verifyTenantAccess(session, query.targetTenantId);

    const entities = await this.buildLogQuery({ userId }, query).getMany();
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /** Logs by client */
  async getLogsByClient(
    clientId: string,
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    await this.verifyTenantAccess(session, query.targetTenantId);

    const entities = await this.buildLogQuery({ clientId }, query).getMany();
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /** Logs by targetUser */
  async getLogsByTargetUser(
    targetUserId: string,
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    await this.verifyTenantAccess(session, query.targetTenantId);

    const entities = await this.buildLogQuery(
      { targetUserId },
      query,
    ).getMany();
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /** Logs by facility */
  async getLogsByFacility(
    targetFacilityId: string,
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    await this.verifyTenantAccess(session, query.targetTenantId);

    const entities = await this.buildLogQuery(
      { targetFacilityId },
      query,
    ).getMany();
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /**
   * Generic search: filter by any FK (userId, clientId, targetUserId, targetFacilityId) plus action/keyword
   */
  async searchLogs(
    filters: {
      userId?: string;
      clientId?: string;
      targetUserId?: string;
      targetFacilityId?: string;
    },
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    await this.verifyTenantAccess(session, query.targetTenantId);

    const entities = await this.buildLogQuery(filters, query).getMany();
    return plainToInstance(UserActionAuditLogResDto, entities);
  }
}
