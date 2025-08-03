// audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Repository } from 'typeorm';
import { BaseTenantService } from '../../common/services/base-tenant.service';
import { CreateUserActionAuditLogDto } from './dto/create-user-action-audit-log.dto';
import { QueryUserActionAuditLogDto } from './dto/query-user-action-audit-log.dto';
import { UserActionAuditLogResDto } from './dto/user-action-audit-log.res.dto';
import { UserActionAuditLogEntity } from './entities/user-action-audit-log.entity';

@Injectable()
export class UserActionAuditLogService extends BaseTenantService {
  constructor(
    @InjectRepository(UserActionAuditLogEntity)
    private readonly userActionAuditLogRepository: Repository<UserActionAuditLogEntity>,
  ) {
    super();
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
        clientId: dto.clientId,
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
        clientId: dto.clientId,
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

    // Load related entities if requested
    if (query.includeRelations) {
      qb.leftJoinAndSelect('log.user', 'user')
        .leftJoinAndSelect('log.targetUser', 'targetUser')
        .leftJoinAndSelect('log.targetFacility', 'targetFacility')
        .leftJoinAndSelect('log.targetTenant', 'targetTenant')
        .leftJoinAndSelect('log.client', 'client');
    }

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

    // Add pagination if page and pageSize are provided
    if (query.page && query.pageSize) {
      const skip = (query.page - 1) * query.pageSize;
      qb.skip(skip).take(query.pageSize);
    }

    return qb.orderBy('log.createdAt', 'DESC');
  }

  /**
   * Add tenant verification to a query before execution
   * @private
   */
  private async executeQueryWithTenantVerification(
    query: ReturnType<typeof this.buildLogQuery>,
    session: SessionContainer,
    requestedTenantId: string,
  ): Promise<UserActionAuditLogEntity[]> {
    // Verify user has access to the requested tenant using the inherited method
    await this.verifyTenantAccess(session, requestedTenantId);

    // Execute the query
    return await query.getMany();
  }

  /** Get all logs with optional filters */
  async getLogs(
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    const entities = await this.executeQueryWithTenantVerification(
      this.buildLogQuery({}, query),
      session,
      query.targetTenantId,
    );
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /** Logs by actor */
  async getLogsByUser(
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    const userId = session.getUserId();
    const entities = await this.executeQueryWithTenantVerification(
      this.buildLogQuery({ userId }, query),
      session,
      query.targetTenantId,
    );
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /** Logs by client */
  async getLogsByClient(
    clientId: string,
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    const entities = await this.executeQueryWithTenantVerification(
      this.buildLogQuery({ clientId }, query),
      session,
      query.targetTenantId,
    );
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /** Logs by targetUser */
  async getLogsByTargetUser(
    targetUserId: string,
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    const entities = await this.executeQueryWithTenantVerification(
      this.buildLogQuery({ targetUserId }, query),
      session,
      query.targetTenantId,
    );
    return plainToInstance(UserActionAuditLogResDto, entities);
  }

  /** Logs by facility */
  async getLogsByFacility(
    targetFacilityId: string,
    query: QueryUserActionAuditLogDto,
    session: SessionContainer,
  ): Promise<UserActionAuditLogResDto[]> {
    const entities = await this.executeQueryWithTenantVerification(
      this.buildLogQuery({ targetFacilityId }, query),
      session,
      query.targetTenantId,
    );
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
    const entities = await this.executeQueryWithTenantVerification(
      this.buildLogQuery(filters, query),
      session,
      query.targetTenantId,
    );
    return plainToInstance(UserActionAuditLogResDto, entities);
  }
}
