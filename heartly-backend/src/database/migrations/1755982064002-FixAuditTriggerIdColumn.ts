import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAuditTriggerIdColumn1755982064002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing function first
    await queryRunner.query(`DROP FUNCTION IF EXISTS audit_trigger_function() CASCADE`);
    
    // Create the fixed audit trigger function that properly handles the ID column
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION audit_trigger_function()
      RETURNS TRIGGER AS $$
      DECLARE
        audit_id uuid;
        changed_fields text[];
        excluded_columns text[] := ARRAY['createdAt', 'updatedAt'];
        json_new jsonb;
        json_old jsonb;
        audit_user_id uuid;
        audit_tenant_id uuid;
        audit_facility_id uuid;
        audit_session_id varchar;
        audit_ip_address varchar;
        audit_user_agent varchar;
      BEGIN
        -- Generate a new UUID for the audit record
        audit_id := uuid_generate_v4();
        
        -- Get context information
        audit_user_id := current_setting('app.user_id', true)::uuid;
        audit_tenant_id := current_setting('app.tenant_id', true)::uuid;
        audit_session_id := current_setting('app.session_id', true);
        audit_ip_address := current_setting('app.ip_address', true);
        audit_user_agent := current_setting('app.user_agent', true);

        IF TG_OP = 'INSERT' THEN
          json_new := to_jsonb(NEW);
          
          -- Only set facility_id if the table has a facilityId column
          IF json_new ? 'facilityId' THEN
            audit_facility_id := (json_new->>'facilityId')::uuid;
          ELSE
            audit_facility_id := NULL;
          END IF;
          
          -- Insert audit record for INSERT operation
          INSERT INTO data_audit_log (
            id, table_name, operation, row_id, user_id, tenant_id, facility_id,
            timestamp, old_values, new_values, changed_fields, session_id, ip_address, user_agent
          ) VALUES (
            audit_id, TG_TABLE_NAME, TG_OP, NEW.id, audit_user_id, audit_tenant_id, audit_facility_id,
            NOW(), NULL, json_new - excluded_columns, NULL, audit_session_id, audit_ip_address, audit_user_agent
          );
          
        ELSIF TG_OP = 'UPDATE' THEN
          json_old := to_jsonb(OLD);
          json_new := to_jsonb(NEW);
          
          -- Calculate changed fields
          SELECT array_agg(key) INTO changed_fields
          FROM jsonb_each(json_old - excluded_columns) old_kv
          JOIN jsonb_each(json_new - excluded_columns) new_kv ON old_kv.key = new_kv.key
          WHERE old_kv.value IS DISTINCT FROM new_kv.value;
          
          -- Don't log if no actual changes
          IF changed_fields IS NULL OR array_length(changed_fields, 1) = 0 THEN
            RETURN NEW;
          END IF;
          
          -- Only set facility_id if the table has a facilityId column
          IF json_new ? 'facilityId' THEN
            audit_facility_id := (json_new->>'facilityId')::uuid;
          ELSE
            audit_facility_id := NULL;
          END IF;
          
          -- Insert audit record for UPDATE operation
          INSERT INTO data_audit_log (
            id, table_name, operation, row_id, user_id, tenant_id, facility_id,
            timestamp, old_values, new_values, changed_fields, session_id, ip_address, user_agent
          ) VALUES (
            audit_id, TG_TABLE_NAME, TG_OP, NEW.id, audit_user_id, audit_tenant_id, audit_facility_id,
            NOW(), json_old - excluded_columns, json_new - excluded_columns, changed_fields, 
            audit_session_id, audit_ip_address, audit_user_agent
          );
          
        ELSIF TG_OP = 'DELETE' THEN
          json_old := to_jsonb(OLD);
          
          -- Only set facility_id if the table has a facilityId column
          IF json_old ? 'facilityId' THEN
            audit_facility_id := (json_old->>'facilityId')::uuid;
          ELSE
            audit_facility_id := NULL;
          END IF;
          
          -- Insert audit record for DELETE operation
          INSERT INTO data_audit_log (
            id, table_name, operation, row_id, user_id, tenant_id, facility_id,
            timestamp, old_values, new_values, changed_fields, session_id, ip_address, user_agent
          ) VALUES (
            audit_id, TG_TABLE_NAME, TG_OP, OLD.id, audit_user_id, audit_tenant_id, audit_facility_id,
            NOW(), json_old - excluded_columns, NULL, NULL, audit_session_id, audit_ip_address, audit_user_agent
          );
        END IF;

        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        ELSE
          RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Recreate all the triggers
    await queryRunner.query(`
      CREATE TRIGGER user_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "user"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryRunner.query(`
      CREATE TRIGGER client_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "client"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryRunner.query(`
      CREATE TRIGGER facility_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "facility"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryRunner.query(`
      CREATE TRIGGER tenant_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "tenant"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryRunner.query(`
      CREATE TRIGGER facility_staff_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "facility_staff"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS user_audit_trigger ON "user"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS client_audit_trigger ON "client"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS facility_audit_trigger ON "facility"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS tenant_audit_trigger ON "tenant"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS facility_staff_audit_trigger ON "facility_staff"`);
    
    // Drop the function
    await queryRunner.query(`DROP FUNCTION IF EXISTS audit_trigger_function()`);
    
    // Restore the previous function that had the ID issue
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION audit_trigger_function()
      RETURNS TRIGGER AS $$
      DECLARE
        audit_row data_audit_log;
        changed_fields text[];
        excluded_columns text[] := ARRAY['createdAt', 'updatedAt'];
        json_new jsonb;
        json_old jsonb;
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
          json_new := to_jsonb(NEW);
          audit_row.new_values := json_new - excluded_columns;
          
          -- Only set facility_id if the table has a facilityId column
          IF json_new ? 'facilityId' THEN
            audit_row.facility_id := (json_new->>'facilityId')::uuid;
          ELSE
            audit_row.facility_id := NULL;
          END IF;
          
        ELSIF TG_OP = 'UPDATE' THEN
          audit_row.row_id := NEW.id;
          json_old := to_jsonb(OLD);
          json_new := to_jsonb(NEW);
          audit_row.old_values := json_old - excluded_columns;
          audit_row.new_values := json_new - excluded_columns;
          
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
          
          -- Only set facility_id if the table has a facilityId column
          IF json_new ? 'facilityId' THEN
            audit_row.facility_id := (json_new->>'facilityId')::uuid;
          ELSE
            audit_row.facility_id := NULL;
          END IF;
          
        ELSIF TG_OP = 'DELETE' THEN
          audit_row.row_id := OLD.id;
          json_old := to_jsonb(OLD);
          audit_row.old_values := json_old - excluded_columns;
          
          -- Only set facility_id if the table has a facilityId column
          IF json_old ? 'facilityId' THEN
            audit_row.facility_id := (json_old->>'facilityId')::uuid;
          ELSE
            audit_row.facility_id := NULL;
          END IF;
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
    
    // Restore all triggers
    await queryRunner.query(`
      CREATE TRIGGER user_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "user"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryRunner.query(`
      CREATE TRIGGER client_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "client"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryRunner.query(`
      CREATE TRIGGER facility_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "facility"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryRunner.query(`
      CREATE TRIGGER tenant_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "tenant"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);

    await queryRunner.query(`
      CREATE TRIGGER facility_staff_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "facility_staff"
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    `);
  }
}