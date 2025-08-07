import { Test, TestingModule } from '@nestjs/testing';
import { SuperTokensRolesService } from './roles.service';
import UserRoles from 'supertokens-node/recipe/userroles';
import { UserRole } from '../../api/user/entities/user.entity';
import { Logger } from '@nestjs/common';

jest.mock('supertokens-node/recipe/userroles');

describe('SuperTokensRolesService', () => {
  let service: SuperTokensRolesService;
  let mockLogger: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperTokensRolesService],
    }).compile();

    service = module.get<SuperTokensRolesService>(SuperTokensRolesService);
    
    // Mock logger
    mockLogger = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeRoles', () => {
    it('should initialize all roles with correct permissions', async () => {
      (UserRoles.createNewRoleOrAddPermissions as jest.Mock).mockResolvedValue({});

      await service.initializeRoles();

      // Check OWNER role
      expect(UserRoles.createNewRoleOrAddPermissions).toHaveBeenCalledWith(
        UserRole.OWNER,
        expect.arrayContaining([
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
        ]),
      );

      // Check ADMIN role
      expect(UserRoles.createNewRoleOrAddPermissions).toHaveBeenCalledWith(
        UserRole.ADMIN,
        expect.arrayContaining([
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
        ]),
      );

      // Check STAFF role
      expect(UserRoles.createNewRoleOrAddPermissions).toHaveBeenCalledWith(
        UserRole.STAFF,
        expect.arrayContaining([
          'users:read',
          'facilities:read',
          'clients:read',
          'clients:write',
          'audit:read',
        ]),
      );

      expect(mockLogger).toHaveBeenCalledWith('SuperTokens system roles initialized successfully');
    });

    it('should throw error when role initialization fails', async () => {
      const error = new Error('SuperTokens error');
      (UserRoles.createNewRoleOrAddPermissions as jest.Mock).mockRejectedValue(error);

      await expect(service.initializeRoles()).rejects.toThrow(error);
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Failed to initialize SuperTokens system roles',
        error,
      );
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign role to user successfully', async () => {
      (UserRoles.addRoleToUser as jest.Mock).mockResolvedValue({});

      await service.assignRoleToUser('user-id', UserRole.ADMIN, 'tenant-id');

      expect(UserRoles.addRoleToUser).toHaveBeenCalledWith(
        'tenant-id',
        'user-id',
        UserRole.ADMIN,
      );
      expect(mockLogger).toHaveBeenCalledWith('Assigned role ADMIN to user user-id');
    });

    it('should handle errors when assigning role', async () => {
      const error = new Error('Assignment failed');
      (UserRoles.addRoleToUser as jest.Mock).mockRejectedValue(error);

      await expect(
        service.assignRoleToUser('user-id', UserRole.ADMIN, 'tenant-id'),
      ).rejects.toThrow(error);
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Failed to assign role ADMIN to user user-id',
        error,
      );
    });
  });

  describe('removeRoleFromUser', () => {
    it('should remove role from user successfully', async () => {
      (UserRoles.removeUserRole as jest.Mock).mockResolvedValue({});

      await service.removeRoleFromUser('user-id', UserRole.STAFF, 'tenant-id');

      expect(UserRoles.removeUserRole).toHaveBeenCalledWith(
        'tenant-id',
        'user-id',
        UserRole.STAFF,
      );
      expect(mockLogger).toHaveBeenCalledWith('Removed role STAFF from user user-id');
    });
  });

  describe('getUserRoles', () => {
    it('should return user roles', async () => {
      const mockRoles = [UserRole.ADMIN, UserRole.STAFF];
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: mockRoles,
      });

      const result = await service.getUserRoles('user-id', 'tenant-id');

      expect(result).toEqual(mockRoles);
      expect(UserRoles.getRolesForUser).toHaveBeenCalledWith('tenant-id', 'user-id');
    });

    it('should handle errors when getting roles', async () => {
      const error = new Error('Failed to get roles');
      (UserRoles.getRolesForUser as jest.Mock).mockRejectedValue(error);

      await expect(service.getUserRoles('user-id', 'tenant-id')).rejects.toThrow(error);
    });
  });

  describe('getUserPermissions', () => {
    it('should return user permissions', async () => {
      const mockPermissions = ['users:read', 'users:write', 'clients:read'];
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: ['ADMIN']
      });
      (UserRoles.getPermissionsForRole as jest.Mock).mockResolvedValue({
        status: 'OK',
        permissions: mockPermissions,
      });

      const result = await service.getUserPermissions('user-id', 'tenant-id');

      expect(result).toEqual(mockPermissions);
      expect(UserRoles.getRolesForUser).toHaveBeenCalledWith('tenant-id', 'user-id');
    });
  });

  describe('userHasRole', () => {
    it('should return true when user has role', async () => {
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: [UserRole.ADMIN, UserRole.STAFF],
      });

      const result = await service.userHasRole('user-id', UserRole.ADMIN, 'tenant-id');

      expect(result).toBe(true);
    });

    it('should return false when user lacks role', async () => {
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: [UserRole.STAFF],
      });

      const result = await service.userHasRole('user-id', UserRole.OWNER, 'tenant-id');

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      (UserRoles.getRolesForUser as jest.Mock).mockRejectedValue(new Error('Error'));

      const result = await service.userHasRole('user-id', UserRole.ADMIN, 'tenant-id');

      expect(result).toBe(false);
      expect(Logger.prototype.error).toHaveBeenCalled();
    });
  });

  describe('userHasPermission', () => {
    it('should return true when user has permission', async () => {
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: ['ADMIN']
      });
      (UserRoles.getPermissionsForRole as jest.Mock).mockResolvedValue({
        status: 'OK',
        permissions: ['users:read', 'users:write'],
      });

      const result = await service.userHasPermission('user-id', 'users:read', 'tenant-id');

      expect(result).toBe(true);
    });

    it('should return false when user lacks permission', async () => {
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: ['STAFF']
      });
      (UserRoles.getPermissionsForRole as jest.Mock).mockResolvedValue({
        status: 'OK',
        permissions: ['users:read'],
      });

      const result = await service.userHasPermission('user-id', 'users:delete', 'tenant-id');

      expect(result).toBe(false);
    });
  });

  describe('syncUserRole', () => {
    it('should sync user role by removing old roles and adding new one', async () => {
      (UserRoles.getRolesForUser as jest.Mock).mockResolvedValue({
        roles: [UserRole.STAFF, UserRole.ADMIN],
      });
      (UserRoles.removeUserRole as jest.Mock).mockResolvedValue({});
      (UserRoles.addRoleToUser as jest.Mock).mockResolvedValue({});

      await service.syncUserRole('user-id', UserRole.OWNER, 'tenant-id');

      // Should remove existing roles
      expect(UserRoles.removeUserRole).toHaveBeenCalledWith('tenant-id', 'user-id', UserRole.STAFF);
      expect(UserRoles.removeUserRole).toHaveBeenCalledWith('tenant-id', 'user-id', UserRole.ADMIN);
      
      // Should add new role
      expect(UserRoles.addRoleToUser).toHaveBeenCalledWith('tenant-id', 'user-id', UserRole.OWNER);
      
      expect(mockLogger).toHaveBeenCalledWith('Synced role OWNER for user user-id');
    });

    it('should handle errors during sync', async () => {
      const error = new Error('Sync failed');
      (UserRoles.getRolesForUser as jest.Mock).mockRejectedValue(error);

      await expect(
        service.syncUserRole('user-id', UserRole.OWNER, 'tenant-id'),
      ).rejects.toThrow(error);
    });
  });
});