# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Heartly is a HIPAA-compliant management system for Adult Residential Facilities (ARFs) and Adult Residential Treatment Facilities (ARTFs). The project is a monorepo containing a NestJS backend and Next.js frontend with multi-tenant, multi-facility architecture, comprehensive audit logging, and intelligent workflow transformation that prioritizes patient privacy and regulatory compliance.

## Required Reading for Context

**CRITICAL**: Before starting any development work, you MUST read and understand ALL files in the `ai-workflow/` folder to gain complete context about the Heartly application. This includes:

### Core Documentation (ai-workflow/)
- `heartly-comprehensive-overview.md` - Complete application overview and business logic
- `heartly-vision.md` - Long-term vision and strategic goals
- `heartly-technical-structure.md` - Technical architecture and stack details
- `mvp-outline.md` - Minimum viable product specifications
- `form-transformation-philosophy.md` - Core UI/UX transformation approach

### Feature Specifications (ai-workflow/)
- `multi-facility-access-system.md` - Multi-facility management system
- `customizable-dashboard-system.md` - Dashboard and analytics system
- `timeline-management-system.md` - Compliance and deadline tracking
- `granular-audit-system.md` - Audit logging for HIPAA compliance
- `document-timelines-and-compliance.md` - Document management requirements
- `universal-action-button.md` - Core UX floating action button system
- `client-cash-management-system.md` - Client financial management and expense tracking
- `supertokens-ai-guidance.md` - SuperTokens authentication integration patterns

### Development Standards (ai-workflow/ai-development-track/)
- `ai-development-direction.md` - **MANDATORY** development standards and guidelines
- `epic-plan.md` - Current development priorities and roadmap
- `story-plan.md` - Detailed story breakdowns and implementation requirements

### HIPAA Compliance (ai-workflow/hipaa-compliance-developers-guide-master/)
- Complete HIPAA compliance guide - **CRITICAL** for healthcare application development

## Architecture

This is a **monorepo** with two main applications:
- `heartly-backend/` - NestJS API server with TypeScript, PostgreSQL, TypeORM, SuperTokens auth
- `heartly-frontend/` - Next.js 14 frontend with TypeScript, HeroUI, TailwindCSS, SuperTokens auth

Key architectural patterns:
- **Multi-tenant architecture**: All data isolated by `tenantId`
- **Role-based access control**: Granular permissions via SuperTokens and custom roles
- **Multi-facility access**: Users can work across multiple facilities with proper access controls
- **Modular backend**: Uses `MODULES_SET` environment variable to load different module configurations (monolith, api, background)

## Common Development Commands

### Root Level Commands
```bash
# Generate TypeScript types from backend schemas
pnpm run generate:types

# Build backend only
pnpm run build:backend

# Sync types (builds backend + generates types)
pnpm run sync-types
```

### Backend Commands (in heartly-backend/)
```bash
# Development
pnpm start:dev          # Start with file watcher
pnpm start:debug        # Start with debugger
pnpm build              # Build for production
pnpm start:prod         # Start production build

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Run with coverage
pnpm test:e2e           # Run end-to-end tests

# Database Management
pnpm migration:generate # Generate new migration
pnpm migration:up       # Run pending migrations
pnpm migration:down     # Revert last migration
pnpm seed:run           # Run database seeds
pnpm db:create          # Create database
pnpm db:drop            # Drop database

# Code Quality
pnpm lint               # Lint and fix code
pnpm format             # Format code with Prettier
```

### Frontend Commands (in heartly-frontend/)
```bash
# Development
pnpm dev                # Start development server
pnpm build              # Build for production
pnpm start              # Start production build

# Testing
pnpm test               # Run Jest tests
pnpm test:watch         # Run tests in watch mode
pnpm cypress:open       # Open Cypress for E2E testing

# Type Generation
pnpm generate:types     # Generate types from backend
```

## Code Structure & Architecture

### Backend Structure (heartly-backend/src/)
- `api/` - Feature modules (client, facility, user, etc.) following NestJS module pattern
- `database/` - TypeORM configuration, migrations, seeds, entities
- `config/` - Application configuration files
- `common/` - Shared DTOs, services, entities
- `utils/` - Utility functions and middleware
- `decorators/` - Custom decorators for validation, auth, etc.
- `background/` - Background job processing with BullMQ

### Frontend Structure (heartly-frontend/)
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components organized by feature
- `shared/` - Shared contexts, hooks, types, and utilities
- `utils/` - Utility functions

### Key Backend Patterns
- **Entity Structure**: All entities extend `AbstractEntity` with `tenantId` for multi-tenancy
- **Module Organization**: Each feature has controller, service, module, DTOs, and entities
- **Validation**: Uses class-validator decorators in DTOs
- **Authentication**: SuperTokens integration with custom role/permission system
- **Database**: PostgreSQL with TypeORM, uses migrations for schema changes

### Key Frontend Patterns
- **App Router**: Uses Next.js 14 App Router (not Pages Router)
- **Server/Client Components**: Mix of RSC and client components with `'use client'` directive
- **Authentication**: SuperTokens React integration
- **Styling**: TailwindCSS with HeroUI (NextUI v2) components
- **State Management**: React Context for global state

## Development Standards & Guidelines

### HIPAA Compliance - MANDATORY
**CRITICAL**: This is a healthcare application handling PHI (Protected Health Information). Every development decision must prioritize patient privacy and data security.

#### HIPAA Implementation Checklist
- [ ] All PHI fields are properly encrypted at rest and in transit
- [ ] Access controls limit PHI access to authorized personnel only (minimum necessary access)
- [ ] Comprehensive audit logs capture all PHI access and modifications
- [ ] Data validation prevents unauthorized data entry
- [ ] Secure authentication and session management with SuperTokens
- [ ] Proper error handling that doesn't expose PHI in error messages
- [ ] Database security with Row Level Security (RLS) policies
- [ ] All API endpoints secured with proper authentication and rate limiting

### Code Quality Requirements
- **TypeScript**: Strict mode compliance - proper typing for ALL functions and variables
- **Error Handling**: Comprehensive try-catch blocks with meaningful, secure error messages
- **Validation**: Input validation at both API (DTOs) and database levels
- **Documentation**: Concise inline comments explaining complex logic only
- **Testing**: Every feature MUST include unit and integration tests
- **Performance**: Consider query optimization and caching strategies

### Database Development Standards
- **Migrations**: Always create proper TypeORM migrations: `pnpm migration:generate -n descriptive-name`
- **RLS Policies**: Implement Row Level Security for ALL tenant-scoped tables
- **Indexes**: Add appropriate indexes for performance optimization
- **Constraints**: Use database constraints for data integrity
- **Audit Logging**: Implement comprehensive audit trails for compliance
- **Tenant Isolation**: All entities must include `tenantId` with proper filtering

### API Development Standards
- **RESTful Design**: Follow REST conventions for endpoint structure
- **DTOs**: Use DTOs with class-validator decorators for ALL endpoints
- **Error Responses**: Consistent error response format across all endpoints
- **Authentication**: Proper SuperTokens integration with role-based access control
- **Rate Limiting**: Implement appropriate rate limiting for security
- **Swagger Documentation**: Use swagger decorators for complete API documentation

### Frontend Development Standards  
- **Component Structure**: Use functional components with strict TypeScript
- **Server/Client Components**: Use Server Components by default, Client Components only for interactivity
- **State Management**: Use React hooks and context appropriately
- **Styling**: Use TailwindCSS utility classes, avoid custom CSS when possible
- **Accessibility**: Ensure WCAG compliance for all components
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Type Safety**: Use generated TypeScript interfaces from backend

### File Organization Standards
- **Naming**: Use kebab-case for files/folders, PascalCase for components/classes
- **Structure**: Follow existing patterns in `heartly-backend/src/` and `heartly-frontend/app/`
- **Imports**: Use absolute imports, organize imports logically
- **Exports**: Use named exports for better tree-shaking

## Testing

### Backend Testing
- Unit tests using Jest: place `.spec.ts` files next to source files
- E2E tests in `test/` directory
- Mock external dependencies and database calls

### Frontend Testing
- Jest for unit tests
- Cypress for E2E testing
- Test user interactions and component behavior

## Important Files & Configurations

### Environment Setup
- Backend: `.env` with database, Redis, SuperTokens configuration
- Frontend: Environment variables for API URLs and SuperTokens

### Key Configuration Files
- `heartly-backend/src/utils/modules-set.ts` - Module loading configuration
- `heartly-backend/src/database/data-source.ts` - TypeORM configuration
- `heartly-frontend/middleware.ts` - SuperTokens middleware
- Root `package.json` - Workspace scripts for type generation

### Docker Support
- Backend has Docker support with `docker-compose.yml`
- Use `docker compose up -d db maildev pgadmin` for development services

## AI Development Workflow

### Feature Implementation Process
1. **Review Epic/Story Plans**: Read `ai-workflow/ai-development-track/epic-plan.md` and `story-plan.md` for current requirements
2. **Create Feature Folder**: Set up documentation in `ai-workflow/ai-development-track/ai-dev-notes/feature-epic-{X}-story-{Y}-{feature-name}/`
3. **Plan Implementation**: Document technical approach in `feature.md`
4. **Implement Feature**: Follow documented plan with HIPAA compliance checks
5. **Handle Errors**: Document issues and solutions in `errors.md`
6. **Write Tests**: Implement comprehensive tests in `tests.md`
7. **Code Review**: Ensure all standards met and HIPAA compliance maintained

### AI Development Notes Structure
```
ai-workflow/ai-development-track/ai-dev-notes/
├── feature-epic-{X}-story-{Y}-{feature-name}/
│   ├── feature.md          # Feature implementation details
│   ├── errors.md           # Error handling and troubleshooting
│   └── tests.md            # Test implementation details
```

### Quality Assurance Checklist
- [ ] Feature matches story requirements exactly
- [ ] All code follows TypeScript strict mode
- [ ] Comprehensive error handling and validation implemented
- [ ] Unit and integration tests written and passing
- [ ] HIPAA compliance requirements met
- [ ] Code properly documented with inline comments
- [ ] Performance considerations addressed
- [ ] Security measures implemented
- [ ] Accessibility requirements met

## Critical Development Rules

### Do's ✅
- Read ALL files in `ai-workflow/` folder for complete context before starting
- Follow the epic and story plans exactly as specified
- Create detailed implementation notes in `ai-dev-notes/` folder
- Implement comprehensive error handling and validation
- Write tests for every feature
- Consider HIPAA compliance in every decision
- Use concise inline documentation for complex logic only

### Don'ts ❌
- Don't implement features not in the current story plan
- Don't skip error handling or validation
- Don't ignore HIPAA compliance requirements
- Don't implement improvements without explicit approval
- Don't skip testing or documentation
- Don't assume the foundation is solid - verify current state

## Multi-Tenancy & Security

### Tenant Isolation Requirements
- All database entities MUST include `tenantId` with proper filtering
- API services must implement automatic tenant filtering via `BaseTenantService`
- Never allow cross-tenant data access under any circumstances
- Implement Row Level Security (RLS) policies for all tenant-scoped tables

### Security Considerations
- All API routes require authentication unless explicitly marked as public
- Use role-based guards for authorization with minimum necessary access
- Never expose tenant data across boundaries
- Always validate and sanitize user inputs to prevent injection attacks
- Implement proper session management with SuperTokens

## Compliance & Audit Features

**CRITICAL FOR REGULATORY COMPLIANCE**: The application includes comprehensive audit logging that must be maintained:

- **Field-level audit trails**: Complete tracking in `user-action-audit-log` module
- **Timeline and deadline tracking**: For regulatory compliance requirements
- **PDF export capabilities**: All data must be exportable to official regulatory forms
- **Complete user action logging**: Every PHI access and modification logged for HIPAA compliance
- **Data integrity controls**: Prevent unauthorized modifications with proper validation

When making ANY changes to data models or user interactions, ensure audit trails are maintained and compliance features continue to work properly. This is non-negotiable for a healthcare application.

## Memories

### Development Workflow
- Always keep notes of work in ai-dev-notes folder and create a folder title with epic-story-team type naming structure and with error, feature, test md. Also can just view ai development notes structure setting in ai-development-direction