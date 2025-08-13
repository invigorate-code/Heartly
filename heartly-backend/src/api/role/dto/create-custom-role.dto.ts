import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCustomRoleDto {
  @ApiProperty({
    description: 'Role name (must be unique within tenant)',
    example: 'nurse_supervisor',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @Length(2, 50)
  name!: string;

  @ApiProperty({
    description: 'Human-readable display name for the role',
    example: 'Nurse Supervisor',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  displayName!: string;

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
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  permissions!: string[];
}
