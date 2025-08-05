# Epic 1 Story 1.5: Audit Logging Triggers - Test Plan

## Unit Tests

### 1. Trigger Function Tests
```sql
-- Test INSERT operation logging
INSERT INTO "user" (id, email, role, tenantId) VALUES 
  ('test-user-id', 'test@example.com', 'STAFF', 'test-tenant-id');

-- Verify audit log created
SELECT * FROM data_audit_log WHERE row_id = 'test-user-id';

-- Test UPDATE operation logging
UPDATE "user" SET email = 'updated@example.com' WHERE id = 'test-user-id';

-- Verify audit log shows changes
SELECT * FROM data_audit_log 
WHERE row_id = 'test-user-id' AND operation = 'UPDATE';

-- Test DELETE operation logging
DELETE FROM "user" WHERE id = 'test-user-id';

-- Verify audit log captured deletion
SELECT * FROM data_audit_log 
WHERE row_id = 'test-user-id' AND operation = 'DELETE';
```

### 2. Change Detection Tests
```sql
-- Test no-change UPDATE (should not create audit log)
UPDATE "user" SET email = email WHERE id = 'test-user-id';

-- Verify no new audit log created
SELECT COUNT(*) FROM data_audit_log 
WHERE row_id = 'test-user-id' 
  AND operation = 'UPDATE' 
  AND changed_fields IS NULL;
```

### 3. Context Capture Tests
```sql
-- Set session context
SELECT set_config('app.user_id', 'context-user-id', true);
SELECT set_config('app.tenant_id', 'context-tenant-id', true);
SELECT set_config('app.user_role', 'ADMIN', true);

-- Perform operation
INSERT INTO "client" (id, firstName, lastName, facilityId, tenantId) 
VALUES ('test-client-id', 'John', 'Doe', 'test-facility-id', 'context-tenant-id');

-- Verify context captured
SELECT user_id, tenant_id, facility_id 
FROM data_audit_log 
WHERE row_id = 'test-client-id';
```

## Integration Tests

### 1. RLS Policy Tests
```typescript
describe('Audit Log RLS Policies', () => {
  it('should allow OWNER to see all tenant audit logs', async () => {
    // Set OWNER context
    await setUserContext('owner-id', 'tenant-1', 'OWNER');
    
    // Query audit logs
    const logs = await db.query('SELECT * FROM data_audit_log');
    
    // Should see all logs for tenant
    expect(logs.every(log => log.tenant_id === 'tenant-1')).toBe(true);
  });

  it('should restrict STAFF to their own audit logs', async () => {
    // Set STAFF context
    await setUserContext('staff-id', 'tenant-1', 'STAFF');
    
    // Query audit logs
    const logs = await db.query('SELECT * FROM data_audit_log');
    
    // Should only see their own logs
    expect(logs.every(log => log.user_id === 'staff-id')).toBe(true);
  });
});
```

### 2. Export Function Tests
```sql
-- Test export with date range
SELECT * FROM export_audit_logs(
  '2025-01-01'::timestamp,
  '2025-12-31'::timestamp
);

-- Test export with tenant filter
SELECT * FROM export_audit_logs(
  '2025-01-01'::timestamp,
  '2025-12-31'::timestamp,
  'specific-tenant-id'::uuid
);

-- Test export with table filter
SELECT * FROM export_audit_logs(
  '2025-01-01'::timestamp,
  '2025-12-31'::timestamp,
  NULL,
  'user'
);
```

### 3. Cleanup Function Tests
```sql
-- Insert old audit log
INSERT INTO data_audit_log (
  id, table_name, operation, row_id, timestamp
) VALUES (
  'old-log-id', 'user', 'UPDATE', 'some-id', 
  NOW() - INTERVAL '3 years'
);

-- Run cleanup
SELECT cleanup_old_audit_logs();

-- Verify old log removed
SELECT COUNT(*) FROM data_audit_log WHERE id = 'old-log-id';
```

## Performance Tests

### 1. Trigger Overhead
```typescript
describe('Audit Trigger Performance', () => {
  it('should not significantly impact INSERT performance', async () => {
    const startTime = Date.now();
    
    // Insert 1000 records
    for (let i = 0; i < 1000; i++) {
      await createUser({
        email: `user${i}@example.com`,
        role: 'STAFF',
        tenantId: 'test-tenant'
      });
    }
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
  });
});
```

### 2. Query Performance
```sql
-- Test indexed query performance
EXPLAIN ANALYZE
SELECT * FROM data_audit_log 
WHERE table_name = 'user' 
  AND row_id = 'specific-id';

-- Should use index scan, not sequential scan
```

## Manual Testing Checklist

### 1. Basic Functionality
- [ ] INSERT operations create audit logs
- [ ] UPDATE operations create audit logs with changed fields
- [ ] DELETE operations create audit logs with old values
- [ ] No-change updates don't create logs

### 2. Context Tracking
- [ ] User ID is captured from session
- [ ] Tenant ID is captured from session
- [ ] Facility ID is extracted for facility-scoped entities
- [ ] Session info (IP, user agent) captured when available

### 3. RLS Enforcement
- [ ] OWNER can see all tenant logs
- [ ] ADMIN can see facility-scoped logs
- [ ] STAFF can see only their own logs
- [ ] Cross-tenant access is blocked

### 4. Utility Functions
- [ ] Export function generates correct format
- [ ] Export filters work correctly
- [ ] Cleanup removes old logs
- [ ] Performance is acceptable

## Security Tests

### 1. SQL Injection Prevention
```sql
-- Attempt SQL injection in session variables
SELECT set_config('app.user_id', 'uuid; DROP TABLE data_audit_log;', true);

-- Should fail or be safely handled
```

### 2. Access Control
```typescript
describe('Audit Log Security', () => {
  it('should prevent unauthorized access', async () => {
    // Clear session context
    await clearUserContext();
    
    // Attempt to query audit logs
    await expect(db.query('SELECT * FROM data_audit_log'))
      .rejects.toThrow();
  });
});
```

## Compliance Tests

### 1. Data Completeness
- [ ] All required fields are captured
- [ ] Timestamps are accurate
- [ ] User attribution is reliable
- [ ] Changes are accurately recorded

### 2. Data Retention
- [ ] Logs are retained for required period
- [ ] Cleanup respects retention policy
- [ ] Export includes all required data
- [ ] No data loss during operations