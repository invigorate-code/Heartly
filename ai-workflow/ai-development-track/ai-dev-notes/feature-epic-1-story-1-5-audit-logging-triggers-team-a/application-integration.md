# Epic 1 Story 1.5: Application-Level Audit Log Integration

## Overview
This document covers the application-level implementation that complements the database-level audit logging triggers. It provides a complete API interface for accessing and managing audit logs.

## Components Implemented

### 1. DataAuditLog Entity
**File**: `src/common/entities/data-audit-log.entity.ts`

TypeORM entity that maps to the `data_audit_log` table:
- Provides type-safe access to audit log data
- Includes proper indexing decorators for performance
- Maps database columns to TypeScript properties

### 2. Audit Log DTOs
**File**: `src/common/dto/audit-log.dto.ts`

Complete set of DTOs for API operations:
- `GetAuditLogsDto`: Query parameters for filtering logs
- `ExportAuditLogsDto`: Parameters for compliance exports
- `AuditLogResponseDto`: Structured response with related data
- `AuditLogSummaryDto`: Statistical summary of audit activity

### 3. AuditLogService
**File**: `src/api/audit-log/audit-log.service.ts`

Core business logic for audit log operations:
- **Role-based access control**: Enforces proper permissions
- **Intelligent filtering**: Queries based on user role and tenant
- **Performance optimization**: Batch loading of related entities
- **Export functionality**: Uses database export function for compliance
- **Summary statistics**: Provides audit activity insights

Key Methods:
- `getAuditLogs()`: Paginated audit log retrieval with filtering
- `exportAuditLogs()`: Compliance-ready export (JSON/CSV)
- `getAuditLogSummary()`: Statistical analysis of audit activity
- `cleanupOldLogs()`: Maintenance function for old log removal

### 4. AuditLogController
**File**: `src/api/audit-log/audit-log.controller.ts`

RESTful API endpoints with proper authentication:
- **GET /audit-logs**: List audit logs with filtering and pagination
- **GET /audit-logs/summary**: Get audit statistics
- **POST /audit-logs/export**: Export audit logs for compliance
- **POST /audit-logs/cleanup**: Remove old audit logs (OWNER only)
- **GET /audit-logs/tables/{table}/rows/{id}**: Get specific record history

Security Features:
- SuperTokens authentication required
- Role-based access (OWNER, ADMIN, STAFF)
- Automatic tenant isolation
- Session context tracking

### 5. Enhanced RLS Context Middleware
**File**: `src/utils/middleware/rls-context.middleware.ts`

Enhanced to set additional session variables for audit logging:
- `app.session_id`: SuperTokens session handle
- `app.ip_address`: Client IP address
- `app.user_agent`: Client user agent string

These variables are captured by the database triggers for comprehensive audit trails.

## API Usage Examples

### 1. Get Audit Logs
```typescript
GET /audit-logs?startDate=2025-01-01&endDate=2025-01-31&tableName=client&page=1&limit=50

Response:
{
  "logs": [
    {
      "id": "audit-id",
      "tableName": "client",
      "operation": "UPDATE",
      "rowId": "client-id",
      "userId": "user-id",
      "userEmail": "user@example.com",
      "facilityId": "facility-id",
      "facilityName": "Sample Facility",
      "timestamp": "2025-01-15T10:30:00Z",
      "oldValues": { "firstName": "John" },
      "newValues": { "firstName": "Johnny" },
      "changedFields": ["firstName"],
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}
```

### 2. Export Audit Logs
```typescript
POST /audit-logs/export
{
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "format": "csv"
}

Response: CSV file download with comprehensive audit data
```

### 3. Get Audit Summary
```typescript
GET /audit-logs/summary?startDate=2025-01-01&endDate=2025-01-31

Response:
{
  "totalLogs": 150,
  "dateRange": {
    "start": "2025-01-01T00:00:00Z",
    "end": "2025-01-31T23:59:59Z"
  },
  "operationCounts": {
    "INSERT": 50,
    "UPDATE": 80,
    "DELETE": 20
  },
  "tableCounts": {
    "client": 75,
    "user": 30,
    "facility": 45
  },
  "userCounts": {
    "user-1": 60,
    "user-2": 90
  }
}
```

## Security Implementation

### 1. Role-Based Access Control
- **OWNER**: Can access all audit logs in their tenant
- **ADMIN**: Can access audit logs for their assigned facilities
- **STAFF**: Can only access their own audit logs

### 2. Data Protection
- All queries automatically filtered by tenant (RLS enforcement)
- IP addresses and user agents captured for forensics
- Export functionality restricted to OWNER and ADMIN roles
- Sensitive data excluded from audit capture (passwords, etc.)

### 3. Performance Considerations
- Efficient batch loading of related user/facility data
- Proper indexing for common query patterns
- Pagination to handle large audit datasets
- Database functions used for heavy operations (export, cleanup)

## Integration Points

### 1. Automatic Context Setting
The enhanced RLS middleware automatically sets audit context for every authenticated request:
```typescript
// Session variables set automatically:
app.tenant_id    // For tenant isolation
app.user_id      // For user attribution
app.user_role    // For role-based access
app.session_id   // For session tracking
app.ip_address   // For forensics
app.user_agent   // For client identification
```

### 2. Module Integration
Added to the main API module for automatic availability:
```typescript
// In api.module.ts
imports: [
  // ... other modules
  AuditLogModule,
]
```

## Testing Strategy

### 1. Unit Tests
- Service method testing with mocked repositories
- Role-based access validation
- Export functionality testing
- Error handling verification

### 2. Integration Tests
- End-to-end API testing
- Database trigger verification
- RLS policy enforcement
- Cross-tenant access prevention

### 3. Performance Tests
- Large dataset handling
- Query performance with proper indexing
- Export performance with realistic data volumes

## Compliance Features

### 1. HIPAA Compliance
- Complete audit trail for all PHI access and modifications
- User attribution for every action
- Immutable audit records
- Secure access controls

### 2. Data Retention
- Automatic cleanup of logs older than 2 years
- Configurable retention policies
- Export capability for archived data

### 3. Reporting
- Structured export formats (JSON, CSV)
- Compliance-ready report generation
- Statistical summaries for audit analysis

This implementation provides a complete audit logging solution that meets healthcare compliance requirements while maintaining performance and usability.