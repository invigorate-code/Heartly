# Heartly Application Overview

## 🏥 Project Description

Heartly is a comprehensive, HIPAA-compliant management system designed to streamline operations and enhance resident care in Adult Residential Facilities (ARFs) and Adult Residential Treatment Facilities (ARTFs). The application provides multi-tenant architecture with role-based access control, comprehensive audit logging, and modern web technologies.

**Core Innovation**: Heartly transforms traditional PDF forms into engaging, conversational interfaces that don't feel like form-filling while maintaining complete PDF compliance and audit trails for California regional center and licensing requirements.

**Timeline Management**: Comprehensive tracking of due dates, suspense dates, deadlines, and profile completion progress to ensure regulatory compliance and prevent missed requirements.

**Granular Audit System**: Complete field-level audit trails tracking every change, save, submit, and edit action with full user attribution for complete regulatory compliance and transparency.

**Customizable Dashboards**: Drag-and-drop widget system allowing Administrators and Owners to customize staff and client dashboard layouts for optimal user experience and facility-specific workflows.

**Multi-Facility Access System**: Comprehensive facility selection and access control system allowing users to work across multiple facilities with role-based permissions and shift-based access controls.

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14 with TypeScript and App Router
- **UI Library**: HeroUI (NextUI v2) for modern, accessible components
- **Styling**: TailwindCSS for utility-first styling
- **Authentication**: SuperTokens for secure session management
- **Animations**: Framer Motion for smooth user interactions
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React and Iconify for consistent iconography
- **Drag & Drop**: React DnD or similar for widget customization

### Backend

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: SuperTokens for secure authentication and session management
- **Caching**: Redis with BullMQ for background job processing
- **Documentation**: Swagger/OpenAPI for API documentation
- **Logging**: Pino for structured logging
- **Internationalization**: NestJS I18n for multi-language support
- **Validation**: Class-validator and class-transformer for DTO validation

### Infrastructure

- **Package Manager**: pnpm with workspace management
- **Containerization**: Docker support for deployment
- **Testing**: Jest for unit tests, Cypress for E2E testing
- **Code Quality**: ESLint, Prettier, Husky for git hooks
- **CI/CD**: GitHub Actions ready

## 🏗 Architecture Overview

### Multi-Tenant Design

The application implements a robust multi-tenant architecture where all data is isolated by `tenantId`. This ensures:

- Complete data separation between different healthcare organizations
- Simplified data cleanup and deletion
- Scalable architecture for multiple clients
- Secure data access controls

### Multi-Facility Access System

The application supports users working across multiple facilities with comprehensive access controls:

- **Facility Selection**: Users with multiple facility access are presented with a facility selection screen after login
- **Role-Based Access**: Different facility access rules based on user roles
- **Dynamic Switching**: Seamless facility switching during active sessions
- **Access Control**: Granular permissions based on facility assignments and user roles
- **Shift-Based Access**: Staff access limited to facilities where they are currently on shift

### Database Schema

#### Core Entities

The following core entities are central to Heartly's data model:

- **Auth**
- **Facility**
- **User-Action-Audit-Log**
- **Tenant**
- **User**
- **Client**
- **File**
- **Placement Information**
- **Personal Rights**
- **Functional Capability Assessment**
- **Admission Agreement**
- **Personal Possession Inventory**
- **Physical Report**
- **Dental Report**
- **Restricted Health Care Plan**
- **Medication Administration Record** (Large Table)
- **Destruction Log**
- **Psychotropic Medication Log**
- **Consent For Medical Treatment**
- **Weight Record**
- **Individual Program Plan (IPP) / Needs and Services Plan**
- **Quarterly Report**
- **Yearly Report**
- **Special Incident Report**
- **Record of Clients Cash Resources**
- **Daily Notes** (Large Table)
- **Permission**
- **Scheduling**
- **Personal Notes**
- **Timeline Tracking**
- **Deadline Management**
- **Profile Completion Status**
- **Field-Level Audit Log**
- **Event Log**
- **Data Change History**
- **Dashboard Layout**
- **Widget Configuration**
- **Widget Library**
- **User Facility Assignment**
- **Facility Access Log**
- **Shift Schedule**
- **Facility Selection Session**

### Authentication & Authorization

#### SuperTokens Integration

- **Email/Password Authentication**: Secure login with email verification
- **Session Management**: Cookie-based sessions with automatic refresh
- **Role-Based Access Control**: Granular permissions based on user roles
- **Multi-Factor Authentication**: Ready for MFA implementation
- **Password Policies**: Enforced minimum requirements (8+ characters)

#### Security Features

- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet Integration**: Security headers for web protection
- **Input Validation**: Comprehensive request validation
- **Audit Logging**: All authentication events logged
- **Session Security**: Secure cookie handling with proper flags

## 📁 Project Structure

```
Heartly/
├── heartly-frontend/          # Next.js frontend application
│   ├── app/                   # App Router pages and layouts
│   ├── components/            # Reusable UI components
│   │   ├── widgets/           # Dashboard widget components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   └── facility-select/   # Facility selection components
│   ├── shared/                # Shared utilities and contexts
│   └── utils/                 # Utility functions
├── heartly-backend/           # NestJS backend application
│   ├── src/
│   │   ├── api/               # API modules and controllers
│   │   ├── database/          # Database configuration and migrations
│   │   ├── utils/             # Utility functions and middleware
│   │   └── config/            # Application configuration
│   └── test/                  # Test files
├── shared/                    # Shared types and utilities
└── scripts/                   # Build and deployment scripts
```

## 🔐 Security & Compliance

### HIPAA Compliance Features

- **Data Encryption**: At-rest and in-transit encryption
- **Access Controls**: Role-based permissions and multi-tenant isolation
- **Audit Logging**: Comprehensive logging of all PHI access
- **User Authentication**: Secure authentication with session management
- **Data Backup**: Automated backup strategies (planned)

### Security Measures

- **Input Sanitization**: All user inputs validated and sanitized
- **SQL Injection Prevention**: TypeORM parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Token-based CSRF protection
- **Rate Limiting**: API rate limiting (planned)

### Regulatory Compliance

- **PDF Export**: All data exportable to official PDF forms for regulatory requirements
- **Audit Trails**: Comprehensive tracking of all data entry, modifications, and access
- **Timeline Compliance**: Automated tracking of required documentation deadlines
- **California Regional Center**: Built-in compliance for regional center inspections
- **Licensing Requirements**: Complete audit trails for licensing inspections
- **Deadline Management**: Comprehensive tracking of due dates and suspense dates
- **Profile Completion**: Real-time monitoring of client profile completeness
- **Granular Audit**: Field-level audit trails for complete compliance verification
- **Multi-Facility Compliance**: Complete audit trails across all facilities with proper access controls

## 🛠 Development Setup

### Prerequisites

- Node.js ≥ 16.13
- pnpm package manager
- PostgreSQL database
- Redis server
- Docker (optional)

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd Heartly

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Configure database, Redis, and SuperTokens settings

# Start development servers
pnpm dev
```

### Environment Configuration

Required environment variables for both frontend and backend:

- Database connection settings
- Redis configuration
- SuperTokens API keys
- DigitalOcean Spaces credentials
- Email service configuration

## 📊 Performance Considerations

### Database Optimization

- Proper indexing on tenantId and frequently queried fields
- Connection pooling configuration
- Query optimization for multi-tenant queries
- Regular database maintenance

### Caching Strategy

- Redis caching for frequently accessed data
- Session storage optimization
- API response caching
- Static asset caching

### Scalability Planning

- Horizontal scaling with load balancers
- Database read replicas
- CDN integration for static assets
- Microservice architecture consideration

## 📞 Support & Documentation

### Development Resources

- API Documentation: Available via Swagger UI
- Code Documentation: Inline comments and JSDoc
- Architecture Documentation: This overview and code comments
- Testing: Unit and E2E test coverage

### Deployment

- Docker containerization ready
- Environment-based configuration
- CI/CD pipeline setup
- Monitoring and logging integration

---

_This document provides a comprehensive overview of the Heartly application architecture, current implementation status, and development roadmap. The application focuses on transforming traditional forms into engaging, conversational experiences while maintaining complete compliance and audit capabilities for regulatory requirements, with comprehensive timeline and deadline management, granular audit trails for complete transparency, customizable dashboard layouts for optimal user experience, and multi-facility access system for efficient facility management._
