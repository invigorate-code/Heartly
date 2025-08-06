import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CustomRoleService } from '../src/api/role/custom-role.service';
import { SuperTokensRolesService } from '../src/utils/supertokens/roles.service';
import { UserRole } from '../src/api/user/entities/user.entity';
import UserRoles from 'supertokens-node/recipe/userroles';

jest.mock('supertokens-node/recipe/userroles');

describe('Custom Roles API (e2e)', () => {
  let app: INestApplication;
  let customRoleService: CustomRoleService;
  let rolesService: SuperTokensRolesService;

  const mockTenantId = 'test-tenant-id';
  const mockOwnerUser = {
    id: 'owner-user-id',
    sessionToken: 'mock-owner-session-token',
  };
  const mockAdminUser = {
    id: 'admin-user-id', 
    sessionToken: 'mock-admin-session-token',
  };
  const mockStaffUser = {
    id: 'staff-user-id',
    sessionToken: 'mock-staff-session-token',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    customRoleService = moduleFixture.get<CustomRoleService>(CustomRoleService);
    rolesService = moduleFixture.get<SuperTokensRolesService>(SuperTokensRolesService);
    
    await app.init();

    // Mock SuperTokens session verification
    const mockSession = (userId: string, role: UserRole) => ({
      getUserId: () => userId,
      getTenantId: async () => mockTenantId,
      getAccessTokenPayload: () => ({ 
        role,
        tenantId: mockTenantId,
        'st-ev': { v: true }, // Email verified
      }),
      verify: jest.fn().mockResolvedValue(true),
    });

    // Mock UserRoles responses based on user
    (UserRoles.getRolesForUser as jest.Mock).mockImplementation((tenantId: string, userId: string) => {
      switch (userId) {
        case mockOwnerUser.id:
          return Promise.resolve({ roles: [UserRole.OWNER] });
        case mockAdminUser.id:
          return Promise.resolve({ roles: [UserRole.ADMIN] });
        case mockStaffUser.id:
          return Promise.resolve({ roles: [UserRole.STAFF] });
        default:
          return Promise.resolve({ roles: [] });
      }
    });

    // Mock other SuperTokens functions
    (UserRoles.createNewRoleOrAddPermissions as jest.Mock).mockResolvedValue({});
    (UserRoles.deleteRole as jest.Mock).mockResolvedValue({});
    (UserRoles.getPermissionsForRole as jest.Mock).mockResolvedValue({ permissions: [] });
    (UserRoles.getAllRoles as jest.Mock).mockResolvedValue({ roles: [] });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /custom-roles', () => {
    const createRoleDto = {
      name: 'nurse_supervisor',
      displayName: 'Nurse Supervisor',
      description: 'Supervises nursing staff',
      permissions: ['users:read', 'clients:read', 'clients:write'],
    };

    it('should allow OWNER to create custom roles', async () => {
      const response = await request(app.getHttpServer())
        .post('/custom-roles')
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .send(createRoleDto);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(createRoleDto.name);
      expect(response.body.permissions).toEqual(createRoleDto.permissions);
    });

    it('should deny ADMIN access to create custom roles', async () => {
      await request(app.getHttpServer())
        .post('/custom-roles')
        .set('Authorization', `Bearer ${mockAdminUser.sessionToken}`)
        .send(createRoleDto)
        .expect(403);
    });

    it('should deny STAFF access to create custom roles', async () => {
      await request(app.getHttpServer())
        .post('/custom-roles')
        .set('Authorization', `Bearer ${mockStaffUser.sessionToken}`)
        .send(createRoleDto)
        .expect(403);
    });

    it('should validate role name uniqueness', async () => {
      // First creation should succeed
      await request(app.getHttpServer())
        .post('/custom-roles')
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .send(createRoleDto);

      // Second creation with same name should fail
      const response = await request(app.getHttpServer())
        .post('/custom-roles')
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .send(createRoleDto);

      expect(response.status).toBe(409);
    });

    it('should validate permissions', async () => {
      const invalidRoleDto = {
        ...createRoleDto,
        name: 'invalid_role',
        permissions: ['invalid:permission', 'another:invalid'],
      };

      const response = await request(app.getHttpServer())
        .post('/custom-roles')
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .send(invalidRoleDto);

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('Invalid permissions');
    });

    it('should prevent system role name conflicts', async () => {
      const systemRoleDto = {
        ...createRoleDto,
        name: 'OWNER', // Conflicts with system role
      };

      const response = await request(app.getHttpServer())
        .post('/custom-roles')
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .send(systemRoleDto);

      expect(response.status).toBe(409);
    });
  });

  describe('GET /custom-roles', () => {
    beforeAll(async () => {
      // Create test roles
      await customRoleService.createCustomRole(
        {
          name: 'test_role_1',
          displayName: 'Test Role 1',
          permissions: ['users:read'],
        },
        mockTenantId,
        mockOwnerUser.id,
      );
    });

    it('should allow OWNER to view all roles', async () => {
      const response = await request(app.getHttpServer())
        .get('/custom-roles')
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .expect(200);

      expect(response.body.systemRoles).toBeDefined();
      expect(response.body.customRoles).toBeDefined();
      expect(response.body.systemRoles).toHaveLength(3); // OWNER, ADMIN, STAFF
    });

    it('should allow ADMIN to view all roles', async () => {
      const response = await request(app.getHttpServer())
        .get('/custom-roles')
        .set('Authorization', `Bearer ${mockAdminUser.sessionToken}`)
        .expect(200);

      expect(response.body.systemRoles).toBeDefined();
      expect(response.body.customRoles).toBeDefined();
    });

    it('should deny STAFF access to view roles', async () => {
      await request(app.getHttpServer())
        .get('/custom-roles')
        .set('Authorization', `Bearer ${mockStaffUser.sessionToken}`)
        .expect(403);
    });
  });

  describe('GET /custom-roles/permissions', () => {
    it('should return available permissions for OWNER', async () => {
      const response = await request(app.getHttpServer())
        .get('/custom-roles/permissions')
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .expect(200);

      expect(response.body.permissions).toBeDefined();
      expect(Array.isArray(response.body.permissions)).toBe(true);
    });

    it('should return available permissions for ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .get('/custom-roles/permissions')
        .set('Authorization', `Bearer ${mockAdminUser.sessionToken}`)
        .expect(200);

      expect(response.body.permissions).toBeDefined();
    });

    it('should deny STAFF access to permissions list', async () => {
      await request(app.getHttpServer())
        .get('/custom-roles/permissions')
        .set('Authorization', `Bearer ${mockStaffUser.sessionToken}`)
        .expect(403);
    });
  });

  describe('PUT /custom-roles/:id', () => {
    let testRoleId: string;

    beforeAll(async () => {
      const role = await customRoleService.createCustomRole(
        {
          name: 'updateable_role',
          displayName: 'Updateable Role',
          permissions: ['users:read'],
        },
        mockTenantId,
        mockOwnerUser.id,
      );
      testRoleId = role.id;
    });

    it('should allow OWNER to update custom roles', async () => {
      const updateDto = {
        displayName: 'Updated Role Name',
        permissions: ['users:read', 'clients:read'],
      };

      const response = await request(app.getHttpServer())
        .put(`/custom-roles/${testRoleId}`)
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.displayName).toBe(updateDto.displayName);
    });

    it('should deny ADMIN access to update custom roles', async () => {
      await request(app.getHttpServer())
        .put(`/custom-roles/${testRoleId}`)
        .set('Authorization', `Bearer ${mockAdminUser.sessionToken}`)
        .send({ displayName: 'Updated Name' })
        .expect(403);
    });
  });

  describe('DELETE /custom-roles/:id', () => {
    let testRoleId: string;

    beforeEach(async () => {
      const role = await customRoleService.createCustomRole(
        {
          name: `deletable_role_${Date.now()}`,
          displayName: 'Deletable Role',
          permissions: ['users:read'],
        },
        mockTenantId,
        mockOwnerUser.id,
      );
      testRoleId = role.id;
    });

    it('should allow OWNER to delete custom roles', async () => {
      await request(app.getHttpServer())
        .delete(`/custom-roles/${testRoleId}`)
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .expect(200);
    });

    it('should deny ADMIN access to delete custom roles', async () => {
      await request(app.getHttpServer())
        .delete(`/custom-roles/${testRoleId}`)
        .set('Authorization', `Bearer ${mockAdminUser.sessionToken}`)
        .expect(403);
    });
  });

  describe('Role Assignment', () => {
    let testRoleId: string;
    const testRoleName = 'assignable_role';

    beforeAll(async () => {
      const role = await customRoleService.createCustomRole(
        {
          name: testRoleName,
          displayName: 'Assignable Role',
          permissions: ['users:read'],
        },
        mockTenantId,
        mockOwnerUser.id,
      );
      testRoleId = role.id;
    });

    it('should allow OWNER to assign custom roles to users', async () => {
      const assignmentDto = { userId: 'target-user-id' };

      await request(app.getHttpServer())
        .post(`/custom-roles/${testRoleName}/assign`)
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .send(assignmentDto)
        .expect(200);
    });

    it('should allow ADMIN to assign custom roles to users', async () => {
      const assignmentDto = { userId: 'target-user-id' };

      await request(app.getHttpServer())
        .post(`/custom-roles/${testRoleName}/assign`)
        .set('Authorization', `Bearer ${mockAdminUser.sessionToken}`)
        .send(assignmentDto)
        .expect(200);
    });

    it('should deny STAFF access to assign roles', async () => {
      const assignmentDto = { userId: 'target-user-id' };

      await request(app.getHttpServer())
        .post(`/custom-roles/${testRoleName}/assign`)
        .set('Authorization', `Bearer ${mockStaffUser.sessionToken}`)
        .send(assignmentDto)
        .expect(403);
    });

    it('should allow OWNER to remove roles from users', async () => {
      await request(app.getHttpServer())
        .delete(`/custom-roles/${testRoleName}/assign/target-user-id`)
        .set('Authorization', `Bearer ${mockOwnerUser.sessionToken}`)
        .expect(200);
    });
  });

  describe('Email Verification Requirements', () => {
    it('should require email verification for role creation', async () => {
      // Mock unverified session
      const unverifiedSession = {
        getUserId: () => mockOwnerUser.id,
        getTenantId: async () => mockTenantId,
        getAccessTokenPayload: () => ({ 
          role: UserRole.OWNER,
          tenantId: mockTenantId,
          'st-ev': { v: false }, // Email NOT verified
        }),
      };

      const createRoleDto = {
        name: 'test_unverified',
        displayName: 'Test Unverified',
        permissions: ['users:read'],
      };

      const response = await request(app.getHttpServer())
        .post('/custom-roles')
        .set('Authorization', `Bearer unverified-token`)
        .send(createRoleDto);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Email verification required');
    });
  });
});