# Heartly MVP Overview

This document outlines the Minimum Viable Product (MVP) for the Heartly application. The MVP focuses on the essential features required to onboard users, manage clients, and perform core facility operations while transforming traditional forms into engaging, intelligent experiences with automation, smart defaults, and predictive capabilities.

---

## 1 Core User Flows

### 1.1. Authentication & Onboarding

- Landing Page
- Auth Pages
  - Login
  - Register
- Onboarding
  - Facility Creation (first-time setup)
  - Staff Creation (invite/add staff)

### 1.2. Multi-Facility Access

- **Facility Selection Screen**: Users with multiple facility access choose which facility to work in
- **Single Facility Users**: Direct access to their assigned facility
- **Role-Based Access**: Different facility access rules based on user roles
- **Facility Context**: Clear indication of current facility throughout the application
- **Intelligent Facility Insights**: Smart recommendations and analytics for facility management

### 1.3. Navigation

- Navbar
  - User dropdown with Logout
  - Profile Settings (basic: change password)
  - **Facility Selector**: Quick facility switching for multi-facility users
  - **Intelligent Notifications**: Smart alerts and recommendations

---

## 2. Client Management

### 2.1. Client List & Profile

- View list of clients with **profile completion progress indicators** and intelligent completion prediction
- Select client to view basic profile/overview
- Dynamic routing to client dashboard (clients/{id})
- **Timeline compliance status** visible on client list with intelligent risk assessment
- **Facility Context**: Clear indication of which facility the client belongs to
- **Smart Recommendations**: Intelligent suggestions for incomplete profiles and missing requirements

### 2.2. Client Dashboard (MVP Components)

- **Daily Notes** (add/view for a client)
  - Intelligent, intuitive interface for entering daily notes with mood tracking
  - Mood tracking with interactive sliders and pattern recognition
  - Goal progress tracking with automated insights
  - Natural language data entry with smart suggestions
  - Behavioral analytics and trend analysis
- **Medication Administration Tracker** (record/administer meds)
  - Interactive medication scheduling with barcode integration
  - Quick check-in/check-out interface with dosage validation
  - Visual medication tracking with automated conflict detection
  - Integration with pharmacy systems for automated refill management
- **File Upload/Download for client** (forms, docs)
  - PDF export capability for all data with automated formatting
  - Document management with audit trails and intelligent organization
  - Smart document categorization and search
- **Cash Management** (deposit/withdraw for client)
  - Simple transaction interface with signature requirements
  - Balance tracking and history with intelligent financial monitoring
  - Receipt upload and management with automated association
- **Recent Activity** (basic audit of actions on client)
  - Timeline view of all client interactions with intelligent analysis
  - Audit trail for regulatory compliance with risk assessment
  - Pattern recognition and behavioral insights
- **Profile Completion Progress**
  - Real-time completion status with intelligent prediction
  - Missing requirements alerts with smart recommendations
  - Due date tracking for required documentation with automated notifications

---

## 3. Staff Dashboard

- View action items (ToDo/Tasks) with intelligent prioritization
- View recent activity with pattern analysis
- View recent notes with behavioral insights
- View special incident reports (basic list) with risk assessment
- **Engaging Interface**: Dashboard that feels like a helpful tool, not paperwork
- **Timeline Alerts**: Notifications for upcoming deadlines and incomplete profiles with intelligent escalation
- **Compliance Overview**: Quick view of facility-wide completion status with risk assessment
- **Basic Widget Layout**: Static dashboard with essential widgets for staff role and intelligent insights
- **Facility Context**: Clear indication of current facility and access permissions
- **Smart Recommendations**: Intelligent suggestions for improving care quality and efficiency

---

## 4. Admin Portal (MVP Scope)

- Facility Dashboard (basic: view facility, occupancy) with intelligent analytics
- Staff Management (view/add staff, assign roles) with smart role recommendations
- Client Management (view/add/edit/delete clients) with intelligent client insights
- Settings: User management (add/remove users, assign roles), basic notifications with intelligent routing
- **Compliance Features**: Audit trail access and PDF export capabilities with intelligent compliance monitoring
- **Timeline Management**: Overview of all deadlines and compliance requirements with predictive analytics
- **Profile Completion Reports**: Facility-wide completion status and missing requirements with intelligent recommendations
- **Basic Dashboard Customization**: Simple layout options for staff and client dashboards with intelligent widget suggestions
- **Multi-Facility Management**: Basic facility switching and management for multi-facility users with cross-facility analytics

---

## 5. Essential System Features

- Role-based access (basic: Admin, Staff) with intelligent permission management
- Audit log of key actions (recent activity) with intelligent risk assessment
- Secure authentication and session management with smart security monitoring
- **PDF Compliance**: All data exportable to official forms with automated formatting
- **Timeline Compliance**: Tracking of required documentation deadlines with intelligent reminders
- **Due Date Management**: Comprehensive tracking of all deadlines and suspense dates with automated escalation
- **Profile Completion Tracking**: Real-time monitoring of client profile completeness with intelligent recommendations
- **Basic Widget System**: Essential widgets for each user role with intelligent data visualization
- **Multi-Facility Access**: Basic facility selection and switching capabilities with intelligent cross-facility insights
- **Intelligent Automation**: Smart defaults, automated workflows, and basic predictive insights
- **Enhanced Integration**: Basic integration with external systems and real-time data synchronization

---

## 6. Form Transformation Philosophy

### Traditional vs. Heartly Approach

**Traditional**: Digital forms that still feel like filling out paperwork
**Heartly**: Intelligent, engaging interfaces that feel like helpful tools with automation and smart insights

### MVP Form Transformations1 **Daily Notes**

   - Instead of: "Fill out daily notes form"
   - Heartly: "How was [Client Name]'s day? with intelligent, intuitive input options and pattern recognition

2. **Medication Administration**

   - Instead of: "Medication administration record form"
   - Heartly: "Quick check-in: Did [Client Name] take their 2pm medication?" with barcode scanning and automated validation

3. **Client Information**
   - Instead of: "Client information form"
   - Heartly: Progressive disclosure with smart defaults, intelligent suggestions, and automated field population

### PDF Compliance Requirements

- All data must be exportable to official PDF forms for regulatory requirements
- Complete audit trails for regulatory inspections with intelligent compliance verification
- Timeline compliance tracking for required documentation with automated alerts
- California regional center and licensing inspection readiness with intelligent preparation tools

---

## 7. Timeline & Deadline Management

### Due Date Tracking

- **Client Admission**: Track required documentation within 30 days of admission with intelligent reminders
- **Quarterly Reports**: Automated tracking of quarterly report deadlines with smart generation
- **Annual Reviews**: Yearly documentation requirements and deadlines with predictive scheduling
- **Medication Reviews**: Regular medication review and update deadlines with automated alerts

### Suspense Date Management

- **Critical Deadlines**: High-priority suspense dates with escalation alerts and intelligent prioritization
- **Compliance Requirements**: Regulatory deadlines with automatic notifications and risk assessment
- **Documentation Updates**: Required updates and review deadlines with smart workflow triggers

### Profile Completion Progress

- **Real-time Indicators**: Visual progress bars on client list and profiles with intelligent completion prediction
- **Missing Requirements**: Clear identification of incomplete documentation with smart recommendations
- **Completion Alerts**: Notifications for staff and administrators with automated task assignment
- **Compliance Dashboard**: Facility-wide overview of completion status with intelligent risk assessment

---

## 8. Multi-Facility Access System

### Facility Selection Flow

1 Login**: Standard authentication process with intelligent session management
2. **Facility Check**: System checks user's facility assignments with smart access recommendations
3. **Single Facility**: Direct access to dashboard if only one facility
4. **Multiple Facilities**: Facility selection screen with available options and intelligent insights
5. **Facility Selection**: User chooses which facility to work in with smart context switching
6**Context Setup**: Application loads with selected facility context and intelligent analytics

### Role-Based Access Rules

#### Owners

- **Access**: All facilities they own with intelligent cross-facility analytics
- **Switching**: Can switch between any owned facility with smart context management
- **Management**: Full management capabilities across all facilities with intelligent insights
- **Audit**: Complete audit trails across all facilities with intelligent risk assessment

#### Administrators

- **Access**: All facilities they are assigned to with intelligent facility insights
- **Switching**: Can switch between assigned facilities with smart workflow management
- **Management**: Management capabilities for assigned facilities with intelligent recommendations
- **Audit**: Audit trails for assigned facilities with intelligent compliance monitoring

#### Staff

- **Access**: Facilities where they are currently on shift with intelligent access management
- **Switching**: Limited to facilities with active shift assignments with smart context switching
- **Management**: Basic operational capabilities with intelligent task recommendations
- **Audit**: Audit trails for current facility only with intelligent activity monitoring

### Facility Context Features

- **Current Facility Indicator**: Clear display of active facility with intelligent context management
- **Facility Switcher**: Quick facility switching for authorized users with smart recommendations
- **Context-Aware Data**: All data filtered by current facility with intelligent cross-facility insights
- **Access Controls**: Proper permissions based on facility and role with intelligent security monitoring
- **Audit Logging**: Complete tracking of facility access and switching with intelligent behavioral analysis

---

## 9. Dashboard Customization (Future Enhancement)

### Widget Library

- **Client Management Widgets**: Client list, profile completion, recent activity with intelligent insights
- **Timeline Widgets**: Due dates, suspense dates, compliance status with intelligent risk assessment
- **Audit Widgets**: Recent changes, user activity, audit trails with intelligent analysis
- **Analytics Widgets**: Facility statistics, trends, insights with predictive analytics
- **Communication Widgets**: Notifications, alerts, messages with intelligent routing
- **Multi-Facility Widgets**: Cross-facility overview, network statistics with intelligent coordination
- **Intelligent Insights Widgets**: Pattern recognition, trend analysis, and automated recommendations

### Customization Features

- **Drag-and-Drop Interface**: Intuitive widget placement and arrangement with intelligent suggestions
- **Widget Drawer**: Side drawer with example widgets that can be dragged to dashboards with smart recommendations
- **Role-Based Layouts**: Different default layouts for different user roles with intelligent customization
- **Layout Persistence**: Save and restore dashboard layouts with intelligent optimization
- **Real-Time Updates**: Widgets that update with live data and intelligent insights
- **Facility-Specific Customization**: Dashboards that adapt to specific facility needs with intelligent recommendations

### Administrator Control

- **Staff Dashboard Customization**: Administrators can customize staff dashboard layouts with intelligent suggestions
- **Client Dashboard Customization**: Administrators can customize client dashboard layouts with smart recommendations
- **Widget Configuration**: Configure widget settings and data sources with intelligent optimization
- **Layout Templates**: Pre-built layout templates for different facility types with intelligent customization
- **Multi-Facility Management**: Customize dashboards across multiple facilities with intelligent coordination

---

## Out of Scope for MVP (Future Releases)

- Advanced scheduling, shift management with intelligent optimization
- Certification/training management
- Advanced search/filtering with intelligent recommendations
- Payment methods with intelligent financial management
- Advanced reporting/analytics with predictive modeling and intelligent insights
- Mood/Outburst tracker, IPP goals, weight management, etc.
- Bulletin, calendar, advanced notifications
- Natural language processing and voice-to-text
- Advanced AI/ML features with personalized recommendations and predictive analytics
- Advanced conversational AI
- Predictive deadline management
- Advanced timeline analytics
- Full dashboard customization system
- Advanced widget library
- AI-powered dashboard optimization
- Advanced multi-facility analytics
- Cross-facility reporting
- Network-wide insights
- Enterprise multi-facility management

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
