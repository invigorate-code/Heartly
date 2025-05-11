import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1746895879723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // add rls to facility table using tenantId to ensure that each tenant can only access their own facilities
        await queryRunner.query(`CREATE POLICY "Enable access to own facilities" ON "facility" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id')::uuid)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP POLICY "Enable access to own facilities" ON "facility"`);
    }

}
