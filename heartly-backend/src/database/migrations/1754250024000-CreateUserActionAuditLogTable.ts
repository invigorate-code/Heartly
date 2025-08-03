import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserActionAuditLogTable1754250024000 implements MigrationInterface {
    name = 'CreateUserActionAuditLogTable1754250024000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create user_action_audit_log table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_action_audit_log" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "clientId" uuid,
                "targetUserId" uuid,
                "targetFacilityId" uuid NOT NULL,
                "targetTenantId" uuid NOT NULL,
                "action" varchar(100) NOT NULL,
                "details" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_user_action_audit_log" PRIMARY KEY ("id"),
                CONSTRAINT "FK_audit_log_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_audit_log_client" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE,
                CONSTRAINT "FK_audit_log_target_user" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE,
                CONSTRAINT "FK_audit_log_target_facility" FOREIGN KEY ("targetFacilityId") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_audit_log_target_tenant" FOREIGN KEY ("targetTenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "CHK_audit_log_action_length" CHECK (LENGTH(action) >= 3 AND LENGTH(action) <= 100)
            )
        `);

        // Create indexes for performance optimization (compliance queries)
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_user_id" ON "user_action_audit_log" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_target_tenant_id" ON "user_action_audit_log" ("targetTenantId")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_target_facility_id" ON "user_action_audit_log" ("targetFacilityId")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_client_id" ON "user_action_audit_log" ("clientId")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_action" ON "user_action_audit_log" ("action")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_created_at" ON "user_action_audit_log" ("created_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_deleted_at" ON "user_action_audit_log" ("deleted_at")`);

        // Composite indexes for common audit queries
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_tenant_created_at" ON "user_action_audit_log" ("targetTenantId", "created_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_facility_created_at" ON "user_action_audit_log" ("targetFacilityId", "created_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_client_created_at" ON "user_action_audit_log" ("clientId", "created_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_user_created_at" ON "user_action_audit_log" ("userId", "created_at")`);
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_tenant_action_created_at" ON "user_action_audit_log" ("targetTenantId", "action", "created_at")`);

        // JSONB index for details queries
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_details_gin" ON "user_action_audit_log" USING gin(details)`);

        // Partial index for non-deleted audit logs
        await queryRunner.query(`CREATE INDEX "IDX_audit_log_active_logs" ON "user_action_audit_log" ("targetTenantId", "created_at") WHERE "deleted_at" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_audit_log_active_logs"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_details_gin"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_tenant_action_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_user_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_client_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_facility_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_tenant_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_deleted_at"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_action"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_client_id"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_target_facility_id"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_target_tenant_id"`);
        await queryRunner.query(`DROP INDEX "IDX_audit_log_user_id"`);
        await queryRunner.query(`DROP TABLE "user_action_audit_log"`);
    }
}