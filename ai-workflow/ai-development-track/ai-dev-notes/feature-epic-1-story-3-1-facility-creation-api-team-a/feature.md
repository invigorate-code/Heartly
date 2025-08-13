# Epic 1 Story 3.1: Fix Facility Creation to Use NestJS API

**Epic**: 1 - The Foundation Crisis  
**Story**: 3.1 - Fix Facility Creation to Use NestJS API  
**Team**: A (Core Infrastructure & Security)  
**Status**: In Progress  
**Started**: 2025-01-11

## 🎯 Story Overview

The facility creation, update, and deletion functionality in the onboarding process is currently using mock data and local state instead of calling the actual NestJS backend API. This story fixes the integration to properly use the backend facility endpoints.

## 📋 Current Issues Identified

1. **Facility Creation**: Line 114 in `/app/onboarding/facilities/page.tsx` has TODO comment, not calling `/api/facility/create`
2. **Facility Update**: Line 105 has TODO comment, not calling `/api/facility/updateFacility`
3. **Facility Deletion**: Line 89 has TODO comment, not calling `/api/facility/:id`
4. **Get User Facilities**: `/api/getUserAndFacilities` endpoint returns mock data instead of calling backend
5. **Onboarding Step Update**: Line 132 has TODO for updating user onboarding step

## 🔧 Implementation Plan

### Phase 1: Create API Service Functions
- Create facility API service functions for CRUD operations
- Ensure proper error handling and response typing
- Use existing SuperTokens session for authentication

### Phase 2: Fix Frontend API Integration
- Replace TODO sections with actual API calls
- Update state management to use API responses
- Add proper loading and error states
- Ensure session tokens are included in requests

### Phase 3: Fix getUserAndFacilities Endpoint
- Create proper API route that calls backend
- Return actual user and facility data
- Include tenant context

### Phase 4: Testing
- Test facility creation flow
- Test facility update flow
- Test facility deletion flow
- Verify onboarding progression

## 📁 Files to Modify

1. `/app/onboarding/facilities/page.tsx` - Main onboarding facilities page
2. `/app/api/getUserAndFacilities/route.ts` - API endpoint (may need creation)
3. New file: `/lib/api/facility.ts` - Facility API service functions

## 🛠️ Technical Approach

### API Service Functions Structure
```typescript
// /lib/api/facility.ts
export const facilityAPI = {
  create: async (data: CreateFacilityDto) => { /* ... */ },
  update: async (data: UpdateFacilityDto) => { /* ... */ },
  delete: async (id: string) => { /* ... */ },
  getById: async (id: string) => { /* ... */ },
  getUserFacilities: async () => { /* ... */ }
};
```

### Backend Endpoints to Use
- `POST /api/facility/create` - Create new facility
- `PATCH /api/facility/updateFacility` - Update facility
- `DELETE /api/facility/:id` - Delete facility (soft delete)
- `GET /api/facility/getLoggedInUserFacilities` - Get user's facilities
- `GET /api/facility/getFacilityById/:id` - Get specific facility

## 🔍 Current Backend Implementation Notes

The backend facility controller already has:
- Proper SuperTokens authentication guards
- Email verification checks
- Role-based access for delete/restore (OWNER only)
- Tenant context handling in the service layer

## ✅ Success Criteria

1. Facility creation in onboarding calls actual backend API
2. Facility updates are persisted to database
3. Facility deletion marks facilities as inactive
4. User can see their actual facilities from database
5. Onboarding progression is tracked properly
6. Error handling provides meaningful feedback to users