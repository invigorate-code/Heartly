import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantTable1754250020000 implements MigrationInterface {
  name = 'CreateTenantTable1754250020000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create tenant table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tenant" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" varchar(100) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_tenant" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_tenant_name" UNIQUE ("name")
            )
        `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_tenant_deleted_at" ON "tenant" ("deleted_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_tenant_deleted_at"`);
    await queryRunner.query(`DROP TABLE "tenant"`);
  }
}
