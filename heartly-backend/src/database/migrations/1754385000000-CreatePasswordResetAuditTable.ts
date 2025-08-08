import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResetAuditTable1754385000000 implements MigrationInterface {
  name = 'CreatePasswordResetAuditTable1754385000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "password_reset_audit" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" character varying NOT NULL,
        "reset_by_user_id" character varying NOT NULL,
        "target_user_id" character varying NOT NULL,
        "reset_method" character varying NOT NULL CHECK (reset_method IN ('self_service', 'administrative', 'temp_password')),
        "ip_address" inet,
        "user_agent" text,
        "success" boolean NOT NULL DEFAULT false,
        "error_message" text,
        "temp_password_token" character varying,
        "temp_password_used" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "expires_at" TIMESTAMP,
        "used_at" TIMESTAMP,
        CONSTRAINT "PK_password_reset_audit" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_audit_tenant_id" ON "password_reset_audit" ("tenant_id")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_audit_reset_by_user_id" ON "password_reset_audit" ("reset_by_user_id")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_audit_target_user_id" ON "password_reset_audit" ("target_user_id")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_audit_created_at" ON "password_reset_audit" ("created_at")
    `);

    // Enable RLS for tenant isolation
    await queryRunner.query(`ALTER TABLE "password_reset_audit" ENABLE ROW LEVEL SECURITY`);
    
    // Create RLS policy for tenant isolation
    await queryRunner.query(`
      CREATE POLICY password_reset_audit_tenant_isolation ON password_reset_audit
      USING (tenant_id = current_setting('app.current_tenant_id', true))
    `);

    // Grant necessary permissions
    // Note: The database user will be created by database admin
    // await queryRunner.query(`GRANT SELECT, INSERT, UPDATE ON password_reset_audit TO heartly_backend_user`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policy
    await queryRunner.query(`DROP POLICY IF EXISTS password_reset_audit_tenant_isolation ON password_reset_audit`);
    
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_password_reset_audit_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_password_reset_audit_target_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_password_reset_audit_reset_by_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_password_reset_audit_tenant_id"`);
    
    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "password_reset_audit"`);
  }
}