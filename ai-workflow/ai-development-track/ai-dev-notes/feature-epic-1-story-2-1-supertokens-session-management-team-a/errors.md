# Error Handling & Troubleshooting: SuperTokens Session Management Integration

## 🚨 Common Issues

### 1. Session Middleware Registration Issues

**Problem**: SuperTokens middleware not working, session data not available
**Symptoms**: 
- Authentication fails even with valid credentials
- Session decorators return null
- RLS context not set properly

**Solution**:
```typescript
// Ensure middleware is registered in correct order in main.ts
app.use(middleware()); // SuperTokens first
app.use(sessionContextInitMiddleware.use.bind(sessionContextInitMiddleware));
app.use(rlsMiddleware.use.bind(rlsMiddleware));
```

**Root Cause**: Middleware order is critical - SuperTokens must be first

### 2. Tenant Context Missing in Session

**Problem**: Session created without tenant information
**Symptoms**:
- `userPayload.tenantId` is undefined
- RLS policies fail to set tenant context
- Cross-tenant data access possible

**Solution**:
```typescript
// Verify getUserTenantContext function works correctly
const tenantContext = await getUserTenantContext(input.userId);
if (!tenantContext) {
  throw new Error('Unable to retrieve tenant context for user');
}
```

**Root Cause**: User entity not properly loaded with tenant relation

### 3. RLS Context Database Errors

**Problem**: Database context setting fails
**Symptoms**:
- `set_config` queries fail
- RLS policies not enforced
- Database connection errors

**Solution**:
```typescript
// Add proper error handling in RLS middleware
try {
  await this.dataSource.query(
    `SELECT set_config('app.tenant_id', $1, true)`,
    [tenantId],
  );
} catch (error) {
  console.error('Failed to set RLS context:', error);
  throw error; // Don't continue with invalid context
}
```

**Root Cause**: Database connection issues or PostgreSQL configuration

### 4. Session Context Service Request Scope Issues

**Problem**: Session context not available in services
**Symptoms**:
- SessionContextService returns null
- "User not authenticated" errors for valid sessions
- Inconsistent session state

**Solution**:
```typescript
// Ensure service is properly injected as REQUEST scoped
@Injectable({ scope: Scope.REQUEST })
export class SessionContextService {
  // Implementation
}

// In consuming service
constructor(
  private readonly sessionContext: SessionContextService
) {}
```

**Root Cause**: Service not properly request-scoped or not initialized

## 🔧 Debugging Steps

### 1. Verify SuperTokens Configuration

```bash
# Check SuperTokens core is running
curl http://localhost:3567/hello
```

```typescript
// Add debug logging to session creation
console.log('Creating session for user:', input.userId);
console.log('Tenant context:', tenantContext);
```

### 2. Check Middleware Registration

```typescript
// Add logging to verify middleware execution order
app.use((req, res, next) => {
  console.log('Middleware executed:', req.url, !!req.session);
  next();
});
```

### 3. Database Context Verification

```sql
-- Check if RLS context is set correctly
SELECT current_setting('app.tenant_id', true) as tenant_id,
       current_setting('app.user_id', true) as user_id,
       current_setting('app.user_role', true) as user_role;
```

### 4. Session Context Service Debug

```typescript
// Add debug logging to session context service
async initializeFromRequest(req: Request): Promise<void> {
  console.log('Initializing session context for request');
  try {
    this.session = await Session.getSession(req, undefined as any, {
      sessionRequired: false,
    });
    console.log('Session found:', !!this.session);
    // ... rest of implementation
  } catch (error) {
    console.error('Session initialization failed:', error);
  }
}
```

## 📝 Error Logs

### SuperTokens Connection Errors
```
Error: SuperTokens core not available at http://localhost:3567
Solution: Start SuperTokens core service
```

### Database Context Errors
```
Error: set_config function failed
Cause: PostgreSQL user lacks privileges or RLS not enabled
Solution: GRANT privileges and enable RLS on tables
```

### Session Validation Errors
```
Error: Session not found or expired
Cause: Session timeout or invalid token
Solution: Implement proper session refresh logic
```

### Tenant Context Errors
```
Error: Tenant context not found for user
Cause: User entity missing tenant relation
Solution: Ensure user is properly associated with tenant
```

## 🛠️ Validation Rules

### Session Validation
- Session must contain userId, tenantId, role, and email
- Session handle must be valid SuperTokens session ID
- Tenant context must be retrievable from database

### Middleware Validation
- SuperTokens middleware must execute first
- Session context init must execute before RLS context
- All middleware must handle errors gracefully

### Database Context Validation
- All required session variables must be set
- RLS policies must be enforced after context setting
- Database queries must use proper connection context

## 🔍 Testing Session Issues

### Unit Test Session Problems
```typescript
// Mock session issues for testing
const mockSession = {
  getUserId: jest.fn().mockReturnValue(undefined), // Simulate missing userId
  getAccessTokenPayload: jest.fn().mockReturnValue({}), // Simulate empty payload
};
```

### Integration Test Database Issues
```typescript
// Test database context setting
expect(mockDataSource.query).toHaveBeenCalledWith(
  `SELECT set_config('app.tenant_id', $1, true)`,
  ['expected-tenant-id']
);
```

### E2E Test Session Lifecycle
```typescript
// Test complete session flow
const response = await request(app)
  .post('/auth/signin')
  .send({ email: 'test@example.com', password: 'password' });

expect(response.headers['set-cookie']).toBeDefined();
```

## 🚨 Security Considerations

### Session Security Issues
- **Problem**: Session tokens exposed in logs
- **Solution**: Never log session tokens or handles
- **Validation**: Ensure no sensitive session data in error messages

### Cross-Tenant Access Issues
- **Problem**: RLS context not properly isolated
- **Solution**: Always verify tenant context before database operations
- **Validation**: Test cross-tenant access prevention

### Session Hijacking Prevention
- **Problem**: Insecure session storage or transmission
- **Solution**: Use HTTPS, secure cookies, proper session timeouts
- **Validation**: Security audit of session handling

## 📊 Performance Issues

### Session Context Performance
- **Problem**: Slow session context initialization
- **Solution**: Optimize database queries for tenant context
- **Monitoring**: Add timing metrics to session operations

### Database Context Setting Performance
- **Problem**: High latency in RLS context setting
- **Solution**: Optimize `set_config` calls or batch them
- **Monitoring**: Track database query performance

### Memory Usage Issues
- **Problem**: Session context service memory leaks
- **Solution**: Ensure proper request scope cleanup
- **Monitoring**: Monitor memory usage with session load

## 🔄 Recovery Procedures

### Session Recovery
1. Clear invalid sessions from storage
2. Force users to re-authenticate
3. Verify tenant context consistency
4. Update session security configuration

### Database Context Recovery
1. Reset PostgreSQL session variables
2. Restart database connections
3. Verify RLS policy enforcement
4. Test tenant isolation

### Service Recovery
1. Restart application services
2. Clear session context caches
3. Verify middleware registration
4. Test authentication flows