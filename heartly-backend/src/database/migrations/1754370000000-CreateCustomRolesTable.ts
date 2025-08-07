import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCustomRolesTable1754370000000 implements MigrationInterface {
  name = 'CreateCustomRolesTable1754370000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'custom_roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'display_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'permissions',
            type: 'jsonb',
            isNullable: false,
            default: "'[]'",
          },
          {
            name: 'is_system',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'tenant_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['tenant_id'],
            referencedTableName: 'tenants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            name: 'fk_custom_roles_tenant_id',
          },
          {
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            name: 'fk_custom_roles_created_by',
          },
          {
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            name: 'fk_custom_roles_updated_by',
          },
        ],
      }),
      true,
    );

    // Create unique index for role name per tenant
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_custom_roles_name_tenant_unique" ON "custom_roles" ("tenant_id", "name")`,
    );

    // Create index for active roles per tenant
    await queryRunner.query(
      `CREATE INDEX "idx_custom_roles_tenant_active" ON "custom_roles" ("tenant_id", "is_active")`,
    );

    // Create index for system roles
    await queryRunner.query(
      `CREATE INDEX "idx_custom_roles_is_system" ON "custom_roles" ("is_system")`,
    );

    // Insert default system roles for documentation purposes
    // Note: These will be managed by SuperTokens but tracked here for UI purposes
    await queryRunner.query(`
      INSERT INTO custom_roles (name, display_name, description, permissions, is_system, tenant_id, created_at, updated_at)
      SELECT 
        role_name,
        display_name,
        description,
        permissions::jsonb,
        true,
        t.id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      FROM (
        VALUES 
          ('OWNER', 'Owner', 'Full system access and tenant management', 
           '["users:read","users:write","users:delete","users:invite","facilities:read","facilities:write","facilities:delete","clients:read","clients:write","clients:delete","audit:read","audit:export","tenant:manage","roles:manage","roles:create","roles:delete"]'),
          ('ADMIN', 'Administrator', 'Administrative access with user and facility management',
           '["users:read","users:write","users:invite","facilities:read","facilities:write","clients:read","clients:write","clients:delete","audit:read","audit:export","roles:read"]'),
          ('STAFF', 'Staff Member', 'Basic operational access for client management',
           '["users:read","facilities:read","clients:read","clients:write","audit:read"]')
      ) AS system_roles(role_name, display_name, description, permissions)
      CROSS JOIN tenants t;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('custom_roles');
  }
}