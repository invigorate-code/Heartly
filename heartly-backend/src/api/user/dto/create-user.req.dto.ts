import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from '@/common/types/common.type';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { IsPersonName, IsPhoneNumber } from '../../../common/validators/business-rules.validator';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsPersonName()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Smith',
  })
  @IsNotEmpty()
  @IsPersonName()
  lastName: string;

  @ApiProperty({
    description: 'Unique username for the user within the tenant',
    example: 'john.smith',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User role within the facility',
    enum: UserRole,
    example: UserRole.STAFF,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'ID of the tenant this user belongs to',
    example: '11e9df6b-391c-4f74-8846-77c5083bee0f',
  })
  @IsNotEmpty()
  @IsUUID()
  tenantId: Uuid;

  @ApiProperty({
    description: 'ID of the primary facility this user is assigned to',
    example: 'f45sh223-1234-5678-9abc-def012345678',
  })
  @IsNotEmpty()
  @IsUUID()
  facilityId: Uuid;

  @ApiProperty({
    description: 'User email address (unique within tenant)',
    example: 'john.smith@facility.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User phone number in international format',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: 'Company or organization name',
    example: 'Sunshine Care Center',
    required: false,
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus = UserStatus.ACTIVE;
}
