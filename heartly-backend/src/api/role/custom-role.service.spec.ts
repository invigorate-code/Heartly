import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CustomRoleService } from './custom-role.service';
import { CustomRoleEntity } from './entities/custom-role.entity';
import { SuperTokensRolesService } from '../../utils/supertokens/roles.service';
import { CreateCustomRoleDto } from './dto/create-custom-role.dto';
import { UpdateCustomRoleDto } from './dto/update-custom-role.dto';
import { UserRole } from '../user/entities/user.entity';

describe('CustomRoleService', () => {
  let service: CustomRoleService;
  let repository: jest.Mocked<Repository<CustomRoleEntity>>;
  let rolesService: jest.Mocked<SuperTokensRolesService>;

  const mockTenantId = 'test-tenant-id';
  const mockUserId = 'test-user-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomRoleService,
        {
          provide: getRepositoryToken(CustomRoleEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: SuperTokensRolesService,
          useValue: {
            isSystemRole: jest.fn(),
            getAllAvailablePermissions: jest.fn(),
            createCustomRole: jest.fn(),
            updateCustomRolePermissions: jest.fn(),
            deleteCustomRole: jest.fn(),
            assignCustomRoleToUser: jest.fn(),
            removeCustomRoleFromUser: jest.fn(),
            getRolePermissions: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomRoleService>(CustomRoleService);
    repository = module.get(getRepositoryToken(CustomRoleEntity));
    rolesService = module.get(SuperTokensRolesService);
  });

  describe('createCustomRole', () => {
    const createDto: CreateCustomRoleDto = {
      name: 'test_role',
      displayName: 'Test Role',
      description: 'A test role',
      permissions: ['users:read', 'clients:read'],
    };

    it('should create a custom role successfully', async () => {
      // Setup
      rolesService.isSystemRole.mockReturnValue(false);
      rolesService.getAllAvailablePermissions.mockReturnValue([
        'users:read', 'clients:read', 'users:write'
      ]);
      repository.findOne.mockResolvedValue(null); // Role doesn't exist
      
      const savedRole = { id: 'role-id', ...createDto, tenantId: mockTenantId } as CustomRoleEntity;
      repository.create.mockReturnValue(savedRole);
      repository.save.mockResolvedValue(savedRole);
      rolesService.createCustomRole.mockResolvedValue();

      // Execute
      const result = await service.createCustomRole(createDto, mockTenantId, mockUserId);

      // Assert
      expect(rolesService.isSystemRole).toHaveBeenCalledWith('test_role');
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: 'test_role', tenantId: mockTenantId },
      });
      expect(rolesService.createCustomRole).toHaveBeenCalledWith(
        'test_role',
        ['users:read', 'clients:read'],
        mockTenantId,
      );
      expect(result).toEqual(savedRole);
    });

    it('should throw ConflictException when role name conflicts with system role', async () => {
      // Setup
      rolesService.isSystemRole.mockReturnValue(true);

      // Execute & Assert
      await expect(
        service.createCustomRole(createDto, mockTenantId, mockUserId),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when role already exists', async () => {
      // Setup
      rolesService.isSystemRole.mockReturnValue(false);
      repository.findOne.mockResolvedValue({} as CustomRoleEntity);

      // Execute & Assert
      await expect(
        service.createCustomRole(createDto, mockTenantId, mockUserId),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException for invalid permissions', async () => {
      // Setup
      rolesService.isSystemRole.mockReturnValue(false);
      rolesService.getAllAvailablePermissions.mockReturnValue(['users:read']);
      repository.findOne.mockResolvedValue(null);

      const invalidDto = { ...createDto, permissions: ['invalid:permission'] };

      // Execute & Assert
      await expect(
        service.createCustomRole(invalidDto, mockTenantId, mockUserId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getCustomRoles', () => {
    it('should return all active custom roles for tenant', async () => {
      // Setup
      const mockRoles = [
        { id: '1', name: 'role1', isActive: true },
        { id: '2', name: 'role2', isActive: true },
      ] as CustomRoleEntity[];
      repository.find.mockResolvedValue(mockRoles);

      // Execute
      const result = await service.getCustomRoles(mockTenantId);

      // Assert
      expect(repository.find).toHaveBeenCalledWith({
        where: { tenantId: mockTenantId, isActive: true },
        order: { name: 'ASC' },
      });
      expect(result).toEqual(mockRoles);
    });
  });

  describe('getAllTenantRoles', () => {
    it('should return system roles and custom roles', async () => {
      // Setup
      const mockCustomRoles = [
        { id: '1', name: 'custom_role', isActive: true },
      ] as CustomRoleEntity[];
      
      repository.find.mockResolvedValue(mockCustomRoles);
      rolesService.getRolePermissions.mockImplementation((role) => {
        const permissions = {
          [UserRole.OWNER]: ['users:read', 'users:write'],
          [UserRole.ADMIN]: ['users:read'],
          [UserRole.STAFF]: ['clients:read'],
        };
        return Promise.resolve(permissions[role as UserRole] || []);
      });

      // Execute
      const result = await service.getAllTenantRoles(mockTenantId);

      // Assert
      expect(result.customRoles).toEqual(mockCustomRoles);
      expect(result.systemRoles).toHaveLength(3);
      expect(result.systemRoles[0].name).toBe(UserRole.OWNER);
    });
  });

  describe('updateCustomRole', () => {
    const roleId = 'role-id';
    const updateDto: UpdateCustomRoleDto = {
      displayName: 'Updated Role',
      permissions: ['users:write'],
    };

    it('should update a custom role successfully', async () => {
      // Setup
      const existingRole = {
        id: roleId,
        name: 'test_role',
        isSystem: false,
      } as CustomRoleEntity;
      
      repository.findOne.mockResolvedValue(existingRole);
      rolesService.getAllAvailablePermissions.mockReturnValue(['users:write']);
      rolesService.updateCustomRolePermissions.mockResolvedValue();
      const updatedRole = { 
        ...existingRole, 
        ...updateDto,
        hasPermission: jest.fn(),
        addPermission: jest.fn(),
        removePermission: jest.fn()
      };
      repository.save.mockResolvedValue(updatedRole);

      // Execute
      const result = await service.updateCustomRole(
        roleId,
        updateDto,
        mockTenantId,
        mockUserId,
      );

      // Assert
      expect(rolesService.updateCustomRolePermissions).toHaveBeenCalledWith(
        'test_role',
        ['users:write'],
        mockTenantId,
      );
    });

    it('should throw ForbiddenException when trying to update system role', async () => {
      // Setup
      const systemRole = { id: roleId, isSystem: true } as CustomRoleEntity;
      repository.findOne.mockResolvedValue(systemRole);

      // Execute & Assert
      await expect(
        service.updateCustomRole(roleId, updateDto, mockTenantId, mockUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteCustomRole', () => {
    const roleId = 'role-id';

    it('should delete a custom role successfully', async () => {
      // Setup
      const customRole = {
        id: roleId,
        name: 'test_role',
        isSystem: false,
      } as CustomRoleEntity;
      
      repository.findOne.mockResolvedValue(customRole);
      rolesService.deleteCustomRole.mockResolvedValue();
      const deletedRole = { 
        ...customRole, 
        isActive: false,
        hasPermission: jest.fn(),
        addPermission: jest.fn(),
        removePermission: jest.fn()
      };
      repository.save.mockResolvedValue(deletedRole);

      // Execute
      await service.deleteCustomRole(roleId, mockTenantId);

      // Assert
      expect(rolesService.deleteCustomRole).toHaveBeenCalledWith(
        'test_role',
        mockTenantId,
      );
    });

    it('should throw ForbiddenException when trying to delete system role', async () => {
      // Setup
      const systemRole = { id: roleId, isSystem: true } as CustomRoleEntity;
      repository.findOne.mockResolvedValue(systemRole);

      // Execute & Assert
      await expect(
        service.deleteCustomRole(roleId, mockTenantId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('assignCustomRoleToUser', () => {
    it('should assign custom role to user', async () => {
      // Setup
      const roleName = 'test_role';
      const role = { name: roleName, isActive: true } as CustomRoleEntity;
      repository.findOne.mockResolvedValue(role);
      rolesService.assignCustomRoleToUser.mockResolvedValue();

      // Execute
      await service.assignCustomRoleToUser(roleName, mockUserId, mockTenantId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: roleName, tenantId: mockTenantId, isActive: true },
      });
      expect(rolesService.assignCustomRoleToUser).toHaveBeenCalledWith(
        mockUserId,
        roleName,
        mockTenantId,
      );
    });

    it('should throw NotFoundException when role does not exist', async () => {
      // Setup
      repository.findOne.mockResolvedValue(null);

      // Execute & Assert
      await expect(
        service.assignCustomRoleToUser('nonexistent', mockUserId, mockTenantId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllAvailablePermissions', () => {
    it('should return all available permissions', () => {
      // Setup
      const permissions = ['users:read', 'users:write', 'clients:read'];
      rolesService.getAllAvailablePermissions.mockReturnValue(permissions);

      // Execute
      const result = service.getAllAvailablePermissions();

      // Assert
      expect(result).toEqual(permissions);
      expect(rolesService.getAllAvailablePermissions).toHaveBeenCalled();
    });
  });

  describe('validatePermissions', () => {
    it('should validate permissions correctly', () => {
      // Setup
      const availablePermissions = ['users:read', 'users:write', 'clients:read'];
      rolesService.getAllAvailablePermissions.mockReturnValue(availablePermissions);

      const testPermissions = ['users:read', 'invalid:permission', 'clients:read'];

      // Execute
      const result = service.validatePermissions(testPermissions);

      // Assert
      expect(result.valid).toEqual(['users:read', 'clients:read']);
      expect(result.invalid).toEqual(['invalid:permission']);
    });
  });
});