# Database Constraints Analysis - Story 1.4

## Current State Analysis

### Existing Constraints (Already Implemented)

#### User Table
✅ **Already has**:
- NOT NULL constraints on required fields (firstName, lastName, username, role, tenantId)
- CHECK constraint for email format validation
- CHECK constraint for onboarding_step range (0-10)
- UNIQUE constraints for username, email, company (global uniqueness - needs fixing for tenant scoping)
- Foreign key to tenant with CASCADE

❌ **Missing**:
- Phone number validation (no phone field exists yet)
- Tenant-scoped uniqueness for email/username
- Better role validation beyond enum

#### Facility Table
✅ **Already has**:
- NOT NULL constraints on required fields
- CHECK constraints for projectedClientCount >= 0
- CHECK constraints for roomCount >= 0
- CHECK constraint for state format (2 chars, uppercase)
- CHECK constraint for zip format (regex pattern)
- Foreign key to tenant with CASCADE

❌ **Missing**:
- Phone number field and validation
- Email field and validation
- Tenant-scoped uniqueness for facility names

#### Client Table
✅ **Already has**:
- NOT NULL constraints on required fields
- CHECK constraint for birth date range (1900-01-01 to current date)
- Foreign keys to facility and tenant with CASCADE
- Tenant-scoped UCI uniqueness (via partial unique index)

❌ **Missing**:
- Phone number field and validation
- Email field and validation
- Status field and validation
- Better UCI format validation

#### Tenant Table
✅ **Already has**:
- NOT NULL constraint on name
- Global unique constraint on name

❌ **Missing**:
- Email field and validation
- Phone field and validation
- Status field and validation

#### User Action Audit Log Table
✅ **Already has**:
- NOT NULL constraints on required fields
- Foreign keys to related entities
- Proper indexes

❌ **Missing**:
- Constraint validation for action field (should be enum-like)
- Validation for details JSON structure

## Missing Constraints to Implement

### 1. Tenant-Scoped Uniqueness Issues
Current global uniqueness constraints need to be tenant-scoped:
- User email should be unique per tenant, not globally
- User username should be unique per tenant, not globally
- Facility name should be unique per tenant, not globally

### 2. Missing Fields and Constraints
Several entities are missing important fields that need constraints:
- Phone number fields across entities
- Email fields in facility and client entities
- Status fields for workflow management
- Better format validation for existing fields

### 3. Financial Field Constraints
When financial fields are added (for cash management), need:
- Positive amount constraints
- Decimal precision constraints
- Currency validation

### 4. Enhanced Business Rule Validation
- UCI format validation (beyond just uniqueness)
- Date range validation for related dates
- Cross-field validation rules

## Implementation Strategy

### Phase 1: Fix Existing Constraint Issues
1. Drop existing global unique constraints
2. Create tenant-scoped unique constraints
3. Add missing NOT NULL constraints

### Phase 2: Add Missing Fields and Constraints
1. Add phone and email fields where missing
2. Add proper format validation constraints
3. Add status fields with enum constraints

### Phase 3: Enhanced Business Rule Constraints
1. Add complex CHECK constraints for business rules
2. Add cross-field validation constraints
3. Add financial field constraints (future-proofing)

### Phase 4: Application-Level Validation
1. Update DTOs with enhanced validation
2. Create custom validators for complex rules
3. Ensure error handling is HIPAA-compliant

## HIPAA Compliance Considerations

### Constraint Error Messages
- Ensure constraint violation messages don't expose sensitive data
- Use generic error messages for PHI-related constraints
- Log detailed errors securely for debugging

### Audit Trail Integration
- Ensure constraints work with existing audit logging
- Don't break RLS policies from Story 1.2
- Maintain referential integrity for audit trails

## Testing Strategy

### Database Level Tests
- Test each constraint violation scenario
- Test cascade behavior for foreign keys
- Test tenant isolation with new constraints

### Application Level Tests
- Test DTO validation with enhanced rules
- Test error handling for constraint violations
- Test integration with existing services

### Performance Tests
- Verify constraint checking doesn't impact performance
- Test index usage with new constraints
- Monitor query execution plans