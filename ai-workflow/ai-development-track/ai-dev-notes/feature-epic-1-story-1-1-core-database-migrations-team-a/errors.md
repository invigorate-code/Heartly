# Error Handling & Troubleshooting: Core Database Migrations

## 🚨 Common Issues

### **1. TypeORM Schema Builder Compatibility Issues**
**Problem**: TypeORM's `new Table()`, `new Index()`, `new ForeignKey()` constructors causing TypeScript errors
```
error TS2350: Only a void function can be called with the 'new' keyword
error TS2353: Object literal may only specify known properties
```
**Solution**: Switch to direct SQL queries using `queryRunner.query()` instead of schema builder
**Root Cause**: Version compatibility issues between TypeORM versions and constructor syntax

### **2. Existing Database State Conflicts**
**Problem**: Migration failures due to existing tables/types
```
QueryFailedError: relation "tenant" already exists
QueryFailedError: type "user_role_enum" already exists
```
**Solution**: Use `IF NOT EXISTS` patterns and PostgreSQL DO blocks for type creation
```sql
-- For tables
CREATE TABLE IF NOT EXISTS "tenant" (...)

-- For types  
DO $$ BEGIN CREATE TYPE "user_role_enum" AS ENUM('OWNER', 'ADMIN', 'STAFF'); 
EXCEPTION WHEN duplicate_object THEN null; END $$
```

### **3. Migration Sequence Issues**
**Problem**: Foreign key constraints failing due to missing referenced tables
**Solution**: Ensure proper migration ordering with timestamp-based naming:
1. 1754250020000 - Tenant (no dependencies)
2. 1754250021000 - User (depends on Tenant)
3. 1754250022000 - Facility (depends on Tenant)
4. 1754250023000 - Client (depends on Facility, Tenant)
5. 1754250024000 - UserActionAuditLog (depends on User, Client, Facility, Tenant)
6. 1754250025000 - FacilityStaff (depends on Facility, User)

### **4. Index Creation Conflicts**
**Problem**: Duplicate index errors when running migrations multiple times
**Solution**: Use `CREATE INDEX IF NOT EXISTS` for all index creation
```sql
CREATE INDEX IF NOT EXISTS "IDX_user_tenant_id" ON "user" ("tenantId")
```

## 🔧 Debugging Steps

### **Migration Execution Debugging**
1. **Check migration status**: `pnpm migration:show`
2. **View database schema**: Connect to database and check existing tables
3. **Check migration logs**: Review TypeORM migration execution logs
4. **Verify foreign keys**: Ensure referenced tables exist before creating dependencies
5. **Test individual migrations**: Execute migrations one by one to isolate issues

### **Database State Verification**
```sql
-- Check existing tables
\dt

-- Check existing types
\dT

-- Check existing indexes
\di

-- Check foreign key constraints
SELECT conname, conrelid::regclass, confrelid::regclass
FROM pg_constraint WHERE contype = 'f';
```

## 📝 Error Logs

### **TypeORM CLI Configuration Issues**
```
TypeError: The "paths[1]" argument must be of type string. Received an instance of Array
ERR_INVALID_ARG_TYPE
```
**Context**: TypeORM CLI having issues with data source configuration
**Resolution**: Use package.json scripts instead of direct CLI commands

### **Migration Transaction Rollbacks**
```
query: START TRANSACTION
query failed: CREATE TYPE "user_role_enum" AS ENUM(...)
error: type "user_role_enum" already exists
query: ROLLBACK
Migration "CreateUserTable1754250021000" failed
```
**Context**: Automatic transaction rollback on migration failures
**Resolution**: Fix the failing query and re-run migration

### **Database Connection Issues**
```
Error during migration run:
Database connection failed
```
**Context**: Environment configuration or database availability issues
**Resolution**: Verify DATABASE_URL and database server status

## 🛠️ Validation Rules

### **Migration File Standards**
1. **Naming Convention**: `{timestamp}-{DescriptiveName}.ts`
2. **Class Naming**: `{DescriptiveName}{timestamp}` implements `MigrationInterface`
3. **Required Methods**: Both `up()` and `down()` methods must be implemented
4. **SQL Formatting**: Use consistent indentation and formatting for readability

### **Database Constraint Validation**
1. **Email Format**: `email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`
2. **State Format**: `LENGTH(state) = 2 AND state = UPPER(state)`
3. **ZIP Code Format**: `zip ~ '^[0-9]{5}(-[0-9]{4})?$'`
4. **Date Ranges**: `birthDate <= CURRENT_DATE AND birthDate >= '1900-01-01'`
5. **Positive Numbers**: `projectedClientCount >= 0`

### **Foreign Key Relationship Rules**
1. **Tenant Relationships**: All tenant-scoped tables must have `tenantId` foreign key
2. **Cascade Rules**: 
   - `CASCADE` for dependent data (audit logs, staff assignments)
   - `SET NULL` for optional references (client photos, assigned_by fields)
   - `RESTRICT` for critical data protection
3. **Index Requirements**: Foreign key columns must have indexes for performance

### **HIPAA Compliance Validation**
1. **Audit Logging**: All PHI access must be logged in audit tables
2. **Data Encryption**: Sensitive fields use `bytea` type for encrypted storage
3. **Access Controls**: Proper tenant isolation enforced at database level
4. **Data Integrity**: CHECK constraints prevent invalid PHI data entry

## 🔍 Performance Considerations

### **Index Strategy Validation**
1. **Composite Indexes**: `(tenantId, deleted_at)` for soft delete queries
2. **Partial Indexes**: `WHERE deleted_at IS NULL` for active records
3. **GIN Indexes**: For JSONB fields and full-text search
4. **Unique Indexes**: For business logic constraints (UCI per tenant)

### **Query Optimization Checks**
1. **Tenant Scoping**: All queries must include tenantId filter
2. **Soft Delete Handling**: Include deleted_at IS NULL where appropriate  
3. **Index Coverage**: Ensure common query patterns are covered by indexes
4. **Join Performance**: Verify foreign key indexes support efficient joins

## 🚦 Migration Execution Checklist

### **Pre-Migration Validation**
- [ ] Database backup completed
- [ ] Migration files have proper naming and structure
- [ ] All referenced tables exist for foreign keys
- [ ] No syntax errors in SQL statements
- [ ] IF NOT EXISTS patterns used for existing elements

### **Post-Migration Validation**
- [ ] All tables created successfully
- [ ] Foreign key constraints working properly
- [ ] Indexes created and performing well
- [ ] CHECK constraints enforcing data validation
- [ ] Audit logging tables functional
- [ ] Tenant isolation working correctly

### **Rollback Preparedness**
- [ ] Down migrations tested and working
- [ ] Data migration rollback procedures documented
- [ ] Backup restoration procedures verified
- [ ] Critical data preservation confirmed