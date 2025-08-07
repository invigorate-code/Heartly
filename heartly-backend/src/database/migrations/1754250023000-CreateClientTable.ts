import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientTable1754250023000 implements MigrationInterface {
  name = 'CreateClientTable1754250023000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create client table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "client" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" varchar(50) NOT NULL,
                "lastName" varchar(50) NOT NULL,
                "birthDate" date NOT NULL,
                "uci" varchar(20) NOT NULL,
                "photo" varchar(500),
                "isDeleted" boolean NOT NULL DEFAULT false,
                "facilityId" uuid NOT NULL,
                "tenantId" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_client" PRIMARY KEY ("id"),
                CONSTRAINT "FK_client_facility" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_client_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "CHK_client_birth_date" CHECK ("birthDate" <= CURRENT_DATE AND "birthDate" >= '1900-01-01')
            )
        `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_client_tenant_id" ON "client" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_facility_id" ON "client" ("facilityId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_deleted_at" ON "client" ("deleted_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_is_deleted" ON "client" ("isDeleted")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_uci" ON "client" ("uci")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_birth_date" ON "client" ("birthDate")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_tenant_id_deleted_at" ON "client" ("tenantId", "deleted_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_facility_id_is_deleted" ON "client" ("facilityId", "isDeleted")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_client_tenant_id_facility_id" ON "client" ("tenantId", "facilityId")`,
    );

    // Unique constraint for UCI within tenant (only for non-deleted records)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_client_tenant_id_uci_unique" ON "client" ("tenantId", "uci") WHERE "deleted_at" IS NULL`,
    );

    // Enable trigram extension for name search
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);

    // Full-text search index for client names
    await queryRunner.query(
      `CREATE INDEX "IDX_client_full_name_search" ON "client" USING gin(("firstName" || ' ' || "lastName") gin_trgm_ops)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_client_full_name_search"`);
    await queryRunner.query(`DROP INDEX "IDX_client_tenant_id_uci_unique"`);
    await queryRunner.query(`DROP INDEX "IDX_client_tenant_id_facility_id"`);
    await queryRunner.query(`DROP INDEX "IDX_client_facility_id_is_deleted"`);
    await queryRunner.query(`DROP INDEX "IDX_client_tenant_id_deleted_at"`);
    await queryRunner.query(`DROP INDEX "IDX_client_birth_date"`);
    await queryRunner.query(`DROP INDEX "IDX_client_uci"`);
    await queryRunner.query(`DROP INDEX "IDX_client_is_deleted"`);
    await queryRunner.query(`DROP INDEX "IDX_client_deleted_at"`);
    await queryRunner.query(`DROP INDEX "IDX_client_facility_id"`);
    await queryRunner.query(`DROP INDEX "IDX_client_tenant_id"`);
    await queryRunner.query(`DROP TABLE "client"`);
  }
}
