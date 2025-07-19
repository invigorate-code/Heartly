# AI Development Guide for Heartly

## 🎯 Purpose

This folder contains comprehensive guidance for AI-assisted development of Heartly, a HIPAA-compliant facility management platform. Use these documents to understand the project vision, architecture, and implementation patterns when generating code, planning features, or making architectural decisions.

## 📋 Current Project Status

### Backend (heartly-backend/)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: SuperTokens integration
- **Status**: Foundation established with basic modules (auth, user, client, facility, tenant)
- **Key Features**: Multi-tenant architecture, role-based access, audit logging foundation

### Frontend (heartly-frontend/)
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: HeroUI (NextUI v2) with TailwindCSS
- **Authentication**: SuperTokens React integration
- **Status**: Basic structure with authentication, onboarding, and dashboard foundations
- **Key Features**: Responsive design, theme support, basic routing

### Current Implementation Status
- ✅ Multi-tenant database architecture
- ✅ Basic authentication flow with SuperTokens
- ✅ Role-based access control foundation
- ✅ Audit logging system foundation
- ✅ Basic API structure (auth, user, client, facility, tenant)
- ✅ Frontend authentication and onboarding flow
- 🔄 **In Progress**: Core facility management features
- ⏳ **Planned**: Advanced features from ai-workflow documentation

## 🏗 Architecture Patterns

### Backend Architecture
- **Pattern**: Domain-Driven Design with Clean Architecture principles
- **Structure**: NestJS modules, services, and controllers
- **Database**: TypeORM with PostgreSQL, Row-Level Security (RLS) for tenant isolation
- **Multi-tenancy**: Tenant-based data isolation with RLS policies

### Frontend Architecture
- **Pattern**: Atomic Design principles
- **Structure**: Feature-based organization with reusable components
- **State Management**: React Context API (Redux only if absolutely necessary)
- **Styling**: TailwindCSS with HeroUI components

### Data Flow
- **Shared Types**: Located in root folder for frontend/backend synchronization
- **API**: RESTful patterns with consistent error handling
- **Authentication**: SuperTokens for secure, HIPAA-compliant auth flow

## 📁 File Organization Guide

### AI-Workflow Documents (Reference for Development)

| Document | Purpose | When to Reference |
|----------|---------|-------------------|
| `heartly-comprehensive-overview.md` | **Primary Vision Document** | Always reference for feature planning and architectural decisions |
| `mvp-overview.md` | **MVP Scope & Features** | When implementing core features or planning development phases |
| `form-transformation-philosophy.md` | **UX/UI Philosophy** | When designing user interfaces or data entry flows |
| `timeline-management-system.md` | **Compliance & Deadlines** | When implementing timeline tracking or compliance features |
| `granular-audit-system.md` | **Audit & Logging** | When implementing audit trails or compliance logging |
| `customizable-dashboard-system.md` | **Dashboard Features** | When building dashboard widgets or customization features |
| `multi-facility-access-system.md` | **Multi-Facility Logic** | When implementing facility switching or access controls |
| `universal-action-button.md` | **Global Actions** | When implementing the floating action button system |
| `client-cash-management-system.md` | **Cash Management** | When implementing financial tracking features |
| `document-timelines-and-compliance.md` | **Compliance Requirements** | When implementing regulatory compliance features |
| `heartly-vision.md` | **Long-term Vision** | When planning future features or architectural decisions |
| `supertokens-ai-guidance.md` | **Authentication Patterns** | When implementing auth flows or user management |
| `hipaa-compliance-developers-guide-master/` | **HIPAA Compliance** | When implementing security features or data handling |

### Project Structure
```
Heartly/
├── ai-workflow/                    # 📚 AI Development Guidance
│   ├── README.md                   # This file
│   ├── plan.md                     # 📋 Current development priorities & roadmap
│   ├── ai-development-track/       # 📝 AI development progress & documentation
│   ├── heartly-comprehensive-overview.md
│   ├── mvp-overview.md
│   ├── form-transformation-philosophy.md
│   ├── timeline-management-system.md
│   ├── granular-audit-system.md
│   ├── customizable-dashboard-system.md
│   ├── multi-facility-access-system.md
│   ├── universal-action-button.md
│   ├── client-cash-management-system.md
│   ├── document-timelines-and-compliance.md
│   ├── heartly-vision.md
│   ├── supertokens-ai-guidance.md
│   └── hipaa-compliance-developers-guide-master/
├── heartly-backend/                # 🖥️ NestJS Backend
│   ├── src/
│   │   ├── api/                    # API modules
│   │   ├── common/                 # Shared utilities
│   │   ├── database/               # TypeORM config & migrations
│   │   └── ...
├── heartly-frontend/               # 🎨 Next.js Frontend
│   ├── app/                        # Next.js app router
│   ├── components/                 # Atomic design components
│   └── ...
└── shared/                         # 🔄 Shared types (planned)
```

## 🛠 Development Standards

### Code Organization
- **Follow existing folder structure** (api/, common/, utils/, etc.)
- **Camel case naming** for files, folders, and components
- **Feature-based organization** within modules
- **Shared types in root folder** for frontend/backend sync

### Testing Requirements
- **Unit tests** for every service/component
- **Integration tests** for API endpoints
- **E2E tests** with Cypress for critical user flows
- **Test coverage** for all business logic

### Database & Security
- **PostgreSQL with RLS** for tenant isolation
- **TypeORM patterns** following existing structure
- **HIPAA compliance** referencing hipaa-compliance-developers-guide
- **Audit logging** for all user actions and system events

### Authentication Flow
1. **Owner signup** → Email verification → Onboarding
2. **User creation** by owner/admin within tenant
3. **Facility selection** for multi-facility users
4. **Auto-focus** on single facility for single-facility users

## 🎯 Key Development Principles

### 1. Intelligent Automation
- **Smart defaults** based on user patterns and facility data
- **Predictive insights** for compliance and care quality
- **Automated workflows** for routine tasks
- **Pattern recognition** for behavioral analysis

### 2. Compliance First
- **HIPAA compliance** in every feature
- **Complete audit trails** for all actions
- **Regulatory readiness** for inspections
- **Data privacy** and security by design

### 3. User Experience
- **Intuitive interfaces** that don't feel like forms
- **Real-time insights** from data entry
- **Progressive disclosure** for complex workflows
- **Mobile-first** responsive design

### 4. Multi-Tenant Architecture
- **Complete data isolation** between tenants
- **Role-based access** with facility context
- **Scalable design** for facility networks
- **Cross-facility analytics** when appropriate

## 🔧 Implementation Guidelines

### When Implementing Features
1. **Reference relevant ai-workflow documents** for feature context
2. **Follow existing patterns** in codebase
3. **Implement comprehensive testing** (unit, integration, E2E)
4. **Ensure HIPAA compliance** for data handling
5. **Add audit logging** for all user actions
6. **Consider multi-tenant implications** for all features

### When Planning Architecture
1. **Review heartly-comprehensive-overview.md** for vision alignment
2. **Check mvp-overview.md** for scope boundaries
3. **Reference heartly-vision.md** for long-term considerations
4. **Consider compliance requirements** from timeline documents

### When Building UI/UX
1. **Follow form-transformation-philosophy.md** for user experience
2. **Use atomic design principles** for component organization
3. **Implement responsive design** with TailwindCSS
4. **Ensure accessibility** and usability

### When Implementing Security
1. **Reference hipaa-compliance-developers-guide** for requirements
2. **Implement RLS policies** for tenant isolation
3. **Add comprehensive audit logging** for compliance
4. **Follow SuperTokens patterns** for authentication

## 📊 Success Metrics

### Development Quality
- **Test coverage** > 90% for all business logic
- **Type safety** with TypeScript throughout
- **Performance** optimization for user experience
- **Security** compliance with HIPAA requirements

### User Experience
- **Intuitive workflows** that reduce training time
- **Real-time insights** that provide immediate value
- **Compliance automation** that reduces manual work
- **Mobile accessibility** for on-the-go use

### Business Value
- **Operational efficiency** improvements
- **Compliance readiness** for inspections
- **Staff satisfaction** through better tools
- **Care quality** enhancements through data insights

## 📋 AI Development Workflow & Documentation

### Mandatory Documentation Requirements

**ALL AI development work must be thoroughly but concisely documented in the `ai-development-track/` folder.**

#### Required Documentation for Every Session:
1. **What I'm Working On**: Clear description of current task/feature
2. **What I Accomplished**: Detailed summary of completed work
3. **What I Left Off On**: Current progress state and next steps
4. **Changes Made**: All code changes with explanations of why
5. **Errors Encountered**: Any issues, errors, or blockers
6. **How I Fixed Issues**: Solutions and workarounds used
7. **What Should Be Worked On Next**: Recommendations for next development session

#### Documentation Format:
- **File naming**: `YYYY-MM-DD-session-summary.md` or `feature-name-progress.md`
- **Location**: `ai-development-track/` folder
- **Include**: Code snippets, error messages, architectural decisions, and reasoning

### Planning & Coordination

#### Always Reference plan.md
- **Before starting work**: Read and understand current plan.md
- **During development**: Check plan.md to ensure alignment with priorities
- **After completing work**: Update plan.md with progress and next steps
- **Avoid duplication**: Check plan.md to prevent repeating completed work

#### Plan.md Integration:
- **Current priorities** and development phases
- **Completed features** and milestones
- **Next development targets** and dependencies
- **Blocked items** and resolution status

## 🚀 Getting Started with AI Development

### Before Starting Any Work
1. **Read plan.md** to understand current priorities and avoid duplication
2. **Check ai-development-track/** for recent progress and context
3. **Read heartly-comprehensive-overview.md** for context
4. **Check mvp-overview.md** for scope
5. **Review relevant feature documents** in ai-workflow
6. **Document your planned work** in ai-development-track/

### For New Features
1. **Reference plan.md** for priority and scope
2. **Follow existing patterns** in codebase
3. **Implement comprehensive testing**
4. **Ensure HIPAA compliance**
5. **Document all changes** with explanations
6. **Update plan.md** with progress

### For Bug Fixes
1. **Check audit logs** for user actions
2. **Review related feature documentation**
3. **Follow existing testing patterns**
4. **Maintain data integrity** and security
5. **Document the fix** and root cause analysis

### For Architecture Decisions
1. **Reference heartly-vision.md** for long-term alignment
2. **Check compliance requirements** from timeline documents
3. **Consider multi-tenant implications**
4. **Ensure scalability** and maintainability
5. **Document architectural reasoning** and trade-offs

---

**Remember**: This is a HIPAA-compliant healthcare application. Every feature must prioritize security, privacy, and regulatory compliance while delivering an exceptional user experience that transforms facility management from paperwork to meaningful interaction. 