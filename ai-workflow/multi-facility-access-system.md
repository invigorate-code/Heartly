# Multi-Facility Access System

## 🎯 Overview

The Multi-Facility Access System is a comprehensive solution that enables users to work across multiple facilities with proper access controls, role-based permissions, and seamless facility switching. This system ensures efficient multi-facility management while maintaining complete data isolation, security, and audit capabilities for regulatory compliance.

## 🏗 System Architecture

### 1. **Core Components**

#### Facility Assignment System

```typescript
interface UserFacilityAssignment {
  id: string;
  userId: string;
  facilityId: string;
  role: UserRole;
  accessLevel: AccessLevel;
  isActive: boolean;
  assignedAt: Date;
  expiresAt?: Date;
  assignedBy: string;
  notes?: string;
}

interface FacilityAccess {
  facilityId: string;
  facilityName: string;
  userRole: UserRole;
  accessLevel: AccessLevel;
  isActive: boolean;
  lastAccessed: Date;
  permissions: Permission[];
}
```

#### Facility Selection Session

```typescript
interface FacilitySelectionSession {
  id: string;
  userId: string;
  selectedFacilityId: string;
  sessionStartTime: Date;
  lastActivityTime: Date;
  ipAddress: string;
  userAgent: string;
  context: SessionContext;
}

interface SessionContext {
  previousFacilityId?: string;
  reason: SelectionReason;
  workflowContext?: string;
  auditTrail: AuditEntry[];
}
```

#### Shift-Based Access Control

```typescript
interface ShiftSchedule {
  id: string;
  userId: string;
  facilityId: string;
  shiftType: ShiftType;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  createdBy: string;
  notes?: string;
}

interface ShiftAccess {
  userId: string;
  facilityId: string;
  currentShift: ShiftSchedule | null;
  accessGranted: boolean;
  accessReason: AccessReason;
  lastVerified: Date;
}
```

### 2. **Access Control Rules**

#### Role-Based Access Rules

**Owners**

- **Access**: All facilities they own
- **Switching**: Can switch between any owned facility
- **Management**: Full management capabilities across all facilities
- **Audit**: Complete audit trails across all facilities
- **Permissions**: Full administrative access to all owned facilities

**Administrators**

- **Access**: All facilities they are assigned to
- **Switching**: Can switch between assigned facilities
- **Management**: Management capabilities for assigned facilities
- **Audit**: Audit trails for assigned facilities
- **Permissions**: Administrative access to assigned facilities

**Staff**

- **Access**: Facilities where they are currently on shift
- **Switching**: Limited to facilities with active shift assignments
- **Management**: Basic operational capabilities
- **Audit**: Audit trails for current facility only
- **Permissions**: Operational access based on current shift

### 3. **Facility Context Management**

```typescript
interface FacilityContext {
  currentFacilityId: string;
  facilityName: string;
  userRole: UserRole;
  accessLevel: AccessLevel;
  permissions: Permission[];
  sessionStartTime: Date;
  lastActivityTime: Date;
  contextData: ContextData;
}

interface ContextData {
  clientCount: number;
  staffCount: number;
  complianceStatus: ComplianceStatus;
  recentActivity: Activity[];
  alerts: Alert[];
}
```

## 📊 Database Schema

### 1. **User Facility Assignment Table**

```sql
CREATE TABLE user_facility_assignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  facility_id UUID NOT NULL REFERENCES facilities(id),
  role VARCHAR(20) NOT NULL,
  access_level VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  assigned_by UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_facility_user ON user_facility_assignment(user_id);
CREATE INDEX idx_user_facility_facility ON user_facility_assignment(facility_id);
CREATE INDEX idx_user_facility_active ON user_facility_assignment(is_active);
CREATE INDEX idx_user_facility_role ON user_facility_assignment(role);
CREATE UNIQUE INDEX idx_user_facility_unique ON user_facility_assignment(user_id, facility_id);
```

### 2. **Facility Selection Session Table**

```sql
CREATE TABLE facility_selection_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  selected_facility_id UUID NOT NULL REFERENCES facilities(id),
  session_start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_facility_session_user ON facility_selection_session(user_id);
CREATE INDEX idx_facility_session_facility ON facility_selection_session(selected_facility_id);
CREATE INDEX idx_facility_session_time ON facility_selection_session(session_start_time);
```

### 3. **Shift Schedule Table**

```sql
CREATE TABLE shift_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  facility_id UUID NOT NULL REFERENCES facilities(id),
  shift_type VARCHAR(20) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shift_user ON shift_schedule(user_id);
CREATE INDEX idx_shift_facility ON shift_schedule(facility_id);
CREATE INDEX idx_shift_active ON shift_schedule(is_active);
CREATE INDEX idx_shift_time ON shift_schedule(start_time, end_time);
```

### 4. **Facility Access Log Table**

```sql
CREATE TABLE facility_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  facility_id UUID NOT NULL REFERENCES facilities(id),
  action_type VARCHAR(20) NOT NULL,
  action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(100),
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_access_log_user ON facility_access_log(user_id);
CREATE INDEX idx_access_log_facility ON facility_access_log(facility_id);
CREATE INDEX idx_access_log_action ON facility_access_log(action_type);
CREATE INDEX idx_access_log_timestamp ON facility_access_log(action_timestamp);
```

## 🔧 Implementation Components

### 1. **Facility Access Service**

```typescript
@Injectable()
export class FacilityAccessService {
  constructor(
    private readonly userFacilityRepository: Repository<UserFacilityAssignment>,
    private readonly shiftRepository: Repository<ShiftSchedule>,
    private readonly sessionRepository: Repository<FacilitySelectionSession>,
    private readonly auditService: AuditService
  ) {}

  async getUserFacilities(userId: string): Promise<FacilityAccess[]> {
    const assignments = await this.userFacilityRepository.find({
      where: { userId, isActive: true },
      relations: ["facility"],
    });

    const facilities: FacilityAccess[] = [];

    for (const assignment of assignments) {
      const accessLevel = await this.determineAccessLevel(
        userId,
        assignment.facilityId
      );
      const permissions = await this.getUserPermissions(
        userId,
        assignment.facilityId
      );

      facilities.push({
        facilityId: assignment.facilityId,
        facilityName: assignment.facility.name,
        userRole: assignment.role,
        accessLevel,
        isActive: assignment.isActive,
        lastAccessed: assignment.lastAccessed,
        permissions,
      });
    }

    return facilities;
  }

  async selectFacility(
    userId: string,
    facilityId: string,
    context: SelectionContext
  ): Promise<FacilitySelectionSession> {
    // Verify user has access to facility
    await this.verifyFacilityAccess(userId, facilityId);

    // Create or update session
    const session = await this.sessionRepository.save({
      userId,
      selectedFacilityId: facilityId,
      sessionStartTime: new Date(),
      lastActivityTime: new Date(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      context: {
        reason: context.reason,
        previousFacilityId: context.previousFacilityId,
        workflowContext: context.workflowContext,
        auditTrail: [],
      },
    });

    // Log facility selection for audit
    await this.auditService.logEvent({
      eventType: "FACILITY_SELECTION",
      eventCategory: "USER_ACTION",
      userId,
      facilityId,
      eventData: { sessionId: session.id, reason: context.reason },
    });

    return session;
  }

  async getCurrentFacilityContext(userId: string): Promise<FacilityContext> {
    const session = await this.getCurrentSession(userId);
    if (!session) {
      throw new Error("No active facility session");
    }

    const assignment = await this.userFacilityRepository.findOne({
      where: { userId, facilityId: session.selectedFacilityId, isActive: true },
    });

    const contextData = await this.getFacilityContextData(
      session.selectedFacilityId
    );

    return {
      currentFacilityId: session.selectedFacilityId,
      facilityName: assignment.facility.name,
      userRole: assignment.role,
      accessLevel: assignment.accessLevel,
      permissions: await this.getUserPermissions(
        userId,
        session.selectedFacilityId
      ),
      sessionStartTime: session.sessionStartTime,
      lastActivityTime: session.lastActivityTime,
      contextData,
    };
  }

  private async verifyFacilityAccess(
    userId: string,
    facilityId: string
  ): Promise<void> {
    const assignment = await this.userFacilityRepository.findOne({
      where: { userId, facilityId, isActive: true },
    });

    if (!assignment) {
      throw new Error("User does not have access to this facility");
    }

    // Check shift-based access for staff
    if (assignment.role === UserRole.STAFF) {
      const hasActiveShift = await this.hasActiveShift(userId, facilityId);
      if (!hasActiveShift) {
        throw new Error("No active shift for this facility");
      }
    }
  }

  private async hasActiveShift(
    userId: string,
    facilityId: string
  ): Promise<boolean> {
    const now = new Date();
    const activeShift = await this.shiftRepository.findOne({
      where: {
        userId,
        facilityId,
        isActive: true,
        startTime: LessThanOrEqual(now),
        endTime: MoreThanOrEqual(now),
      },
    });

    return !!activeShift;
  }
}
```

### 2. **Facility Selection Controller**

```typescript
@Controller("facility")
export class FacilityController {
  constructor(
    private readonly facilityAccessService: FacilityAccessService,
    private readonly auditService: AuditService
  ) {}

  @Get("available")
  async getAvailableFacilities(
    @CurrentUser() user: User
  ): Promise<FacilityAccess[]> {
    return this.facilityAccessService.getUserFacilities(user.id);
  }

  @Post("select")
  async selectFacility(
    @CurrentUser() user: User,
    @Body() request: SelectFacilityRequest
  ): Promise<FacilitySelectionSession> {
    const context: SelectionContext = {
      reason: request.reason,
      previousFacilityId: request.previousFacilityId,
      workflowContext: request.workflowContext,
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
    };

    return this.facilityAccessService.selectFacility(
      user.id,
      request.facilityId,
      context
    );
  }

  @Get("current")
  async getCurrentFacility(
    @CurrentUser() user: User
  ): Promise<FacilityContext> {
    return this.facilityAccessService.getCurrentFacilityContext(user.id);
  }

  @Post("switch")
  async switchFacility(
    @CurrentUser() user: User,
    @Body() request: SwitchFacilityRequest
  ): Promise<FacilitySelectionSession> {
    // Log facility switch for audit
    await this.auditService.logEvent({
      eventType: "FACILITY_SWITCH",
      eventCategory: "USER_ACTION",
      userId: user.id,
      eventData: {
        fromFacilityId: request.fromFacilityId,
        toFacilityId: request.toFacilityId,
        reason: request.reason,
      },
    });

    const context: SelectionContext = {
      reason: SelectionReason.SWITCH,
      previousFacilityId: request.fromFacilityId,
      workflowContext: request.workflowContext,
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
    };

    return this.facilityAccessService.selectFacility(
      user.id,
      request.toFacilityId,
      context
    );
  }
}
```

### 3. **Facility Context Guard**

```typescript
@Injectable()
export class FacilityContextGuard implements CanActivate {
  constructor(private readonly facilityAccessService: FacilityAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    try {
      const facilityContext =
        await this.facilityAccessService.getCurrentFacilityContext(user.id);
      request.facilityContext = facilityContext;
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

## 📱 User Interface Components

### 1. **Facility Selection Screen**

```typescript
interface FacilitySelectionScreen {
  availableFacilities: FacilityAccess[];
  recentFacilities: FacilityAccess[];
  searchFunction: SearchFacility;
  selectFacility: SelectFacilityFunction;
  showShiftStatus: boolean;
  showAccessLevel: boolean;
}
```

### 2. **Facility Switcher**

```typescript
interface FacilitySwitcher {
  currentFacility: FacilityContext;
  availableFacilities: FacilityAccess[];
  switchFacility: SwitchFacilityFunction;
  showContext: boolean;
  showNotifications: boolean;
}
```

### 3. **Facility Context Indicator**

```typescript
interface FacilityContextIndicator {
  facilityName: string;
  userRole: UserRole;
  accessLevel: AccessLevel;
  sessionDuration: number;
  showDetails: boolean;
  showSwitch: boolean;
}
```

## 🎨 User Experience Flow

### 1. **Facility Selection Flow**

1. **User Login**: Standard authentication process
2. **Facility Check**: System checks user's facility assignments
3. **Single Facility**: Direct access to dashboard if only one facility
4. **Multiple Facilities**: Facility selection screen with available options
5. **Facility Selection**: User chooses which facility to work in
6. **Access Verification**: System verifies user has proper access
7. **Context Setup**: Application loads with selected facility context
8. **Audit Logging**: Facility selection is logged for compliance

### 2. **Facility Switching Flow**

1. **Switch Request**: User requests to switch facilities
2. **Access Verification**: System verifies access to target facility
3. **Context Preservation**: Current context is preserved if needed
4. **Facility Switch**: User is switched to new facility
5. **Context Update**: Application updates with new facility context
6. **Audit Logging**: Facility switch is logged for compliance
7. **User Notification**: User is notified of successful switch

### 3. **Shift-Based Access Flow**

1. **Shift Check**: System checks user's current shift assignments
2. **Access Determination**: Access is determined based on active shifts
3. **Facility Filtering**: Only facilities with active shifts are shown
4. **Access Enforcement**: Access is enforced throughout the session
5. **Shift Updates**: Real-time updates when shifts start/end
6. **Access Revocation**: Access is revoked when shifts end

## 🔒 Security & Access Control

### 1. **Multi-Tenant Isolation**

- **Data Isolation**: Complete data separation between tenants
- **Facility Isolation**: Data isolation between facilities within tenant
- **Access Boundaries**: Strict access controls between facilities
- **Audit Separation**: Separate audit trails for each facility

### 2. **Role-Based Access Control**

```typescript
interface FacilityPermission {
  role: UserRole;
  facilityId: string;
  permissions: Permission[];
  accessLevel: AccessLevel;
  restrictions: AccessRestriction[];
}

enum AccessLevel {
  NONE = "none",
  READ_ONLY = "read_only",
  OPERATIONAL = "operational",
  ADMINISTRATIVE = "administrative",
  OWNERSHIP = "ownership",
}
```

### 3. **Session Security**

- **Session Validation**: Regular validation of facility sessions
- **Activity Monitoring**: Monitor user activity within facility context
- **Automatic Logout**: Automatic logout on inactivity
- **Session Audit**: Complete audit trail of facility sessions

## 📊 Performance Considerations

### 1. **Caching Strategy**

```typescript
interface FacilityCache {
  userId: string;
  facilities: FacilityAccess[];
  currentContext: FacilityContext;
  lastUpdated: Date;
  ttl: number;
}
```

### 2. **Database Optimization**

- **Indexing**: Optimized indexes for facility queries
- **Query Optimization**: Efficient facility access queries
- **Connection Pooling**: Optimized database connections
- **Read Replicas**: Use read replicas for facility data

### 3. **Real-Time Updates**

- **WebSocket Integration**: Real-time facility status updates
- **Event-Driven Updates**: Facility changes trigger real-time updates
- **Push Notifications**: Notify users of facility changes
- **Status Synchronization**: Keep facility status synchronized

## 🎯 Compliance Integration

### 1. **Audit Trail Integration**

- **Facility Access**: All facility access is logged
- **Facility Switching**: All facility switches are tracked
- **Session Management**: Complete session audit trails
- **Access Verification**: All access verifications are logged

### 2. **Regulatory Compliance**

- **California Regional Center**: Support for regional center requirements
- **Licensing Requirements**: Support for licensing inspections
- **HIPAA Compliance**: HIPAA-compliant facility access controls
- **Data Privacy**: Complete data privacy controls

### 3. **Timeline Compliance**

- **Access Tracking**: Track facility access for compliance
- **Session Duration**: Monitor session duration for compliance
- **Access Patterns**: Analyze access patterns for compliance
- **Audit Reporting**: Generate compliance audit reports

## 🔮 Future Enhancements

### 1. **Advanced Access Control**

- **Time-Based Access**: Time-based facility access controls
- **Geographic Restrictions**: Geographic-based access controls
- **Device-Based Access**: Device-specific access controls
- **Multi-Factor Authentication**: Enhanced authentication for facility access

### 2. **Intelligent Facility Management**

- **Predictive Access**: Predict facility access needs
- **Auto-Scheduling**: Automatic shift scheduling
- **Resource Optimization**: Optimize facility resource allocation
- **Performance Analytics**: Facility performance analytics

### 3. **Enterprise Features**

- **Multi-Facility Networks**: Support for large facility networks
- **Cross-Facility Analytics**: Analytics across multiple facilities
- **Network Management**: Centralized network management
- **Advanced Reporting**: Advanced multi-facility reporting

---

This multi-facility access system provides comprehensive facility management capabilities while maintaining complete security, compliance, and audit capabilities for Heartly's facility management platform.
