import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImplementDatabaseConstraintsAndValidation1754330262000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ===== PHASE 1: Fix Existing Constraint Issues =====

    // 1.1 Fix User table uniqueness constraints (make them tenant-scoped)
    // Drop existing constraints using IF EXISTS to handle TypeORM-generated names
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "UQ_e12875dfb3b1d92d7d7c5377e22"`, // email constraint
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "UQ_78a916df40e02a9deb1c4b75edb"`, // username constraint
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "UQ_1deceaa2e6008b9a3241252c778"`, // company constraint
    );

    // Create tenant-scoped unique constraints
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_user_tenant_email_unique" ON "user" ("tenantId", "email") 
      WHERE "email" IS NOT NULL AND "deleted_at" IS NULL
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_user_tenant_username_unique" ON "user" ("tenantId", "username") 
      WHERE "deleted_at" IS NULL
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_user_tenant_company_unique" ON "user" ("tenantId", "company") 
      WHERE "company" IS NOT NULL AND "deleted_at" IS NULL
    `);

    // 1.2 Add missing NOT NULL constraints
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" ALTER COLUMN "address" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "firstName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "lastName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "uci" SET NOT NULL`,
    );

    // ===== PHASE 2: Add Missing Fields and Constraints =====

    // 2.1 Add phone number fields and constraints
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "phone" varchar(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" ADD COLUMN "phone" varchar(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD COLUMN "phone" varchar(20)`,
    );

    // Add phone number format validation
    await queryRunner.query(`
      ALTER TABLE "user" ADD CONSTRAINT "CHK_user_phone_format" 
      CHECK ("phone" IS NULL OR "phone" ~ E'^\\+?[1-9]\\d{1,14}$')
    `);
    await queryRunner.query(`
      ALTER TABLE "facility" ADD CONSTRAINT "CHK_facility_phone_format" 
      CHECK ("phone" IS NULL OR "phone" ~ E'^\\+?[1-9]\\d{1,14}$')
    `);
    await queryRunner.query(`
      ALTER TABLE "client" ADD CONSTRAINT "CHK_client_phone_format" 
      CHECK ("phone" IS NULL OR "phone" ~ E'^\\+?[1-9]\\d{1,14}$')
    `);

    // 2.2 Add email fields where missing and improve validation
    await queryRunner.query(
      `ALTER TABLE "facility" ADD COLUMN "email" varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD COLUMN "email" varchar(100)`,
    );

    // Add improved email format validation
    await queryRunner.query(`
      ALTER TABLE "user" ADD CONSTRAINT "CHK_user_email_format" 
      CHECK ("email" IS NULL OR "email" ~* E'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
    `);
    await queryRunner.query(`
      ALTER TABLE "facility" ADD CONSTRAINT "CHK_facility_email_format" 
      CHECK ("email" IS NULL OR "email" ~* E'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
    `);
    await queryRunner.query(`
      ALTER TABLE "client" ADD CONSTRAINT "CHK_client_email_format" 
      CHECK ("email" IS NULL OR "email" ~* E'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
    `);

    // 2.3 Add tenant-scoped uniqueness for facility names
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_facility_tenant_name_unique" ON "facility" ("tenantId", "name") 
      WHERE "deleted_at" IS NULL
    `);

    // 2.4 Add status fields with enum constraints (future-proofing for workflow)
    await queryRunner.query(`
      DO $$ BEGIN 
        CREATE TYPE "user_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN 
        CREATE TYPE "facility_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN 
        CREATE TYPE "client_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'DISCHARGED', 'ON_HOLD');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "status" "user_status_enum" NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" ADD COLUMN "status" "facility_status_enum" NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD COLUMN "status" "client_status_enum" NOT NULL DEFAULT 'ACTIVE'`,
    );

    // ===== PHASE 3: Enhanced Business Rule Constraints =====

    // 3.1 Enhanced UCI format validation
    await queryRunner.query(`
      ALTER TABLE "client" ADD CONSTRAINT "CHK_client_uci_format" 
      CHECK (LENGTH("uci") >= 6 AND LENGTH("uci") <= 20 AND "uci" ~ E'^[A-Z0-9]+$')
    `);

    // 3.2 Enhanced name validation (no special characters, reasonable length)
    await queryRunner.query(`
      ALTER TABLE "user" ADD CONSTRAINT "CHK_user_name_format" 
      CHECK (
        LENGTH("firstName") >= 1 AND LENGTH("firstName") <= 50 AND 
        LENGTH("lastName") >= 1 AND LENGTH("lastName") <= 50 AND
        "firstName" ~ E'^[A-Za-z[:space:]''-]+$' AND 
        "lastName" ~ E'^[A-Za-z[:space:]''-]+$'
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "client" ADD CONSTRAINT "CHK_client_name_format" 
      CHECK (
        LENGTH("firstName") >= 1 AND LENGTH("firstName") <= 50 AND 
        LENGTH("lastName") >= 1 AND LENGTH("lastName") <= 50 AND
        "firstName" ~ E'^[A-Za-z[:space:]''-]+$' AND 
        "lastName" ~ E'^[A-Za-z[:space:]''-]+$'
      )
    `);

    // 3.3 Facility validation enhancements
    await queryRunner.query(`
      ALTER TABLE "facility" ADD CONSTRAINT "CHK_facility_name_length" 
      CHECK (LENGTH("name") >= 3 AND LENGTH("name") <= 100)
    `);
    await queryRunner.query(`
      ALTER TABLE "facility" ADD CONSTRAINT "CHK_facility_address_length" 
      CHECK (LENGTH("address") >= 5 AND LENGTH("address") <= 200)
    `);
    await queryRunner.query(`
      ALTER TABLE "facility" ADD CONSTRAINT "CHK_facility_city_format" 
      CHECK (LENGTH("city") >= 2 AND LENGTH("city") <= 100 AND "city" ~ E'^[A-Za-z[:space:]''-]+$')
    `);

    // 3.4 Add financial field constraints (future-proofing)
    await queryRunner.query(
      `ALTER TABLE "client" ADD COLUMN "current_balance" decimal(10,2) DEFAULT 0.00`,
    );
    await queryRunner.query(`
      ALTER TABLE "client" ADD CONSTRAINT "CHK_client_balance_precision" 
      CHECK ("current_balance" IS NULL OR ("current_balance" >= -999999.99 AND "current_balance" <= 999999.99))
    `);

    // 3.5 Enhanced audit log action validation
    await queryRunner.query(`
      DO $$ BEGIN 
        CREATE TYPE "audit_action_enum" AS ENUM(
          'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 
          'EXPORT', 'IMPORT', 'APPROVE', 'REJECT', 'ASSIGN', 'UNASSIGN'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);
    await queryRunner.query(
      `ALTER TABLE "user_action_audit_log" ALTER COLUMN "action" TYPE "audit_action_enum" USING "action"::"audit_action_enum"`,
    );

    // 3.6 Cross-field validation for dates
    await queryRunner.query(`
      ALTER TABLE "user" ADD CONSTRAINT "CHK_user_onboarding_date_logic" 
      CHECK (
        "onboarding_completed_at" IS NULL OR 
        ("onboarding_completed_at" >= "created_at" AND "onboarding_completed_at" <= CURRENT_TIMESTAMP)
      )
    `);

    // ===== PHASE 4: Performance Indexes for New Constraints =====

    // Create indexes for new fields
    await queryRunner.query(
      `CREATE INDEX "IDX_user_phone" ON "user" ("phone") WHERE "phone" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_status" ON "user" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_facility_phone" ON "facility" ("phone") WHERE "phone" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_facility_email" ON "facility" ("email") WHERE "email" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_facility_status" ON "facility" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_phone" ON "client" ("phone") WHERE "phone" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_email" ON "client" ("email") WHERE "email" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_status" ON "client" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_balance" ON "client" ("current_balance") WHERE "current_balance" IS NOT NULL`,
    );

    // Composite indexes for common queries
    await queryRunner.query(
      `CREATE INDEX "IDX_user_tenant_status" ON "user" ("tenantId", "status", "deleted_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_facility_tenant_status" ON "facility" ("tenantId", "status", "deleted_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_facility_status" ON "client" ("facilityId", "status", "deleted_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_log_action_date" ON "user_action_audit_log" ("action", "created_at")`,
    );

    // ===== PHASE 5: Comments section removed =====
    // Note: PostgreSQL doesn't support COMMENT ON CONSTRAINT directly
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop performance indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_log_action_date"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_client_facility_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_facility_tenant_status"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_tenant_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_client_balance"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_client_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_client_email"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_client_phone"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_facility_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_facility_email"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_facility_phone"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_phone"`);

    // Drop constraints
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "CHK_user_email_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "CHK_user_onboarding_date_logic"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "CHK_client_balance_precision"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP CONSTRAINT IF EXISTS "CHK_facility_city_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP CONSTRAINT IF EXISTS "CHK_facility_address_length"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP CONSTRAINT IF EXISTS "CHK_facility_name_length"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "CHK_client_name_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "CHK_user_name_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "CHK_client_uci_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "CHK_client_phone_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP CONSTRAINT IF EXISTS "CHK_facility_phone_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "CHK_user_phone_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "CHK_client_email_format"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP CONSTRAINT IF EXISTS "CHK_facility_email_format"`,
    );

    // Drop tenant-scoped unique indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_facility_tenant_name_unique"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_tenant_company_unique"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_tenant_username_unique"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_tenant_email_unique"`,
    );

    // Remove added columns
    await queryRunner.query(
      `ALTER TABLE "user_action_audit_log" ALTER COLUMN "action" TYPE varchar USING "action"::varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN IF EXISTS "current_balance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN IF EXISTS "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP COLUMN IF EXISTS "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN IF EXISTS "email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP COLUMN IF EXISTS "email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP COLUMN IF EXISTS "phone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facility" DROP COLUMN IF EXISTS "phone"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "phone"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "audit_action_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "client_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "facility_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_status_enum"`);

    // Restore original unique constraints
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_company" UNIQUE ("company")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_username" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_user_email" UNIQUE ("email")`,
    );
  }
}
