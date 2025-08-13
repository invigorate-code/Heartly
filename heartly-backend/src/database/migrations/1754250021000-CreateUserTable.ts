import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1754250021000 implements MigrationInterface {
  name = 'CreateUserTable1754250021000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user role enum type
    await queryRunner.query(
      `DO $$ BEGIN CREATE TYPE "user_role_enum" AS ENUM('OWNER', 'ADMIN', 'STAFF'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    );

    // Create user table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id" uuid NOT NULL,
                "firstName" varchar(50) NOT NULL,
                "lastName" varchar(50) NOT NULL,
                "username" varchar(100) NOT NULL,
                "email" varchar(100),
                "company" varchar(255),
                "onboarding_completed_at" TIMESTAMP,
                "onboarding_step" integer NOT NULL DEFAULT 0,
                "role" "user_role_enum" NOT NULL DEFAULT 'STAFF',
                "permissions" jsonb,
                "tenantId" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_user" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_user_username" UNIQUE ("username"),
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "UQ_user_company" UNIQUE ("company"),
                CONSTRAINT "FK_user_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "CHK_user_email_format" CHECK ("email" IS NULL OR "email" ~* E'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
                CONSTRAINT "CHK_user_onboarding_step" CHECK ("onboarding_step" >= 0 AND "onboarding_step" <= 10)
            )
        `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_tenant_id" ON "user" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_username" ON "user" ("username")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" ("deleted_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_user_tenant_id_deleted_at" ON "user" ("tenantId", "deleted_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_user_tenant_id_deleted_at"`);
    await queryRunner.query(`DROP INDEX "IDX_user_deleted_at"`);
    await queryRunner.query(`DROP INDEX "IDX_user_username"`);
    await queryRunner.query(`DROP INDEX "IDX_user_email"`);
    await queryRunner.query(`DROP INDEX "IDX_user_tenant_id"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
