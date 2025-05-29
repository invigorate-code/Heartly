import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryUserActionAuditLogDto {
  @ApiPropertyOptional({ description: 'Filter by action (e.g., READ_PHI)' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ description: 'Keyword to search within JSON details' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'Unique identifier for the target tenant',
    example: '11e9df6b-391c-4f74-8846-77c5083bee0f',
  })
  @IsString()
  targetTenantId: string;
}
