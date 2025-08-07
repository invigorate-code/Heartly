import { Injectable, Logger } from '@nestjs/common';
import UserRoles from 'supertokens-node/recipe/userroles';
import { UserRole } from '../../api/user/entities/user.entity';

export interface CustomRole {
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  tenantId: string;
  isSystem: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermissions {
  [roleName: string]: string[];
}

@Injectable()
export class SuperTokensRolesService {
  private readonly logger = new Logger(SuperTokensRolesService.name);

  // System roles that exist for all tenants
  private readonly SYSTEM_ROLES = [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF];

  // Default permissions for system roles
  private readonly DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
    [UserRole.OWNER]: [
      'users:read',
      'users:write', 
      'users:delete',
      'users:invite',
      'facilities:read',
      'facilities:write',
      'facilities:delete',
      'clients:read',
      'clients:write',
      'clients:delete',
      'audit:read',
      'audit:export',
      'tenant:manage',
      'roles:manage',
      'roles:create',
      'roles:delete',
    ],
    [UserRole.ADMIN]: [
      'users:read',
      'users:write',
      'users:invite',
      'facilities:read',
      'facilities:write',
      'clients:read',
      'clients:write',
      'clients:delete',
      'audit:read',
      'audit:export',
      'roles:read',
    ],
    [UserRole.STAFF]: [
      'users:read',
      'facilities:read',
      'clients:read',
      'clients:write',
      'audit:read',
    ],
  };

  /**
   * Initialize SuperTokens system roles and permissions
   * This should be called during application startup
   */
  async initializeSystemRoles(): Promise<void> {
    try {
      // Initialize all system roles with their default permissions
      for (const role of this.SYSTEM_ROLES) {
        const permissions = this.DEFAULT_ROLE_PERMISSIONS[role];
        await UserRoles.createNewRoleOrAddPermissions(role, permissions);
      }

      this.logger.log('SuperTokens system roles initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize SuperTokens system roles', error);
      throw error;
    }
  }

  /**
   * Initialize roles - backwards compatibility
   */
  async initializeRoles(): Promise<void> {
    return this.initializeSystemRoles();
  }

  /**
   * Assign a role to a user
   */
  async assignRoleToUser(
    userId: string,
    role: UserRole,
    tenantId?: string,
  ): Promise<void> {
    try {
      await UserRoles.addRoleToUser(tenantId, userId, role);
      this.logger.log(`Assigned role ${role} to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to assign role ${role} to user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Remove a role from a user
   */
  async removeRoleFromUser(
    userId: string,
    role: UserRole,
    tenantId?: string,
  ): Promise<void> {
    try {
      await UserRoles.removeUserRole(tenantId, userId, role);
      this.logger.log(`Removed role ${role} from user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to remove role ${role} from user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Get all roles for a user
   */
  async getUserRoles(userId: string, tenantId?: string): Promise<string[]> {
    try {
      const rolesResponse = await UserRoles.getRolesForUser(tenantId, userId);
      return rolesResponse.roles;
    } catch (error) {
      this.logger.error(`Failed to get roles for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Get all permissions for a user
   */
  async getUserPermissions(
    userId: string,
    tenantId?: string,
  ): Promise<string[]> {
    try {
      // Get user roles first, then get permissions for each role
      const { roles } = await UserRoles.getRolesForUser(tenantId, userId);
      const allPermissions: string[] = [];
      
      for (const role of roles) {
        const rolePermissions = await UserRoles.getPermissionsForRole(role);
        if (rolePermissions.status === 'OK') {
          allPermissions.push(...rolePermissions.permissions);
        }
      }
      
      // Remove duplicates and return
      return [...new Set(allPermissions)];
    } catch (error) {
      this.logger.error(`Failed to get permissions for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Check if user has a specific role
   */
  async userHasRole(
    userId: string,
    role: UserRole,
    tenantId?: string,
  ): Promise<boolean> {
    try {
      const roles = await this.getUserRoles(userId, tenantId);
      return roles.includes(role);
    } catch (error) {
      this.logger.error(`Failed to check role ${role} for user ${userId}`, error);
      return false;
    }
  }

  /**
   * Check if user has a specific permission
   */
  async userHasPermission(
    userId: string,
    permission: string,
    tenantId?: string,
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId, tenantId);
      return permissions.includes(permission);
    } catch (error) {
      this.logger.error(
        `Failed to check permission ${permission} for user ${userId}`,
        error,
      );
      return false;
    }
  }

  /**
   * Sync database role with SuperTokens role
   */
  async syncUserRole(
    userId: string,
    databaseRole: UserRole,
    tenantId?: string,
  ): Promise<void> {
    try {
      // Get current SuperTokens roles
      const currentRoles = await this.getUserRoles(userId, tenantId);

      // Remove all existing roles
      for (const role of currentRoles) {
        await this.removeRoleFromUser(userId, role as UserRole, tenantId);
      }

      // Assign the database role
      await this.assignRoleToUser(userId, databaseRole, tenantId);

      this.logger.log(`Synced role ${databaseRole} for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to sync role for user ${userId}`, error);
      throw error;
    }
  }

  // ==========================================
  // CUSTOM ROLES MANAGEMENT
  // ==========================================

  /**
   * Create a custom role for a tenant
   */
  async createCustomRole(
    roleName: string,
    permissions: string[],
    tenantId: string,
  ): Promise<void> {
    try {
      // Create the role in SuperTokens with tenant-specific naming
      const fullRoleName = this.getTenantSpecificRoleName(roleName, tenantId);
      await UserRoles.createNewRoleOrAddPermissions(fullRoleName, permissions);
      
      this.logger.log(`Created custom role ${fullRoleName} with ${permissions.length} permissions`);
    } catch (error) {
      this.logger.error(`Failed to create custom role ${roleName} for tenant ${tenantId}`, error);
      throw error;
    }
  }

  /**
   * Delete a custom role (system roles cannot be deleted)
   */
  async deleteCustomRole(
    roleName: string,
    tenantId: string,
  ): Promise<void> {
    try {
      // Prevent deletion of system roles
      if (this.SYSTEM_ROLES.includes(roleName as UserRole)) {
        throw new Error(`Cannot delete system role: ${roleName}`);
      }

      const fullRoleName = this.getTenantSpecificRoleName(roleName, tenantId);
      await UserRoles.deleteRole(fullRoleName);
      
      this.logger.log(`Deleted custom role ${fullRoleName}`);
    } catch (error) {
      this.logger.error(`Failed to delete custom role ${roleName} for tenant ${tenantId}`, error);
      throw error;
    }
  }

  /**
   * Update permissions for a custom role
   */
  async updateCustomRolePermissions(
    roleName: string,
    permissions: string[],
    tenantId: string,
  ): Promise<void> {
    try {
      // Prevent modification of system roles
      if (this.SYSTEM_ROLES.includes(roleName as UserRole)) {
        throw new Error(`Cannot modify system role: ${roleName}`);
      }

      const fullRoleName = this.getTenantSpecificRoleName(roleName, tenantId);
      
      // Get current permissions and remove them
      const permissionsResponse = await UserRoles.getPermissionsForRole(fullRoleName);
      if (permissionsResponse.status === 'OK') {
        const currentPermissions = permissionsResponse.permissions;
        for (const permission of currentPermissions) {
          await UserRoles.removePermissionsFromRole(fullRoleName, [permission]);
        }
      }
      
      // Add new permissions
      await UserRoles.createNewRoleOrAddPermissions(fullRoleName, permissions);
      
      this.logger.log(`Updated custom role ${fullRoleName} permissions`);
    } catch (error) {
      this.logger.error(`Failed to update custom role ${roleName} for tenant ${tenantId}`, error);
      throw error;
    }
  }

  /**
   * Get all available roles for a tenant (system + custom)
   */
  async getTenantRoles(tenantId: string): Promise<string[]> {
    try {
      // Get all roles from SuperTokens
      const { roles } = await UserRoles.getAllRoles();
      
      // Filter to get tenant-specific roles and system roles
      const tenantPrefix = `${tenantId}_`;
      const tenantRoles = roles.filter(role => 
        this.SYSTEM_ROLES.includes(role as UserRole) || 
        role.startsWith(tenantPrefix)
      );

      return tenantRoles;
    } catch (error) {
      this.logger.error(`Failed to get tenant roles for ${tenantId}`, error);
      throw error;
    }
  }

  /**
   * Check if a role is a system role
   */
  isSystemRole(roleName: string): boolean {
    return this.SYSTEM_ROLES.includes(roleName as UserRole);
  }

  /**
   * Get permissions for a role (system or custom)
   */
  async getRolePermissions(
    roleName: string,
    tenantId?: string,
  ): Promise<string[]> {
    try {
      // If it's a system role, return default permissions
      if (this.isSystemRole(roleName)) {
        return this.DEFAULT_ROLE_PERMISSIONS[roleName] || [];
      }

      // For custom roles, get from SuperTokens
      if (!tenantId) {
        throw new Error('Tenant ID required for custom roles');
      }

      const fullRoleName = this.getTenantSpecificRoleName(roleName, tenantId);
      const permissionsResponse = await UserRoles.getPermissionsForRole(fullRoleName);
      if (permissionsResponse.status === 'OK') {
        return permissionsResponse.permissions;
      }
      return [];
    } catch (error) {
      this.logger.error(`Failed to get permissions for role ${roleName}`, error);
      throw error;
    }
  }

  /**
   * Assign custom role to user
   */
  async assignCustomRoleToUser(
    userId: string,
    roleName: string,
    tenantId: string,
  ): Promise<void> {
    const fullRoleName = this.getTenantSpecificRoleName(roleName, tenantId);
    await this.assignRoleToUser(userId, fullRoleName as UserRole, tenantId);
  }

  /**
   * Remove custom role from user
   */
  async removeCustomRoleFromUser(
    userId: string,
    roleName: string,
    tenantId: string,
  ): Promise<void> {
    const fullRoleName = this.getTenantSpecificRoleName(roleName, tenantId);
    await this.removeRoleFromUser(userId, fullRoleName as UserRole, tenantId);
  }

  /**
   * Get all available permissions in the system
   */
  getAllAvailablePermissions(): string[] {
    const allPermissions = new Set<string>();
    
    // Add all permissions from system roles
    Object.values(this.DEFAULT_ROLE_PERMISSIONS).forEach(permissions => {
      permissions.forEach(permission => allPermissions.add(permission));
    });

    return Array.from(allPermissions).sort();
  }

  // ==========================================
  // PRIVATE HELPER METHODS
  // ==========================================

  /**
   * Generate tenant-specific role name for custom roles
   */
  private getTenantSpecificRoleName(roleName: string, tenantId: string): string {
    // System roles don't need tenant prefix
    if (this.isSystemRole(roleName)) {
      return roleName;
    }
    
    return `${tenantId}_${roleName}`;
  }

  /**
   * Extract role name from tenant-specific role name
   */
  private extractRoleName(fullRoleName: string, tenantId: string): string {
    const prefix = `${tenantId}_`;
    if (fullRoleName.startsWith(prefix)) {
      return fullRoleName.substring(prefix.length);
    }
    return fullRoleName;
  }
}