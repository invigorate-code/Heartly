// dto/create-audit-log.dto.ts
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateSystemAuditLogDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  action: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  targetUserId?: string;

  @IsOptional()
  @IsString()
  targetFacilityId?: string;

  @IsOptional()
  @IsString()
  targetTenantId?: string;
}
