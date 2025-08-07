# Frontend Roles Testing Guide

## 1. Role-Based Component Testing

### Test RoleBasedAccess Component
Create a test page with different role requirements:

```typescript
// Test component in app/test-roles/page.tsx
export default function TestRolesPage() {
  return (
    <div className="p-6 space-y-4">
      <h1>Role-Based Access Testing</h1>
      
      {/* Owner Only */}
      <OwnerOnly fallback={<div>❌ Owner access denied</div>}>
        <div className="bg-red-100 p-4">✅ Owner content visible</div>
      </OwnerOnly>
      
      {/* Admin or Owner */}
      <AdminOrOwner fallback={<div>❌ Admin/Owner access denied</div>}>
        <div className="bg-blue-100 p-4">✅ Admin/Owner content visible</div>
      </AdminOrOwner>
      
      {/* Custom role check */}
      <RoleBasedAccess 
        allowedRoles={["ADMIN", "nurse_supervisor"]} 
        fallback={<div>❌ Admin or Nurse Supervisor access denied</div>}
      >
        <div className="bg-green-100 p-4">✅ Admin or Nurse Supervisor content</div>
      </RoleBasedAccess>
      
      {/* Multiple custom roles */}
      <RoleBasedAccess 
        allowedRoles={["facility_manager", "intake_specialist"]} 
        fallback={<div>❌ Facility Manager or Intake Specialist access denied</div>}
      >
        <div className="bg-yellow-100 p-4">✅ Custom roles content</div>
      </RoleBasedAccess>
    </div>
  );
}
```

## 2. Custom Role Manager Testing

### Access the Role Management Interface
1. **Navigate to**: `/dashboard/settings/roles` (or wherever you mount CustomRoleManager)
2. **Login as OWNER**: Should see full interface
3. **Login as ADMIN**: Should see "Only organization owners can manage custom roles" message
4. **Login as STAFF**: Should see access denied message

### Test Role Management Flow
As an OWNER user:

1. **View System Roles**: Should see OWNER, ADMIN, STAFF cards marked as "System"
2. **Create Custom Role**:
   - Click "Create Custom Role"
   - Fill in: name="test_role", displayName="Test Role"
   - Select permissions from different categories
   - Submit and verify creation
3. **Edit Custom Role**:
   - Click "Edit" on a custom role
   - Modify display name and permissions
   - Submit and verify changes
4. **Delete Custom Role**:
   - Click "Delete" on a custom role
   - Confirm deletion
   - Verify role is removed

## 3. Navigation Testing

Test that navigation items show/hide based on roles:
- **OWNER**: Should see all navigation items
- **ADMIN**: Should see most items except tenant management
- **STAFF**: Should see limited navigation options

## 4. Permission Hook Testing

Test the useHasRole and useHasPermission hooks:

```typescript
function TestHooksComponent() {
  const hasOwnerRole = useHasRole("OWNER");
  const hasAdminOrOwner = useHasRole(["ADMIN", "OWNER"]);
  const canManageUsers = useHasPermission("ADMIN");
  const hasCustomRole = useHasRole("nurse_supervisor");
  
  return (
    <div>
      <p>Has Owner: {hasOwnerRole ? "✅" : "❌"}</p>
      <p>Has Admin or Owner: {hasAdminOrOwner ? "✅" : "❌"}</p>
      <p>Can Manage Users: {canManageUsers ? "✅" : "❌"}</p>
      <p>Has Custom Role: {hasCustomRole ? "✅" : "❌"}</p>
    </div>
  );
}
```

## 5. Multi-User Testing Scenarios

### Create Test Users
1. **Owner User**: First user of tenant (gets OWNER automatically)
2. **Admin User**: Invited by owner with ADMIN role
3. **Staff User**: Invited by admin with STAFF role
4. **Custom Role User**: User assigned a custom role

### Test Cross-User Interactions
1. **Owner creates custom role** → **Admin assigns it to staff user**
2. **Staff user tries to access admin features** → Should be denied
3. **User with custom role accesses permitted features** → Should work
4. **User with custom role tries to access restricted features** → Should be denied