import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { PasswordResetMethod } from '../entities/password-reset-audit.entity';

export class OwnerPasswordResetRequestDto {
  @ApiProperty({
    description: 'Email address for password reset',
    example: 'owner@facility.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class OwnerPasswordResetConfirmDto {
  @ApiProperty({
    description: 'Password reset token from email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    description: 'New password (minimum 8 characters)',
    example: 'newSecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

export class AdminPasswordResetDto {
  @ApiProperty({
    description: 'User ID whose password will be reset',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  targetUserId!: string;

  @ApiPropertyOptional({
    description: 'Optional reason for password reset',
    example: 'User forgot password and requested reset',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Send temporary password via email (default: true)',
    example: true,
  })
  @IsOptional()
  sendEmail?: boolean = true;
}

export class TempPasswordChangeDto {
  @ApiProperty({
    description: 'Temporary password token',
    example: 'temp_abc123def456',
  })
  @IsString()
  @IsNotEmpty()
  tempPasswordToken!: string;

  @ApiProperty({
    description: 'New password (minimum 8 characters)',
    example: 'newSecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

export class PasswordResetAuditResponseDto {
  @ApiProperty({ description: 'Audit record ID' })
  id!: string;

  @ApiProperty({ description: 'User who performed the reset' })
  resetByUserId!: string;

  @ApiProperty({ description: 'User whose password was reset' })
  targetUserId!: string;

  @ApiProperty({
    description: 'Method used for password reset',
    enum: PasswordResetMethod,
  })
  resetMethod!: PasswordResetMethod;

  @ApiProperty({ description: 'Whether the reset was successful' })
  success!: boolean;

  @ApiPropertyOptional({ description: 'Error message if reset failed' })
  errorMessage?: string;

  @ApiProperty({ description: 'When the reset was performed' })
  createdAt!: Date;

  @ApiPropertyOptional({ description: 'When temporary password expires' })
  expiresAt?: Date;

  @ApiPropertyOptional({ description: 'When temporary password was used' })
  usedAt?: Date;
}

export class GenerateTempPasswordResponseDto {
  @ApiProperty({
    description: 'Generated temporary password',
    example: 'TempPass123!',
  })
  tempPassword!: string;

  @ApiProperty({
    description: 'Temporary password token for validation',
    example: 'temp_abc123def456',
  })
  tempPasswordToken!: string;

  @ApiProperty({
    description: 'Expiration time for temporary password',
    example: '2024-01-01T12:00:00.000Z',
  })
  expiresAt!: Date;

  @ApiProperty({
    description: 'Audit record ID for tracking',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  auditId!: string;
}
