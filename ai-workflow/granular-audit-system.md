# Granular Audit System

## 🎯 Overview

The Granular Audit System is a comprehensive logging and tracking system that provides complete transparency into all data changes, user actions, and system events within Heartly. This system ensures full regulatory compliance for California regional center and licensing inspections while providing valuable insights into user behavior and data patterns.

## 🔍 Core Principles

### 1. **Complete Transparency**

- Every action, change, and event is logged
- Full user attribution for all modifications
- Complete data lineage tracking
- Real-time audit trail visibility

### 2. **Field-Level Tracking**

- Track changes at the individual field level
- Maintain complete history of all modifications
- Provide before/after values for all changes
- Enable granular compliance verification

### 3. **User Attribution**

- Always track who made changes
- Record when changes were made
- Log where changes originated from
- Maintain complete user action history

### 4. **Regulatory Compliance**

- Meet California regional center requirements
- Support licensing inspection needs
- Provide complete audit trails for compliance
- Enable rapid compliance verification

## 🏗 System Architecture

### 1. **Core Components**

#### Field-Level Audit Log

```typescript
interface FieldAuditLog {
  id: string;
  tenantId: string;
  facilityId: string;
  entityType: EntityType;
  entityId: string;
  fieldName: string;
  fieldPath: string;
  oldValue: any;
  newValue: any;
  changeType: ChangeType;
  userId: string;
  userRole: UserRole;
  timestamp: Date;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  context: AuditContext;
}
```

#### Event Log

```typescript
interface EventLog {
  id: string;
  tenantId: string;
  facilityId: string;
  eventType: EventType;
  eventCategory: EventCategory;
  userId: string;
  userRole: UserRole;
  timestamp: Date;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  eventData: EventData;
  context: AuditContext;
  severity: LogSeverity;
}
```

#### Data Change History

```typescript
interface DataChangeHistory {
  id: string;
  tenantId: string;
  facilityId: string;
  entityType: EntityType;
  entityId: string;
  changeType: ChangeType;
  userId: string;
  userRole: UserRole;
  timestamp: Date;
  sessionId: string;
  fieldChanges: FieldChange[];
  metadata: ChangeMetadata;
  context: AuditContext;
}
```

### 2. **Audit Categories**

#### Data Operations

- **Create**: New record creation
- **Update**: Record modifications
- **Delete**: Record deletion (soft delete)
- **Archive**: Record archiving
- **Restore**: Record restoration

#### User Actions

- **Login/Logout**: Authentication events
- **Session Management**: Session creation and termination
- **Permission Changes**: Role and permission modifications
- **Facility Switching**: Multi-facility access events
- **Dashboard Customization**: Widget and layout changes

#### System Events

- **API Calls**: All API request/response logging
- **Error Events**: System errors and exceptions
- **Performance Events**: Slow queries and performance issues
- **Security Events**: Security-related incidents
- **Compliance Events**: Regulatory compliance activities

#### Timeline & Compliance

- **Deadline Tracking**: Due date and suspense date events
- **Profile Completion**: Completion status changes
- **Compliance Alerts**: Regulatory deadline notifications
- **Audit Preparation**: Compliance verification activities

### 3. **Audit Context**

```typescript
interface AuditContext {
  requestId: string;
  correlationId: string;
  facilityId: string;
  clientId?: string;
  formId?: string;
  workflowId?: string;
  parentEventId?: string;
  tags: string[];
  metadata: Record<string, any>;
}
```

## 📊 Database Schema

### 1. **Field Audit Log Table**

```sql
CREATE TABLE field_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  facility_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  field_path VARCHAR(255) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  change_type VARCHAR(20) NOT NULL,
  user_id UUID NOT NULL,
  user_role VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_field_audit_tenant ON field_audit_log(tenant_id);
CREATE INDEX idx_field_audit_facility ON field_audit_log(facility_id);
CREATE INDEX idx_field_audit_entity ON field_audit_log(entity_type, entity_id);
CREATE INDEX idx_field_audit_user ON field_audit_log(user_id);
CREATE INDEX idx_field_audit_timestamp ON field_audit_log(timestamp);
CREATE INDEX idx_field_audit_session ON field_audit_log(session_id);
```

### 2. **Event Log Table**

```sql
CREATE TABLE event_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  facility_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_category VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL,
  user_role VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  event_data JSONB,
  context JSONB,
  severity VARCHAR(20) DEFAULT 'INFO',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_event_log_tenant ON event_log(tenant_id);
CREATE INDEX idx_event_log_facility ON event_log(facility_id);
CREATE INDEX idx_event_log_type ON event_log(event_type);
CREATE INDEX idx_event_log_user ON event_log(user_id);
CREATE INDEX idx_event_log_timestamp ON event_log(timestamp);
CREATE INDEX idx_event_log_severity ON event_log(severity);
```

### 3. **Data Change History Table**

```sql
CREATE TABLE data_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  facility_id UUID NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  change_type VARCHAR(20) NOT NULL,
  user_id UUID NOT NULL,
  user_role VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(100),
  field_changes JSONB,
  metadata JSONB,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_data_change_tenant ON data_change_history(tenant_id);
CREATE INDEX idx_data_change_facility ON data_change_history(facility_id);
CREATE INDEX idx_data_change_entity ON data_change_history(entity_type, entity_id);
CREATE INDEX idx_data_change_user ON data_change_history(user_id);
CREATE INDEX idx_data_change_timestamp ON data_change_history(timestamp);
```

## 🔧 Implementation Components

### 1. **Audit Service**

```typescript
@Injectable()
export class AuditService {
  constructor(
    private readonly fieldAuditRepository: Repository<FieldAuditLog>,
    private readonly eventLogRepository: Repository<EventLog>,
    private readonly dataChangeRepository: Repository<DataChangeHistory>
  ) {}

  async logFieldChange(fieldChange: FieldChangeData): Promise<void> {
    const auditLog = this.fieldAuditRepository.create({
      tenantId: fieldChange.tenantId,
      facilityId: fieldChange.facilityId,
      entityType: fieldChange.entityType,
      entityId: fieldChange.entityId,
      fieldName: fieldChange.fieldName,
      fieldPath: fieldChange.fieldPath,
      oldValue: fieldChange.oldValue,
      newValue: fieldChange.newValue,
      changeType: fieldChange.changeType,
      userId: fieldChange.userId,
      userRole: fieldChange.userRole,
      sessionId: fieldChange.sessionId,
      ipAddress: fieldChange.ipAddress,
      userAgent: fieldChange.userAgent,
      context: fieldChange.context,
    });

    await this.fieldAuditRepository.save(auditLog);
  }

  async logEvent(event: EventData): Promise<void> {
    const eventLog = this.eventLogRepository.create({
      tenantId: event.tenantId,
      facilityId: event.facilityId,
      eventType: event.eventType,
      eventCategory: event.eventCategory,
      userId: event.userId,
      userRole: event.userRole,
      sessionId: event.sessionId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      eventData: event.eventData,
      context: event.context,
      severity: event.severity,
    });

    await this.eventLogRepository.save(eventLog);
  }

  async logDataChange(dataChange: DataChangeData): Promise<void> {
    const changeHistory = this.dataChangeRepository.create({
      tenantId: dataChange.tenantId,
      facilityId: dataChange.facilityId,
      entityType: dataChange.entityType,
      entityId: dataChange.entityId,
      changeType: dataChange.changeType,
      userId: dataChange.userId,
      userRole: dataChange.userRole,
      sessionId: dataChange.sessionId,
      fieldChanges: dataChange.fieldChanges,
      metadata: dataChange.metadata,
      context: dataChange.context,
    });

    await this.dataChangeRepository.save(changeHistory);
  }
}
```

### 2. **Audit Interceptor**

```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const user = request.user;

    // Log API call event
    this.auditService.logEvent({
      tenantId: user?.tenantId,
      facilityId: request.facilityId,
      eventType: "API_CALL",
      eventCategory: "SYSTEM",
      userId: user?.id,
      userRole: user?.role,
      sessionId: request.sessionId,
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
      eventData: {
        method: request.method,
        url: request.url,
        statusCode: response.statusCode,
        duration: Date.now() - request.startTime,
      },
      context: {
        requestId: request.requestId,
        correlationId: request.correlationId,
      },
      severity: "INFO",
    });

    return next.handle();
  }
}
```

### 3. **Audit Decorators**

```typescript
export const AuditField = (entityType: EntityType, fieldName: string) => {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(
      "audit:field",
      { entityType, fieldName },
      target,
      propertyKey
    );
  };
};

export const AuditEvent = (
  eventType: EventType,
  eventCategory: EventCategory
) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      // Log event after method execution
      this.auditService.logEvent({
        eventType,
        eventCategory,
        // ... other event data
      });

      return result;
    };
  };
};
```

## 📱 User Interface Components

### 1. **Audit Trail Widget**

```typescript
interface AuditTrailWidget {
  entityId: string;
  entityType: EntityType;
  timeRange: TimeRange;
  filterOptions: AuditFilter[];
  visualTimeline: TimelineView;
  exportOptions: ExportFormat[];
}
```

### 2. **Real-Time Audit Monitor**

```typescript
interface RealTimeAuditMonitor {
  facilityId: string;
  liveEvents: EventStream;
  alertRules: AlertRule[];
  dashboard: AuditDashboard;
  notificationSystem: NotificationSystem;
}
```

### 3. **Compliance Dashboard**

```typescript
interface ComplianceDashboard {
  facilityId: string;
  complianceScore: number;
  auditReadiness: AuditStatus;
  recentChanges: ChangeSummary[];
  complianceAlerts: ComplianceAlert[];
  exportReports: ReportExport[];
}
```

## 🔍 Audit Analytics

### 1. **User Activity Analysis**

```typescript
interface UserActivityAnalytics {
  userId: string;
  activitySummary: ActivitySummary;
  changePatterns: ChangePattern[];
  complianceMetrics: ComplianceMetric[];
  riskIndicators: RiskIndicator[];
}
```

### 2. **Data Pattern Analysis**

```typescript
interface DataPatternAnalytics {
  entityType: EntityType;
  changeFrequency: ChangeFrequency;
  fieldModificationPatterns: FieldPattern[];
  complianceTrends: ComplianceTrend[];
  anomalyDetection: AnomalyAlert[];
}
```

### 3. **Compliance Reporting**

```typescript
interface ComplianceReporting {
  facilityId: string;
  reportPeriod: TimeRange;
  complianceMetrics: ComplianceMetric[];
  auditTrail: AuditTrail;
  regulatoryRequirements: RegulatoryRequirement[];
  exportFormats: ExportFormat[];
}
```

## 🔒 Security & Privacy

### 1. **Data Protection**

- **Encryption**: All audit logs encrypted at rest and in transit
- **Access Controls**: Role-based access to audit data
- **Data Retention**: Configurable retention policies
- **Privacy Compliance**: HIPAA-compliant audit logging

### 2. **Audit Security**

- **Tamper Protection**: Immutable audit logs
- **Digital Signatures**: Cryptographic verification of audit integrity
- **Access Logging**: Complete logging of audit data access
- **Backup Security**: Secure backup and recovery procedures

### 3. **Compliance Features**

- **Regulatory Alignment**: California regional center requirements
- **Licensing Compliance**: Licensing inspection support
- **Export Capabilities**: PDF and electronic export formats
- **Verification Tools**: Compliance verification utilities

## 📊 Performance Considerations

### 1. **Database Optimization**

- **Indexing Strategy**: Optimized indexes for common queries
- **Partitioning**: Time-based partitioning for large audit tables
- **Archiving**: Automated archiving of old audit data
- **Query Optimization**: Efficient audit trail queries

### 2. **Real-Time Processing**

- **Event Streaming**: Real-time event processing
- **Caching Strategy**: Intelligent caching of audit data
- **Batch Processing**: Efficient batch logging operations
- **Performance Monitoring**: Real-time performance tracking

### 3. **Scalability**

- **Horizontal Scaling**: Distributed audit logging
- **Load Balancing**: Balanced audit data distribution
- **Resource Management**: Efficient resource utilization
- **Capacity Planning**: Scalable audit infrastructure

## 🎯 Compliance Integration

### 1. **California Regional Center**

- **Documentation Requirements**: Complete audit trails for all documentation
- **Timeline Compliance**: Tracking of required documentation deadlines
- **Inspection Readiness**: Rapid compliance verification
- **Reporting Requirements**: Automated compliance reporting

### 2. **Licensing Requirements**

- **Inspection Support**: Complete audit trails for licensing inspections
- **Documentation Verification**: Rapid document verification
- **Compliance Monitoring**: Continuous compliance monitoring
- **Audit Preparation**: Automated audit preparation tools

### 3. **HIPAA Compliance**

- **Privacy Protection**: HIPAA-compliant audit logging
- **Access Controls**: Secure access to audit data
- **Data Retention**: Compliant data retention policies
- **Breach Notification**: Automated breach detection and notification

---

This granular audit system provides complete transparency into all Heartly operations while ensuring full regulatory compliance and providing valuable insights for facility management and continuous improvement.
