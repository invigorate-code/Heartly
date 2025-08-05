# Epic 1 Story 1.2: RLS Policies - Test Plan

## Unit Tests

### 1. RLS Context Middleware Tests
```typescript
describe('RlsContextMiddleware', () => {
  it('should set database context for authenticated users');
  it('should handle missing session gracefully');
  it('should extract tenant, user, and role from session');
  it('should handle database errors');
});
```

### 2. RLS Context Cleanup Middleware Tests
```typescript
describe('RlsContextCleanupMiddleware', () => {
  it('should clean up query runner on response finish');
  it('should handle cleanup errors gracefully');
});
```

## Integration Tests

### 1. Tenant Isolation Tests
```typescript
describe('RLS Tenant Isolation', () => {
  it('should prevent cross-tenant data access for users');
  it('should prevent cross-tenant data access for clients');
  it('should prevent cross-tenant data access for facilities');
  it('should allow access within same tenant');
});
```

### 2. Role-Based Access Tests
```typescript
describe('RLS Role-Based Access', () => {
  describe('OWNER role', () => {
    it('should access all data in their tenant');
    it('should see all facilities');
    it('should see all audit logs');
  });

  describe('ADMIN role', () => {
    it('should only access assigned facilities');
    it('should see clients in assigned facilities');
    it('should see audit logs for assigned facilities');
  });

  describe('STAFF role', () => {
    it('should only access assigned facilities');
    it('should see clients in assigned facilities');
    it('should only see their own audit logs');
  });
});
```

### 3. Facility Assignment Tests
```typescript
describe('RLS Facility Assignment', () => {
  it('should enforce facility assignments for ADMIN users');
  it('should enforce facility assignments for STAFF users');
  it('should update access when facility assignments change');
});
```

## E2E Tests

### 1. API Endpoint Tests
```typescript
describe('RLS API Integration', () => {
  it('should filter GET /users based on tenant');
  it('should filter GET /clients based on role and facility');
  it('should filter GET /facilities based on role');
  it('should prevent unauthorized data modifications');
});
```

### 2. Performance Tests
```typescript
describe('RLS Performance', () => {
  it('should maintain query performance with RLS enabled');
  it('should use indexes effectively');
  it('should handle concurrent requests efficiently');
});
```

## Manual Testing Checklist

### 1. Cross-Tenant Access Prevention
- [ ] Create two tenants with users
- [ ] Attempt to access Tenant B data as Tenant A user
- [ ] Verify access is denied

### 2. Role-Based Access Verification
- [ ] Test OWNER accessing all tenant data
- [ ] Test ADMIN accessing only assigned facilities
- [ ] Test STAFF accessing only assigned facilities
- [ ] Test audit log visibility for each role

### 3. Session Integration
- [ ] Verify RLS context is set on login
- [ ] Verify context is cleared on logout
- [ ] Test session expiry handling

### 4. Database Migration
- [ ] Run migration on clean database
- [ ] Run migration rollback
- [ ] Verify indexes are created
- [ ] Test migration idempotency

## Security Testing

### 1. SQL Injection Prevention
- [ ] Test RLS policies with malicious inputs
- [ ] Verify session variables cannot be manipulated
- [ ] Test parameter binding in queries

### 2. Access Control Validation
- [ ] Verify no data leakage across tenants
- [ ] Test privilege escalation attempts
- [ ] Validate audit trail for all access

## Test Data Setup
```sql
-- Create test tenants
INSERT INTO tenant (id, name) VALUES 
  ('tenant-1-uuid', 'Test Tenant 1'),
  ('tenant-2-uuid', 'Test Tenant 2');

-- Create test users with different roles
INSERT INTO user (id, email, role, tenantId) VALUES
  ('owner-1-uuid', 'owner@tenant1.com', 'OWNER', 'tenant-1-uuid'),
  ('admin-1-uuid', 'admin@tenant1.com', 'ADMIN', 'tenant-1-uuid'),
  ('staff-1-uuid', 'staff@tenant1.com', 'STAFF', 'tenant-1-uuid'),
  ('owner-2-uuid', 'owner@tenant2.com', 'OWNER', 'tenant-2-uuid');

-- Create test facilities
INSERT INTO facility (id, name, tenantId) VALUES
  ('facility-1-uuid', 'Facility 1', 'tenant-1-uuid'),
  ('facility-2-uuid', 'Facility 2', 'tenant-1-uuid'),
  ('facility-3-uuid', 'Facility 3', 'tenant-2-uuid');

-- Create facility assignments
INSERT INTO facility_staff (facilityId, userId, assignedAt) VALUES
  ('facility-1-uuid', 'admin-1-uuid', NOW()),
  ('facility-1-uuid', 'staff-1-uuid', NOW());
```