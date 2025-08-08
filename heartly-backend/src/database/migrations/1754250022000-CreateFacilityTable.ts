import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFacilityTable1754250022000 implements MigrationInterface {
  name = 'CreateFacilityTable1754250022000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create facility table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "facility" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" varchar(100) NOT NULL,
                "address" varchar(200) NOT NULL,
                "city" varchar(100) NOT NULL,
                "state" varchar(2) NOT NULL,
                "zip" varchar(10) NOT NULL,
                "projectedClientCount" integer NOT NULL DEFAULT 0,
                "roomCount" integer DEFAULT 0,
                "isDeleted" boolean NOT NULL DEFAULT false,
                "tenantId" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_facility" PRIMARY KEY ("id"),
                CONSTRAINT "FK_facility_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "CHK_facility_projected_client_count" CHECK ("projectedClientCount" >= 0),
                CONSTRAINT "CHK_facility_room_count" CHECK ("roomCount" IS NULL OR "roomCount" >= 0),
                CONSTRAINT "CHK_facility_state_format" CHECK (LENGTH("state") = 2 AND "state" = UPPER("state")),
                CONSTRAINT "CHK_facility_zip_format" CHECK ("zip" ~ '^[0-9]{5}(-[0-9]{4})?$')
            )
        `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_facility_tenant_id" ON "facility" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_facility_deleted_at" ON "facility" ("deleted_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_facility_tenant_id_deleted_at" ON "facility" ("tenantId", "deleted_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_facility_tenant_id_deleted_at"`);
    await queryRunner.query(`DROP INDEX "IDX_facility_deleted_at"`);
    await queryRunner.query(`DROP INDEX "IDX_facility_tenant_id"`);
    await queryRunner.query(`DROP TABLE "facility"`);
  }
}
