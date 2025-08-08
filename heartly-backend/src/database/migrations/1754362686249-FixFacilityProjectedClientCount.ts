import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFacilityProjectedClientCount1754362686249
  implements MigrationInterface
{
  name = 'FixFacilityProjectedClientCount1754362686249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "FK_client_facility"
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "FK_client_tenant"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_audit_log_user"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_audit_log_client"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_audit_log_target_user"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_audit_log_target_facility"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_audit_log_target_tenant"
        `);
    await queryRunner.query(`
            ALTER TABLE "facility_staff" DROP CONSTRAINT IF EXISTS "FK_f79a22d861415ebfc915028fc89"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_tenant_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_email"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_username"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_deleted_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_tenant_id_deleted_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_tenant_composite"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_role_performance"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_onboarding_performance"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_user_created_performance"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_user_tenant_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_audit_log_table_row"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_audit_log_user_timestamp"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_audit_log_tenant_timestamp"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_audit_log_timestamp"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_tenant_deleted_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_facility_tenant_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_facility_deleted_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_facility_tenant_id_deleted_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_facility_tenant_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_tenant_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_facility_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_deleted_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_is_deleted"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_uci"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_birth_date"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_tenant_id_deleted_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_facility_id_is_deleted"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_tenant_id_facility_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_client_tenant_id_uci_unique"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_client_tenant_facility"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_target_tenant_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_target_facility_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_client_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_action"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_created_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_deleted_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_tenant_created_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_facility_created_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_client_created_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_user_created_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_tenant_action_created_at"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_details_gin"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_active_logs"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_user_performance"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_facility_performance"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_audit_log_tenant_performance"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_audit_log_tenant_facility"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_facility_staff_facility_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_facility_staff_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_facility_staff_performance_facility"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_facility_staff_performance_user"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."idx_facility_staff_user_facility"
        `);
    await queryRunner.query(`
            ALTER TABLE "data_audit_log" DROP CONSTRAINT IF EXISTS "data_audit_log_operation_check"
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "CHK_client_birth_date"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "CHK_audit_log_action_length"
        `);
    await queryRunner.query(`
            CREATE TABLE "form_field_contribution" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "field_name" character varying NOT NULL,
                "form_type" character varying NOT NULL,
                "metadataId" uuid,
                "contributorId" uuid,
                CONSTRAINT "PK_868250e20e5f881f70fb43ca9a1" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "metadata" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "formType" character varying NOT NULL,
                "entityId" character varying NOT NULL,
                "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "lastUpdatedBy" uuid NOT NULL,
                CONSTRAINT "PK_56b22355e89941b9792c04ab176" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "address" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(255),
                "relation" character varying(100),
                "streetAddress" character varying(200),
                "city" character varying(100),
                "zipCode" character varying(20),
                "phone" character varying(20),
                "tenantId" character varying(100),
                CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "specialist" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "type" bytea,
                "name" bytea,
                "addressId" uuid,
                CONSTRAINT "REL_772feb82534d81f3d3aaf08594" UNIQUE ("addressId"),
                CONSTRAINT "PK_461a4a90df7daf980d8b79bc3ce" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "medication" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" bytea,
                "requiredDosage" bytea,
                "timeFrequency" bytea,
                "isPrescription" boolean,
                "prescribingMd" bytea,
                "filledDate" date,
                "refillsRemaining" integer,
                "isDailyMed" boolean,
                "tenantId" character varying NOT NULL,
                "placementInfoId" character varying,
                "clientId" uuid,
                CONSTRAINT "PK_0682f5b7379fea3c2fdb77d6545" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "placement_info" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "nickname" character varying(100),
                "gender" character varying(20),
                "maritalStatus" character varying(50),
                "distinguishingMarks" bytea,
                "languages" character varying(200),
                "uci" bytea,
                "height" bytea,
                "weight" bytea,
                "eyes" bytea,
                "hair" bytea,
                "allergies" bytea,
                "dietarySensitivities" bytea,
                "socialSecurity" bytea,
                "ssi" bytea,
                "ssiPayee" bytea,
                "ssa" bytea,
                "ssaPayee" bytea,
                "otherBenefits" bytea,
                "otherBenefitsPayee" bytea,
                "medical" bytea,
                "medicare" bytea,
                "otherInsurance" bytea,
                "religiousPreference" bytea,
                "religiousPrefAdvisor" bytea,
                "dangerousPropensities" bytea,
                "dangerousPropensitiesDescription" bytea,
                "diagnosis" bytea,
                "medicalNeeds" bytea,
                "communicableConditions" bytea,
                "dateOfPlacement" date,
                "burialArrangements" character varying(500),
                "specialInstructions" character varying(1000),
                "visitationRestrictions" character varying(1000),
                "personsAuthorizedClientFromHome" character varying(1000),
                "otherSignificantInfo" character varying(1000),
                "tenantId" character varying(100),
                "isCompleted" boolean NOT NULL DEFAULT false,
                "completionPercentage" integer NOT NULL DEFAULT '0',
                "clientId" uuid,
                "religiousPrefAddressId" uuid,
                "primaryPhysicianId" uuid,
                "dentistId" uuid,
                "facilityId" uuid,
                "previousPlacementId" uuid,
                "placementAgencyId" uuid,
                "otherAgencyId" uuid,
                "legalRepId" uuid,
                "otherRepId" uuid,
                "metadataId" uuid,
                CONSTRAINT "REL_b68ed446c7c1a5806b6b2b2e3e" UNIQUE ("clientId"),
                CONSTRAINT "REL_af57643966bd9a0e661a5f8910" UNIQUE ("religiousPrefAddressId"),
                CONSTRAINT "REL_384be773910e2d2a6e8d41a98f" UNIQUE ("primaryPhysicianId"),
                CONSTRAINT "REL_443f5aa7ed7e2efa0b55584b71" UNIQUE ("dentistId"),
                CONSTRAINT "REL_933cd46899c4f8b50f7f2cdc5d" UNIQUE ("previousPlacementId"),
                CONSTRAINT "REL_d617e5af4dc38dac1b0a816d81" UNIQUE ("placementAgencyId"),
                CONSTRAINT "REL_e2926900eab0e8465ca8517282" UNIQUE ("otherAgencyId"),
                CONSTRAINT "REL_acd733393077348fcaca40c8ae" UNIQUE ("legalRepId"),
                CONSTRAINT "REL_35af8c075cd665e7bfca8f73c7" UNIQUE ("otherRepId"),
                CONSTRAINT "REL_e22a676b732692689bee92469b" UNIQUE ("metadataId"),
                CONSTRAINT "PK_2568968736531a2835ae0881773" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "contributor" (
                "metadataId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_f7e93b7e8cd99bbf2708274a508" PRIMARY KEY ("metadataId", "userId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_3e58fa23a278b8393e76e26576" ON "contributor" ("metadataId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_4be92df1dfa5c24a494e3f6b33" ON "contributor" ("userId")
        `);
    await queryRunner.query(`
            CREATE TABLE "placement_info_specialists" (
                "placementInfoId" uuid NOT NULL,
                "specialistId" uuid NOT NULL,
                CONSTRAINT "PK_abda47a700571cb437c66f6b825" PRIMARY KEY ("placementInfoId", "specialistId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_bd004c519ae7b2164d66895355" ON "placement_info_specialists" ("placementInfoId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e329d7ce38cd3c7df4b7437a0b" ON "placement_info_specialists" ("specialistId")
        `);
    await queryRunner.query(`
            ALTER TABLE "facility" DROP COLUMN "projected_client_count"
        `);
    await queryRunner.query(`
            ALTER TABLE "facility"
            ADD "projectedClientCount" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "facility"
            ADD "roomCount" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "facility"
            ADD "isDeleted" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "firstName"
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "firstName" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "lastName"
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "lastName" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "uci"
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "uci" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "photo"
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "photo" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP COLUMN "action"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD "action" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "system_audit_logs" DROP COLUMN "details"
        `);
    await queryRunner.query(`
            ALTER TABLE "system_audit_logs"
            ADD "details" jsonb
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a92b15406515b60d366acaecc8" ON "data_audit_log" ("timestamp")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f3108e5284d834716b3f890d88" ON "data_audit_log" ("tenant_id", "timestamp")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_6dc6c7c9c18e926dc6acf3b965" ON "data_audit_log" ("user_id", "timestamp")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_d2b01148b69743bda5e369b3c5" ON "data_audit_log" ("table_name", "row_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_b832d46978373d040e3e064859" ON "user_action_audit_log" ("userId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_34df2b06889612b97cc021ae81" ON "user_action_audit_log" ("targetTenantId")
        `);
    await queryRunner.query(`
            ALTER TABLE "form_field_contribution"
            ADD CONSTRAINT "FK_2da711ad6aa781d74ab9dea89b3" FOREIGN KEY ("metadataId") REFERENCES "metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "form_field_contribution"
            ADD CONSTRAINT "FK_c640250a2e2260566e05115924a" FOREIGN KEY ("contributorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "metadata"
            ADD CONSTRAINT "FK_a192f03fd67e096fd714e8a0d32" FOREIGN KEY ("lastUpdatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD CONSTRAINT "FK_ad1d780ef85cdd11f011d693b3f" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD CONSTRAINT "FK_810b65a0776d2aa7bd93115a682" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_b832d46978373d040e3e0648598" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_3d45dfa67fef2e6403b52d52a86" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_7b52daf9ad061ef1feb3ae2ccd9" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_26354ec7795d2db91ce4e21cf90" FOREIGN KEY ("targetFacilityId") REFERENCES "facility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_34df2b06889612b97cc021ae819" FOREIGN KEY ("targetTenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "specialist"
            ADD CONSTRAINT "FK_772feb82534d81f3d3aaf085949" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "medication"
            ADD CONSTRAINT "FK_48c7f0dfc82800011df120030c6" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_b68ed446c7c1a5806b6b2b2e3ed" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_af57643966bd9a0e661a5f8910c" FOREIGN KEY ("religiousPrefAddressId") REFERENCES "address"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_384be773910e2d2a6e8d41a98f8" FOREIGN KEY ("primaryPhysicianId") REFERENCES "specialist"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_443f5aa7ed7e2efa0b55584b71a" FOREIGN KEY ("dentistId") REFERENCES "specialist"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_e967ae542303c31facaa3b1ac12" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_933cd46899c4f8b50f7f2cdc5de" FOREIGN KEY ("previousPlacementId") REFERENCES "address"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_d617e5af4dc38dac1b0a816d81f" FOREIGN KEY ("placementAgencyId") REFERENCES "address"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_e2926900eab0e8465ca85172829" FOREIGN KEY ("otherAgencyId") REFERENCES "address"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_acd733393077348fcaca40c8aee" FOREIGN KEY ("legalRepId") REFERENCES "address"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_35af8c075cd665e7bfca8f73c7e" FOREIGN KEY ("otherRepId") REFERENCES "address"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info"
            ADD CONSTRAINT "FK_e22a676b732692689bee92469ba" FOREIGN KEY ("metadataId") REFERENCES "metadata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "facility_staff"
            ADD CONSTRAINT "FK_f79a22d861415ebfc915028fc89" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "contributor"
            ADD CONSTRAINT "FK_3e58fa23a278b8393e76e265760" FOREIGN KEY ("metadataId") REFERENCES "metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "contributor"
            ADD CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info_specialists"
            ADD CONSTRAINT "FK_bd004c519ae7b2164d668953559" FOREIGN KEY ("placementInfoId") REFERENCES "placement_info"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info_specialists"
            ADD CONSTRAINT "FK_e329d7ce38cd3c7df4b7437a0b3" FOREIGN KEY ("specialistId") REFERENCES "specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "placement_info_specialists" DROP CONSTRAINT IF EXISTS "FK_e329d7ce38cd3c7df4b7437a0b3"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info_specialists" DROP CONSTRAINT IF EXISTS "FK_bd004c519ae7b2164d668953559"
        `);
    await queryRunner.query(`
            ALTER TABLE "contributor" DROP CONSTRAINT IF EXISTS "FK_4be92df1dfa5c24a494e3f6b330"
        `);
    await queryRunner.query(`
            ALTER TABLE "contributor" DROP CONSTRAINT IF EXISTS "FK_3e58fa23a278b8393e76e265760"
        `);
    await queryRunner.query(`
            ALTER TABLE "facility_staff" DROP CONSTRAINT IF EXISTS "FK_f79a22d861415ebfc915028fc89"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_e22a676b732692689bee92469ba"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_35af8c075cd665e7bfca8f73c7e"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_acd733393077348fcaca40c8aee"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_e2926900eab0e8465ca85172829"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_d617e5af4dc38dac1b0a816d81f"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_933cd46899c4f8b50f7f2cdc5de"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_e967ae542303c31facaa3b1ac12"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_443f5aa7ed7e2efa0b55584b71a"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_384be773910e2d2a6e8d41a98f8"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_af57643966bd9a0e661a5f8910c"
        `);
    await queryRunner.query(`
            ALTER TABLE "placement_info" DROP CONSTRAINT IF EXISTS "FK_b68ed446c7c1a5806b6b2b2e3ed"
        `);
    await queryRunner.query(`
            ALTER TABLE "medication" DROP CONSTRAINT IF EXISTS "FK_48c7f0dfc82800011df120030c6"
        `);
    await queryRunner.query(`
            ALTER TABLE "specialist" DROP CONSTRAINT IF EXISTS "FK_772feb82534d81f3d3aaf085949"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_34df2b06889612b97cc021ae819"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_26354ec7795d2db91ce4e21cf90"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_7b52daf9ad061ef1feb3ae2ccd9"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_3d45dfa67fef2e6403b52d52a86"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP CONSTRAINT IF EXISTS "FK_b832d46978373d040e3e0648598"
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "FK_810b65a0776d2aa7bd93115a682"
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP CONSTRAINT IF EXISTS "FK_ad1d780ef85cdd11f011d693b3f"
        `);
    await queryRunner.query(`
            ALTER TABLE "metadata" DROP CONSTRAINT IF EXISTS "FK_a192f03fd67e096fd714e8a0d32"
        `);
    await queryRunner.query(`
            ALTER TABLE "form_field_contribution" DROP CONSTRAINT IF EXISTS "FK_c640250a2e2260566e05115924a"
        `);
    await queryRunner.query(`
            ALTER TABLE "form_field_contribution" DROP CONSTRAINT IF EXISTS "FK_2da711ad6aa781d74ab9dea89b3"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_34df2b06889612b97cc021ae81"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_b832d46978373d040e3e064859"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_d2b01148b69743bda5e369b3c5"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_6dc6c7c9c18e926dc6acf3b965"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_f3108e5284d834716b3f890d88"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_a92b15406515b60d366acaecc8"
        `);
    await queryRunner.query(`
            ALTER TABLE "system_audit_logs" DROP COLUMN "details"
        `);
    await queryRunner.query(`
            ALTER TABLE "system_audit_logs"
            ADD "details" json
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log" DROP COLUMN "action"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD "action" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "photo"
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "photo" character varying(500)
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "uci"
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "uci" character varying(20) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "lastName"
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "lastName" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "client" DROP COLUMN "firstName"
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD "firstName" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "facility" DROP COLUMN "isDeleted"
        `);
    await queryRunner.query(`
            ALTER TABLE "facility" DROP COLUMN "roomCount"
        `);
    await queryRunner.query(`
            ALTER TABLE "facility" DROP COLUMN "projectedClientCount"
        `);
    await queryRunner.query(`
            ALTER TABLE "facility"
            ADD "projected_client_count" integer NOT NULL
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_e329d7ce38cd3c7df4b7437a0b"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_bd004c519ae7b2164d66895355"
        `);
    await queryRunner.query(`
            DROP TABLE "placement_info_specialists"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_4be92df1dfa5c24a494e3f6b33"
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS "public"."IDX_3e58fa23a278b8393e76e26576"
        `);
    await queryRunner.query(`
            DROP TABLE "contributor"
        `);
    await queryRunner.query(`
            DROP TABLE "placement_info"
        `);
    await queryRunner.query(`
            DROP TABLE "medication"
        `);
    await queryRunner.query(`
            DROP TABLE "specialist"
        `);
    await queryRunner.query(`
            DROP TABLE "address"
        `);
    await queryRunner.query(`
            DROP TABLE "metadata"
        `);
    await queryRunner.query(`
            DROP TABLE "form_field_contribution"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "CHK_audit_log_action_length" CHECK (
                    (
                        (length((action)::text) >= 3)
                        AND (length((action)::text) <= 100)
                    )
                )
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD CONSTRAINT "CHK_client_birth_date" CHECK (
                    (
                        ("birthDate" <= CURRENT_DATE)
                        AND ("birthDate" >= '1900-01-01'::date)
                    )
                )
        `);
    await queryRunner.query(`
            ALTER TABLE "data_audit_log"
            ADD CONSTRAINT "data_audit_log_operation_check" CHECK (
                    (
                        (operation)::text = ANY (
                            (
                                ARRAY ['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying]
                            )::text []
                        )
                    )
                )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_facility_staff_user_facility" ON "facility_staff" ("userId", "facilityId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_facility_staff_performance_user" ON "facility_staff" ("userId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_facility_staff_performance_facility" ON "facility_staff" ("facilityId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_facility_staff_user_id" ON "facility_staff" ("userId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_facility_staff_facility_id" ON "facility_staff" ("facilityId")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_audit_log_tenant_facility" ON "user_action_audit_log" ("targetFacilityId", "targetTenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_tenant_performance" ON "user_action_audit_log" ("targetTenantId", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_facility_performance" ON "user_action_audit_log" ("targetFacilityId", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_user_performance" ON "user_action_audit_log" ("userId", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_active_logs" ON "user_action_audit_log" ("targetTenantId", "created_at")
            WHERE (deleted_at IS NULL)
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_details_gin" ON "user_action_audit_log" ("details")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_tenant_action_created_at" ON "user_action_audit_log" ("targetTenantId", "action", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_user_created_at" ON "user_action_audit_log" ("userId", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_client_created_at" ON "user_action_audit_log" ("clientId", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_facility_created_at" ON "user_action_audit_log" ("targetFacilityId", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_tenant_created_at" ON "user_action_audit_log" ("targetTenantId", "created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_deleted_at" ON "user_action_audit_log" ("deleted_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_created_at" ON "user_action_audit_log" ("created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_action" ON "user_action_audit_log" ("action")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_client_id" ON "user_action_audit_log" ("clientId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_target_facility_id" ON "user_action_audit_log" ("targetFacilityId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_target_tenant_id" ON "user_action_audit_log" ("targetTenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_log_user_id" ON "user_action_audit_log" ("userId")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_client_tenant_facility" ON "client" ("facilityId", "tenantId")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_client_tenant_id_uci_unique" ON "client" ("uci", "tenantId")
            WHERE (deleted_at IS NULL)
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_tenant_id_facility_id" ON "client" ("facilityId", "tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_facility_id_is_deleted" ON "client" ("isDeleted", "facilityId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_tenant_id_deleted_at" ON "client" ("tenantId", "deleted_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_birth_date" ON "client" ("birthDate")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_uci" ON "client" ("uci")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_is_deleted" ON "client" ("isDeleted")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_deleted_at" ON "client" ("deleted_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_facility_id" ON "client" ("facilityId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_client_tenant_id" ON "client" ("tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_facility_tenant_id" ON "facility" ("tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_facility_tenant_id_deleted_at" ON "facility" ("deleted_at", "tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_facility_deleted_at" ON "facility" ("deleted_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_facility_tenant_id" ON "facility" ("tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_tenant_deleted_at" ON "tenant" ("deleted_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_audit_log_timestamp" ON "data_audit_log" ("timestamp")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_audit_log_tenant_timestamp" ON "data_audit_log" ("tenant_id", "timestamp")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_audit_log_user_timestamp" ON "data_audit_log" ("user_id", "timestamp")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_audit_log_table_row" ON "data_audit_log" ("table_name", "row_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_tenant_id" ON "user" ("tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_created_performance" ON "user" ("created_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_onboarding_performance" ON "user" ("onboarding_completed_at", "tenantId")
            WHERE (onboarding_completed_at IS NOT NULL)
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_role_performance" ON "user" ("role", "tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_tenant_composite" ON "user" ("id", "tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_tenant_id_deleted_at" ON "user" ("deleted_at", "tenantId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_deleted_at" ON "user" ("deleted_at")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_username" ON "user" ("username")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_email" ON "user" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_user_tenant_id" ON "user" ("tenantId")
        `);
    await queryRunner.query(`
            ALTER TABLE "facility_staff"
            ADD CONSTRAINT "FK_f79a22d861415ebfc915028fc89" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_audit_log_target_tenant" FOREIGN KEY ("targetTenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_audit_log_target_facility" FOREIGN KEY ("targetFacilityId") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_audit_log_target_user" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_audit_log_client" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_action_audit_log"
            ADD CONSTRAINT "FK_audit_log_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD CONSTRAINT "FK_client_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "client"
            ADD CONSTRAINT "FK_client_facility" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }
}
