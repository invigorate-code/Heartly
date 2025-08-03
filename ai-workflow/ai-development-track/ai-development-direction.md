# 🤖 AI Development Direction Guide for Heartly

## 🎯 **Purpose**
This file provides comprehensive direction for AI assistants working on the Heartly project. It establishes development standards, folder structure, and ensures consistent, high-quality implementation of features based on the epic and story plans.

**IMPORTANT**: This project now uses a parallel work approach with two teams. See `parallel-work-plan.md` for team assignments and coordination details.

## 📁 **Project Context & Structure**

### **Core Project Information**
- **Project**: Heartly - HIPAA-compliant facility management platform
- **Architecture**: Multi-tenant, multi-facility NestJS backend + Next.js 14 frontend
- **Authentication**: SuperTokens integration
- **Database**: PostgreSQL with TypeORM and Row Level Security (RLS)
- **Frontend**: Next.js 14, TypeScript, HeroUI (NextUI v2), TailwindCSS

### **Key Documentation Locations**
- **Epic Plans**: `ai-workflow/ai-development-track/epic-plan.md`
- **Story Plans**: `ai-workflow/ai-development-track/story-plan.md`
- **Parallel Work Plan**: `ai-workflow/ai-development-track/parallel-work-plan.md`
- **Technical Structure**: `ai-workflow/heartly-technical-structure.md`
- **HIPAA Compliance**: `ai-workflow/hipaa-compliance-developers-guide-master/`
- **Comprehensive Overview**: `ai-workflow/heartly-comprehensive-overview.md`

### **Complete Context Understanding**
**IMPORTANT**: AI assistants should read and understand ALL files in the `ai-workflow/` folder to gain complete context about the Heartly application. This includes:

**Core Documentation**:
- `README.md` - Project overview and setup instructions
- `heartly-comprehensive-overview.md` - Complete application overview
- `heartly-vision.md` - Long-term vision and goals
- `mvp-outline.md` - Minimum viable product specifications
- `heartly-technical-structure.md` - Technical architecture details

**Feature Specifications**:
- `multi-facility-access-system.md` - Multi-facility management system
- `customizable-dashboard-system.md` - Dashboard and analytics system
- `client-cash-management-system.md` - Financial management features
- `timeline-management-system.md` - Compliance and deadline tracking
- `granular-audit-system.md` - Audit logging and compliance
- `document-timelines-and-compliance.md` - Document management
- `form-transformation-philosophy.md` - Form digitization approach
- `universal-action-button.md` - UI component specifications

**Technical Guidance**:
- `supertokens-ai-guidance.md` - Authentication system guidance
- `hipaa-compliance-developers-guide-master/` - Complete HIPAA compliance guide

**Current State Analysis**:
- `currently-used-pdfs/` - Analysis of existing paper-based processes
- `transformation-roadmap.md` - Process transformation strategy

**AI Development Track**:
- `ai-development-track/epic-plan.md` - Current development priorities
- `ai-development-track/story-plan.md` - Detailed story breakdowns
- `ai-development-track/parallel-work-plan.md` - Team assignments and coordination
- `ai-development-track/ai-development-direction.md` - This file (development standards)

## 🏗️ **Development Standards**

### **Code Quality Requirements**
- **TypeScript**: Strict mode compliance, proper typing for all functions and variables
- **Error Handling**: Comprehensive try-catch blocks with meaningful error messages
- **Validation**: Input validation at both API and database levels
- **Documentation**: Concise inline comments explaining complex logic
- **Testing**: Every feature must include complementary unit and integration tests
- **Performance**: Consider query optimization and caching strategies

### **File Organization Standards**
- **Naming**: Use kebab-case for files and folders, PascalCase for components/classes
- **Structure**: Follow existing patterns in `heartly-backend/src/` and `heartly-frontend/app/`
- **Imports**: Use absolute imports where possible, organize imports logically
- **Exports**: Use named exports for better tree-shaking

### **Database Standards**
- **Migrations**: Always create proper TypeORM migrations for schema changes
- **RLS Policies**: Implement Row Level Security for all tenant-scoped tables
- **Indexes**: Add appropriate indexes for performance optimization
- **Constraints**: Use database constraints for data integrity
- **Audit Logging**: Implement comprehensive audit trails for compliance

### **API Standards**
- **RESTful Design**: Follow REST conventions for endpoint design
- **Validation**: Use DTOs with class-validator decorators
- **Error Responses**: Consistent error response format across all endpoints
- **Authentication**: Proper SuperTokens integration with role-based access
- **Rate Limiting**: Implement appropriate rate limiting for security

### **Frontend Standards**
- **Component Structure**: Use functional components with TypeScript
- **State Management**: Use React hooks and context appropriately
- **Styling**: Use TailwindCSS utility classes, avoid custom CSS when possible
- **Accessibility**: Ensure WCAG compliance for all components
- **Responsive Design**: Mobile-first approach with proper breakpoints

## 📝 **AI Development Notes Structure**

### **Folder Organization**
```
ai-workflow/ai-development-track/ai-dev-notes/
├── feature-epic-{X}-story-{Y}-{feature-name}/
│   ├── feature.md          # Feature implementation details
│   ├── errors.md           # Error handling and troubleshooting
│   └── tests.md            # Test implementation details
```

### **Feature File Template** (`feature.md`)
```markdown
# Feature: [Feature Name]
**Epic**: [Epic Number] - [Epic Name]  
**Story**: [Story Number] - [Story Name]  
**Status**: [In Progress/Completed/Blocked]  
**Started**: [Date]  
**Completed**: [Date]  

## 🎯 Implementation Plan
[Detailed step-by-step implementation plan]

## 🔧 Technical Approach
[Technical decisions and architecture choices]

## 📋 Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## 🧪 Testing Strategy
[Testing approach and test cases]

## 🔍 Code Review Notes
[Important implementation details and decisions]
```

### **Error File Template** (`errors.md`)
```markdown
# Error Handling & Troubleshooting: [Feature Name]

## 🚨 Common Issues
[Common problems and their solutions]

## 🔧 Debugging Steps
[Step-by-step debugging process]

## 📝 Error Logs
[Important error messages and their context]

## 🛠️ Validation Rules
[Input validation and error handling rules]
```

## 🛡️ **HIPAA Compliance Requirements**

### **Critical HIPAA Considerations**
- **Data Encryption**: All PHI must be encrypted at rest and in transit
- **Access Controls**: Implement role-based access with minimum necessary access
- **Audit Logging**: Comprehensive logging of all PHI access and modifications
- **Data Integrity**: Ensure data accuracy and prevent unauthorized modifications
- **Secure Communication**: Use HTTPS and secure APIs for all data transmission
- **Backup Security**: Secure backup procedures with encryption
- **Incident Response**: Plan for security incidents and data breaches

### **HIPAA Implementation Checklist**
- [ ] All PHI fields are properly encrypted
- [ ] Access controls limit PHI access to authorized personnel only
- [ ] Audit logs capture all PHI access and modifications
- [ ] Data validation prevents unauthorized data entry
- [ ] Secure authentication and session management
- [ ] Proper error handling that doesn't expose PHI
- [ ] Secure API endpoints with proper authentication
- [ ] Database security with RLS policies
- [ ] Logging and monitoring for security events

### **HIPAA Documentation Reference**
- **Main Guide**: `ai-workflow/hipaa-compliance-developers-guide-master/`
- **Key Sections**: Data Protection, Access Controls, Audit Logging, Security Measures

## 🔄 **Development Workflow**

### **Parallel Work Coordination**
1. **Check Team Assignment**: Review `parallel-work-plan.md` to understand your team's responsibilities
2. **Coordinate Dependencies**: Check handoff points and dependencies with the other team
3. **Communicate Changes**: Notify the other team of any breaking changes or API modifications
4. **Document Handoffs**: Provide required documentation when handing off work to the other team

### **Feature Implementation Process**
1. **Review Epic/Story Plans**: Understand the specific requirements from the story plan
2. **Check Team Assignment**: Ensure you're working on stories assigned to your team
3. **Create Feature Folder**: Set up the feature folder in `ai-dev-notes/`
4. **Plan Implementation**: Document the technical approach in `feature.md`
5. **Implement Feature**: Follow the documented plan with detailed explanations
6. **Handle Errors**: Document any issues and solutions in `errors.md`
7. **Write Tests**: Implement comprehensive tests for the feature
8. **Code Review**: Ensure all standards are met and HIPAA compliance is maintained
9. **Coordinate Integration**: Work with the other team for integration testing

### **Quality Assurance Checklist**
- [ ] Feature matches story requirements exactly
- [ ] All code follows TypeScript strict mode
- [ ] Proper error handling and validation implemented
- [ ] Comprehensive tests written and passing
- [ ] HIPAA compliance requirements met
- [ ] Code is properly documented with inline comments
- [ ] Performance considerations addressed
- [ ] Security measures implemented
- [ ] Accessibility requirements met

## 🚀 **Getting Started**

### **For New AI Assistants**
1. **Read Complete Context**: Review ALL files in the `ai-workflow/` folder to understand the complete application context, vision, and requirements
2. **Check Team Assignment**: Review `parallel-work-plan.md` to understand your team's responsibilities and dependencies
3. **Understand Current Priorities**: Review the epic and story plans to understand current development priorities
4. **Understand Architecture**: Review `heartly-technical-structure.md` for system overview
5. **Check HIPAA Requirements**: Review HIPAA compliance guide for security requirements
6. **Set Up Notes**: Create feature folder in `ai-dev-notes/` for the current story
7. **Begin Implementation**: Follow the documented standards and processes

### **For Ongoing Development**
1. **Check Current Status**: Review existing `ai-dev-notes/` for current progress
2. **Check Team Coordination**: Review `parallel-work-plan.md` for any handoff requirements or dependencies
3. **Continue Implementation**: Follow the established patterns and standards
4. **Update Documentation**: Keep feature and error files current
5. **Maintain Quality**: Ensure all code meets the established standards
6. **Coordinate with Other Team**: Communicate any changes that affect the other team's work

## 📞 **Important Notes**

### **Do's**
- ✅ Read and understand ALL files in the `ai-workflow/` folder for complete context
- ✅ Check `parallel-work-plan.md` to understand your team's responsibilities
- ✅ Follow the epic and story plans exactly
- ✅ Create detailed implementation notes in `ai-dev-notes/`
- ✅ Implement comprehensive error handling and validation
- ✅ Write tests for every feature
- ✅ Consider HIPAA compliance in every decision
- ✅ Use concise inline documentation
- ✅ Coordinate with the other team for dependencies and handoffs
- ✅ Suggest improvements when absolutely necessary (but don't implement without approval)

### **Don'ts**
- ❌ Don't implement features not in the current story plan
- ❌ Don't work on stories assigned to the other team without coordination
- ❌ Don't skip error handling or validation
- ❌ Don't ignore HIPAA compliance requirements
- ❌ Don't implement suggested improvements without explicit approval
- ❌ Don't skip testing or documentation
- ❌ Don't assume the foundation is solid - check current state if needed
- ❌ Don't make breaking changes without notifying the other team

## 🎯 **Success Metrics**
- All features implemented according to story requirements
- Comprehensive test coverage for all new code
- Zero HIPAA compliance violations
- Proper error handling and validation throughout
- Clear, maintainable code with appropriate documentation
- All development notes properly maintained in `ai-dev-notes/`

---

**Remember**: This is a HIPAA-compliant healthcare application. Every decision must consider patient privacy and data security. When in doubt, prioritize security and compliance over convenience or speed. 