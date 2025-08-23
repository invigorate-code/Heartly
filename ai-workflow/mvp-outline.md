# Heartly MVP Outline

This document outlines the Minimum Viable Product (MVP) for the Heartly application. The MVP focuses on the essential features required to onboard users, manage clients, and perform core facility operations. The MVP prioritizes reliability, compliance, and core functionality over advanced features, which are planned for future releases (see Post-MVP Roadmap).

## Core Feature Specifications

For detailed specifications of core features, see:
- **Multi-Facility Access**: `heartly-core-features/multi-facility-access-system.md`
- **Dashboard System**: `heartly-core-features/customizable-dashboard-system.md`
- **Audit System**: `heartly-core-features/granular-audit-system.md`
- **Timeline Management**: `heartly-core-features/timeline-management-system.md`
- **Cash Management**: `heartly-core-features/client-cash-management-system.md`
- **Universal Action Button**: `heartly-core-features/universal-action-button.md`

---

## MVP vs Future Features

This table clarifies what functionality is included in the MVP release versus planned future enhancements.

| Feature | MVP Scope | Future Enhancements |
|---------|-----------|-------------------|
| **Dashboard** | Static layout with essential widgets for each role | Drag-and-drop customization, custom widget creation |
| **Client Management** | Basic CRUD operations, file uploads, profile viewing | Automated workflows, predictive analytics, bulk operations |
| **Medication Tracking** | Manual entry, basic scheduling, administration records | Barcode scanning, pharmacy integration, automated refills |
| **Cash Management** | Basic deposit/withdraw, receipt uploads, balance tracking | Automated reconciliation, financial reports, spending analytics |
| **Audit System** | Basic activity logging, user action tracking | Advanced analytics, pattern detection, anomaly alerts |
| **Facility Access** | Simple facility selection and switching | Cross-facility analytics, performance comparison, network insights |
| **Offline Support** | Not included | PWA with offline capabilities (Phase 2) |
| **Forms** | PDF upload/download, basic data entry | Dynamic form transformation, auto-population, smart defaults |
| **Notifications** | Basic email alerts for critical events | Smart notifications, predictive alerts, customizable rules |
| **Analytics** | Basic reports and activity summaries | Predictive insights, trend analysis, custom report builder |
| **Daily Notes** | Text entry with mood/goal tracking | Natural language processing, behavioral analytics |
| **Timeline Management** | Due date tracking, basic alerts | Automated scheduling, compliance predictions |

---

## 1 Core User Flows

### 1.1. Authentication & Onboarding

- Landing Page
- Auth Pages
  - Login
  - Register
- Onboarding
  - Facility Creation (first-time setup)

### 1.2. Multi-Facility Access

- **Facility Selection Screen**: Users with multiple facility access choose which facility to work in
- **Single Facility Users**: Direct access to their assigned facility
- **Role-Based Access**: Different facility access rules based on user roles
- **Facility Context**: Clear indication of current facility throughout the application
- **Facility Analytics**: Basic usage reports and occupancy tracking

### 1.3. Navigation

- Navbar
  - User dropdown with Logout
  - Profile Settings (basic: change password)
  - **Facility Selector**: Quick facility switching for multi-facility users
  - **Notifications**: Basic alerts for important events

---

## 2. Client Management

### 2.1. Client List & Profile

- View list of clients with **profile completion progress indicators**
- Select client to view basic profile/overview
- Dynamic routing to client dashboard (clients/{id})
- **Timeline compliance status** visible on client list
- **Facility Context**: Clear indication of which facility the client belongs to
- **Profile Alerts**: Notifications for incomplete profiles and missing requirements

### 2.2. Client Dashboard (MVP Components)

- **Daily Notes** (add/view for a client)
  - Simple form for entering daily observations
  - Basic mood tracking (1-5 scale or simple categories)
  - Goal progress checkboxes
  - Text fields for notes and observations
  - View history of previous notes
- **Medication Administration Tracker** (record/administer meds)
  - Manual medication entry and scheduling
  - Check-in/check-out interface with time stamps
  - Basic medication list and dosage tracking
  - Simple administration record keeping
- **File Upload/Download for client** (forms, docs)
  - PDF export capability for all data
  - Document management with audit trails
  - Basic document categorization by type
- **Cash Management** (deposit/withdraw for client)
  - Simple transaction interface with signature requirements
  - Balance tracking and transaction history
  - Receipt upload and storage
- **Recent Activity** (basic audit of actions on client)
  - Timeline view of all client interactions
  - Audit trail for regulatory compliance
  - Basic activity log with timestamps and users
- **Profile Completion Progress**
  - Real-time completion status percentage
  - List of missing requirements
  - Due date tracking for required documentation

---

## 3. Staff Dashboard

- View action items (ToDo/Tasks) sorted by due date and priority
- View recent activity log
- View recent notes from all staff
- View special incident reports (basic list)
- **Clean Interface**: Dashboard with clear, organized information display
- **Timeline Alerts**: Email notifications for upcoming deadlines and incomplete profiles
- **Compliance Overview**: Quick view of facility-wide completion status
- **Basic Widget Layout**: Static dashboard with essential widgets for staff role
- **Facility Context**: Clear indication of current facility and access permissions
- **Task Management**: Clear action items and daily priorities

---

## 4. Admin Portal (MVP Scope)

- Facility Dashboard (basic: view facility, occupancy statistics)
- Staff Management (view/add staff, assign roles)
- Client Management (view/add/edit/delete clients)
- Settings: User management (add/remove users, assign roles), basic notification preferences
- **Compliance Features**: Audit trail access and PDF export capabilities
- **Timeline Management**: Overview of all deadlines and compliance requirements
- **Profile Completion Reports**: Facility-wide completion status and missing requirements
- **Basic Dashboard Layout**: Pre-configured dashboards for each role
- **Multi-Facility Management**: Basic facility switching and management for multi-facility users

---

## 5. Essential System Features

- Role-based access (basic: Admin, Staff)
- Audit log of key actions (recent activity)
- Secure authentication and session management
- **PDF Compliance**: All data exportable to official forms
- **Timeline Compliance**: Tracking of required documentation deadlines
- **Due Date Management**: Tracking of all deadlines and suspense dates
- **Profile Completion Tracking**: Real-time monitoring of client profile completeness
- **Basic Widget System**: Essential widgets for each user role
- **Multi-Facility Access**: Basic facility selection and switching capabilities
- **Data Entry**: Simple forms with basic validation
- **Basic Reporting**: Essential reports for compliance and operations

---

## 6. Form Transformation Philosophy

### Traditional vs. Heartly Approach

**Traditional**: Digital forms that still feel like filling out paperwork
**Heartly MVP**: Clean, user-friendly interfaces that simplify data entry
**Future**: Engaging interfaces with automation and predictive capabilities

### MVP Form Transformations

1. **Daily Notes**
   - Instead of: "Fill out daily notes form"
   - Heartly MVP: "Add daily note for [Client Name]" with structured fields

2. **Medication Administration**
   - Instead of: "Medication administration record form"
   - Heartly MVP: "Record medication for [Client Name]" with time stamps

3. **Client Information**
   - Instead of: "Client information form"
   - Heartly MVP: Step-by-step profile creation with clear sections

### PDF Compliance Requirements

- All data must be exportable to official PDF forms for regulatory requirements
- Complete audit trails for regulatory inspections
- Timeline compliance tracking for required documentation
- California regional center and licensing inspection readiness

---

## 7. Timeline & Deadline Management

The MVP includes basic timeline tracking for regulatory compliance and deadline management.

**Complete Specifications**: See `heartly-core-features/timeline-management-system.md`

**MVP Implementation**:
- Basic due date tracking for client documentation
- Simple deadline notifications via email
- Profile completion progress indicators
- Basic compliance dashboard

**Future Enhancements** (Phase 2+):
- Automated deadline predictions
- Advanced compliance analytics
- Intelligent reminder scheduling

---

## 8. Multi-Facility Access System

The MVP includes basic multi-facility support with facility selection, role-based access, and context switching.

**Complete Specifications**: See `heartly-core-features/multi-facility-access-system.md`

**MVP Implementation**:
- Basic facility selection screen for multi-facility users
- Simple role-based access (Owner, Admin, Staff)
- Context switching between facilities
- Basic audit logging of facility access

**Future Enhancements** (Phase 2+):
- Cross-facility analytics
- Advanced permission management
- Network-wide reporting

---

## Post-MVP Roadmap

### Phase 2 (Months 4-6)
- Offline capabilities with PWA
- Drag-and-drop dashboard customization
- Advanced analytics and reporting
- Barcode scanning for medications
- Smart defaults and auto-population
- Enhanced audit trail analytics

### Phase 3 (Months 7-9)
- Pharmacy integration
- Natural language processing for notes
- Predictive analytics for compliance
- Cross-facility performance metrics
- Advanced role-based permissions
- Custom widget creation

### Phase 4 (Months 10-12)
- Mobile applications (iOS/Android)
- Voice input capabilities
- AI-powered insights and recommendations
- Advanced automation workflows
- Enterprise multi-facility management
- Machine learning for pattern detection

---

## 9. Dashboard Customization (Future Enhancement - Phase 2)

Note: This feature is planned for Phase 2, not included in MVP.

### Widget Library
- Client Management Widgets: Client list, profile completion, recent activity
- Timeline Widgets: Due dates, suspense dates, compliance status
- Audit Widgets: Recent changes, user activity, audit trails
- Analytics Widgets: Facility statistics, trends, reports
- Communication Widgets: Notifications, alerts, messages
- Multi-Facility Widgets: Cross-facility overview, network statistics

### Customization Features
- Drag-and-Drop Interface: Widget placement and arrangement
- Widget Drawer: Side drawer with widgets to add to dashboards
- Role-Based Layouts: Different default layouts for different user roles
- Layout Persistence: Save and restore dashboard layouts
- Real-Time Updates: Widgets update with live data
- Facility-Specific Customization: Dashboards for specific facility needs

### Administrator Control
- Staff Dashboard Customization: Administrators can customize staff layouts
- Client Dashboard Customization: Administrators can customize client layouts
- Widget Configuration: Configure widget settings and data sources
- Layout Templates: Pre-built templates for different facility types
- Multi-Facility Management: Customize dashboards across multiple facilities

---

## Out of Scope for MVP (See Post-MVP Roadmap)

- Advanced scheduling and shift management
- Certification/training management
- Advanced search/filtering capabilities
- Payment processing and financial management
- Advanced reporting and predictive analytics
- Mood/Outburst tracker, IPP goals, weight management
- Bulletin board, calendar, advanced notifications
- Natural language processing and voice-to-text
- AI/ML features and recommendations
- Dashboard customization (Phase 2)
- Cross-facility analytics and reporting
- Enterprise features

---

## MVP Success Criteria

- Users can register, log in, and onboard a facility
- Multi-facility users can select and switch between facilities
- Admins can add staff and clients
- Staff can view and update client notes, administer medication, and manage cash
- All actions are tracked in recent activity
- Basic role-based access is enforced
- **User Experience**: Data entry feels natural and engaging, not like form filling
- **Compliance**: All data exportable to PDF forms with complete audit trails
- **Regulatory Readiness**: Timeline compliance tracking for California regional center and licensing requirements
- **Timeline Management**: Due dates and suspense dates are tracked and visible
- **Profile Completion**: Real-time visibility into client profile completeness and missing requirements
- **Basic Dashboards**: Functional dashboards with essential widgets for each role
- **Multi-Facility Access**: Users can work across multiple facilities with proper access controls

---

This MVP will allow us to validate the core workflow, gather user feedback, and iterate quickly while establishing the foundation for engaging, compliant user experiences with comprehensive timeline and deadline management, basic dashboard functionality, and multi-facility access system.
