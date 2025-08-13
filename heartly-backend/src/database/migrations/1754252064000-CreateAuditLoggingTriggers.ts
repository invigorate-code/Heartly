import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLoggingTriggers1754252064000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a more comprehensive audit log table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "data_audit_log" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "table_name" varchar NOT NULL,
        "operation" varchar NOT NULL CHECK ("operation" IN ('INSERT', 'UPDATE', 'DELETE')),
        "row_id" uuid NOT NULL,
        "user_id" uuid,
        "tenant_id" uuid,
        "facility_id" uuid,
        "timestamp" timestamp NOT NULL DEFAULT NOW(),
        "old_values" jsonb,
        "new_values" jsonb,
        "changed_fields" text[],
        "session_id" varchar,
        "ip_address" varchar,
        "user_agent" varchar,
        CONSTRAINT "PK_data_audit_log" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for the audit log table
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_audit_log_table_row" ON "data_audit_log" ("table_name", "row_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_audit_log_user_timestamp" ON "data_audit_log" ("user_id", "timestamp")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_audit_log_tenant_timestamp" ON "data_audit_log" ("tenant_id", "timestamp")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_audit_log_timestamp" ON "data_audit_log" ("timestamp")`,
    );

    // Create function to handle audit logging
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION audit_trigger_function()
      RETURNS TRIGGER AS $$
      DECLARE
        audit_row data_audit_log;
        changed_fields text[];
        excluded_columns text[] := ARRAY['createdAt', 'updatedAt'];
      BEGIN
        audit_row.table_name := TG_TABLE_NAME;
        audit_row.operation := TG_OP;
        audit_row.user_id := current_setting('app.user_id', true)::uuid;
        audit_row.tenant_id := current_setting('app.tenant_id', true)::uuid;
        audit_row.timestamp := NOW();
        
        -- Get session information if available
        audit_row.session_id := current_setting('app.session_id', true);
        audit_row.ip_address := current_setting('app.ip_address', true);
        audit_row.user_agent := current_setting('app.user_agent', true);

        IF TG_OP = 'INSERT' THEN
          audit_row.row_id := NEW.id;
          audit_row.new_values := to_jsonb(NEW) - excluded_columns;
          audit_row.facility_id := CASE 
            WHEN to_jsonb(NEW) ? 'facilityId' THEN (NEW.facilityId)::uuid
            ELSE NULL
          END;
        ELSIF TG_OP = 'UPDATE' THEN
          audit_row.row_id := NEW.id;
          audit_row.old_values := to_jsonb(OLD) - excluded_columns;
          audit_row.new_values := to_jsonb(NEW) - excluded_columns;
          
          -- Calculate changed fields
          SELECT array_agg(key) INTO changed_fields
          FROM jsonb_each(audit_row.old_values) old_kv
          JOIN jsonb_each(audit_row.new_values) new_kv ON old_kv.key = new_kv.key
          WHERE old_kv.value IS DISTINCT FROM new_kv.value
            AND old_kv.key != ALL(excluded_columns);
          
          audit_row.changed_fields := changed_fields;
          
          -- Don't log if no actual changes
          IF changed_fields IS NULL OR array_length(changed_fields, 1) = 0 THEN
            RETURN NEW;
          END IF;
          
          audit_row.facility_id := CASE 
            WHEN to_jsonb(NEW) ? 'facilityId' THEN (NEW.facilityId)::uuid
            ELSE NULL
          END;
        ELSIF TG_OP = 'DELETE' THEN
          audit_row.row_id := OLD.id;
          audit_row.old_values := to_jsonb(OLD) - excluded_columns;
          audit_row.facility_id := CASE 
            WHEN to_jsonb(OLD) ? 'facilityId' THEN (OLD.facilityId)::uuid
            ELSE NULL
          END;
        END IF;

        -- Insert the audit record
        INSERT INTO data_audit_log VALUES (audit_row.*);

        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        ELSE
          RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create triggers for User table
    await queryRunner.query(`
      CREATE TRIGGER user_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "user"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    // Create triggers for Client table
    await queryRunner.query(`
      CREATE TRIGGER client_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "client"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    // Create triggers for Facility table
    await queryRunner.query(`
      CREATE TRIGGER facility_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "facility"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    // Create triggers for Tenant table
    await queryRunner.query(`
      CREATE TRIGGER tenant_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "tenant"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    // Create triggers for FacilityStaff table
    await queryRunner.query(`
      CREATE TRIGGER facility_staff_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "facility_staff"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    // Enable RLS on the audit log table
    await queryRunner.query(
      `ALTER TABLE "data_audit_log" ENABLE ROW LEVEL SECURITY`,
    );

    // Create RLS policy for audit log table
    await queryRunner.query(`
      CREATE POLICY "audit_log_access_policy" ON "data_audit_log"
      FOR ALL
      USING (
        tenant_id = current_setting('app.tenant_id', true)::uuid
        AND (
          -- OWNER can see all audit logs in their tenant
          current_setting('app.user_role', true) = 'OWNER'
          OR
          -- ADMIN can see audit logs for their facilities
          (
            current_setting('app.user_role', true) = 'ADMIN'
            AND (
              facility_id IS NULL 
              OR facility_id IN (
                SELECT "facilityId" FROM "facility_staff" 
                WHERE "userId" = current_setting('app.user_id', true)::uuid
              )
            )
          )
          OR
          -- STAFF can only see their own audit logs
          (
            current_setting('app.user_role', true) = 'STAFF'
            AND user_id = current_setting('app.user_id', true)::uuid
          )
        )
      )
    `);

    // Create function for audit log retention (keeps logs for 2 years)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
      RETURNS void AS $$
      BEGIN
        DELETE FROM data_audit_log 
        WHERE timestamp < NOW() - INTERVAL '2 years';
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create function to export audit logs for compliance
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION export_audit_logs(
        start_date timestamp,
        end_date timestamp,
        p_tenant_id uuid DEFAULT NULL,
        p_table_name varchar DEFAULT NULL
      )
      RETURNS TABLE(
        audit_date date,
        table_name varchar,
        operation varchar,
        row_id uuid,
        user_email varchar,
        facility_name varchar,
        old_values jsonb,
        new_values jsonb,
        changed_fields text[]
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          date(dal.timestamp) as audit_date,
          dal.table_name,
          dal.operation,
          dal.row_id,
          u.email as user_email,
          f.name as facility_name,
          dal.old_values,
          dal.new_values,
          dal.changed_fields
        FROM data_audit_log dal
        LEFT JOIN "user" u ON dal.user_id = u.id
        LEFT JOIN facility f ON dal.facility_id = f.id
        WHERE dal.timestamp BETWEEN start_date AND end_date
          AND (p_tenant_id IS NULL OR dal.tenant_id = p_tenant_id)
          AND (p_table_name IS NULL OR dal.table_name = p_table_name)
        ORDER BY dal.timestamp DESC;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS user_audit_trigger ON "user"`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS client_audit_trigger ON "client"`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS facility_audit_trigger ON "facility"`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS tenant_audit_trigger ON "tenant"`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS facility_staff_audit_trigger ON "facility_staff"`,
    );

    // Drop functions
    await queryRunner.query(`DROP FUNCTION IF EXISTS audit_trigger_function()`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS cleanup_old_audit_logs()`);
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS export_audit_logs(timestamp, timestamp, uuid, varchar)`,
    );

    // Drop RLS policy
    await queryRunner.query(
      `DROP POLICY IF EXISTS "audit_log_access_policy" ON "data_audit_log"`,
    );

    // Disable RLS
    await queryRunner.query(
      `ALTER TABLE "data_audit_log" DISABLE ROW LEVEL SECURITY`,
    );

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_log_table_row"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_audit_log_user_timestamp"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_audit_log_tenant_timestamp"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_log_timestamp"`);

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "data_audit_log"`);
  }
}
