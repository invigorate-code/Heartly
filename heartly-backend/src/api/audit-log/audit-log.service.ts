import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import {
  AuditLogResponseDto,
  AuditLogSummaryDto,
  ExportAuditLogsDto,
  GetAuditLogsDto,
} from '../../common/dto/audit-log.dto';
import { DataAuditLog } from '../../common/entities/data-audit-log.entity';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(DataAuditLog)
    private readonly auditLogRepository: Repository<DataAuditLog>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FacilityEntity)
    private readonly facilityRepository: Repository<FacilityEntity>,
  ) {}

  async getAuditLogs(
    query: GetAuditLogsDto,
    currentUser: UserEntity,
  ): Promise<{
    logs: AuditLogResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Check permissions
    this.validateAccessPermissions(currentUser);

    const queryBuilder = this.createBaseQuery();
    this.applyFilters(queryBuilder, query, currentUser);

    // Apply pagination
    const page = query.page || 1;
    const limit = Math.min(query.limit || 50, 1000); // Max 1000 items per page
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    // Get total count
    const total = await queryBuilder.getCount();

    // Get results with related data
    const logs = await queryBuilder.getMany();

    // Transform to response DTOs
    const transformedLogs = await this.transformToResponseDto(logs);

    return {
      logs: transformedLogs,
      total,
      page,
      limit,
    };
  }

  async exportAuditLogs(
    query: ExportAuditLogsDto,
    currentUser: UserEntity,
  ): Promise<any[]> {
    // Check permissions - only OWNER and ADMIN can export
    if (!['OWNER', 'ADMIN'].includes(currentUser.role)) {
      throw new ForbiddenException(
        'Insufficient permissions to export audit logs',
      );
    }

    // Use the database function for compliance export
    const result = await this.auditLogRepository.query(
      `SELECT * FROM export_audit_logs($1, $2, $3, $4)`,
      [
        query.startDate,
        query.endDate,
        currentUser.tenantId,
        query.tableName || null,
      ],
    );

    return result;
  }

  async getAuditLogSummary(
    startDate?: Date,
    endDate?: Date,
    currentUser?: UserEntity,
  ): Promise<AuditLogSummaryDto> {
    // Check permissions
    if (currentUser) {
      this.validateAccessPermissions(currentUser);
    }

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

    if (startDate && endDate) {
      queryBuilder.andWhere('audit.timestamp BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    // Apply tenant filtering based on user role
    if (currentUser) {
      queryBuilder.andWhere('audit.tenantId = :tenantId', {
        tenantId: currentUser.tenantId,
      });

      if (currentUser.role === 'STAFF') {
        queryBuilder.andWhere('audit.userId = :userId', {
          userId: currentUser.id,
        });
      }
    }

    const logs = await queryBuilder.getMany();

    // Calculate summary statistics
    const totalLogs = logs.length;
    const operationCounts = {
      INSERT: logs.filter((log) => log.operation === 'INSERT').length,
      UPDATE: logs.filter((log) => log.operation === 'UPDATE').length,
      DELETE: logs.filter((log) => log.operation === 'DELETE').length,
    };

    const tableCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};

    logs.forEach((log) => {
      // Count by table
      tableCounts[log.tableName] = (tableCounts[log.tableName] || 0) + 1;

      // Count by user
      if (log.userId) {
        userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
      }
    });

    const dateRange = {
      start:
        startDate ||
        (logs.length > 0 ? logs[logs.length - 1].timestamp : new Date()),
      end: endDate || (logs.length > 0 ? logs[0].timestamp : new Date()),
    };

    return {
      totalLogs,
      dateRange,
      operationCounts,
      tableCounts,
      userCounts,
    };
  }

  async cleanupOldLogs(): Promise<{ deletedCount: number }> {
    // Use the database function for cleanup
    const _result = await this.auditLogRepository.query(
      'SELECT cleanup_old_audit_logs()',
    );

    // Get count of deleted records
    const countResult = await this.auditLogRepository.query(
      `SELECT COUNT(*) as count FROM data_audit_log WHERE timestamp < NOW() - INTERVAL '2 years'`,
    );

    return { deletedCount: parseInt(countResult[0]?.count || '0', 10) };
  }

  private validateAccessPermissions(user: UserEntity): void {
    if (!['OWNER', 'ADMIN', 'STAFF'].includes(user.role)) {
      throw new ForbiddenException(
        'Insufficient permissions to access audit logs',
      );
    }
  }

  private createBaseQuery(): SelectQueryBuilder<DataAuditLog> {
    return this.auditLogRepository
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.userId', 'user')
      .leftJoinAndSelect('audit.facilityId', 'facility')
      .orderBy('audit.timestamp', 'DESC');
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<DataAuditLog>,
    query: GetAuditLogsDto,
    currentUser: UserEntity,
  ): void {
    // Apply tenant filtering (handled by RLS, but explicit for clarity)
    queryBuilder.andWhere('audit.tenantId = :tenantId', {
      tenantId: currentUser.tenantId,
    });

    // Role-based filtering
    if (currentUser.role === 'STAFF') {
      queryBuilder.andWhere('audit.userId = :userId', {
        userId: currentUser.id,
      });
    }

    // Date range filtering
    if (query.startDate) {
      queryBuilder.andWhere('audit.timestamp >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere('audit.timestamp <= :endDate', {
        endDate: query.endDate,
      });
    }

    // Other filters
    if (query.tableName) {
      queryBuilder.andWhere('audit.tableName = :tableName', {
        tableName: query.tableName,
      });
    }

    if (query.rowId) {
      queryBuilder.andWhere('audit.rowId = :rowId', {
        rowId: query.rowId,
      });
    }

    if (query.userId) {
      queryBuilder.andWhere('audit.userId = :filterUserId', {
        filterUserId: query.userId,
      });
    }

    if (query.facilityId) {
      queryBuilder.andWhere('audit.facilityId = :facilityId', {
        facilityId: query.facilityId,
      });
    }

    if (query.operation) {
      queryBuilder.andWhere('audit.operation = :operation', {
        operation: query.operation,
      });
    }
  }

  private async transformToResponseDto(
    logs: DataAuditLog[],
  ): Promise<AuditLogResponseDto[]> {
    const userIds = [...new Set(logs.map((log) => log.userId).filter(Boolean))];
    const facilityIds = [
      ...new Set(logs.map((log) => log.facilityId).filter(Boolean)),
    ];

    // Fetch related data in batches for performance
    const users =
      userIds.length > 0
        ? await this.userRepository.find({
            where: { id: In(userIds) },
            select: ['id', 'email'],
          })
        : [];

    const facilities =
      facilityIds.length > 0
        ? await this.facilityRepository.find({
            where: { id: In(facilityIds) },
            select: ['id', 'name'],
          })
        : [];

    const userMap = new Map(users.map((user) => [user.id, user]));
    const facilityMap = new Map(
      facilities.map((facility) => [facility.id, facility]),
    );

    return logs.map((log) => ({
      id: log.id,
      tableName: log.tableName,
      operation: log.operation,
      rowId: log.rowId,
      userId: log.userId,
      userEmail: log.userId ? userMap.get(log.userId)?.email : undefined,
      tenantId: log.tenantId,
      facilityId: log.facilityId,
      facilityName: log.facilityId
        ? facilityMap.get(log.facilityId)?.name
        : undefined,
      timestamp: log.timestamp,
      oldValues: log.oldValues,
      newValues: log.newValues,
      changedFields: log.changedFields,
      sessionId: log.sessionId,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
    }));
  }
}
