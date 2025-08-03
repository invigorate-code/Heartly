import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFacilityStaffTable1754250025000 implements MigrationInterface {
    name = 'CreateFacilityStaffTable1754250025000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create facility_staff junction table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "facility_staff" (
                "facilityId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
                "assigned_by" uuid,
                CONSTRAINT "PK_facility_staff" PRIMARY KEY ("facilityId", "userId"),
                CONSTRAINT "FK_facility_staff_facility" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_facility_staff_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_facility_staff_assigned_by" FOREIGN KEY ("assigned_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE
            )
        `);

        // Create indexes for performance
        await queryRunner.query(`CREATE INDEX "IDX_facility_staff_facility_id" ON "facility_staff" ("facilityId")`);
        await queryRunner.query(`CREATE INDEX "IDX_facility_staff_user_id" ON "facility_staff" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_facility_staff_assigned_at" ON "facility_staff" ("assigned_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_facility_staff_assigned_by" ON "facility_staff" ("assigned_by")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_facility_staff_assigned_by"`);
        await queryRunner.query(`DROP INDEX "IDX_facility_staff_assigned_at"`);
        await queryRunner.query(`DROP INDEX "IDX_facility_staff_user_id"`);
        await queryRunner.query(`DROP INDEX "IDX_facility_staff_facility_id"`);
        await queryRunner.query(`DROP TABLE "facility_staff"`);
    }
}