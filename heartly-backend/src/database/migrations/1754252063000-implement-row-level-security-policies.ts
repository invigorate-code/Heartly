import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImplementRowLevelSecurityPolicies1754252063000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable RLS on all tenant-scoped tables
    await queryRunner.query(`ALTER TABLE "user" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "client" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "facility" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "tenant" ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(
      `ALTER TABLE "user_action_audit_log" ENABLE ROW LEVEL SECURITY`,
    );

    // Drop the existing facility policy first (from previous migration)
    await queryRunner.query(
      `DROP POLICY IF EXISTS "Enable access to own facilities" ON "facility"`,
    );

    // User table RLS policies
    // Users can only see users in their tenant
    await queryRunner.query(`
            CREATE POLICY "user_tenant_isolation" ON "user" 
            FOR ALL 
            USING ("tenantId" = current_setting('app.tenant_id', true)::uuid)
        `);

    // Client table RLS policies
    // Users can only see clients in their facilities (for their tenant)
    await queryRunner.query(`
            CREATE POLICY "client_facility_access" ON "client" 
            FOR ALL 
            USING (
                "tenantId" = current_setting('app.tenant_id', true)::uuid
                AND (
                    -- OWNER and ADMIN can see all clients in their tenant
                    current_setting('app.user_role', true) IN ('OWNER', 'ADMIN')
                    OR
                    -- STAFF can only see clients in their assigned facilities
                    "facilityId" IN (
                        SELECT "facilityId" FROM "facility_staff" 
                        WHERE "userId" = current_setting('app.user_id', true)::uuid
                    )
                )
            )
        `);

    // Facility table RLS policies
    // Users can only see facilities in their tenant
    await queryRunner.query(`
            CREATE POLICY "facility_tenant_access" ON "facility" 
            FOR ALL 
            USING (
                "tenantId" = current_setting('app.tenant_id', true)::uuid
                AND (
                    -- OWNER can see all facilities in their tenant
                    current_setting('app.user_role', true) = 'OWNER'
                    OR
                    -- ADMIN and STAFF can only see facilities they're assigned to
                    "id" IN (
                        SELECT "facilityId" FROM "facility_staff" 
                        WHERE "userId" = current_setting('app.user_id', true)::uuid
                    )
                )
            )
        `);

    // Tenant table RLS policies
    // Users can only see their own tenant
    await queryRunner.query(`
            CREATE POLICY "tenant_self_access" ON "tenant" 
            FOR ALL 
            USING ("id" = current_setting('app.tenant_id', true)::uuid)
        `);

    // User Action Audit Log RLS policies
    // Users can only see audit logs based on their role and tenant
    await queryRunner.query(`
            CREATE POLICY "audit_log_role_based_access" ON "user_action_audit_log" 
            FOR ALL 
            USING (
                "targetTenantId" = current_setting('app.tenant_id', true)::uuid
                AND (
                    -- OWNER can see all audit logs in their tenant
                    current_setting('app.user_role', true) = 'OWNER'
                    OR
                    -- ADMIN can see audit logs for their facilities
                    (
                        current_setting('app.user_role', true) = 'ADMIN'
                        AND "targetFacilityId" IN (
                            SELECT "facilityId" FROM "facility_staff" 
                            WHERE "userId" = current_setting('app.user_id', true)::uuid
                        )
                    )
                    OR
                    -- STAFF can only see their own audit logs
                    (
                        current_setting('app.user_role', true) = 'STAFF'
                        AND "userId" = current_setting('app.user_id', true)::uuid
                    )
                )
            )
        `);

    // Create indexes to optimize RLS policy performance
    // Note: CONCURRENTLY removed as it cannot run inside a transaction
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_user_tenant_id" ON "user" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_client_tenant_facility" ON "client" ("tenantId", "facilityId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_facility_tenant_id" ON "facility" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_audit_log_tenant_facility" ON "user_action_audit_log" ("targetTenantId", "targetFacilityId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_facility_staff_user_facility" ON "facility_staff" ("userId", "facilityId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all RLS policies
    await queryRunner.query(
      `DROP POLICY IF EXISTS "user_tenant_isolation" ON "user"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "client_facility_access" ON "client"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "facility_tenant_access" ON "facility"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "tenant_self_access" ON "tenant"`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS "audit_log_role_based_access" ON "user_action_audit_log"`,
    );

    // Disable RLS on all tables
    await queryRunner.query(`ALTER TABLE "user" DISABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE "client" DISABLE ROW LEVEL SECURITY`);
    await queryRunner.query(
      `ALTER TABLE "facility" DISABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DISABLE ROW LEVEL SECURITY`);
    await queryRunner.query(
      `ALTER TABLE "user_action_audit_log" DISABLE ROW LEVEL SECURITY`,
    );

    // Drop performance indexes
    await queryRunner.query(
      `DROP INDEX CONCURRENTLY IF EXISTS "idx_user_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX CONCURRENTLY IF EXISTS "idx_client_tenant_facility"`,
    );
    await queryRunner.query(
      `DROP INDEX CONCURRENTLY IF EXISTS "idx_facility_tenant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX CONCURRENTLY IF EXISTS "idx_audit_log_tenant_facility"`,
    );
    await queryRunner.query(
      `DROP INDEX CONCURRENTLY IF EXISTS "idx_facility_staff_user_facility"`,
    );

    // Restore the original facility policy (from previous migration)
    await queryRunner.query(`
            CREATE POLICY "Enable access to own facilities" ON "facility" 
            FOR SELECT 
            USING ("tenantId" = current_setting('app.tenant_id')::uuid)
        `);
  }
}
