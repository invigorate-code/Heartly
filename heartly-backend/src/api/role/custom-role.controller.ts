import { Roles } from '@/decorators/roles.decorator';
import { SuperTokensRolesGuard } from '@/guards/supertokens-roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserRole } from '../user/entities/user.entity';
import { CustomRoleService } from './custom-role.service';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import {
  AvailablePermissionsResponseDto,
  CustomRoleResponseDto,
} from './dto/custom-role.res.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';

@ApiTags('Custom Roles')
@ApiBearerAuth()
@Controller('custom-roles')
@UseGuards(SuperTokensAuthGuard)
export class CustomRoleController {
  constructor(private readonly customRoleService: CustomRoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new custom role' })
  @ApiResponse({
    status: 201,
    description: 'Custom role created successfully',
    type: CustomRoleResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - role name already exists',
  })
  @UseGuards(SuperTokensRolesGuard)
  @VerifySession()
  @Roles(UserRole.OWNER) // Only owners can create custom roles
  async createCustomRole(
    @Body() createRoleDto: CreateCustomRoleDto,
    @Session() session: SessionContainer,
  ): Promise<CustomRoleResponseDto> {
    // Check email verification
    const payload = session.getAccessTokenPayload();
    const isEmailVerified = payload['st-ev']?.v || false;

    if (!isEmailVerified) {
      throw new UnauthorizedException(
        'Email verification required for role management',
      );
    }

    const tenantId = payload.tenantId;
    const userId = session.getUserId();

    const role = await this.customRoleService.createCustomRole(
      createRoleDto,
      tenantId,
      userId,
    );

    return role;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all roles for the current tenant (system + custom)',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        systemRoles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              displayName: { type: 'string' },
              isSystem: { type: 'boolean' },
              permissions: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        customRoles: {
          type: 'array',
          items: { $ref: '#/components/schemas/CustomRoleResponseDto' },
        },
      },
    },
  })
  @UseGuards(SuperTokensRolesGuard)
  @VerifySession()
  @Roles(UserRole.OWNER, UserRole.ADMIN) // Owners and admins can view roles
  async getAllTenantRoles(@Session() session: SessionContainer) {
    const payload = session.getAccessTokenPayload();
    const tenantId = payload.tenantId;

    return this.customRoleService.getAllTenantRoles(tenantId);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all available permissions in the system' })
  @ApiResponse({
    status: 200,
    description: 'Available permissions retrieved successfully',
    type: AvailablePermissionsResponseDto,
  })
  @UseGuards(SuperTokensRolesGuard)
  @VerifySession()
  @Roles(UserRole.OWNER, UserRole.ADMIN) // Owners and admins can view permissions
  async getAvailablePermissions(): Promise<AvailablePermissionsResponseDto> {
    const permissions = this.customRoleService.getAllAvailablePermissions();
    return { permissions };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific custom role' })
  @ApiResponse({
    status: 200,
    description: 'Custom role retrieved successfully',
    type: CustomRoleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Custom role not found' })
  @UseGuards(SuperTokensRolesGuard)
  @VerifySession()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async getCustomRole(
    @Param('id') id: string,
    @Session() session: SessionContainer,
  ): Promise<CustomRoleResponseDto> {
    const payload = session.getAccessTokenPayload();
    const tenantId = payload.tenantId;

    return this.customRoleService.getCustomRole(id, tenantId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a custom role' })
  @ApiResponse({
    status: 200,
    description: 'Custom role updated successfully',
    type: CustomRoleResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot update system roles',
  })
  @ApiResponse({ status: 404, description: 'Custom role not found' })
  @UseGuards(SuperTokensRolesGuard)
  @VerifySession()
  @Roles(UserRole.OWNER) // Only owners can update custom roles
  async updateCustomRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateCustomRoleDto,
    @Session() session: SessionContainer,
  ): Promise<CustomRoleResponseDto> {
    // Check email verification
    const payload = session.getAccessTokenPayload();
    const isEmailVerified = payload['st-ev']?.v || false;

    if (!isEmailVerified) {
      throw new UnauthorizedException(
        'Email verification required for role management',
      );
    }

    const tenantId = payload.tenantId;
    const userId = session.getUserId();

    return this.customRoleService.updateCustomRole(
      id,
      updateRoleDto,
      tenantId,
      userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a custom role' })
  @ApiResponse({ status: 200, description: 'Custom role deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - cannot delete system roles',
  })
  @ApiResponse({ status: 404, description: 'Custom role not found' })
  @UseGuards(SuperTokensRolesGuard)
  @VerifySession()
  @Roles(UserRole.OWNER) // Only owners can delete custom roles
  async deleteCustomRole(
    @Param('id') id: string,
    @Session() session: SessionContainer,
  ): Promise<{ message: string }> {
    // Check email verification
    const payload = session.getAccessTokenPayload();
    const isEmailVerified = payload['st-ev']?.v || false;

    if (!isEmailVerified) {
      throw new UnauthorizedException(
        'Email verification required for role management',
      );
    }

    const tenantId = payload.tenantId;

    await this.customRoleService.deleteCustomRole(id, tenantId);
    return { message: 'Custom role deleted successfully' };
  }

  @Post(':roleName/assign')
  @ApiOperation({ summary: 'Assign a custom role to a user' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 404, description: 'Role or user not found' })
  @UseGuards(SuperTokensRolesGuard)
  @VerifySession()
  @Roles(UserRole.OWNER, UserRole.ADMIN) // Owners and admins can assign roles
  async assignRoleToUser(
    @Param('roleName') roleName: string,
    @Body() assignmentDto: { userId: string },
    @Session() session: SessionContainer,
  ): Promise<{ message: string }> {
    const payload = session.getAccessTokenPayload();
    const tenantId = payload.tenantId;

    await this.customRoleService.assignCustomRoleToUser(
      roleName,
      assignmentDto.userId,
      tenantId,
    );

    return { message: `Role '${roleName}' assigned successfully` };
  }

  @Delete(':roleName/assign/:userId')
  @ApiOperation({ summary: 'Remove a custom role from a user' })
  @ApiResponse({ status: 200, description: 'Role removed successfully' })
  @UseGuards(SuperTokensRolesGuard)
  @VerifySession()
  @Roles(UserRole.OWNER, UserRole.ADMIN) // Owners and admins can remove roles
  async removeRoleFromUser(
    @Param('roleName') roleName: string,
    @Param('userId') userId: string,
    @Session() session: SessionContainer,
  ): Promise<{ message: string }> {
    const payload = session.getAccessTokenPayload();
    const tenantId = payload.tenantId;

    await this.customRoleService.removeCustomRoleFromUser(
      roleName,
      userId,
      tenantId,
    );

    return { message: `Role '${roleName}' removed successfully` };
  }
}
