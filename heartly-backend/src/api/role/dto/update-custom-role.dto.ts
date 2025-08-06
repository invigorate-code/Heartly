import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, Length, ArrayUnique } from 'class-validator';

export class UpdateCustomRoleDto {
  @ApiProperty({
    description: 'Human-readable display name for the role',
    example: 'Senior Nurse Supervisor',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  displayName?: string;

  @ApiProperty({
    description: 'Optional description of the role',
    example: 'Supervises nursing staff and manages care plans',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Array of permissions for this role',
    example: ['users:read', 'clients:read', 'clients:write', 'facilities:read'],
    isArray: true,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  permissions?: string[];
}