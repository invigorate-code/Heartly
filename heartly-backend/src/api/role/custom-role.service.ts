import { Injectable, Logger, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomRoleEntity } from './entities/custom-role.entity';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';
import { SuperTokensRolesService } from '../../utils/supertokens/roles.service';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class CustomRoleService {
  private readonly logger = new Logger(CustomRoleService.name);

  constructor(
    @InjectRepository(CustomRoleEntity)
    private readonly customRoleRepository: Repository<CustomRoleEntity>,
    private readonly superTokensRolesService: SuperTokensRolesService,
  ) {}

  /**
   * Create a new custom role for a tenant
   */
  async createCustomRole(
    dto: CreateCustomRoleDto,
    tenantId: string,
    createdBy: string,
  ): Promise<CustomRoleEntity> {
    try {
      // Validate that role name doesn't conflict with system roles
      if (this.superTokensRolesService.isSystemRole(dto.name)) {
        throw new ConflictException(`Role name '${dto.name}' conflicts with system role`);
      }

      // Check if role already exists for this tenant
      const existingRole = await this.customRoleRepository.findOne({
        where: { name: dto.name, tenantId },
      });

      if (existingRole) {
        throw new ConflictException(`Role '${dto.name}' already exists for this tenant`);
      }

      // Validate permissions
      const availablePermissions = this.superTokensRolesService.getAllAvailablePermissions();
      const invalidPermissions = dto.permissions.filter(
        permission => !availablePermissions.includes(permission),
      );

      if (invalidPermissions.length > 0) {
        throw new ConflictException(
          `Invalid permissions: ${invalidPermissions.join(', ')}`,
        );
      }

      // Create role in database
      const customRole = this.customRoleRepository.create({
        ...dto,
        tenantId,
        createdBy,
        updatedBy: createdBy,
      });

      const savedRole = await this.customRoleRepository.save(customRole);

      // Create role in SuperTokens
      await this.superTokensRolesService.createCustomRole(
        dto.name,
        dto.permissions,
        tenantId,
      );

      this.logger.log(`Created custom role '${dto.name}' for tenant ${tenantId}`);
      return savedRole;
    } catch (error) {
      this.logger.error(`Failed to create custom role '${dto.name}'`, error);
      throw error;
    }
  }

  /**
   * Get all custom roles for a tenant
   */
  async getCustomRoles(tenantId: string): Promise<CustomRoleEntity[]> {
    return this.customRoleRepository.find({
      where: { tenantId, isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Get all roles for a tenant (system + custom)
   */
  async getAllTenantRoles(tenantId: string): Promise<{
    systemRoles: Array<{ name: string; displayName: string; isSystem: true; permissions: string[] }>;
    customRoles: CustomRoleEntity[];
  }> {
    const customRoles = await this.getCustomRoles(tenantId);
    
    const systemRoles = [
      {
        name: UserRole.OWNER,
        displayName: 'Owner',
        isSystem: true as const,
        permissions: await this.superTokensRolesService.getRolePermissions(UserRole.OWNER),
      },
      {
        name: UserRole.ADMIN,
        displayName: 'Administrator',
        isSystem: true as const,
        permissions: await this.superTokensRolesService.getRolePermissions(UserRole.ADMIN),
      },
      {
        name: UserRole.STAFF,
        displayName: 'Staff Member',
        isSystem: true as const,
        permissions: await this.superTokensRolesService.getRolePermissions(UserRole.STAFF),
      },
    ];

    return { systemRoles, customRoles };
  }

  /**
   * Get a specific custom role
   */
  async getCustomRole(id: string, tenantId: string): Promise<CustomRoleEntity> {
    const role = await this.customRoleRepository.findOne({
      where: { id, tenantId },
    });

    if (!role) {
      throw new NotFoundException(`Custom role with ID '${id}' not found`);
    }

    return role;
  }

  /**
   * Update a custom role
   */
  async updateCustomRole(
    id: string,
    dto: UpdateCustomRoleDto,
    tenantId: string,
    updatedBy: string,
  ): Promise<CustomRoleEntity> {
    const role = await this.getCustomRole(id, tenantId);

    // Prevent updating system roles
    if (role.isSystem) {
      throw new ForbiddenException('Cannot update system roles');
    }

    // Validate permissions if provided
    if (dto.permissions) {
      const availablePermissions = this.superTokensRolesService.getAllAvailablePermissions();
      const invalidPermissions = dto.permissions.filter(
        permission => !availablePermissions.includes(permission),
      );

      if (invalidPermissions.length > 0) {
        throw new ConflictException(
          `Invalid permissions: ${invalidPermissions.join(', ')}`,
        );
      }

      // Update permissions in SuperTokens
      await this.superTokensRolesService.updateCustomRolePermissions(
        role.name,
        dto.permissions,
        tenantId,
      );
    }

    // Update role in database
    Object.assign(role, dto, { updatedBy });
    const updatedRole = await this.customRoleRepository.save(role);

    this.logger.log(`Updated custom role '${role.name}' for tenant ${tenantId}`);
    return updatedRole;
  }

  /**
   * Delete a custom role
   */
  async deleteCustomRole(id: string, tenantId: string): Promise<void> {
    const role = await this.getCustomRole(id, tenantId);

    // Prevent deleting system roles
    if (role.isSystem) {
      throw new ForbiddenException('Cannot delete system roles');
    }

    // Check if role is assigned to any users
    // TODO: Add check for role assignments when user-role assignment tracking is implemented

    // Delete from SuperTokens
    await this.superTokensRolesService.deleteCustomRole(role.name, tenantId);

    // Soft delete from database (mark as inactive)
    role.isActive = false;
    await this.customRoleRepository.save(role);

    this.logger.log(`Deleted custom role '${role.name}' for tenant ${tenantId}`);
  }

  /**
   * Assign custom role to user
   */
  async assignCustomRoleToUser(
    roleName: string,
    userId: string,
    tenantId: string,
  ): Promise<void> {
    // Verify role exists
    const role = await this.customRoleRepository.findOne({
      where: { name: roleName, tenantId, isActive: true },
    });

    if (!role) {
      throw new NotFoundException(`Custom role '${roleName}' not found`);
    }

    // Assign role in SuperTokens
    await this.superTokensRolesService.assignCustomRoleToUser(
      userId,
      roleName,
      tenantId,
    );

    this.logger.log(`Assigned custom role '${roleName}' to user ${userId}`);
  }

  /**
   * Remove custom role from user
   */
  async removeCustomRoleFromUser(
    roleName: string,
    userId: string,
    tenantId: string,
  ): Promise<void> {
    // Remove role in SuperTokens
    await this.superTokensRolesService.removeCustomRoleFromUser(
      userId,
      roleName,
      tenantId,
    );

    this.logger.log(`Removed custom role '${roleName}' from user ${userId}`);
  }

  /**
   * Get all available permissions
   */
  getAllAvailablePermissions(): string[] {
    return this.superTokensRolesService.getAllAvailablePermissions();
  }

  /**
   * Validate role permissions
   */
  validatePermissions(permissions: string[]): { valid: string[]; invalid: string[] } {
    const availablePermissions = this.getAllAvailablePermissions();
    const valid = permissions.filter(p => availablePermissions.includes(p));
    const invalid = permissions.filter(p => !availablePermissions.includes(p));
    return { valid, invalid };
  }
}