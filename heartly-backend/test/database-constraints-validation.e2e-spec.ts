import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('Database Constraints and Validation (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Table Constraints', () => {
    describe('Phone Number Validation', () => {
      it('should accept valid international phone number', async () => {
        const result = await dataSource.query(`
          INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "phone")
          VALUES (
            uuid_generate_v4(), 
            'John', 
            'Doe', 
            'john.doe.test1', 
            'STAFF', 
            (SELECT id FROM "tenant" LIMIT 1), 
            '+1234567890'
          ) RETURNING id
        `);

        expect(result).toHaveLength(1);
        expect(result[0].id).toBeDefined();

        // Cleanup
        await dataSource.query(`DELETE FROM "user" WHERE id = $1`, [
          result[0].id,
        ]);
      });

      it('should reject invalid phone number format', async () => {
        await expect(
          dataSource.query(`
            INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "phone")
            VALUES (
              uuid_generate_v4(), 
              'John', 
              'Doe', 
              'john.doe.test2', 
              'STAFF', 
              (SELECT id FROM "tenant" LIMIT 1), 
              'invalid-phone'
            )
          `),
        ).rejects.toThrow();
      });
    });

    describe('Email Format Validation', () => {
      it('should accept valid email format', async () => {
        const result = await dataSource.query(`
          INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "email")
          VALUES (
            uuid_generate_v4(), 
            'Jane', 
            'Smith', 
            'jane.smith.test1', 
            'STAFF', 
            (SELECT id FROM "tenant" LIMIT 1), 
            'jane.smith@example.com'
          ) RETURNING id
        `);

        expect(result).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "user" WHERE id = $1`, [
          result[0].id,
        ]);
      });

      it('should reject invalid email format', async () => {
        await expect(
          dataSource.query(`
            INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "email")
            VALUES (
              uuid_generate_v4(), 
              'Jane', 
              'Smith', 
              'jane.smith.test2', 
              'STAFF', 
              (SELECT id FROM "tenant" LIMIT 1), 
              'invalid-email'
            )
          `),
        ).rejects.toThrow();
      });
    });

    describe('Name Format Validation', () => {
      it('should accept valid names with letters, spaces, and hyphens', async () => {
        const result = await dataSource.query(`
          INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId")
          VALUES (
            uuid_generate_v4(), 
            'Mary-Jane', 
            'O''Connor Smith', 
            'mary.jane.test1', 
            'STAFF', 
            (SELECT id FROM "tenant" LIMIT 1)
          ) RETURNING id
        `);

        expect(result).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "user" WHERE id = $1`, [
          result[0].id,
        ]);
      });

      it('should reject names with invalid characters', async () => {
        await expect(
          dataSource.query(`
            INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId")
            VALUES (
              uuid_generate_v4(), 
              'John123', 
              'Smith', 
              'john.smith.test3', 
              'STAFF', 
              (SELECT id FROM "tenant" LIMIT 1)
            )
          `),
        ).rejects.toThrow();
      });
    });

    describe('Tenant-Scoped Uniqueness', () => {
      it('should allow same email in different tenants', async () => {
        const tenants = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 2`,
        );
        expect(tenants).toHaveLength(2);

        const user1 = await dataSource.query(
          `
          INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "email")
          VALUES (
            uuid_generate_v4(), 
            'Same', 
            'Email', 
            'same.email.tenant1', 
            'STAFF', 
            $1, 
            'same@example.com'
          ) RETURNING id
        `,
          [tenants[0].id],
        );

        const user2 = await dataSource.query(
          `
          INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "email")
          VALUES (
            uuid_generate_v4(), 
            'Same', 
            'Email', 
            'same.email.tenant2', 
            'STAFF', 
            $1, 
            'same@example.com'
          ) RETURNING id
        `,
          [tenants[1].id],
        );

        expect(user1).toHaveLength(1);
        expect(user2).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "user" WHERE id IN ($1, $2)`, [
          user1[0].id,
          user2[0].id,
        ]);
      });

      it('should reject duplicate email within same tenant', async () => {
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        const user1 = await dataSource.query(
          `
          INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "email")
          VALUES (
            uuid_generate_v4(), 
            'Duplicate', 
            'Email', 
            'duplicate.email.1', 
            'STAFF', 
            $1, 
            'duplicate@example.com'
          ) RETURNING id
        `,
          [tenant[0].id],
        );

        await expect(
          dataSource.query(
            `
            INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "email")
            VALUES (
              uuid_generate_v4(), 
              'Duplicate', 
              'Email', 
              'duplicate.email.2', 
              'STAFF', 
              $1, 
              'duplicate@example.com'
            )
          `,
            [tenant[0].id],
          ),
        ).rejects.toThrow();

        // Cleanup
        await dataSource.query(`DELETE FROM "user" WHERE id = $1`, [
          user1[0].id,
        ]);
      });
    });

    describe('Onboarding Date Logic', () => {
      it('should accept onboarding date after creation date', async () => {
        const result = await dataSource.query(`
          INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "onboarding_completed_at")
          VALUES (
            uuid_generate_v4(), 
            'Valid', 
            'Onboarding', 
            'valid.onboarding.test', 
            'STAFF', 
            (SELECT id FROM "tenant" LIMIT 1), 
            CURRENT_TIMESTAMP + INTERVAL '1 hour'
          ) RETURNING id
        `);

        expect(result).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "user" WHERE id = $1`, [
          result[0].id,
        ]);
      });

      it('should reject onboarding date in the future', async () => {
        await expect(
          dataSource.query(`
            INSERT INTO "user" ("id", "firstName", "lastName", "username", "role", "tenantId", "onboarding_completed_at")
            VALUES (
              uuid_generate_v4(), 
              'Future', 
              'Onboarding', 
              'future.onboarding.test', 
              'STAFF', 
              (SELECT id FROM "tenant" LIMIT 1), 
              CURRENT_TIMESTAMP + INTERVAL '1 day'
            )
          `),
        ).rejects.toThrow();
      });
    });
  });

  describe('Facility Table Constraints', () => {
    describe('Address and Location Validation', () => {
      it('should accept valid facility with all required fields', async () => {
        const result = await dataSource.query(`
          INSERT INTO "facility" ("id", "name", "address", "city", "state", "zip", "tenantId", "projectedClientCount", "roomCount")
          VALUES (
            uuid_generate_v4(), 
            'Valid Facility', 
            '123 Main Street', 
            'San Francisco', 
            'CA', 
            '94102', 
            (SELECT id FROM "tenant" LIMIT 1), 
            100, 
            50
          ) RETURNING id
        `);

        expect(result).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "facility" WHERE id = $1`, [
          result[0].id,
        ]);
      });

      it('should reject invalid ZIP code format', async () => {
        await expect(
          dataSource.query(`
            INSERT INTO "facility" ("id", "name", "address", "city", "state", "zip", "tenantId", "projectedClientCount", "roomCount")
            VALUES (
              uuid_generate_v4(), 
              'Invalid ZIP Facility', 
              '123 Main Street', 
              'San Francisco', 
              'CA', 
              'invalid-zip', 
              (SELECT id FROM "tenant" LIMIT 1), 
              100, 
              50
            )
          `),
        ).rejects.toThrow();
      });

      it('should reject invalid state format', async () => {
        await expect(
          dataSource.query(`
            INSERT INTO "facility" ("id", "name", "address", "city", "state", "zip", "tenantId", "projectedClientCount", "roomCount")
            VALUES (
              uuid_generate_v4(), 
              'Invalid State Facility', 
              '123 Main Street', 
              'San Francisco', 
              'California', 
              '94102', 
              (SELECT id FROM "tenant" LIMIT 1), 
              100, 
              50
            )
          `),
        ).rejects.toThrow();
      });
    });

    describe('Facility Name Uniqueness', () => {
      it('should allow same facility name in different tenants', async () => {
        const tenants = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 2`,
        );

        const facility1 = await dataSource.query(
          `
          INSERT INTO "facility" ("id", "name", "address", "city", "state", "zip", "tenantId", "projectedClientCount", "roomCount")
          VALUES (
            uuid_generate_v4(), 
            'Same Name Facility', 
            '123 First Street', 
            'San Francisco', 
            'CA', 
            '94102', 
            $1, 
            100, 
            50
          ) RETURNING id
        `,
          [tenants[0].id],
        );

        const facility2 = await dataSource.query(
          `
          INSERT INTO "facility" ("id", "name", "address", "city", "state", "zip", "tenantId", "projectedClientCount", "roomCount")
          VALUES (
            uuid_generate_v4(), 
            'Same Name Facility', 
            '123 Second Street', 
            'Los Angeles', 
            'CA', 
            '90210', 
            $1, 
            100, 
            50
          ) RETURNING id
        `,
          [tenants[1].id],
        );

        expect(facility1).toHaveLength(1);
        expect(facility2).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "facility" WHERE id IN ($1, $2)`, [
          facility1[0].id,
          facility2[0].id,
        ]);
      });
    });

    describe('Count Validation', () => {
      it('should reject negative projected client count', async () => {
        await expect(
          dataSource.query(`
            INSERT INTO "facility" ("id", "name", "address", "city", "state", "zip", "tenantId", "projectedClientCount", "roomCount")
            VALUES (
              uuid_generate_v4(), 
              'Negative Count Facility', 
              '123 Main Street', 
              'San Francisco', 
              'CA', 
              '94102', 
              (SELECT id FROM "tenant" LIMIT 1), 
              -1, 
              50
            )
          `),
        ).rejects.toThrow();
      });

      it('should reject negative room count', async () => {
        await expect(
          dataSource.query(`
            INSERT INTO "facility" ("id", "name", "address", "city", "state", "zip", "tenantId", "projectedClientCount", "roomCount")
            VALUES (
              uuid_generate_v4(), 
              'Negative Room Facility', 
              '123 Main Street', 
              'San Francisco', 
              'CA', 
              '94102', 
              (SELECT id FROM "tenant" LIMIT 1), 
              100, 
              -1
            )
          `),
        ).rejects.toThrow();
      });
    });
  });

  describe('Client Table Constraints', () => {
    describe('UCI Format Validation', () => {
      it('should accept valid UCI format', async () => {
        const facility = await dataSource.query(
          `SELECT id FROM "facility" LIMIT 1`,
        );
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        const result = await dataSource.query(
          `
          INSERT INTO "client" ("id", "firstName", "lastName", "birthDate", "uci", "facilityId", "tenantId")
          VALUES (
            uuid_generate_v4(), 
            'Valid', 
            'Client', 
            '1990-01-01', 
            'CLIENT123456', 
            $1, 
            $2
          ) RETURNING id
        `,
          [facility[0].id, tenant[0].id],
        );

        expect(result).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "client" WHERE id = $1`, [
          result[0].id,
        ]);
      });

      it('should reject UCI with invalid characters', async () => {
        const facility = await dataSource.query(
          `SELECT id FROM "facility" LIMIT 1`,
        );
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        await expect(
          dataSource.query(
            `
            INSERT INTO "client" ("id", "firstName", "lastName", "birthDate", "uci", "facilityId", "tenantId")
            VALUES (
              uuid_generate_v4(), 
              'Invalid', 
              'Client', 
              '1990-01-01', 
              'client-123-456', 
              $1, 
              $2
            )
          `,
            [facility[0].id, tenant[0].id],
          ),
        ).rejects.toThrow();
      });

      it('should reject UCI that is too short', async () => {
        const facility = await dataSource.query(
          `SELECT id FROM "facility" LIMIT 1`,
        );
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        await expect(
          dataSource.query(
            `
            INSERT INTO "client" ("id", "firstName", "lastName", "birthDate", "uci", "facilityId", "tenantId")
            VALUES (
              uuid_generate_v4(), 
              'Short', 
              'UCI', 
              '1990-01-01', 
              'ABC12', 
              $1, 
              $2
            )
          `,
            [facility[0].id, tenant[0].id],
          ),
        ).rejects.toThrow();
      });
    });

    describe('Birth Date Validation', () => {
      it('should accept valid birth date', async () => {
        const facility = await dataSource.query(
          `SELECT id FROM "facility" LIMIT 1`,
        );
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        const result = await dataSource.query(
          `
          INSERT INTO "client" ("id", "firstName", "lastName", "birthDate", "uci", "facilityId", "tenantId")
          VALUES (
            uuid_generate_v4(), 
            'Valid', 
            'Birthdate', 
            '1990-01-01', 
            'VALIDBIRTH123', 
            $1, 
            $2
          ) RETURNING id
        `,
          [facility[0].id, tenant[0].id],
        );

        expect(result).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "client" WHERE id = $1`, [
          result[0].id,
        ]);
      });

      it('should reject future birth date', async () => {
        const facility = await dataSource.query(
          `SELECT id FROM "facility" LIMIT 1`,
        );
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        await expect(
          dataSource.query(
            `
            INSERT INTO "client" ("id", "firstName", "lastName", "birthDate", "uci", "facilityId", "tenantId")
            VALUES (
              uuid_generate_v4(), 
              'Future', 
              'Birthdate', 
              '2030-01-01', 
              'FUTUREBIRTH123', 
              $1, 
              $2
            )
          `,
            [facility[0].id, tenant[0].id],
          ),
        ).rejects.toThrow();
      });

      it('should reject birth date before 1900', async () => {
        const facility = await dataSource.query(
          `SELECT id FROM "facility" LIMIT 1`,
        );
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        await expect(
          dataSource.query(
            `
            INSERT INTO "client" ("id", "firstName", "lastName", "birthDate", "uci", "facilityId", "tenantId")
            VALUES (
              uuid_generate_v4(), 
              'Ancient', 
              'Birthdate', 
              '1850-01-01', 
              'ANCIENTBIRTH123', 
              $1, 
              $2
            )
          `,
            [facility[0].id, tenant[0].id],
          ),
        ).rejects.toThrow();
      });
    });

    describe('Financial Amount Validation', () => {
      it('should accept valid balance amounts', async () => {
        const facility = await dataSource.query(
          `SELECT id FROM "facility" LIMIT 1`,
        );
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        const result = await dataSource.query(
          `
          INSERT INTO "client" ("id", "firstName", "lastName", "birthDate", "uci", "facilityId", "tenantId", "current_balance")
          VALUES (
            uuid_generate_v4(), 
            'Valid', 
            'Balance', 
            '1990-01-01', 
            'VALIDBALANCE123', 
            $1, 
            $2,
            250.75
          ) RETURNING id
        `,
          [facility[0].id, tenant[0].id],
        );

        expect(result).toHaveLength(1);

        // Cleanup
        await dataSource.query(`DELETE FROM "client" WHERE id = $1`, [
          result[0].id,
        ]);
      });

      it('should reject balance exceeding precision limits', async () => {
        const facility = await dataSource.query(
          `SELECT id FROM "facility" LIMIT 1`,
        );
        const tenant = await dataSource.query(
          `SELECT id FROM "tenant" LIMIT 1`,
        );

        await expect(
          dataSource.query(
            `
            INSERT INTO "client" ("id", "firstName", "lastName", "birthDate", "uci", "facilityId", "tenantId", "current_balance")
            VALUES (
              uuid_generate_v4(), 
              'Invalid', 
              'Balance', 
              '1990-01-01', 
              'INVALIDBALANCE123', 
              $1, 
              $2,
              1000000.00
            )
          `,
            [facility[0].id, tenant[0].id],
          ),
        ).rejects.toThrow();
      });
    });
  });

  describe('Audit Log Action Validation', () => {
    it('should accept valid audit action enum values', async () => {
      const user = await dataSource.query(`SELECT id FROM "user" LIMIT 1`);
      const facility = await dataSource.query(
        `SELECT id FROM "facility" LIMIT 1`,
      );
      const tenant = await dataSource.query(`SELECT id FROM "tenant" LIMIT 1`);

      const result = await dataSource.query(
        `
        INSERT INTO "user_action_audit_log" ("id", "userId", "targetFacilityId", "targetTenantId", "action")
        VALUES (
          uuid_generate_v4(), 
          $1, 
          $2, 
          $3, 
          'CREATE'
        ) RETURNING id
      `,
        [user[0].id, facility[0].id, tenant[0].id],
      );

      expect(result).toHaveLength(1);

      // Cleanup
      await dataSource.query(
        `DELETE FROM "user_action_audit_log" WHERE id = $1`,
        [result[0].id],
      );
    });

    it('should reject invalid audit action values', async () => {
      const user = await dataSource.query(`SELECT id FROM "user" LIMIT 1`);
      const facility = await dataSource.query(
        `SELECT id FROM "facility" LIMIT 1`,
      );
      const tenant = await dataSource.query(`SELECT id FROM "tenant" LIMIT 1`);

      await expect(
        dataSource.query(
          `
          INSERT INTO "user_action_audit_log" ("id", "userId", "targetFacilityId", "targetTenantId", "action")
          VALUES (
            uuid_generate_v4(), 
            $1, 
            $2, 
            $3, 
            'INVALID_ACTION'
          )
        `,
          [user[0].id, facility[0].id, tenant[0].id],
        ),
      ).rejects.toThrow();
    });
  });
});
