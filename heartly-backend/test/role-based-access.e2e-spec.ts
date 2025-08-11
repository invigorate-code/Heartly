import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import UserRoles from 'supertokens-node/recipe/userroles';
import { UserRole } from '../src/api/user/entities/user.entity';
import { AppModule } from '../src/app.module';
import { SuperTokensRolesService } from '../src/utils/supertokens/roles.service';

jest.mock('supertokens-node/recipe/userroles');
jest.mock('supertokens-node/recipe/emailpassword');

describe('Role-based Access Control (e2e)', () => {
  let app: INestApplication;
  let _rolesService: SuperTokensRolesService;
  let testUsers: {
    owner: { id: string; sessionToken: string };
    admin: { id: string; sessionToken: string };
    staff: { id: string; sessionToken: string };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    _rolesService = moduleFixture.get<SuperTokensRolesService>(
      SuperTokensRolesService,
    );

    await app.init();

    // Setup test users with different roles
    testUsers = {
      owner: {
        id: 'owner-user-id',
        sessionToken: 'mock-owner-session-token',
      },
      admin: {
        id: 'admin-user-id',
        sessionToken: 'mock-admin-session-token',
      },
      staff: {
        id: 'staff-user-id',
        sessionToken: 'mock-staff-session-token',
      },
    };

    // Mock SuperTokens session verification
    const mockSession = (userId: string, role: UserRole) => ({
      getUserId: () => userId,
      getTenantId: async () => 'test-tenant-id',
      getAccessTokenPayload: () => ({ role }),
      verify: jest.fn().mockResolvedValue(true),
    });

    // Mock UserRoles responses based on user
    (UserRoles.getRolesForUser as jest.Mock).mockImplementation(
      (tenantId: string, userId: string) => {
        switch (userId) {
          case testUsers.owner.id:
            return Promise.resolve({ roles: [UserRole.OWNER] });
          case testUsers.admin.id:
            return Promise.resolve({ roles: [UserRole.ADMIN] });
          case testUsers.staff.id:
            return Promise.resolve({ roles: [UserRole.STAFF] });
          default:
            return Promise.resolve({ roles: [] });
        }
      },
    );

    // Mock session middleware to inject appropriate session based on token
    jest.doMock(
      '../src/utils/middleware/session-middleware.integration.spec.ts',
      () => ({
        sessionMiddleware: (req: any, res: any, next: any) => {
          const authHeader = req.headers.authorization;
          if (authHeader?.includes(testUsers.owner.sessionToken)) {
            req.session = mockSession(testUsers.owner.id, UserRole.OWNER);
          } else if (authHeader?.includes(testUsers.admin.sessionToken)) {
            req.session = mockSession(testUsers.admin.id, UserRole.ADMIN);
          } else if (authHeader?.includes(testUsers.staff.sessionToken)) {
            req.session = mockSession(testUsers.staff.id, UserRole.STAFF);
          }
          next();
        },
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Audit Logs Access Control', () => {
    describe('GET /audit-logs', () => {
      it('should allow OWNER to access audit logs', async () => {
        const response = await request(app.getHttpServer())
          .get('/audit-logs')
          .set('Authorization', `Bearer ${testUsers.owner.sessionToken}`)
          .expect(200);

        // Should not receive forbidden response
        expect(response.status).not.toBe(403);
      });

      it('should allow ADMIN to access audit logs', async () => {
        const response = await request(app.getHttpServer())
          .get('/audit-logs')
          .set('Authorization', `Bearer ${testUsers.admin.sessionToken}`)
          .expect(200);

        expect(response.status).not.toBe(403);
      });

      it('should allow STAFF to access audit logs', async () => {
        const response = await request(app.getHttpServer())
          .get('/audit-logs')
          .set('Authorization', `Bearer ${testUsers.staff.sessionToken}`)
          .expect(200);

        expect(response.status).not.toBe(403);
      });
    });

    describe('GET /audit-logs/summary', () => {
      it('should allow OWNER to access audit summary', async () => {
        await request(app.getHttpServer())
          .get('/audit-logs/summary')
          .set('Authorization', `Bearer ${testUsers.owner.sessionToken}`)
          .expect(200);
      });

      it('should allow ADMIN to access audit summary', async () => {
        await request(app.getHttpServer())
          .get('/audit-logs/summary')
          .set('Authorization', `Bearer ${testUsers.admin.sessionToken}`)
          .expect(200);
      });

      it('should deny STAFF access to audit summary', async () => {
        await request(app.getHttpServer())
          .get('/audit-logs/summary')
          .set('Authorization', `Bearer ${testUsers.staff.sessionToken}`)
          .expect(403);
      });
    });

    describe('POST /audit-logs/export', () => {
      it('should allow OWNER to export audit logs', async () => {
        await request(app.getHttpServer())
          .post('/audit-logs/export')
          .set('Authorization', `Bearer ${testUsers.owner.sessionToken}`)
          .send({
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            format: 'csv',
          })
          .expect(200);
      });

      it('should allow ADMIN to export audit logs', async () => {
        await request(app.getHttpServer())
          .post('/audit-logs/export')
          .set('Authorization', `Bearer ${testUsers.admin.sessionToken}`)
          .send({
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            format: 'csv',
          })
          .expect(200);
      });

      it('should deny STAFF access to export audit logs', async () => {
        await request(app.getHttpServer())
          .post('/audit-logs/export')
          .set('Authorization', `Bearer ${testUsers.staff.sessionToken}`)
          .send({
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            format: 'csv',
          })
          .expect(403);
      });
    });

    describe('POST /audit-logs/cleanup', () => {
      it('should allow only OWNER to cleanup old logs', async () => {
        await request(app.getHttpServer())
          .post('/audit-logs/cleanup')
          .set('Authorization', `Bearer ${testUsers.owner.sessionToken}`)
          .expect(200);
      });

      it('should deny ADMIN access to cleanup logs', async () => {
        await request(app.getHttpServer())
          .post('/audit-logs/cleanup')
          .set('Authorization', `Bearer ${testUsers.admin.sessionToken}`)
          .expect(403);
      });

      it('should deny STAFF access to cleanup logs', async () => {
        await request(app.getHttpServer())
          .post('/audit-logs/cleanup')
          .set('Authorization', `Bearer ${testUsers.staff.sessionToken}`)
          .expect(403);
      });
    });
  });

  describe('Facility Management Access Control', () => {
    describe('DELETE /facility/:id', () => {
      it('should allow only OWNER to delete facilities', async () => {
        await request(app.getHttpServer())
          .delete('/facility/test-facility-id')
          .set('Authorization', `Bearer ${testUsers.owner.sessionToken}`)
          .expect(200);
      });

      it('should deny ADMIN access to delete facilities', async () => {
        await request(app.getHttpServer())
          .delete('/facility/test-facility-id')
          .set('Authorization', `Bearer ${testUsers.admin.sessionToken}`)
          .expect(403);
      });

      it('should deny STAFF access to delete facilities', async () => {
        await request(app.getHttpServer())
          .delete('/facility/test-facility-id')
          .set('Authorization', `Bearer ${testUsers.staff.sessionToken}`)
          .expect(403);
      });
    });
  });

  describe('User Management Access Control', () => {
    describe('POST /users/createUser', () => {
      const createUserDto = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.STAFF,
      };

      it('should allow OWNER to create users', async () => {
        await request(app.getHttpServer())
          .post('/users/createUser')
          .set('Authorization', `Bearer ${testUsers.owner.sessionToken}`)
          .send(createUserDto)
          .expect(201);
      });

      it('should allow ADMIN to create users', async () => {
        await request(app.getHttpServer())
          .post('/users/createUser')
          .set('Authorization', `Bearer ${testUsers.admin.sessionToken}`)
          .send(createUserDto)
          .expect(201);
      });

      it('should deny STAFF access to create users', async () => {
        await request(app.getHttpServer())
          .post('/users/createUser')
          .set('Authorization', `Bearer ${testUsers.staff.sessionToken}`)
          .send(createUserDto)
          .expect(403);
      });
    });
  });

  describe('Unauthorized Access', () => {
    it('should return 401 for requests without session token', async () => {
      await request(app.getHttpServer()).get('/audit-logs').expect(401);
    });

    it('should return 401 for requests with invalid session token', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Role Hierarchy', () => {
    it('should respect role hierarchy for permissions', async () => {
      // OWNER should have access to all endpoints
      const ownerEndpoints = [
        '/audit-logs',
        '/audit-logs/summary',
        '/users/createUser',
      ];

      for (const endpoint of ownerEndpoints) {
        await request(app.getHttpServer())
          .get(endpoint)
          .set('Authorization', `Bearer ${testUsers.owner.sessionToken}`)
          .expect((res) => expect(res.status).not.toBe(403));
      }

      // ADMIN should have limited access
      await request(app.getHttpServer())
        .get('/audit-logs/summary')
        .set('Authorization', `Bearer ${testUsers.admin.sessionToken}`)
        .expect((res) => expect(res.status).not.toBe(403));

      // STAFF should have most limited access
      await request(app.getHttpServer())
        .get('/audit-logs/summary')
        .set('Authorization', `Bearer ${testUsers.staff.sessionToken}`)
        .expect(403);
    });
  });
});
