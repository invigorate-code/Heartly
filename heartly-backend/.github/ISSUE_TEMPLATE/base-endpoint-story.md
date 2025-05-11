---
name: "Base Endpoint Story"
about: "Create a tenant-scoped CRUD endpoint for a given resource"
title: "BASE-###: {Resource} Endpoints"
labels: ["backend","api","story"]
assignees: []
---

## Overview
**Resource**: `{Resource}`  
**Module**: Base Endpoint Creation Feature  

**As a** tenant-scoped user  
**I want** CRUD endpoints for **`{Resource}`**  
**So that** my tenant’s data for this resource is managed securely and in isolation  

## Acceptance Criteria
- [ ] **tenantId** field is included in all request & response DTOs  
- [ ] Standard REST routes exist under `/api/{resource}`:  
  - `GET /api/{resource}`  
  - `GET /api/{resource}/{id}`  
  - `POST /api/{resource}`  
  - `PUT /api/{resource}/{id}`  
  - `DELETE /api/{resource}/{id}`  
- [ ] **RBAC** enforcement:  
  - Create/Update/Delete → **Owner**, **Admin** only  
  - Read → **Owner**, **Admin**, **Staff**  
  - Unauthorized roles receive HTTP 403  
- [ ] Request and response DTOs defined (e.g. `create{Resource}.req.dto.ts`, `create{Resource}.res.dto.ts`)  
- [ ] **RLS** policy in database ensures queries automatically filter by `tenantId`  
- [ ] Unit tests for controllers, services, and security rules  
- [ ] Integration tests verifying RBAC and RLS behaviors  
- [ ] **(Optional)** Pagination/filtering on list endpoints for large tables  

## Additional Context
*Any extra details, performance considerations, or custom behaviors for this resource (e.g. large-table pagination, date filtering, etc.)*
