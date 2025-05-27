import { ApiPropertyOptional } from '@nestjs/swagger';
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
}
