import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDatabasePerformanceIndexes1754250026000
  implements MigrationInterface
{
  name = 'AddDatabasePerformanceIndexes1754250026000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Only add indexes that don't conflict with existing table creation migrations
    // These indexes are for performance optimization after the base schema is complete

    // Composite indexes for tenant-scoped queries (only on tables that have tenantId)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_tenant_composite" ON "user" ("tenantId", "id")`,
    );

    // User lookup indexes - critical for authentication (avoid conflicts with existing unique indexes)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_role_performance" ON "user" ("role", "tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_onboarding_performance" ON "user" ("onboarding_completed_at", "tenantId") WHERE "onboarding_completed_at" IS NOT NULL`,
    );

    // Facility staff junction table indexes - only if the table exists after other migrations
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_facility_staff_performance_facility" ON "facility_staff" ("facilityId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_facility_staff_performance_user" ON "facility_staff" ("userId")`,
    );

    // Audit log performance indexes - only if table exists
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_user_performance" ON "user_action_audit_log" ("userId", "created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_facility_performance" ON "user_action_audit_log" ("targetFacilityId", "created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_log_tenant_performance" ON "user_action_audit_log" ("targetTenantId", "created_at")`,
    );

    // General timestamp performance indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_created_performance" ON "user" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop performance indexes in reverse order
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_created_performance"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_audit_log_tenant_performance"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_audit_log_facility_performance"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_audit_log_user_performance"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_facility_staff_performance_user"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_facility_staff_performance_facility"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_onboarding_performance"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_role_performance"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_tenant_composite"`);
  }
}
