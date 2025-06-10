import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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

  @ApiPropertyOptional({
    description: 'Whether to include related entities (user, facility, etc.)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeRelations?: boolean;

  @ApiPropertyOptional({
    description: 'Page number for pagination (starts at 1)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  pageSize?: number;
}
