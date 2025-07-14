# Heartly MVP Overview

This document outlines the Minimum Viable Product (MVP) for the Heartly application. The MVP focuses on the essential features required to onboard users, manage clients, and perform core facility operations while transforming traditional forms into engaging, conversational experiences.

---

## 1. Core User Flows

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

### 1.3. Navigation

- Navbar
  - User dropdown with Logout
  - Profile Settings (basic: change password)
  - **Facility Selector**: Quick facility switching for multi-facility users

---

## 2. Client Management

### 2.1. Client List & Profile

- View list of clients with **profile completion progress indicators**
- Select client to view basic profile/overview
- Dynamic routing to client dashboard (clients/{id})
- **Timeline compliance status** visible on client list
- **Facility Context**: Clear indication of which facility the client belongs to

### 2.2. Client Dashboard (MVP Components)

- **Daily Notes** (add/view for a client)
  - Conversational interface for entering daily notes
  - Mood tracking with interactive sliders
  - Goal progress tracking
  - Natural language data entry
- **Medication Administration Tracker** (record/administer meds)
  - Interactive medication scheduling
  - Quick check-in/check-out interface
  - Visual medication tracking
- **File Upload/Download for client** (forms, docs)
  - PDF export capability for all data
  - Document management with audit trails
- **Cash Management** (deposit/withdraw for client)
  - Simple transaction interface
  - Balance tracking and history
- **Recent Activity** (basic audit of actions on client)
  - Timeline view of all client interactions
  - Audit trail for regulatory compliance
- **Profile Completion Progress**
  - Real-time completion status
  - Missing requirements alerts
  - Due date tracking for required documentation

---

## 3. Staff Dashboard

- View action items (ToDo/Tasks)
- View recent activity
- View recent notes
- View special incident reports (basic list)
- **Engaging Interface**: Dashboard that feels like a helpful tool, not paperwork
- **Timeline Alerts**: Notifications for upcoming deadlines and incomplete profiles
- **Compliance Overview**: Quick view of facility-wide completion status
- **Basic Widget Layout**: Static dashboard with essential widgets for staff role
- **Facility Context**: Clear indication of current facility and access permissions

---

## 4. Admin Portal (MVP Scope)

- Facility Dashboard (basic: view facility, occupancy)
- Staff Management (view/add staff, assign roles)
- Client Management (view/add/edit/delete clients)
- Settings: User management (add/remove users, assign roles), basic notifications
- **Compliance Features**: Audit trail access and PDF export capabilities
- **Timeline Management**: Overview of all deadlines and compliance requirements
- **Profile Completion Reports**: Facility-wide completion status and missing requirements
- **Basic Dashboard Customization**: Simple layout options for staff and client dashboards
- **Multi-Facility Management**: Basic facility switching and management for multi-facility users

---

## 5. Essential System Features

- Role-based access (basic: Admin, Staff)
- Audit log of key actions (recent activity)
- Secure authentication and session management
- **PDF Compliance**: All data exportable to official forms
- **Timeline Compliance**: Tracking of required documentation deadlines
- **Due Date Management**: Comprehensive tracking of all deadlines and suspense dates
- **Profile Completion Tracking**: Real-time monitoring of client profile completeness
- **Basic Widget System**: Essential widgets for each user role
- **Multi-Facility Access**: Basic facility selection and switching capabilities

---

## 6. Form Transformation Philosophy

### Traditional vs. Heartly Approach

**Traditional**: Digital forms that still feel like filling out paperwork
**Heartly**: Engaging interfaces that feel like helpful tools

### MVP Form Transformations

1. **Daily Notes**

   - Instead of: "Fill out daily notes form"
   - Heartly: "How was [Client Name]'s day?" with conversational prompts

2. **Medication Administration**

   - Instead of: "Medication administration record form"
   - Heartly: "Quick check-in: Did [Client Name] take their 2pm medication?"

3. **Client Information**
   - Instead of: "Client information form"
   - Heartly: Progressive disclosure with smart defaults and suggestions

### PDF Compliance Requirements

- All data must be exportable to official PDF forms
- Complete audit trails for regulatory inspections
- Timeline compliance tracking for required documentation
- California regional center and licensing inspection readiness

---

## 7. Timeline & Deadline Management

### Due Date Tracking

- **Client Admission**: Track required documentation within 30 days of admission
- **Quarterly Reports**: Automated tracking of quarterly report deadlines
- **Annual Reviews**: Yearly documentation requirements and deadlines
- **Medication Reviews**: Regular medication review and update deadlines

### Suspense Date Management

- **Critical Deadlines**: High-priority suspense dates with escalation alerts
- **Compliance Requirements**: Regulatory deadlines with automatic notifications
- **Documentation Updates**: Required updates and review deadlines

### Profile Completion Progress

- **Real-time Indicators**: Visual progress bars on client list and profiles
- **Missing Requirements**: Clear identification of incomplete documentation
- **Completion Alerts**: Notifications for staff and administrators
- **Compliance Dashboard**: Facility-wide overview of completion status

---

## 8. Multi-Facility Access System

### Facility Selection Flow

1. **User Login**: Standard authentication process
2. **Facility Check**: System checks user's facility assignments
3. **Single Facility**: Direct access to dashboard if only one facility
4. **Multiple Facilities**: Facility selection screen with available options
5. **Facility Selection**: User chooses which facility to work in
6. **Context Setup**: Application loads with selected facility context

### Role-Based Access Rules

#### Owners

- **Access**: All facilities they own
- **Switching**: Can switch between any owned facility
- **Management**: Full management capabilities across all facilities
- **Audit**: Complete audit trails across all facilities

#### Administrators

- **Access**: All facilities they are assigned to
- **Switching**: Can switch between assigned facilities
- **Management**: Management capabilities for assigned facilities
- **Audit**: Audit trails for assigned facilities

#### Staff

- **Access**: Facilities where they are currently on shift
- **Switching**: Limited to facilities with active shift assignments
- **Management**: Basic operational capabilities
- **Audit**: Audit trails for current facility only

### Facility Context Features

- **Current Facility Indicator**: Clear display of active facility
- **Facility Switcher**: Quick facility switching for authorized users
- **Context-Aware Data**: All data filtered by current facility
- **Access Controls**: Proper permissions based on facility and role
- **Audit Logging**: Complete tracking of facility access and switching

---

## 9. Dashboard Customization (Future Enhancement)

### Widget Library

- **Client Management Widgets**: Client list, profile completion, recent activity
- **Timeline Widgets**: Due dates, suspense dates, compliance status
- **Audit Widgets**: Recent changes, user activity, audit trails
- **Analytics Widgets**: Facility statistics, trends, insights
- **Communication Widgets**: Notifications, alerts, messages
- **Multi-Facility Widgets**: Cross-facility overview, network statistics

### Customization Features

- **Drag-and-Drop Interface**: Intuitive widget placement and arrangement
- **Widget Drawer**: Side drawer with example widgets that can be dragged to dashboards
- **Role-Based Layouts**: Different default layouts for different user roles
- **Layout Persistence**: Save and restore dashboard layouts
- **Real-Time Updates**: Widgets that update with live data
- **Facility-Specific Customization**: Dashboards that adapt to specific facility needs

### Administrator Control

- **Staff Dashboard Customization**: Administrators can customize staff dashboard layouts
- **Client Dashboard Customization**: Administrators can customize client dashboard layouts
- **Widget Configuration**: Configure widget settings and data sources
- **Layout Templates**: Pre-built layout templates for different facility types
- **Multi-Facility Management**: Customize dashboards across multiple facilities

---

## Out of Scope for MVP (Future Releases)

- Advanced scheduling, shift management
- Certification/training management
- Advanced search/filtering
- Payment methods
- Advanced reporting/analytics
- Mood/Outburst tracker, IPP goals, weight management, etc.
- Bulletin, calendar, advanced notifications
- Natural language processing and voice-to-text
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
