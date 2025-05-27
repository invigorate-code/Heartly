import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UserActionAuditLogResDto {
  @ApiProperty({ description: 'Unique identifier of the audit log entry' })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({ description: 'ID of the user who performed the action' })
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'ID of the client the action was performed on',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  clientId?: string;

  @ApiProperty({
    description: 'ID of the target user the action was performed for',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  targetUserId?: string;

  @ApiProperty({
    description: 'ID of the facility the action was performed for',
  })
  @IsString()
  @Expose()
  targetFacilityId: string;

  @ApiProperty({ description: 'ID of the tenant the action was performed for' })
  @IsString()
  @Expose()
  targetTenantId: string;

  @ApiProperty({ description: 'The type of action performed' })
  @IsString()
  @Expose()
  action: string;

  @ApiProperty({
    description: 'Additional details about the action in JSON format',
    required: false,
    type: Object,
    additionalProperties: true,
  })
  @IsOptional()
  @Expose()
  details: Record<string, any>;

  @ApiProperty({ description: 'Timestamp when the action was recorded' })
  @IsDate()
  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value : new Date(value)))
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the audit log was last updated' })
  @IsDate()
  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value : new Date(value)))
  updatedAt: Date;
}
