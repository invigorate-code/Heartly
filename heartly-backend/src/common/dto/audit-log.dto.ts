import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class GetAuditLogsDto {
  @ApiPropertyOptional({ description: 'Start date for filtering logs' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering logs' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Table name to filter by' })
  @IsOptional()
  @IsString()
  tableName?: string;

  @ApiPropertyOptional({ description: 'Row ID to filter by' })
  @IsOptional()
  @IsUUID()
  rowId?: string;

  @ApiPropertyOptional({ description: 'User ID to filter by' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Facility ID to filter by' })
  @IsOptional()
  @IsUUID()
  facilityId?: string;

  @ApiPropertyOptional({
    description: 'Operation type to filter by',
    enum: ['INSERT', 'UPDATE', 'DELETE'],
  })
  @IsOptional()
  @IsEnum(['INSERT', 'UPDATE', 'DELETE'])
  operation?: 'INSERT' | 'UPDATE' | 'DELETE';

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 50 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 50;
}

export class ExportAuditLogsDto {
  @ApiProperty({ description: 'Start date for export' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date for export' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ description: 'Table name to filter by' })
  @IsOptional()
  @IsString()
  tableName?: string;

  @ApiPropertyOptional({
    description: 'Export format',
    enum: ['json', 'csv'],
    default: 'json',
  })
  @IsOptional()
  @IsEnum(['json', 'csv'])
  format?: 'json' | 'csv' = 'json';
}

export class AuditLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tableName: string;

  @ApiProperty({ enum: ['INSERT', 'UPDATE', 'DELETE'] })
  operation: 'INSERT' | 'UPDATE' | 'DELETE';

  @ApiProperty()
  rowId: string;

  @ApiPropertyOptional()
  userId?: string;

  @ApiPropertyOptional()
  userEmail?: string;

  @ApiPropertyOptional()
  tenantId?: string;

  @ApiPropertyOptional()
  facilityId?: string;

  @ApiPropertyOptional()
  facilityName?: string;

  @ApiProperty()
  timestamp: Date;

  @ApiPropertyOptional()
  oldValues?: Record<string, any>;

  @ApiPropertyOptional()
  newValues?: Record<string, any>;

  @ApiPropertyOptional()
  changedFields?: string[];

  @ApiPropertyOptional()
  sessionId?: string;

  @ApiPropertyOptional()
  ipAddress?: string;

  @ApiPropertyOptional()
  userAgent?: string;
}

export class AuditLogSummaryDto {
  @ApiProperty()
  totalLogs: number;

  @ApiProperty()
  dateRange: {
    start: Date;
    end: Date;
  };

  @ApiProperty()
  operationCounts: {
    INSERT: number;
    UPDATE: number;
    DELETE: number;
  };

  @ApiProperty()
  tableCounts: Record<string, number>;

  @ApiProperty()
  userCounts: Record<string, number>;
}
