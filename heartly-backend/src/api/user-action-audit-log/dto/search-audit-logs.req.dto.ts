import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryUserActionAuditLogDto } from './query-user-action-audit-log.dto';

/**
 * DTO for searching audit logs with enhanced filtering capabilities
 */
export class SearchAuditLogsDto extends QueryUserActionAuditLogDto {
  @ApiProperty({
    description: 'Filter logs by user ID who performed the action',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Filter logs by client ID the action was performed on',
    required: false,
  })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiProperty({
    description: 'Filter logs by target user ID the action was performed for',
    required: false,
  })
  @IsString()
  @IsOptional()
  targetUserId?: string;

  @ApiProperty({
    description: 'Filter logs by facility ID the action was performed for',
    required: false,
  })
  @IsString()
  @IsOptional()
  targetFacilityId?: string;
}
