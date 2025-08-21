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

### Development Planning
- **Epic Plans**: `ai-workflow/ai-development-track/epic-plan.md`
- **Story Plans**: `ai-workflow/ai-development-track/story-plan.md`
- **Parallel Work Plan**: `ai-workflow/ai-development-track/parallel-work-plan.md`
- **Development Direction**: `ai-workflow/ai-development-track/ai-development-direction.md`

### Technical Documentation
- **Technical Structure**: `ai-workflow/heartly-technical-structure.md`
- **Comprehensive Overview**: `ai-workflow/heartly-comprehensive-overview.md`
- **Authentication Flow**: `heartly-frontend/docs/authentication-flow.md`
- **HIPAA Compliance**: `ai-workflow/hipaa-compliance-developers-guide-master/`

### Feature Specifications
- **Multi-facility Access**: `ai-workflow/multi-facility-access-system.md`
- **Dashboard System**: `ai-workflow/customizable-dashboard-system.md`
- **Cash Management**: `ai-workflow/client-cash-management-system.md`
- **Timeline Management**: `ai-workflow/timeline-management-system.md`
- **Audit System**: `ai-workflow/granular-audit-system.md`
- **Document Management**: `ai-workflow/document-timelines-and-compliance.md`

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

## Development Workflow

### AI Development Notes Structure
```
ai-workflow/ai-development-track/ai-dev-notes/
├── feature-epic-{X}-story-{Y}-{feature-name}/
│   ├── feature.md          # Feature implementation details
│   ├── errors.md           # Error handling and troubleshooting
│   └── tests.md            # Test implementation details
```

### Feature Implementation Process
1. **Review Epic/Story Plans**: Understand the specific requirements from the story plan
2. **Check Team Assignment**: Review `parallel-work-plan.md` for team responsibilities
3. **Create Feature Folder**: Set up the feature folder in `ai-dev-notes/`
4. **Plan Implementation**: Document the technical approach in `feature.md`
5. **Implement Feature**: Follow the documented plan with detailed explanations
6. **Handle Errors**: Document any issues and solutions in `errors.md`
7. **Write Tests**: Implement comprehensive tests for the feature
8. **Code Review**: Ensure all standards are met and HIPAA compliance is maintained

### Documentation and Tracking
- Always document what we worked on and what we think we should work on next
- Maintain an "update todos" list with completed items and next steps
- Refer back to this documentation in subsequent work sessions to provide continuity and context
- Keep notes of work in ai-dev-notes folder with epic-story-team naming structure

### Testing Requirements
- Always try to add test files for whatever you are implementing
- This allows testing outside of our thread where it makes sense
- Include both unit tests and integration tests for comprehensive coverage

## Quality Assurance Checklist
- [ ] Feature matches story requirements exactly
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
- ✅ Check `parallel-work-plan.md` to understand team responsibilities
- ✅ Follow the epic and story plans exactly
- ✅ Create detailed implementation notes in `ai-dev-notes/`
- ✅ Implement comprehensive error handling and validation
- ✅ Write tests for every feature
- ✅ Consider HIPAA compliance in every decision
- ✅ Use concise inline documentation
- ✅ Coordinate with other teams for dependencies and handoffs

### Don'ts
- ❌ Don't implement features not in the current story plan
- ❌ Don't work on stories assigned to other teams without coordination
- ❌ Don't skip error handling or validation
- ❌ Don't ignore HIPAA compliance requirements
- ❌ Don't implement suggested improvements without explicit approval
- ❌ Don't skip testing or documentation
- ❌ Don't assume the foundation is solid - check current state if needed
- ❌ Don't make breaking changes without notifying other teams

## Branch Strategy
- Use dev branch as main branch to branch from
- Follow the naming convention: `feature/epic-{X}-story-{Y}-{feature-name}`

## Getting Started

### For New Development Sessions
1. **Read Complete Context**: Review relevant files in the `ai-workflow/` folder
2. **Check Team Assignment**: Review `parallel-work-plan.md` for responsibilities
3. **Understand Current Priorities**: Review epic and story plans
4. **Check Previous Work**: Review existing `ai-dev-notes/` for current progress
5. **Set Up Notes**: Create feature folder in `ai-dev-notes/` for current story
6. **Begin Implementation**: Follow documented standards and processes

### For Ongoing Development
1. **Check Current Status**: Review existing `ai-dev-notes/` for current progress
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
1. **Read** relevant epic/story plans from `ai-workflow/`
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
- All features implemented according to story requirements
- Comprehensive test coverage for all new code
- Zero HIPAA compliance violations
- Proper error handling and validation throughout
- Clear, maintainable code with appropriate documentation
- All development notes properly maintained in `ai-dev-notes/`
- Effective use of agents for systematic development workflow

---

**Remember**: This is a HIPAA-compliant healthcare application. Every decision must consider patient privacy and data security. When in doubt, prioritize security and compliance over convenience or speed.