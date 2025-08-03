# Error Handling & Troubleshooting: Create Core Database Migrations

## 🚨 Common Issues

### Migration Conflicts
**Problem**: Multiple migrations trying to create the same table or column
**Solution**: 
- Check existing migrations for conflicts
- Use unique migration names with timestamps
- Ensure migrations are run in correct order

### Foreign Key Constraint Errors
**Problem**: Foreign key references non-existent tables or columns
**Solution**:
- Verify referenced tables exist before creating foreign keys
- Check column types match between referenced tables
- Ensure proper cascade rules are defined

### Tenant Isolation Issues
**Problem**: Data not properly isolated between tenants
**Solution**:
- Verify tenant_id is included in all relevant tables
- Check RLS policies are properly configured
- Ensure tenant context is available in all queries

### Performance Issues
**Problem**: Slow queries due to missing indexes
**Solution**:
- Add composite indexes for common query patterns
- Use partial indexes for active records only
- Monitor query performance with EXPLAIN ANALYZE

## 🔧 Debugging Steps

### 1. Migration Validation
```bash
# Check migration status
npm run migration:show

# Validate migration files
npm run migration:validate

# Test migration rollback
npm run migration:revert
```

### 2. Database Schema Verification
```sql
-- Check table structure
\d+ table_name

-- Verify foreign key constraints
SELECT * FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY';

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'table_name';
```

### 3. Tenant Isolation Testing
```sql
-- Test cross-tenant data access
SELECT * FROM users WHERE tenant_id != 'current_tenant_id';

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'table_name';
```

## 📝 Error Logs

### Migration Execution Errors
```
Error: relation "table_name" already exists
Context: Migration 1234567890-CreateTableName
Solution: Check if table already exists, use IF NOT EXISTS

Error: column "column_name" does not exist
Context: Foreign key constraint creation
Solution: Verify column exists in referenced table
```

### Constraint Violation Errors
```
Error: duplicate key value violates unique constraint
Context: Email uniqueness constraint
Solution: Check for duplicate emails within tenant scope

Error: new row for relation violates check constraint
Context: Status field validation
Solution: Verify status value is in allowed enum values
```

## 🛠️ Validation Rules

### Database Constraints
- **NOT NULL**: All required fields must have NOT NULL constraint
- **UNIQUE**: Email addresses must be unique per tenant
- **CHECK**: Status fields must have valid enum values
- **FOREIGN KEY**: All relationships must have proper foreign key constraints

### Migration Rules
- **Reversible**: All migrations must have up() and down() methods
- **Atomic**: Each migration should be atomic and complete
- **Ordered**: Migrations must be run in timestamp order
- **Tested**: All migrations must be tested before deployment

### HIPAA Compliance Rules
- **Encryption**: All PHI fields must be encrypted at rest
- **Audit**: All data changes must be logged
- **Isolation**: Cross-tenant data access must be prevented
- **Access Control**: Database access must be role-based

## 🔍 Troubleshooting Checklist

### Before Running Migrations
- [ ] Backup existing database
- [ ] Check migration order and dependencies
- [ ] Verify TypeORM configuration
- [ ] Test migrations in development environment

### During Migration Execution
- [ ] Monitor migration progress
- [ ] Check for constraint violations
- [ ] Verify tenant isolation
- [ ] Test data integrity

### After Migration Completion
- [ ] Verify all tables created correctly
- [ ] Test foreign key relationships
- [ ] Check performance with indexes
- [ ] Validate audit logging
- [ ] Test tenant isolation
- [ ] Verify HIPAA compliance

## 🚨 Emergency Procedures

### Migration Rollback
```bash
# Revert last migration
npm run migration:revert

# Revert specific migration
npm run migration:revert -- -n MigrationName

# Reset to specific migration
npm run migration:run -- -n MigrationName
```

### Database Recovery
```bash
# Restore from backup
pg_restore -d database_name backup_file.sql

# Reset database completely
npm run db:reset
```

### Data Integrity Verification
```sql
-- Check for orphaned records
SELECT * FROM child_table 
WHERE parent_id NOT IN (SELECT id FROM parent_table);

-- Verify tenant isolation
SELECT tenant_id, COUNT(*) 
FROM users 
GROUP BY tenant_id;
``` 