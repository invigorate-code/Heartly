import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ClientEntity } from '../src/api/client/entities/client.entity';
import { FacilityEntity } from '../src/api/facility/entities/facility.entity';
import { TenantEntity } from '../src/api/tenant/entities/tenant.entity';
import { UserActionAuditLogEntity } from '../src/api/user-action-audit-log/entities/user-action-audit-log.entity';
import { UserEntity } from '../src/api/user/entities/user.entity';
import { AppModule } from '../src/app.module';
import { RlsContextService } from '../src/common/services/rls-context.service';

describe('RLS Policies (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let rlsContextService: RlsContextService;

  // Test data
  const testData = {
    tenant1: { id: 'tenant-1', name: 'Tenant 1' },
    tenant2: { id: 'tenant-2', name: 'Tenant 2' },
    facility1a: {
      id: 'facility-1a',
      tenantId: 'tenant-1',
      name: 'Facility 1A',
    },
    facility1b: {
      id: 'facility-1b',
      tenantId: 'tenant-1',
      name: 'Facility 1B',
    },
    facility2a: {
      id: 'facility-2a',
      tenantId: 'tenant-2',
      name: 'Facility 2A',
    },
    owner1: {
      id: 'owner-1',
      tenantId: 'tenant-1',
      role: 'OWNER',
      email: 'owner1@test.com',
    },
    admin1a: {
      id: 'admin-1a',
      tenantId: 'tenant-1',
      role: 'ADMIN',
      email: 'admin1a@test.com',
    },
    staff1a: {
      id: 'staff-1a',
      tenantId: 'tenant-1',
      role: 'STAFF',
      email: 'staff1a@test.com',
    },
    owner2: {
      id: 'owner-2',
      tenantId: 'tenant-2',
      role: 'OWNER',
      email: 'owner2@test.com',
    },
    client1a1: {
      id: 'client-1a-1',
      tenantId: 'tenant-1',
      facilityId: 'facility-1a',
      firstName: 'John',
    },
    client1b1: {
      id: 'client-1b-1',
      tenantId: 'tenant-1',
      facilityId: 'facility-1b',
      firstName: 'Jane',
    },
    client2a1: {
      id: 'client-2a-1',
      tenantId: 'tenant-2',
      facilityId: 'facility-2a',
      firstName: 'Bob',
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get<DataSource>(DataSource);
    rlsContextService = app.get<RlsContextService>(RlsContextService);

    // Set up test data
    await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await app.close();
  });

  beforeEach(async () => {
    // Clear RLS context before each test
    await rlsContextService.clearGlobalRlsContext();
  });

  describe('User Table RLS', () => {
    it('should allow users to see only users in their tenant', async () => {
      // Set context as owner1 (tenant-1)
      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-1',
        userId: 'owner-1',
        userRole: 'OWNER',
      });

      const users = await dataSource.getRepository(UserEntity).find();
      const userIds = users.map((u) => u.id);

      expect(userIds).toContain('owner-1');
      expect(userIds).toContain('admin-1a');
      expect(userIds).toContain('staff-1a');
      expect(userIds).not.toContain('owner-2'); // Different tenant
    });

    it('should prevent cross-tenant user access', async () => {
      // Set context as owner2 (tenant-2)
      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-2',
        userId: 'owner-2',
        userRole: 'OWNER',
      });

      const users = await dataSource.getRepository(UserEntity).find();
      const userIds = users.map((u) => u.id);

      expect(userIds).toContain('owner-2');
      expect(userIds).not.toContain('owner-1'); // Different tenant
      expect(userIds).not.toContain('admin-1a'); // Different tenant
      expect(userIds).not.toContain('staff-1a'); // Different tenant
    });
  });

  describe('Client Table RLS', () => {
    it('should allow OWNER to see all clients in their tenant', async () => {
      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-1',
        userId: 'owner-1',
        userRole: 'OWNER',
      });

      const clients = await dataSource.getRepository(ClientEntity).find();
      const clientIds = clients.map((c) => c.id);

      expect(clientIds).toContain('client-1a-1');
      expect(clientIds).toContain('client-1b-1');
      expect(clientIds).not.toContain('client-2a-1'); // Different tenant
    });

    it('should allow STAFF to see only clients in their assigned facilities', async () => {
      // First, assign staff to facility-1a
      await dataSource.query(
        `INSERT INTO facility_staff (userId, facilityId) VALUES ($1, $2)`,
        ['staff-1a', 'facility-1a'],
      );

      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-1',
        userId: 'staff-1a',
        userRole: 'STAFF',
      });

      const clients = await dataSource.getRepository(ClientEntity).find();
      const clientIds = clients.map((c) => c.id);

      expect(clientIds).toContain('client-1a-1'); // In assigned facility
      expect(clientIds).not.toContain('client-1b-1'); // Different facility
      expect(clientIds).not.toContain('client-2a-1'); // Different tenant
    });

    it('should prevent cross-tenant client access', async () => {
      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-2',
        userId: 'owner-2',
        userRole: 'OWNER',
      });

      const clients = await dataSource.getRepository(ClientEntity).find();
      const clientIds = clients.map((c) => c.id);

      expect(clientIds).toContain('client-2a-1');
      expect(clientIds).not.toContain('client-1a-1'); // Different tenant
      expect(clientIds).not.toContain('client-1b-1'); // Different tenant
    });
  });

  describe('Facility Table RLS', () => {
    it('should allow OWNER to see all facilities in their tenant', async () => {
      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-1',
        userId: 'owner-1',
        userRole: 'OWNER',
      });

      const facilities = await dataSource.getRepository(FacilityEntity).find();
      const facilityIds = facilities.map((f) => f.id);

      expect(facilityIds).toContain('facility-1a');
      expect(facilityIds).toContain('facility-1b');
      expect(facilityIds).not.toContain('facility-2a'); // Different tenant
    });

    it('should allow STAFF to see only assigned facilities', async () => {
      // Assign staff to facility-1a only
      await dataSource.query(
        `INSERT INTO facility_staff (userId, facilityId) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        ['staff-1a', 'facility-1a'],
      );

      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-1',
        userId: 'staff-1a',
        userRole: 'STAFF',
      });

      const facilities = await dataSource.getRepository(FacilityEntity).find();
      const facilityIds = facilities.map((f) => f.id);

      expect(facilityIds).toContain('facility-1a'); // Assigned facility
      expect(facilityIds).not.toContain('facility-1b'); // Not assigned
      expect(facilityIds).not.toContain('facility-2a'); // Different tenant
    });
  });

  describe('Tenant Table RLS', () => {
    it('should allow users to see only their own tenant', async () => {
      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-1',
        userId: 'owner-1',
        userRole: 'OWNER',
      });

      const tenants = await dataSource.getRepository(TenantEntity).find();
      const tenantIds = tenants.map((t) => t.id);

      expect(tenantIds).toContain('tenant-1');
      expect(tenantIds).not.toContain('tenant-2');
    });
  });

  describe('User Action Audit Log RLS', () => {
    it('should allow OWNER to see all audit logs in their tenant', async () => {
      // Create test audit logs
      await dataSource.getRepository(UserActionAuditLogEntity).save([
        {
          id: 'audit-1',
          userId: 'staff-1a',
          targetTenantId: 'tenant-1',
          targetFacilityId: 'facility-1a',
          action: 'CREATE_CLIENT',
        },
        {
          id: 'audit-2',
          userId: 'admin-1a',
          targetTenantId: 'tenant-1',
          targetFacilityId: 'facility-1b',
          action: 'UPDATE_CLIENT',
        },
        {
          id: 'audit-3',
          userId: 'owner-2',
          targetTenantId: 'tenant-2',
          targetFacilityId: 'facility-2a',
          action: 'DELETE_CLIENT',
        },
      ]);

      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-1',
        userId: 'owner-1',
        userRole: 'OWNER',
      });

      const auditLogs = await dataSource
        .getRepository(UserActionAuditLogEntity)
        .find();
      const auditIds = auditLogs.map((a) => a.id);

      expect(auditIds).toContain('audit-1');
      expect(auditIds).toContain('audit-2');
      expect(auditIds).not.toContain('audit-3'); // Different tenant
    });

    it('should allow STAFF to see only their own audit logs', async () => {
      await rlsContextService.setGlobalRlsContext({
        tenantId: 'tenant-1',
        userId: 'staff-1a',
        userRole: 'STAFF',
      });

      const auditLogs = await dataSource
        .getRepository(UserActionAuditLogEntity)
        .find();
      const auditIds = auditLogs.map((a) => a.id);

      expect(auditIds).toContain('audit-1'); // Their own log
      expect(auditIds).not.toContain('audit-2'); // Different user
      expect(auditIds).not.toContain('audit-3'); // Different tenant
    });
  });

  // Helper functions
  async function setupTestData() {
    // Create tenants
    await dataSource
      .getRepository(TenantEntity)
      .save([testData.tenant1, testData.tenant2]);

    // Create facilities
    await dataSource.getRepository(FacilityEntity).save([
      {
        ...testData.facility1a,
        address: '123 Main St',
        city: 'City',
        state: 'CA',
        zip: '12345',
      },
      {
        ...testData.facility1b,
        address: '456 Oak St',
        city: 'City',
        state: 'CA',
        zip: '12345',
      },
      {
        ...testData.facility2a,
        address: '789 Pine St',
        city: 'City',
        state: 'CA',
        zip: '12345',
      },
    ]);

    // Create users
    await dataSource.getRepository(UserEntity).save([
      {
        ...testData.owner1,
        firstName: 'Owner',
        lastName: 'One',
        username: 'owner1',
      },
      {
        ...testData.admin1a,
        firstName: 'Admin',
        lastName: 'One',
        username: 'admin1a',
      },
      {
        ...testData.staff1a,
        firstName: 'Staff',
        lastName: 'One',
        username: 'staff1a',
      },
      {
        ...testData.owner2,
        firstName: 'Owner',
        lastName: 'Two',
        username: 'owner2',
      },
    ]);

    // Create clients
    await dataSource.getRepository(ClientEntity).save([
      {
        ...testData.client1a1,
        lastName: 'Doe',
        birthDate: new Date('1990-01-01'),
        uci: 'UCI001',
      },
      {
        ...testData.client1b1,
        lastName: 'Smith',
        birthDate: new Date('1985-05-15'),
        uci: 'UCI002',
      },
      {
        ...testData.client2a1,
        lastName: 'Johnson',
        birthDate: new Date('1992-08-20'),
        uci: 'UCI003',
      },
    ]);
  }

  async function cleanupTestData() {
    // Clean up in reverse dependency order
    await dataSource.query('DELETE FROM user_action_audit_log');
    await dataSource.query('DELETE FROM facility_staff');
    await dataSource.query('DELETE FROM client');
    await dataSource.query('DELETE FROM "user"');
    await dataSource.query('DELETE FROM facility');
    await dataSource.query('DELETE FROM tenant');
  }
});
