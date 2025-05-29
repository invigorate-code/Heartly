// dto/create-audit-log.dto.ts
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateUserActionAuditLogDto {
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

  @IsNotEmpty()
  @IsString()
  targetFacilityId: string;

  @IsNotEmpty()
  @IsString()
  targetTenantId?: string;
}
