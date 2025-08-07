# Custom Roles Testing Guide

## API Testing with curl/Postman

### 1. Get Available Permissions
```bash
curl -X GET "http://localhost:3000/api/custom-roles/permissions" \
  -H "Authorization: Bearer <owner-or-admin-token>"
```

### 2. Create Custom Role (OWNER only)
```bash
curl -X POST "http://localhost:3000/api/custom-roles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <owner-token>" \
  -d '{
    "name": "nurse_supervisor",
    "displayName": "Nurse Supervisor",
    "description": "Supervises nursing staff and patient care",
    "permissions": ["users:read", "clients:read", "clients:write", "audit:read"]
  }'
```

### 3. List All Roles (System + Custom)
```bash
curl -X GET "http://localhost:3000/api/custom-roles" \
  -H "Authorization: Bearer <admin-or-owner-token>"
```

### 4. Update Custom Role (OWNER only)
```bash
curl -X PUT "http://localhost:3000/api/custom-roles/{role-id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <owner-token>" \
  -d '{
    "displayName": "Senior Nurse Supervisor",
    "permissions": ["users:read", "clients:read", "clients:write", "facilities:read", "audit:read"]
  }'
```

### 5. Assign Custom Role to User (ADMIN+ only)
```bash
curl -X POST "http://localhost:3000/api/custom-roles/nurse_supervisor/assign" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-or-owner-token>" \
  -d '{
    "userId": "target-user-id"
  }'
```

### 6. Remove Role from User (ADMIN+ only)
```bash
curl -X DELETE "http://localhost:3000/api/custom-roles/nurse_supervisor/assign/target-user-id" \
  -H "Authorization: Bearer <admin-or-owner-token>"
```

### 7. Delete Custom Role (OWNER only)
```bash
curl -X DELETE "http://localhost:3000/api/custom-roles/{role-id}" \
  -H "Authorization: Bearer <owner-token>"
```

## Expected Responses

### Success Cases
- **200/201**: Operation successful
- **Role Creation**: Returns role object with generated ID
- **Role List**: Returns `{ systemRoles: [...], customRoles: [...] }`

### Error Cases to Test
- **403**: ADMIN trying to create custom role (only OWNER can)
- **403**: STAFF trying to access any custom role endpoint
- **409**: Creating role with duplicate name
- **409**: Creating role with system role name (OWNER, ADMIN, STAFF)
- **409**: Invalid permissions in role creation
- **404**: Trying to update/delete non-existent role
- **401**: Unverified email trying to create role

## Database Verification

Check custom roles table:
```sql
SELECT * FROM custom_roles WHERE tenant_id = 'your-tenant-id';
```

Check SuperTokens role assignment:
```sql
-- This depends on your SuperTokens database setup
SELECT * FROM user_roles WHERE tenant_id = 'your-tenant-id';
```