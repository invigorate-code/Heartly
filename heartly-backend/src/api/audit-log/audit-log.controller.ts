import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import {
  AuditLogResponseDto,
  AuditLogSummaryDto,
  ExportAuditLogsDto,
  GetAuditLogsDto,
} from '../../common/dto/audit-log.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserEntity, UserRole } from '../user/entities/user.entity';
import { AuditLogService } from './audit-log.service';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@Controller('audit-logs')
@UseGuards(SuperTokensAuthGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs with filtering and pagination' })
  @ApiResponse({ type: [AuditLogResponseDto] })
  @VerifySession({
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF],
  })
  async getAuditLogs(
    @Query() query: GetAuditLogsDto,
    @CurrentUser() currentUser: UserEntity,
    @Session() session: SessionContainer,
  ) {
    // Set additional context for audit logging
    await this.setAuditContext(session);

    return this.auditLogService.getAuditLogs(query, currentUser);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get audit log summary statistics' })
  @ApiResponse({ type: AuditLogSummaryDto })
  @VerifySession({
    roles: [UserRole.OWNER, UserRole.ADMIN],
  })
  async getAuditLogSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @CurrentUser() currentUser?: UserEntity,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.auditLogService.getAuditLogSummary(start, end, currentUser);
  }

  @Post('export')
  @ApiOperation({ summary: 'Export audit logs for compliance reporting' })
  @VerifySession({
    roles: [UserRole.OWNER, UserRole.ADMIN],
  })
  async exportAuditLogs(
    @Body() exportDto: ExportAuditLogsDto,
    @CurrentUser() currentUser: UserEntity,
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: SessionContainer,
  ) {
    // Set additional context for audit logging
    await this.setAuditContext(session, req);

    const data = await this.auditLogService.exportAuditLogs(
      exportDto,
      currentUser,
    );

    if (exportDto.format === 'csv') {
      // Convert to CSV format
      const csv = this.convertToCSV(data);
      const filename = `audit-logs-${exportDto.startDate}-to-${exportDto.endDate}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      return res.send(csv);
    } else {
      // Return JSON format
      const filename = `audit-logs-${exportDto.startDate}-to-${exportDto.endDate}.json`;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );
      return res.json({
        exportDate: new Date().toISOString(),
        dateRange: {
          start: exportDto.startDate,
          end: exportDto.endDate,
        },
        tableName: exportDto.tableName,
        totalRecords: data.length,
        data,
      });
    }
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Clean up old audit logs (2+ years old)' })
  @VerifySession({
    roles: [UserRole.OWNER],
  })
  async cleanupOldLogs(
    @CurrentUser() currentUser: UserEntity,
    @Session() session: SessionContainer,
  ) {
    // Set additional context for audit logging
    await this.setAuditContext(session);

    return this.auditLogService.cleanupOldLogs();
  }

  @Get('tables/:tableName/rows/:rowId')
  @ApiOperation({ summary: 'Get audit history for a specific record' })
  @ApiResponse({ type: [AuditLogResponseDto] })
  @VerifySession({
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF],
  })
  async getRecordHistory(
    @Query('tableName') tableName: string,
    @Query('rowId') rowId: string,
    @CurrentUser() currentUser: UserEntity,
    @Session() session: SessionContainer,
  ) {
    // Set additional context for audit logging
    await this.setAuditContext(session);

    const query: GetAuditLogsDto = {
      tableName,
      rowId,
    };

    return this.auditLogService.getAuditLogs(query, currentUser);
  }

  private async setAuditContext(
    session: SessionContainer,
    req?: Request,
  ): Promise<void> {
    try {
      // Set additional session variables for audit logging
      const sessionId = session.getHandle();
      const ipAddress = req?.ip || req?.connection?.remoteAddress;
      const userAgent = req?.get('User-Agent');

      // These would be set in the database session for audit triggers
      // The RLS context middleware already sets user_id, tenant_id, user_role
      if (sessionId) {
        // Set session ID for audit context
        // This would be implemented in a database context service
      }

      if (ipAddress) {
        // Set IP address for audit context
        // This would be implemented in a database context service
      }

      if (userAgent) {
        // Set user agent for audit context
        // This would be implemented in a database context service
      }
    } catch (error) {
      // Log error but don't fail the request
      console.warn('Failed to set audit context:', error.message);
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object')
          return JSON.stringify(value).replace(/"/g, '""');
        return String(value).replace(/"/g, '""');
      });
      csvRows.push(values.map((value) => `"${value}"`).join(','));
    }

    return csvRows.join('\n');
  }
}
