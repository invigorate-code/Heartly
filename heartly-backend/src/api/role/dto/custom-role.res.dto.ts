import { ApiProperty } from '@nestjs/swagger';

export class CustomRoleResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the custom role',
    example: 'uuid-here',
  })
  id!: string;

  @ApiProperty({
    description: 'Role name',
    example: 'nurse_supervisor',
  })
  name!: string;

  @ApiProperty({
    description: 'Human-readable display name',
    example: 'Nurse Supervisor',
  })
  displayName!: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Supervises nursing staff and manages care plans',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Array of permissions',
    example: ['users:read', 'clients:read', 'clients:write'],
    isArray: true,
    type: String,
  })
  permissions!: string[];

  @ApiProperty({
    description: 'Whether this is a system role',
    example: false,
  })
  isSystem!: boolean;

  @ApiProperty({
    description: 'Whether this role is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Tenant ID',
    example: 'uuid-here',
  })
  tenantId!: string;

  @ApiProperty({
    description: 'User ID who created this role',
    example: 'uuid-here',
    nullable: true,
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt!: Date;
}

export class AvailablePermissionsResponseDto {
  @ApiProperty({
    description: 'List of all available permissions in the system',
    example: [
      'users:read',
      'users:write',
      'users:delete',
      'clients:read',
      'clients:write',
      'facilities:read',
    ],
    isArray: true,
    type: String,
  })
  permissions!: string[];
}

export class RoleAssignmentDto {
  @ApiProperty({
    description: 'User ID to assign the role to',
    example: 'uuid-here',
  })
  userId!: string;

  @ApiProperty({
    description: 'Role name to assign',
    example: 'nurse_supervisor',
  })
  roleName!: string;
}