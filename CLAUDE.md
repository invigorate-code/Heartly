# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Heartly is a HIPAA-compliant management system for Adult Residential Facilities (ARFs) and Adult Residential Treatment Facilities (ARTFs). The project is a monorepo containing a NestJS backend and Next.js frontend with multi-tenant, multi-facility architecture, comprehensive audit logging, and intelligent workflow transformation that prioritizes patient privacy and regulatory compliance.

### Core Project Information
- **Architecture**: Multi-tenant, multi-facility NestJS backend + Next.js 14 frontend
- **Authentication**: SuperTokens integration with email verification and session management
- **Database**: PostgreSQL with TypeORM and Row Level Security (RLS)
- **Frontend**: Next.js 14, TypeScript, HeroUI (NextUI v2), TailwindCSS
- **Compliance**: HIPAA-compliant with comprehensive audit logging

## Key Documentation Locations

### Technical Documentation
- **Technical Structure**: `ai-workflow/heartly-technical-structure.md`
- **Comprehensive Overview**: `ai-workflow/heartly-comprehensive-overview.md`
- **Vision Document**: `ai-workflow/heartly-vision.md`
- **MVP Outline**: `ai-workflow/mvp-outline.md`
- **Authentication Flow**: `heartly-frontend/docs/authentication-flow.md`
- **HIPAA Compliance Guide**: `ai-workflow/hipaa-compliance-guide/`
- **SuperTokens Documentation**: `ai-workflow/supertokens-documentation/`

### Feature Specifications
- **Core Features Directory**: `ai-workflow/heartly-core-features/`
  - **Multi-facility Access**: `ai-workflow/heartly-core-features/multi-facility-access-system.md`
  - **Dashboard System**: `ai-workflow/heartly-core-features/customizable-dashboard-system.md`
  - **Cash Management**: `ai-workflow/heartly-core-features/client-cash-management-system.md`
  - **Timeline Management**: `ai-workflow/heartly-core-features/timeline-management-system.md`
  - **Audit System**: `ai-workflow/heartly-core-features/granular-audit-system.md`
  - **Universal Action Button**: `ai-workflow/heartly-core-features/universal-action-button.md`

### Document Management & Forms
- **Forms Documentation**: `ai-workflow/currently-used-pdfs/`
  - **Document Timelines & Compliance**: `ai-workflow/currently-used-pdfs/document-timelines-and-compliance.md`
  - **Form Transformation Philosophy**: `ai-workflow/currently-used-pdfs/form-transformation-philosophy.md`
  - **Transformation Roadmap**: `ai-workflow/currently-used-pdfs/transformation-roadmap.md`
  - **17 Core Forms with Analysis**: Each form PDF with accompanying analysis markdown file

## Development Standards

### Code Quality Requirements
- **TypeScript**: Strict mode compliance, proper typing for all functions and variables
- **Error Handling**: Comprehensive try-catch blocks with meaningful error messages
- **Validation**: Input validation at both API and database levels
- **Testing**: Every feature must include complementary unit and integration tests
- **Documentation**: Concise inline comments explaining complex logic
- **Performance**: Consider query optimization and caching strategies

### Database Standards
- **Migrations**: Always create proper TypeORM migrations for schema changes
- **RLS Policies**: Implement Row Level Security for all tenant-scoped tables
- **Indexes**: Add appropriate indexes for performance optimization
- **Constraints**: Use database constraints for data integrity
- **Audit Logging**: Implement comprehensive audit trails for compliance

### API Standards
- **RESTful Design**: Follow REST conventions for endpoint design
- **Validation**: Use DTOs with class-validator decorators
- **Error Responses**: Consistent error response format across all endpoints
- **Authentication**: Proper SuperTokens integration with role-based access
- **Rate Limiting**: Implement appropriate rate limiting for security

### Frontend Standards
- **Component Structure**: Use functional components with TypeScript
- **State Management**: Use React hooks and context appropriately
- **Styling**: Use TailwindCSS utility classes, avoid custom CSS when possible
- **Accessibility**: Ensure WCAG compliance for all components
- **Responsive Design**: Mobile-first approach with proper breakpoints

## HIPAA Compliance Requirements

### Critical Considerations
- **Data Encryption**: All PHI must be encrypted at rest and in transit
- **Access Controls**: Implement role-based access with minimum necessary access
- **Audit Logging**: Comprehensive logging of all PHI access and modifications
- **Data Integrity**: Ensure data accuracy and prevent unauthorized modifications
- **Secure Communication**: Use HTTPS and secure APIs for all data transmission
- **Error Handling**: Proper error handling that doesn't expose PHI

### HIPAA Implementation Checklist
- [ ] All PHI fields are properly encrypted
- [ ] Access controls limit PHI access to authorized personnel only
- [ ] Audit logs capture all PHI access and modifications
- [ ] Data validation prevents unauthorized data entry
- [ ] Secure authentication and session management
- [ ] Proper error handling that doesn't expose PHI
- [ ] Secure API endpoints with proper authentication
- [ ] Database security with RLS policies

## Additional Resources

### HIPAA Compliance Documentation
The `ai-workflow/hipaa-compliance-guide/` directory contains comprehensive HIPAA guidance:
- Table of Contents and Introduction
- What is HIPAA and compliance requirements
- Security rules and implementation guides
- Developer considerations and best practices
- Mobile and wearable application guidelines
- Detailed implementation examples

### Forms and Document Analysis
The `ai-workflow/currently-used-pdfs/` directory contains 17 core facility forms:
- Each form has an original PDF and accompanying analysis markdown
- Forms cover placement, services, medical records, and compliance
- Analysis files provide structured field mapping and requirements
- Essential for understanding data model and workflow requirements

### SuperTokens Integration
The `ai-workflow/supertokens-documentation/` directory contains:
- Authentication setup and configuration guides
- Session management and verification
- User roles and permissions implementation
- MFA, email verification, and security features
- Enterprise SSO and tenant management
- Migration guides and API references

## Development Workflow

### AI Development Structure
- **Vision Document**: `ai-workflow/heartly-vision.md` - Overall product vision and goals
- **Technical Structure**: `ai-workflow/heartly-technical-structure.md` - Complete technical architecture
- **Comprehensive Overview**: `ai-workflow/heartly-comprehensive-overview.md` - Full system documentation
- **MVP Outline**: `ai-workflow/mvp-outline.md` - Initial release requirements
- **Core Features**: `ai-workflow/heartly-core-features/` - Detailed feature specifications

### Feature Implementation Process
1. **Review Specifications**: Understand requirements from technical structure, feature specs, and vision documents
2. **Review Priorities**: Check MVP outline and technical structure for current priorities
3. **Plan Implementation**: Document the technical approach based on specifications
4. **Implement Feature**: Follow the documented specifications and technical structure
5. **Handle Errors**: Document and resolve any issues
6. **Write Tests**: Implement comprehensive tests for the feature
7. **Code Review**: Ensure all standards are met and HIPAA compliance is maintained

### Documentation and Tracking
- Always document what we worked on and what we think we should work on next
- Maintain an "update todos" list with completed items and next steps
- Refer back to this documentation in subsequent work sessions to provide continuity and context
- Review comprehensive documentation in `ai-workflow/` folder for specifications and requirements

### Testing Requirements
- Always try to add test files for whatever you are implementing
- This allows testing outside of our thread where it makes sense
- Include both unit tests and integration tests for comprehensive coverage

## Quality Assurance Checklist
- [ ] Feature matches specifications exactly
- [ ] All code follows TypeScript strict mode
- [ ] Proper error handling and validation implemented
- [ ] Comprehensive tests written and passing
- [ ] HIPAA compliance requirements met
- [ ] Code is properly documented with inline comments
- [ ] Performance considerations addressed
- [ ] Security measures implemented
- [ ] Accessibility requirements met

## Important Guidelines

### Do's
- ✅ Read and understand ALL files in the `ai-workflow/` folder for complete context
- ✅ Check `ai-workflow/mvp-outline.md` and technical structure for development priorities
- ✅ Follow the technical specifications and vision documents exactly
- ✅ Create detailed implementation documentation
- ✅ Implement comprehensive error handling and validation
- ✅ Write tests for every feature
- ✅ Consider HIPAA compliance in every decision
- ✅ Use concise inline documentation

### Don'ts
- ❌ Don't implement features not in the current specifications
- ❌ Don't deviate from the documented vision and technical structure
- ❌ Don't skip error handling or validation
- ❌ Don't ignore HIPAA compliance requirements
- ❌ Don't implement suggested improvements without explicit approval
- ❌ Don't skip testing or documentation
- ❌ Don't assume the foundation is solid - check current state if needed

## Branch Strategy
- **IMPORTANT**: Always pull from main branch and create a new branch from main before starting any work
- Branch from main using: `git checkout main && git pull && git checkout -b feature/{feature-name}`
- Follow the naming convention: `feature/{feature-name}` or `fix/{issue-name}`
- Never work directly on main branch

## Getting Started

### For New Development Sessions
1. **Read Complete Context**: Review relevant files in the `ai-workflow/` folder
2. **Review Specifications**: Check technical structure and feature specifications
3. **Understand Current Priorities**: Review vision, technical structure, and feature specifications
4. **Check Previous Work**: Review existing code and documentation for current progress
5. **Plan Implementation**: Align with documented specifications and architecture
6. **Begin Implementation**: Follow documented standards and processes

### For Ongoing Development
1. **Check Current Status**: Review existing code and documentation for current progress
2. **Continue Implementation**: Follow established patterns and standards
3. **Update Documentation**: Keep feature and error files current
4. **Maintain Quality**: Ensure all code meets established standards
5. **Test Everything**: Run tests to ensure nothing breaks
6. **Document Next Steps**: Update todos with completed items and what to work on next

## Agent Usage Guidelines

### Primary Development Agents

#### Task Management
- **TodoWrite**: Always use for complex features and multi-step tasks. Essential for tracking HIPAA compliance implementations and maintaining development notes structure.

#### Code Search and Analysis
- **Grep**: Primary search tool for finding patterns, HIPAA-related code, audit implementations, and security vulnerabilities
- **Glob**: Fast file pattern matching for locating specific file types (migrations, tests, configs)
- **Read**: Essential for understanding implementations, reviewing documentation, and analyzing existing code

#### Code Modification
- **Edit/MultiEdit**: Apply targeted fixes, implement features, and maintain HIPAA compliance. MultiEdit preferred for multiple changes to same file
- **Write**: Create new test files and implementation files (avoid creating documentation unless explicitly requested)

#### Development Operations
- **Bash**: Execute tests, build applications, run database migrations, and git operations. Critical for compliance verification
- **mcp__ide__getDiagnostics**: Identify TypeScript errors and maintain strict mode compliance

### Agent Usage Workflow

#### Starting New Features
1. **Read** relevant specifications, vision, and technical structure from `ai-workflow/`
2. **TodoWrite** to create structured task list
3. **Grep/Glob** to find existing patterns and related files
4. **Read** existing implementations for context
5. **Edit/MultiEdit** to implement feature
6. **Write** test files
7. **Bash** to run tests and verify
8. **TodoWrite** to update progress

#### HIPAA Compliance Audits
1. **TodoWrite** to structure compliance audit tasks
2. **Grep** to search for PHI handling patterns
3. **Read** specific files for detailed analysis
4. **Edit** to apply compliance fixes
5. **Bash** to run security tests
6. **TodoWrite** to document findings

#### Error Investigation
1. **mcp__ide__getDiagnostics** to identify errors
2. **Grep** to find error patterns
3. **Read** error logs and related files
4. **Edit** to apply fixes
5. **Bash** to test fixes

### Agent Best Practices

#### Proactive Usage (Start of Session)
- Always begin with **TodoWrite** for task planning
- Use **Read** to review relevant documentation
- Apply **Grep** to understand existing patterns
- Check structure with **LS** when needed

#### Reactive Usage (As Needed)
- **Edit/MultiEdit** when implementing changes
- **Bash** for testing and verification
- **WebSearch** for researching solutions
- **mcp__ide__getDiagnostics** after changes

### Critical Reminders
- **Never skip TodoWrite** for complex features - it's essential for tracking progress
- **Always use Grep** before implementing new patterns to maintain consistency
- **Prefer MultiEdit** over multiple Edit operations on the same file
- **Run tests with Bash** after every significant change
- **Use Read extensively** to understand the comprehensive documentation in `ai-workflow/`

## Success Metrics
- All features implemented according to specifications
- Comprehensive test coverage for all new code
- Zero HIPAA compliance violations
- Proper error handling and validation throughout
- Clear, maintainable code with appropriate documentation
- All development properly documented and aligned with specifications
- Effective use of agents for systematic development workflow

---

**Remember**: This is a HIPAA-compliant healthcare application. Every decision must consider patient privacy and data security. When in doubt, prioritize security and compliance over convenience or speed.