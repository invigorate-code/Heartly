# 📋 **Story Plan: Epic 1 - The Foundation Crisis**

## 🎯 **Epic Overview**
**Epic 1: The Foundation Crisis** - "Fixing What's Broken Before Building New"

**Epic Goal**: Fix all critical foundation issues including database schema, authentication system, and onboarding flow to create a stable, secure foundation for the Heartly application.

**Epic Success Criteria**:
- Complete, secure database schema with proper tenant isolation
- Complete, secure authentication system with proper role management  
- Complete, functional onboarding flow for new users
- All basic user flows work end-to-end

---

## 📚 **Chapter 1: Database Schema and Migration Crisis**

### **Story 1.1: Create Core Database Migrations**
**As a** developer  
**I want** comprehensive database migrations for all entities  
**So that** the database schema is properly versioned and deployable

**Acceptance Criteria**:
- [ ] Create migration for User entity with all required fields and constraints
- [ ] Create migration for Client entity with proper relationships to User and Facility
- [ ] Create migration for Facility entity with tenant isolation fields
- [ ] Create migration for Tenant entity with proper configuration fields
- [ ] Create migration for UserActionAuditLog entity for compliance tracking
- [ ] All migrations include proper foreign key constraints
- [ ] All migrations include proper indexes for performance
- [ ] All migrations are reversible (up/down methods)
- [ ] Migrations can be run in sequence without conflicts

**Notes**:
- Current entities exist but lack proper migrations
- Need to ensure tenant_id is included in all relevant tables
- Consider soft delete patterns for compliance
- Include created_at, updated_at timestamps in all tables
- Ensure proper cascade rules for foreign keys

---

### **Story 1.2: Implement Row Level Security (RLS) Policies**
**As a** system administrator  
**I want** proper RLS policies for all tables  
**So that** data is properly isolated between tenants

**Acceptance Criteria**:
- [ ] Implement RLS policy for User table (users can only see users in their tenant)
- [ ] Implement RLS policy for Client table (users can only see clients in their facilities)
- [ ] Implement RLS policy for Facility table (users can only see facilities in their tenant)
- [ ] Implement RLS policy for Tenant table (users can only see their own tenant)
- [ ] Implement RLS policy for UserActionAuditLog table (users can only see logs for their actions)
- [ ] All policies include proper role-based access (OWNER, ADMIN, STAFF)
- [ ] Policies are tested with different user roles and tenants
- [ ] Policies prevent cross-tenant data access
- [ ] Policies allow proper data access within tenant boundaries

**Notes**:
- Currently only facility table has basic RLS
- Need to consider facility-specific access within tenants
- Ensure policies work with SuperTokens user context
- Test with multiple tenants and users simultaneously
- Consider edge cases like user transfers between facilities

---

### **Story 1.3: Add Database Performance Indexes**
**As a** system administrator  
**I want** proper database indexes for performance optimization  
**So that** queries execute efficiently at scale

**Acceptance Criteria**:
- [ ] Add composite index on (tenant_id, id) for all tenant-scoped tables
- [ ] Add index on (facility_id, id) for facility-scoped tables
- [ ] Add index on (user_id, created_at) for audit logs
- [ ] Add index on (email) for User table
- [ ] Add index on (client_id, created_at) for client-related tables
- [ ] Add index on (status, facility_id) for active client queries
- [ ] All indexes are created with proper naming conventions
- [ ] Index creation is included in migrations
- [ ] Performance impact is measured and documented

**Notes**:
- Focus on queries that will be most common (client lists, user lookups)
- Consider partial indexes for active records only
- Ensure indexes don't conflict with RLS policies
- Test index performance with realistic data volumes

---

### **Story 1.4: Implement Database Constraints and Validation**
**As a** developer  
**I want** proper database constraints and validation rules  
**So that** data integrity is maintained at the database level

**Acceptance Criteria**:
- [ ] Add NOT NULL constraints to all required fields
- [ ] Add CHECK constraints for email format validation
- [ ] Add CHECK constraints for phone number format validation
- [ ] Add CHECK constraints for status field valid values
- [ ] Add UNIQUE constraints where appropriate (email per tenant)
- [ ] Add proper foreign key constraints with cascade rules
- [ ] Add constraint for positive amounts in financial fields
- [ ] Add constraint for valid date ranges
- [ ] All constraints have meaningful error messages

**Notes**:
- Consider tenant-scoped uniqueness (email unique per tenant, not globally)
- Use appropriate cascade rules (CASCADE for audit logs, RESTRICT for critical data)
- Ensure constraints work with soft delete patterns
- Test constraint violations with proper error handling

---

### **Story 1.5: Create Audit Logging Tables and Triggers**
**As a** compliance officer  
**I want** comprehensive audit logging at the database level  
**So that** all data changes are tracked for compliance

**Acceptance Criteria**:
- [ ] Create audit_log table with proper structure
- [ ] Implement database triggers for INSERT operations
- [ ] Implement database triggers for UPDATE operations
- [ ] Implement database triggers for DELETE operations
- [ ] Triggers capture user_id, timestamp, old_values, new_values
- [ ] Triggers work with RLS policies
- [ ] Audit logs are properly indexed for query performance
- [ ] Audit log retention policy is implemented
- [ ] Audit logs can be exported for compliance reporting

**Notes**:
- Consider using JSONB for old_values/new_values to handle schema changes
- Ensure triggers don't significantly impact performance
- Plan for audit log archival strategy
- Consider what data should NOT be audited (passwords, sensitive fields)

---

## 🔐 **Chapter 2: Authentication System Overhaul**

### **Story 2.1: Fix SuperTokens Session Management Integration**
**As a** user  
**I want** proper session management with SuperTokens  
**So that** my authentication state is properly maintained across the application

**Acceptance Criteria**:
- [ ] SuperTokens session is properly integrated with NestJS application
- [ ] User context is available in all API endpoints
- [ ] Session validation works on both frontend and backend
- [ ] Session refresh works automatically
- [ ] Session cleanup works on logout
- [ ] Session timeout is properly configured
- [ ] Multiple concurrent sessions are handled correctly
- [ ] Session data includes user role and tenant information

**Notes**:
- Current integration is incomplete
- Need to ensure session data includes tenant context
- Consider session storage strategy (Redis vs database)
- Test session behavior across different browsers and devices

---

### **Story 2.2: Implement Email Verification Flow**
**As a** user  
**I want** proper email verification when I sign up  
**So that** I can verify my email address and access the application

**Acceptance Criteria**:
- [ ] Email verification is required for new user accounts
- [ ] Verification email is sent with proper branding
- [ ] Email contains secure verification link
- [ ] Verification link expires after 24 hours
- [ ] User cannot access application until email is verified
- [ ] Resend verification email functionality works
- [ ] Email verification status is tracked in database
- [ ] Proper error messages for expired/invalid links
- [ ] Email templates are customizable

**Notes**:
- Currently set to "OPTIONAL" mode
- Need to configure email service (AWS SES, SendGrid, etc.)
- Consider rate limiting for email sending
- Test email delivery across different email providers

---

### **Story 2.3: Integrate SuperTokens Roles with Application Permissions**
**As a** system administrator  
**I want** SuperTokens roles to be properly integrated with application permissions  
**So that** role-based access control works throughout the application

**Acceptance Criteria**:
- [ ] SuperTokens roles (OWNER, ADMIN, STAFF) are properly configured
- [ ] Role information is available in user session
- [ ] Role-based route guards work on all protected endpoints
- [ ] Role information is included in user context
- [ ] Role changes are reflected immediately in session
- [ ] Role validation works on both frontend and backend
- [ ] Role hierarchy is properly enforced
- [ ] Role-based UI components render correctly

**Notes**:
- Need to map SuperTokens roles to application permissions
- Consider facility-specific roles within tenants
- Ensure role changes don't break existing sessions
- Test role escalation and de-escalation scenarios

---

### **Story 2.4: Fix Authentication Guards and Middleware**
**As a** developer  
**I want** proper authentication guards and middleware  
**So that** all protected routes are properly secured

**Acceptance Criteria**:
- [ ] Authentication guard works on all protected API endpoints
- [ ] Optional authentication decorator works for public endpoints
- [ ] Role-based guards work with SuperTokens roles
- [ ] Tenant context is properly validated in guards
- [ ] Facility access is validated in guards where needed
- [ ] Proper error responses for unauthorized access
- [ ] Guards work with both JWT and session tokens
- [ ] Guards include proper logging for security monitoring

**Notes**:
- Current guards are incomplete
- Need to ensure tenant context is always available
- Consider rate limiting for authentication attempts
- Test guards with different user roles and scenarios

---

### **Story 2.5: Implement Password Reset Functionality**
**As a** user  
**I want** to be able to reset my password if I forget it  
**So that** I can regain access to my account

**Acceptance Criteria**:
- [ ] Password reset request endpoint works
- [ ] Password reset email is sent with secure link
- [ ] Reset link expires after 1 hour
- [ ] Password reset form validates new password requirements
- [ ] Password reset is logged for security
- [ ] Rate limiting prevents abuse of reset functionality
- [ ] Reset link can only be used once
- [ ] Proper error messages for invalid/expired links

**Notes**:
- Use SuperTokens built-in password reset functionality
- Ensure password requirements match security policy
- Consider requiring email verification after password reset
- Test with different email providers and spam filters

---

### **Story 2.6: Implement Proper Logout and Session Cleanup**
**As a** user  
**I want** to be able to logout and have my session properly cleaned up  
**So that** my account is secure when I'm done using the application

**Acceptance Criteria**:
- [ ] Logout endpoint properly invalidates session
- [ ] Frontend clears all session data on logout
- [ ] User is redirected to login page after logout
- [ ] Session cleanup works across all tabs/windows
- [ ] Logout is logged for audit purposes
- [ ] "Remember me" functionality is properly cleared
- [ ] Logout works from all pages in the application
- [ ] Session cleanup works with multiple concurrent sessions

**Notes**:
- Ensure SuperTokens session is properly invalidated
- Clear any cached user data in frontend
- Consider implementing "logout from all devices" option
- Test logout behavior with different session states

---

## 🚀 **Chapter 3: Onboarding System Fix**

### **Story 3.1: Fix Facility Creation to Use NestJS API**
**As a** new user  
**I want** to create my facility using the proper NestJS API  
**So that** my facility is properly created and configured

**Acceptance Criteria**:
- [ ] Facility creation uses NestJS API instead of Supabase
- [ ] Facility creation includes proper tenant context
- [ ] Facility creation validates all required fields
- [ ] Facility creation creates proper database records
- [ ] Facility creation sets up proper RLS policies
- [ ] Facility creation includes audit logging
- [ ] Facility creation returns proper success/error responses
- [ ] Facility creation works with SuperTokens user context

**Notes**:
- Currently uses Supabase directly instead of NestJS API
- Need to ensure tenant context is properly set
- Consider facility naming conventions and validation
- Test facility creation with different user roles

---

### **Story 3.2: Implement Onboarding Step Validation and Progression**
**As a** new user  
**I want** proper validation and progression through onboarding steps  
**So that** I can complete the onboarding process successfully

**Acceptance Criteria**:
- [ ] Each onboarding step validates required data before proceeding
- [ ] Progress is saved between steps
- [ ] Users can go back to previous steps
- [ ] Onboarding completion is tracked in database
- [ ] Incomplete onboarding prevents access to main application
- [ ] Onboarding progress is displayed to user
- [ ] Validation errors are clearly displayed
- [ ] Onboarding can be resumed if interrupted

**Notes**:
- Current onboarding flow is incomplete
- Need to persist onboarding state in database
- Consider what happens if onboarding is abandoned
- Test onboarding flow with different data scenarios

---

### **Story 3.3: Build Staff Invitation System**
**As a** facility owner  
**I want** to invite staff members to my facility  
**So that** they can access the application and help manage clients

**Acceptance Criteria**:
- [ ] Staff invitation form collects required information
- [ ] Invitation email is sent with proper branding
- [ ] Invitation includes secure signup link
- [ ] Invitation specifies facility and role
- [ ] Invitation expires after 7 days
- [ ] Invited users can signup with invitation link
- [ ] Invitation status is tracked in database
- [ ] Invitation can be cancelled before acceptance
- [ ] Proper error handling for expired/invalid invitations

**Notes**:
- Need to integrate with SuperTokens invitation system
- Consider role assignment during invitation
- Ensure invitation links are secure and unique
- Test invitation flow with different email providers

---

### **Story 3.4: Fix Onboarding State Management**
**As a** new user  
**I want** proper state management during onboarding  
**So that** my progress is saved and I can complete the process

**Acceptance Criteria**:
- [ ] Onboarding state is persisted in database
- [ ] State includes current step and completed data
- [ ] State is associated with user account
- [ ] State can be retrieved when user returns
- [ ] State is cleared when onboarding is completed
- [ ] State includes validation status for each step
- [ ] State can be reset if needed
- [ ] State is properly secured and isolated by tenant

**Notes**:
- Current state management is broken
- Consider using a dedicated onboarding table
- Ensure state is properly cleaned up after completion
- Test state persistence across different scenarios

---

### **Story 3.5: Add Onboarding Error Handling and Validation**
**As a** new user  
**I want** clear error messages and validation during onboarding  
**So that** I can fix any issues and complete the process

**Acceptance Criteria**:
- [ ] Field-level validation with clear error messages
- [ ] Form-level validation for required steps
- [ ] Network error handling with retry options
- [ ] Validation errors are displayed inline
- [ ] Error messages are user-friendly and actionable
- [ ] Validation prevents progression with invalid data
- [ ] Error logging for debugging purposes
- [ ] Graceful handling of API failures

**Notes**:
- Focus on user-friendly error messages
- Consider offline/online state handling
- Ensure validation works with different data types
- Test error scenarios thoroughly

---

### **Story 3.6: Implement Onboarding Completion Tracking**
**As a** system administrator  
**I want** to track onboarding completion rates  
**So that** I can understand user adoption and identify issues

**Acceptance Criteria**:
- [ ] Onboarding completion is tracked in database
- [ ] Completion metrics are available for reporting
- [ ] Partial completion is tracked
- [ ] Time to completion is measured
- [ ] Drop-off points are identified
- [ ] Completion data is available via API
- [ ] Completion tracking works with different user types
- [ ] Data is properly anonymized for privacy

**Notes**:
- Consider what metrics are most important
- Ensure tracking doesn't impact user experience
- Plan for data retention and privacy compliance
- Use tracking data to improve onboarding flow

---

## 🎯 **Epic 1 Success Criteria Checklist**

### **Database Schema and Migration Crisis**
- [ ] All core entities have proper migrations
- [ ] RLS policies are implemented for all tables
- [ ] Performance indexes are in place
- [ ] Database constraints and validation are working
- [ ] Audit logging is comprehensive and functional

### **Authentication System Overhaul**
- [ ] SuperTokens integration is complete and working
- [ ] Email verification is required and functional
- [ ] Role-based access control is properly implemented
- [ ] Authentication guards work on all protected routes
- [ ] Password reset functionality is working
- [ ] Logout and session cleanup is proper

### **Onboarding System Fix**
- [ ] Facility creation uses NestJS API
- [ ] Onboarding steps validate and progress properly
- [ ] Staff invitation system is functional
- [ ] Onboarding state management works correctly
- [ ] Error handling and validation are comprehensive
- [ ] Onboarding completion is tracked

### **Overall Epic Success**
- [ ] All basic user flows work end-to-end
- [ ] No critical security vulnerabilities
- [ ] Database is properly secured and optimized
- [ ] Authentication system is robust and reliable
- [ ] Onboarding process is smooth and complete

---

## 📝 **Notes for AI Execution**

### **Priority Order**
1. **Database Schema** (Stories 1.1-1.5) - Foundation for everything else
2. **Authentication System** (Stories 2.1-2.6) - Security and user management
3. **Onboarding System** (Stories 3.1-3.6) - User experience and adoption

### **Dependencies**
- Database migrations must be completed before RLS policies
- Authentication system must be working before onboarding
- SuperTokens configuration must be complete before role integration

### **Testing Strategy**
- Each story should include unit tests
- Integration tests for database and authentication
- End-to-end tests for onboarding flow
- Security testing for authentication and authorization

### **Risk Mitigation**
- Backup database before running migrations
- Test authentication changes in staging environment
- Have rollback plan for each major change
- Monitor application performance during changes

### **Success Metrics**
- Zero critical security vulnerabilities
- All automated tests passing
- Onboarding completion rate > 80%
- Authentication system uptime > 99.9%
- Database query performance within acceptable limits 