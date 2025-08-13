# Enhanced Authentication Guards Usage Examples

## Available Guards

### 1. EnhancedAuthGuard
- Handles basic authentication with SuperTokens
- Validates email verification status
- Extracts and validates tenant context
- Provides comprehensive security logging
- Supports public and optional auth endpoints

### 2. RolesGuard
- Validates user roles against required roles
- Works with SuperTokens session context
- Provides detailed logging for authorization events
- Supports multiple role requirements

### 3. TenantContextGuard
- Validates tenant context in session
- Ensures proper tenant isolation
- Attaches tenant context to request

### 4. FacilityAccessGuard
- Validates facility-specific access permissions
- Handles role-based facility access (OWNER/ADMIN have all access, STAFF has limited)
- Extracts facility ID from request params/body/query

## Usage Examples

### Basic Authentication
```typescript
@Controller('users')
@UseGuards(EnhancedAuthGuard)
export class UserController {
  @Get()
  async getUsers() {
    // Only authenticated users with verified email can access
  }
}
```

### Role-Based Access Control
```typescript
@Controller('admin')
@UseGuards(EnhancedAuthGuard, RolesGuard)
export class AdminController {
  @Get('reports')
  @Roles('ADMIN', 'OWNER')
  async getReports() {
    // Only ADMIN or OWNER roles can access
  }
}
```

### Tenant Context Validation
```typescript
@Controller('tenant-data')
@UseGuards(EnhancedAuthGuard, TenantContextGuard)
export class TenantDataController {
  @Get()
  async getTenantData(@Req() request: Request) {
    const tenantId = request['tenantId']; // Attached by TenantContextGuard
    // Process tenant-specific data
  }
}
```

### Facility-Specific Access
```typescript
@Controller('facilities')
@UseGuards(EnhancedAuthGuard, FacilityAccessGuard)
export class FacilityController {
  @Get(':facilityId/clients')
  @RequiresFacilityAccess()
  async getFacilityClients(@Param('facilityId') facilityId: string) {
    // Only users with access to this facility can view its clients
  }
}
```

### Combined Guards Example
```typescript
@Controller('secure-facility-admin')
@UseGuards(EnhancedAuthGuard, RolesGuard, TenantContextGuard, FacilityAccessGuard)
export class SecureFacilityAdminController {
  @Post(':facilityId/sensitive-action')
  @Roles('ADMIN', 'OWNER')
  @RequiresFacilityAccess()
  async performSensitiveAction(
    @Param('facilityId') facilityId: string,
    @Req() request: Request
  ) {
    // Requires:
    // 1. Valid authenticated session with verified email
    // 2. ADMIN or OWNER role
    // 3. Valid tenant context
    // 4. Access to the specified facility
    
    const userId = request['userId'];
    const tenantId = request['tenantId'];
    const userRole = request['userRole'];
    
    // Perform sensitive action with full security validation
  }
}
```

### Public Endpoints
```typescript
@Controller('public')
export class PublicController {
  @Get('health')
  @Public()
  async healthCheck() {
    // Public endpoint, no authentication required
  }

  @Get('optional-auth')
  @AuthOptional()
  @UseGuards(EnhancedAuthGuard)
  async optionalAuth(@Req() request: Request) {
    const userId = request['userId']; // May be undefined if not authenticated
    // Handle both authenticated and unauthenticated users
  }
}
```

## Security Features

### Comprehensive Logging
- All authentication attempts (success/failure)
- Role validation results
- Tenant context validation
- Facility access checks
- Security errors and warnings

### Error Handling
- Secure error messages that don't leak information
- Consistent error responses across all guards
- Proper HTTP status codes
- Integration with application-wide error handling

### Performance Considerations
- Guards are designed to be lightweight
- Session validation is cached by SuperTokens
- Minimal database queries (only when necessary)
- Efficient error handling to avoid blocking requests

### HIPAA Compliance
- All security events are logged for audit trails
- No PHI is exposed in error messages
- Proper tenant isolation is enforced
- Access control follows minimum necessary principle