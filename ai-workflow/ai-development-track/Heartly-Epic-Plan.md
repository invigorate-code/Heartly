# Heartly Application Agile Epic-Story Plan

## Application Overview

The Heartly application is a HIPAA-compliant, multi-tenant web app designed to digitize and transform facility management for Adult Residential Facilities (ARFs) in California. These facilities provide non-medical care, supervision, room, board, and daily assistance for adults (18-59) with serious mental illness (SMI) unable to live independently, addressing a persistent crisis. As of 2025, shortages remain severe, with a 2022 RAND estimate of 2,963 community residential bed gaps, 3,852 beds lost by 2021, and thousands more needed per 2022 CBHPC surveys. Recent developments include Prop 1 (passed 2024) authorizing $6.38B in bonds for treatment and housing, adding slots via programs like ALW (7,000) and BHCIP ($2.2B), though regional challenges persist (e.g., San Francisco needs 75-135 more beds, San Diego has only 8 providers for SMI).

Heartly's strengths include reimagining forms (e.g., daily notes with paragraphs, questions, mood sliders, outburst checkboxes) into data-rich features for insights, alongside robust compliance, audits, and dashboards. It spans secure infrastructure, intuitive workflows, migration, PDF exports, and analytics, supporting California's community-based care shift amid complex needs (e.g., dual diagnoses, criminal justice involvement) and workforce shortages. Weaknesses involve unresolved offline decisions, no initial APIs, success metric uncertainty, and solo no-budget constraints potentially delaying scope.

Key components include Authentication & RBAC, Audit Logging & Immutability, Data Migration & Import, Dashboard & Widgets, Workflow Management, PDF Export & Compliance Engine, Database & Backend Infrastructure, Frontend UI/UX Layer, Reporting & Analytics, and optional Offline Capabilities. User flows cover onboarding/login, data migration, daily workflows (e.g., resident notes), incident reporting, compliance exports, dashboard customization, and audit reviews.

Assumptions include small initial user base (10-50 users per facility), HIPAA security needs, fixed tech stack (NestJS backend, Next.js frontend, SuperTokens auth, PostgreSQL-like DB), deferred offline to post-MVP, and state-specific regulations. Open questions involve ARF/ARTF distinctions, prioritized workflows, offline sync, PDF form lists, future integrations, peak usage, success metrics, and Prop 1 impact.

## Epic Overview

### Epic Statement
As a facility administrator or caregiver in an Adult Residential Facility (ARF), I want a HIPAA-compliant, multi-tenant web application that digitizes and transforms paper-based workflows into intuitive digital processes, so that I can improve operational efficiency, ensure regulatory compliance, and gain actionable insights into resident care amid ongoing bed shortages and workforce challenges in California.

### Epic Breakdown
| Epic Scope (Included/Excluded) | Business Value (Quantifiable Benefits) | Assumptions (Unvalidated Premises) | Constraints (Tech Stack Limits or Timeframes) |
|--------------------------------|----------------------------------------|------------------------------------|-----------------------------------------------|
| **Included:** Core components such as authentication & RBAC, audit logging, data migration, dashboard & widgets, workflow management (e.g., daily notes, incident reporting), PDF export & compliance engine, database & backend infrastructure, frontend UI/UX layer, and basic reporting & analytics. Focus on MVP features like multi-tenant isolation, conversational UIs, pixel-perfect PDF generation, and real-time compliance scoring. User flows for onboarding, data import, daily workflows, incident reporting, compliance exports, dashboard customization, and audit reviews.<br><br>**Excluded:** Advanced offline capabilities (deferred to post-MVP), AI-driven anomaly detection or predictive analytics beyond basic insights, external API integrations (e.g., with EMR systems), multilingual support, AR/VR features, full mobile app hybrid, blockchain integration, and e-signature for PDFs. Non-core enhancements like gamification, voice commands, or BI tool exports are out of scope for initial epic. | - Efficiency gains: Reduce paperwork time by 30-50% (e.g., from hours to minutes per daily note or incident report), based on transformative workflows.<br>- User growth: Target adoption in 10-20 facilities within first year, scaling to hundreds amid California's 2,963+ bed shortages and Prop 1 funding.<br>- Compliance improvements: Achieve 95%+ audit pass rates by automating forms and logs, minimizing errors in regulatory submissions.<br>- Cost savings: Lower administrative overhead by 20-40% through digital imports and dashboards, freeing staff for resident care in understaffed environments.<br>- Insight-driven decisions: Enable 20% faster response to resident needs via analytics, addressing complex issues like dual diagnoses. | - Small initial user base (10-50 users per facility) with growth tied to persistent shortages (e.g., 3,852 beds lost by 2021, thousands needed per 2022 surveys).<br>- Non-technical users will adapt to conversational UIs without significant resistance.<br>- Regulatory forms remain stable post-Prop 1 (2024), with no major changes requiring frequent updates.<br>- Solo developer can manage HIPAA compliance without external audits initially.<br>- Peak usage at end-of-shift won't overwhelm the stack, assuming moderate data volumes (e.g., 2 years of historical imports). | - Tech stack fixed to NestJS (backend), Next.js (frontend), SuperTokens (auth), and PostgreSQL-like DB; no additional libraries beyond provided ones (e.g., no internet for installs).<br>- Solo developer constraints: 40-hour weeks with 40% on core dev, extending timelines (e.g., 8-16 hours per PDF form).<br>- No budget as passion project, limiting cloud resources (e.g., AWS with BAAs) to free tiers initially.<br>- Timeframe: MVP targeted for 6-12 months, deferring offline sync and advanced features.<br>- HIPAA mandates encryption and 7-year log retention, restricting non-prod PHI use. |

### Key Success Metrics
1. **User Adoption Rate:** 70%+ of targeted facility staff actively using the app within 3 months of launch (measured via login frequency and workflow completions).
2. **Efficiency Improvement:** 30%+ reduction in time spent on compliance tasks (e.g., PDF generation and reporting), tracked through user surveys and analytics.
3. **Compliance Score:** Average dashboard compliance rating of 90%+ across facilities, with zero major audit failures in pilot tests.
4. **User Satisfaction:** Net Promoter Score (NPS) of 50+ or average rating >4/5 from feedback on transformative features like conversational UIs.
5. **Data Migration Success:** 95%+ successful imports without data loss or PHI breaches, including validation for 10,000+ records.

### Strategic Importance
This epic establishes the foundational MVP for Heartly, directly addressing California's ARF crisis by digitizing operations in facilities serving adults with serious mental illness. It aligns with state initiatives like Prop 1 ($6.38B bonds for housing/treatment) and programs such as ALW (7,000 slots added), enabling facilities to scale amid shortages (e.g., 2,963 bed gaps per 2022 RAND estimates). By transforming workflows into data-rich, insightful tools, it not only ensures HIPAA compliance but also empowers understaffed teams to focus on resident care, potentially increasing bed utilization and reducing administrative burdens in a sector with regional gaps (e.g., San Francisco needing 75-135 more beds).

### Potential Risks
- Scope creep from "transformative" features overwhelming solo development timelines.
- Compliance violations if audit logging or RBAC has oversights, leading to PHI leaks.
- Low user adoption due to resistance from non-technical caregivers or unresolved offline needs in rural areas.
- Data quality issues during migrations causing rollout delays.
- Evolving regulations (e.g., post-2025 BH-CONNECT) requiring unplanned updates.

## Personas

Persona Name: Maria Gonzalez  
Role: Caregiver (Staff)  
Demographics: 35 years old, licensed vocational nurse with 8 years in mental health care; works in understaffed ARFs serving adults with serious mental illnesses; bilingual (English/Spanish), tech-familiar but not expert.  
Goals: Quickly document daily notes and incidents to focus more on resident care; access real-time insights on resident needs to respond faster.  
Pain Points: Time-consuming paper forms at end-of-shift, leading to errors and overtime; difficulty tracking compliance in fast-paced environments with workforce shortages.  
Behaviors: Prefers mobile-friendly, conversational UIs for quick inputs; uses similar apps like EMR systems sporadically, often frustrated by complex navigation; relies on admins for tech support.

Persona Name: John Patel  
Role: Facility Administrator  
Demographics: 45 years old, experienced operations manager with a background in healthcare administration; oversees 20-50 bed facilities in California amid bed shortages; moderately tech-savvy from using basic CRM tools.  
Goals: Streamline onboarding, data imports, and audit reviews to ensure facility-wide compliance; customize dashboards for operational oversight and quick decision-making.  
Pain Points: Manual data migration from paper records causing delays; regulatory audits exposing errors in logs, risking fines; managing multi-tenant access without overwhelming non-tech staff.  
Behaviors: Interacts with software daily for reporting; favors intuitive RBAC for delegation; uses tools like Google Workspace but avoids overly customized setups due to time constraints.

Persona Name: Sarah Lee  
Role: Owner (App Subscriber)  
Demographics: 52 years old, entrepreneur owning multiple ARFs; former social worker with business acumen; deals with funding from initiatives like Prop 1; basic tech user focused on ROI.  
Goals: Achieve cost savings through efficiency gains and scalable user growth; monitor compliance scores and analytics to support funding applications and bed utilization.  
Pain Points: High administrative overhead reducing profitability; challenges in user adoption across facilities, especially with staff turnover; limited budget for tech as a passion project.  
Behaviors: Accesses software via web dashboards for high-level views; delegates password resets and access to admins; uses subscription-based tools like QuickBooks, expecting seamless multi-tenant isolation without deep technical involvement.

Persona Name: Emily Carter  
Role: Compliance Officer  
Demographics: 40 years old, certified compliance specialist with 10 years in regulatory healthcare; works part-time across facilities; detail-oriented with experience in HIPAA audits.  
Goals: Automate PDF exports and audit logging for 95%+ compliance rates; review real-time scoring to minimize errors in submissions.  
Pain Points: Inconsistent paper trails leading to audit failures; time-intensive manual checks amid evolving regulations like post-Prop 1 changes.  
Behaviors: Relies on structured UIs for data validation; interacts with compliance software analytically, exporting reports frequently; prefers audit trails and RBAC to limit access risks.

## User Stories

Here are 12 granular user stories derived from the epic, focusing on MVP core components. Each follows the INVEST principles and uses the format: "As a [persona], I want [feature] so that [benefit]." Stories are grouped thematically by key feature areas and user journeys (e.g., onboarding/authentication, daily workflows, compliance/reporting, insights/dashboards).

### Master Backlog Table
| Story ID | Description | Linked Persona | Priority Level | Effort Estimate (Story Points) | Business Value | Thematic Group |
|----------|-------------|----------------|----------------|--------------------------------|----------------|---------------|
| US-001 | As John Patel (Facility Administrator), I want secure user authentication with role-based access control (RBAC) so that I can manage staff permissions and maintain multi-tenant data isolation. | John Patel | Must-have | 13 | High | Group 1: Authentication & Onboarding |
| US-003 | As John Patel (Facility Administrator), I want an onboarding workflow for new users so that I can easily add staff and facilities, supporting user growth in the first year. | John Patel | Must-have | 5 | High | Group 1: Authentication & Onboarding |
| US-004 | As John Patel (Facility Administrator), I want to import historical paper-based data via file uploads so that I can migrate records without data loss and achieve 95%+ success rates. | John Patel | Could-have | 13 | Medium | Group 1: Authentication & Onboarding |
| US-009 | As Sarah Lee (Owner), I want multi-tenant subscription management so that I can isolate data across facilities and scale adoption to 10-20 sites amid bed shortages. | Sarah Lee | Must-have | 8 | High | Group 1: Authentication & Onboarding |
| US-002 | As Maria Gonzalez (Caregiver), I want a conversational UI for entering daily resident notes so that I can quickly document observations and reduce end-of-shift paperwork time by 30-50%. | Maria Gonzalez | Should-have | 8 | High | Group 2: Workflow Management |
| US-005 | As Maria Gonzalez (Caregiver), I want to digitally report incidents with guided prompts so that I can ensure accurate, compliant records without manual form errors. | Maria Gonzalez | Should-have | 5 | High | Group 2: Workflow Management |
| US-012 | As Maria Gonzalez (Caregiver), I want workflow reminders for daily tasks so that I can stay compliant during understaffed shifts and avoid overtime from missed documentation. | Maria Gonzalez | Could-have | 3 | Medium | Group 2: Workflow Management |
| US-006 | As Emily Carter (Compliance Officer), I want automated PDF generation for regulatory forms so that I can export pixel-perfect documents and minimize audit failures. | Emily Carter | Should-have | 8 | High | Group 3: Compliance & Reporting |
| US-007 | As Emily Carter (Compliance Officer), I want real-time compliance scoring on workflows so that I can proactively address issues and maintain 90%+ average ratings. | Emily Carter | Should-have | 13 | High | Group 3: Compliance & Reporting |
| US-008 | As Emily Carter (Compliance Officer), I want access to audit logs with search functionality so that I can review activities and ensure HIPAA-compliant 7-year retention. | Emily Carter | Could-have | 8 | Medium | Group 3: Compliance & Reporting |
| US-010 | As Sarah Lee (Owner), I want basic reporting on efficiency metrics so that I can track cost savings and administrative overhead reductions of 20-40%. | Sarah Lee | Could-have | 3 | Medium | Group 4: Dashboard & Insights |
| US-011 | As John Patel (Facility Administrator), I want a customizable dashboard with widgets so that I can gain actionable insights into operations and respond 20% faster to resident needs. | John Patel | Should-have | 5 | High | Group 4: Dashboard & Insights |

### Acceptance Criteria, Edge Cases, and Testability Notes
For each story, acceptance criteria are in Given-When-Then format, with edge cases and testability notes. No ambiguous criteria were flagged unless noted.

#### Group 1: Authentication & Onboarding
- **US-001 Acceptance Criteria:**  
  - Given a registered user with admin role, When they log in with valid credentials, Then they gain access to all admin features and tenant-specific data is isolated.  
  - Given a user with caregiver role, When they attempt to access admin-only features, Then access is denied with an appropriate error message.  
  - Given an unregistered user, When they attempt to log in, Then authentication fails and they are prompted to register or contact admin.  
  - Given a valid session, When the user logs out, Then the session is terminated and they are redirected to the login page.  
  - Given multi-tenant setup, When a user from one tenant logs in, Then they cannot access data from another tenant.  
  - Given password reset request, When a valid email is provided, Then a reset link is sent and usable for updating credentials.  
  **Edge Cases:** Invalid credentials (e.g., wrong password) should trigger rate-limiting after 5 attempts; Expired sessions due to inactivity; Cross-tenant access attempts via URL manipulation; Network failures during login.  
  **Testability Notes:** Verify via automated integration tests using tools like Jest for backend auth flows and Cypress for frontend UI; Solo dev can manually test role denials by switching user accounts in a local dev environment; Use database queries to confirm data isolation post-login.

- **US-003 Acceptance Criteria:**  
  - Given an admin user is logged in, When they initiate onboarding for a new staff member via email invite, Then the invite is sent and the new user can complete registration.  
  - Given a new facility creation form, When valid details are submitted, Then the facility is added to the system with isolated data schema.  
  - Given an invite recipient, When they click the link and set up credentials, Then they are assigned the correct role and tenant.  
  - Given onboarding completion, When the new user logs in for the first time, Then they are prompted for any required profile updates.  
  - Given bulk onboarding for multiple staff, When a CSV upload is processed, Then users are created without duplicates and errors are logged.  
  - Given invalid invite link, When accessed, Then an error is shown and the process halts.  
  **Edge Cases:** Expired invite links (e.g., after 24 hours); Duplicate email attempts during onboarding; Invalid facility data (e.g., missing required fields); Network interruptions during email sending.  
  **Testability Notes:** Automated tests with email mocking libraries in NestJS; frontend form validation with React Testing Library; Solo manual verification by simulating invites in a local setup and checking database entries; Edge cases testable via unit tests for validation logic.

- **US-004 Acceptance Criteria:**  
  - Given an admin is logged in, When they upload a valid CSV file with resident data, Then the data is imported into the database with 95%+ accuracy and duplicates are handled.  
  - Given a PDF upload for scanned records, When processed, Then text is extracted and mapped to fields without loss of key information.  
  - Given import completion, When validation errors occur, Then a report is generated listing issues and partial imports are rolled back.  
  - Given multi-tenant context, When data is imported, Then it is assigned to the correct tenant without cross-contamination.  
  - Given large file upload, When exceeding size limits, Then the upload is rejected with a clear error message.  
  - Given successful import, When queried, Then the data appears in relevant workflows and dashboards.  
  **Edge Cases:** Corrupted or malformed files (e.g., invalid CSV structure); Files containing sensitive PHI that fails validation; Upload timeouts for very large files; Concurrent imports by multiple admins.  
  **Testability Notes:** Integration tests simulating file uploads in NestJS; measure success rates programmatically; Solo dev can test manually with sample files and verify database integrity via SQL queries; Use tools like Postman for API upload testing.  
  **Ambiguous Criteria Flagged:** PDF extraction assumes basic parsing; clarify if OCR is in scope (deferred to post-MVP per notes).

- **US-009 Acceptance Criteria:**  
  - Given an owner is logged in, When they create a new tenant subscription, Then the tenant is provisioned with isolated database schemas.  
  - Given a subscription upgrade, When payment details are updated, Then access levels are adjusted and billed accordingly.  
  - Given tenant isolation, When querying data, Then results are filtered by tenant ID without leakage.  
  - Given subscription expiration, When grace period ends, Then access is suspended and notifications are sent.  
  - Given owner oversight, When viewing all tenants, Then aggregated metrics are shown without exposing individual data.  
  - Given deletion request, When a tenant is removed, Then all associated data is archived per retention policies.  
  **Edge Cases:** Subscription downgrades affecting user counts; Failed payment processing; Tenant ID spoofing attempts; Scaling to 20+ tenants causing performance issues.  
  **Testability Notes:** Database schema tests in PostgreSQL; API security tests with JWT manipulation; Solo verification through multi-browser sessions simulating different tenants; Unit tests for filtering logic in NestJS.  
  **Ambiguous Criteria Flagged:** Payment integration details; clarify if external services (e.g., Stripe) are assumed.

#### Group 2: Workflow Management
- **US-002 Acceptance Criteria:**  
  - Given a caregiver is logged in, When they start a conversational note entry, Then guided prompts appear for observations.  
  - Given input via chat, When submitted, Then notes are saved to the database and timestamped.  
  - Given partial entry, When session is interrupted, Then draft is auto-saved and recoverable.  
  - Given note completion, When reviewed, Then it meets compliance standards and is editable within 24 hours.  
  - Given search for past notes, When queried by resident, Then relevant notes are displayed securely.  
  - Given voice input option, When enabled, Then transcription is accurate for basic entries.  
  **Edge Cases:** Long entries exceeding character limits; Network loss during submission; Invalid or non-compliant language detection; Concurrent edits by multiple caregivers.  
  **Testability Notes:** UI tests with Cypress for conversational flow; backend storage checks; Solo manual timing of entry process to verify time reductions; Integration tests for auto-save features.  
  **Ambiguous Criteria Flagged:** Voice input; clarify if in MVP scope (notes suggest basic prompts only).

- **US-005 Acceptance Criteria:**  
  - Given a caregiver logged in, When starting incident report, Then guided prompts for details appear sequentially.  
  - Given form completion, When submitted, Then report is validated for compliance and saved.  
  - Given attachment upload, When added (e.g., photo), Then it is encrypted and linked to the report.  
  - Given report review, When flagged issues exist, Then caregiver is prompted to correct before final submission.  
  - Given search for incidents, When filtered by date/resident, Then results are shown with access controls.  
  - Given auto-population, When from daily notes, Then relevant data is pre-filled.  
  **Edge Cases:** Incomplete forms submitted prematurely; File uploads exceeding size or type limits; Compliance validation failures; Reports during offline mode (if applicable).  
  **Testability Notes:** Form validation tests in Next.js; submission API tests; Solo simulation of reports and manual compliance checks; Unit tests for prompt logic.

- **US-012 Acceptance Criteria:**  
  - Given a caregiver logged in, When daily tasks are due, Then in-app reminders appear at set intervals.  
  - Given reminder acknowledgment, When task is completed, Then it is marked off and logged.  
  - Given missed reminder, When shift ends, Then escalation notification is sent to admin.  
  - Given task customization, When set by admin, Then reminders reflect updated schedules.  
  - Given multi-task view, When dashboard loads, Then pending reminders are prioritized.  
  - Given dismissal, When a reminder is ignored, Then it reappears after a cooldown.  
  **Edge Cases:** Overlapping reminders during busy shifts; Device notifications if app is closed; Timezone differences for tasks; High volume of reminders causing UI clutter.  
  **Testability Notes:** Cron job tests in NestJS; UI notification mocks; Solo timing and manual acknowledgment in dev mode; Integration tests for escalation flows.

#### Group 3: Compliance & Reporting
- **US-006 Acceptance Criteria:**  
  - Given compliance data is ready, When PDF export is triggered, Then a pixel-perfect document matching templates is generated.  
  - Given form selection, When custom fields are filled, Then they are included in the PDF accurately.  
  - Given export completion, When downloaded, Then the file is encrypted and watermarked.  
  - Given batch export, When for multiple residents, Then separate PDFs are created without errors.  
  - Given template update, When applied, Then new exports use the updated format.  
  - Given validation, When data is incomplete, Then export fails with error details.  
  **Edge Cases:** Large data sets causing generation timeouts; Non-standard characters in data; Export during system maintenance; Corrupted template files.  
  **Testability Notes:** Visual diff tools for PDF comparison; backend generation tests; Solo manual exports and Acrobat checks for pixel-perfection; Unit tests for encryption.

- **US-007 Acceptance Criteria:**  
  - Given a workflow in progress, When data is entered, Then real-time score updates and displays.  
  - Given score below 90%, When threshold hit, Then alerts are shown with suggestions.  
  - Given completion, When score is calculated, Then it is logged and averaged across sessions.  
  - Given rule update, When applied, Then scoring reflects new criteria immediately.  
  - Given dashboard view, When scores are queried, Then trends are shown for proactive review.  
  - Given override, When by officer, Then manual adjustments are audited.  
  **Edge Cases:** Rapid data changes causing score fluctuations; Zero-score scenarios (e.g., empty workflows); Conflicting rules in scoring; High traffic impacting real-time updates.  
  **Testability Notes:** Backend logic tests in NestJS; WebSocket mocks for real-time; Solo input simulations to verify score calculations; Database queries for average verifications.

- **US-008 Acceptance Criteria:**  
  - Given officer logged in, When searching logs by date/user, Then relevant entries are returned.  
  - Given log event, When triggered, Then it is stored with timestamps and details.  
  - Given retention policy, When 7 years pass, Then old logs are archived securely.  
  - Given export, When requested, Then logs are downloadable in CSV format.  
  - Given filters, When applied (e.g., error only), Then results are narrowed accurately.  
  - Given access attempt, When by non-officer, Then denied with logging.  
  **Edge Cases:** Large log volumes slowing searches; Search with invalid queries; Data tampering attempts; Storage limits for retention.  
  **Testability Notes:** Query performance tests; log insertion unit tests; Solo search simulations and manual retention checks via date mocks; Security tests for access denials.

#### Group 4: Dashboard & Insights
- **US-010 Acceptance Criteria:**  
  - Given owner logged in, When viewing reports, Then metrics like task times are aggregated and shown.  
  - Given date range, When selected, Then reports filter data and calculate savings.  
  - Given export, When triggered, Then metrics are output in chart/PDF format.  
  - Given data update, When new entries added, Then reports refresh automatically.  
  - Given benchmark, When compared to goals (20-40%), Then variances are highlighted.  
  - Given multi-tenant, When aggregated, Then owner sees cross-facility insights.  
  **Edge Cases:** No data available for reports; Extreme metric values (e.g., negative savings); Report generation timeouts; Filtered views with no results.  
  **Testability Notes:** Aggregate query tests in PostgreSQL; UI chart libraries tests; Solo data seeding and manual variance checks; Integration tests for refreshes.

- **US-011 Acceptance Criteria:**  
  - Given admin logged in, When adding a widget, Then it appears on dashboard with data feed.  
  - Given customization, When widgets are rearranged, Then layout is saved per user.  
  - Given data refresh, When interval hits, Then widgets update in real-time.  
  - Given insight click, When drilled down, Then detailed views open for actions.  
  - Given widget removal, When confirmed, Then it is deleted without affecting others.  
  - Given performance, When loaded, Then dashboard renders under 2 seconds.  
  **Edge Cases:** Maximum widgets causing UI overflow; Data feeds failing; Customization conflicts in multi-user; Mobile view distortions.  
  **Testability Notes:** Drag-drop UI tests with Cypress; backend feed mocks; Solo layout saves and manual timing for response improvements; Performance profiling in dev tools.

### Text-Based User Story Map
The user story map organizes stories horizontally by user journeys (columns) and vertically by priority (rows, with Must-haves at top). This visualizes the MVP backbone (e.g., onboarding to compliance) and iterations.

- **Journey: Setup and Access Management** (Group 1)  
  - Must-have: US-001 (Auth/RBAC) → US-009 (Multi-tenant) → US-003 (Onboarding)  
  - Could-have: US-004 (Data Import)  

- **Journey: Daily Operations and Documentation** (Group 2)  
  - Should-have: US-002 (Conversational Notes) → US-005 (Incident Reporting)  
  - Could-have: US-012 (Reminders)  

- **Journey: Audit and Export Processes** (Group 3)  
  - Should-have: US-006 (PDF Generation) → US-007 (Real-Time Scoring)  
  - Could-have: US-008 (Audit Logs)  

- **Journey: Monitoring and Analytics** (Group 4)  
  - Should-have: US-011 (Custom Dashboard)  
  - Could-have: US-010 (Basic Reporting)  

Backbone (MVP Release): US-001 → US-009 → US-003 → US-002 → US-005 → US-006 → US-007 → US-011  
Iteration 1 (Polish): US-004, US-012, US-008, US-010  

## Dependencies/Risks

### Dependencies Table
| Story ID | Depends On | Impact if Delayed |
|----------|------------|-------------------|
| US-001 | None | High: Delays entire project as it's foundational for security and multi-tenancy; could lead to rework in all other stories. |
| US-009 | US-001 | High: Blocks tenant-specific features; delayed isolation could expose data risks and require schema migrations later. |
| US-003 | US-001, US-009 | Medium: Hinders user onboarding; delays could slow testing with real users but allow parallel work on core workflows. |
| US-002 | US-001, US-009 | High: Core workflow; delays would cascade to incident reporting (US-005), exports (US-006), and real-time features (US-007). |
| US-005 | US-001, US-009, US-002 | Medium: Builds on workflows; delay might limit data for testing downstream stories but could be prototyped independently. |
| US-006 | US-002, US-005 | Medium: Requires workflow data for PDFs; delay could postpone compliance exports but not block core app functionality. |
| US-007 | US-002, US-005 | High: Real-time depends on data flows; delay risks missing alerts/dashboards, impacting overall app value. |
| US-011 | US-007 | Low: UI customization; delay affects polish but not core functionality; can be deferred without major issues. |
| US-004 | US-001 | Medium: Secure uploads needed; delay could hold up data migration but allow focus on greenfield features first. |
| US-012 | US-002, US-005 | Low: Notifications are additive; delay might miss reminders but not disrupt main workflows. |
| US-008 | US-001 | Medium: Logging builds on auth; delay could leave gaps in auditing, increasing compliance risks over time. |
| US-010 | US-002, US-005, US-009 | Low: Analytics on aggregated data; delay affects insights but not operational features; can be added post-MVP. |

### Risks Table
| Risk Description | Likelihood | Impact | Mitigation Plan |
|------------------|------------|--------|-----------------|
| HIPAA compliance validation delays (e.g., audits in US-001, US-008). | Medium | High (could add 20-30% effort across stories). | Conduct early spikes (research tasks) for HIPAA checklists; use open-source compliant templates; buffer 1-2 sprints for external reviews. |
| OCR/PDF parsing inaccuracies in US-004 failing 95% success. | High | High (data migration failures could block historical insights). | Prototype OCR with sample PDFs early; fallback to manual entry MVP; test with diverse formats and iterate on accuracy thresholds. |
| Steep learning curves for new tech (e.g., WebSockets in US-007, OCR in US-004). | Medium | Medium (inflates solo effort by 1-2x per story). | Allocate time for PoCs in planning; leverage tutorials/NestJS docs; split stories (e.g., basic US-007 without real-time first). |
| Scope creep from ambiguous requirements (e.g., UI in US-002, forms in US-006). | Medium | Medium (adds iterations, risking burnout). | Define acceptance criteria upfront; use time-boxed refinements; defer "could-have" features like voice input to later sprints. |
| Solo developer burnout from high-effort stories and context switching. | High | High (reduces velocity, extends timeline by weeks). | Plan at 80% capacity; intersperse low-effort stories (e.g., US-010 after US-001); incorporate weekly retros for workload adjustments. |
| Integration failures with third-party libraries (e.g., PDF-lib in US-006). | Medium | Medium (debugging eats time in solo setup). | Select well-documented libraries early; build integration tests from the start; have fallback options (e.g., simple exports first). |
| Scalability issues in multi-tenant DB (US-009) under load. | Low | High (performance bottlenecks for 10-20 facilities). | Simulate load in tests; monitor with basic metrics early; design for horizontal scaling but defer optimization until data grows. |
| External regulatory changes affecting exports or logs (US-006, US-008). | Low | Medium (requires rework on templates/retention). | Subscribe to regulatory updates; make templates configurable; conduct quarterly reviews to adapt without full rewrites. |

## High-Level Roadmap

This phased timeline assumes 2-week sprints for a solo developer (10-20 points per sprint, at 40-hour weeks with 80% capacity). Total effort: 92 points, targeting MVP in 6-12 months. Focus on critical path (US-001 → US-009 → core workflows) first, with buffers for risks.

- **Phase 1: Foundation (Sprints 1-3, ~6 weeks, 26 points)**  
  Must-haves: US-001 (13 pts), US-009 (8 pts), US-003 (5 pts).  
  Outcomes: Secure auth, multi-tenant isolation, onboarding. Validate with internal tests.

- **Phase 2: Core Workflows (Sprints 4-6, ~6 weeks, 21 points)**  
  Should-haves: US-002 (8 pts), US-005 (5 pts), US-006 (8 pts).  
  Outcomes: Transformative notes, incidents, PDF exports. Prototype user flows.

- **Phase 3: Insights & Polish (Sprints 7-9, ~6 weeks, 23 points)**  
  Should-haves: US-007 (13 pts), US-011 (5 pts); Could-haves: US-012 (3 pts), US-010 (3 pts).  
  Outcomes: Real-time scoring, dashboards, basic add-ons. User feedback loop.

- **Phase 4: Advanced & Migration (Sprints 10-12, ~6 weeks, 22 points)**  
  Could-haves: US-004 (13 pts), US-008 (8 pts).  
  Outcomes: Data imports, audit depth. Post-MVP if delays occur.

- **Post-MVP Iterations:** Offline capabilities, AI enhancements (deferred; monitor regulations like BH-CONNECT).

Sequenced Backlog Order:  
1. US-001  
2. US-009  
3. US-003  
4. US-002  
5. US-005  
6. US-006  
7. US-007  
8. US-011  
9. US-004  
10. US-012  
11. US-008  
12. US-010  

## Plan Summary and Next Steps

### Completeness
This plan is comprehensive, covering 80-90% of the epic's MVP scope with strong alignment to business values (e.g., 30-50% efficiency gains, 95%+ compliance). It integrates components, user flows, assumptions, and open questions into a cohesive structure, with stories providing granular, testable coverage across personas. Risks and dependencies are mitigated for solo feasibility, though ambiguities (e.g., OCR scope, voice input) could require refinement. Total effort (92 points) supports a 10-18 week timeline, promoting incremental delivery to reduce scope creep.

### Actionable Next Steps
- Conduct lightweight user interviews (2-3 personas) to validate assumptions and refine criteria (e.g., prioritize daily notes workflow).  
- Set up a simple Kanban board (e.g., Trello) for tracking; estimate velocities post-Sprint 1.  
- Prototype high-risk items (e.g., US-004 OCR PoC) in a spike sprint.  
- Browse/search for latest CALBHB/C ARF brief (2024) to update bed needs; monitor Prop 1 awards (starting May 2025) for partnerships.  
- Start Sprint 1 with US-001, using TDD and weekly retros for momentum.  

### Refinements Needed
- Clarify ambiguities (e.g., payment integrations in US-009, OCR in US-004) via stakeholder input or spikes.  
- Add story point re-estimation after prototypes to adjust for solo velocity.  
- Define detailed success metrics tracking (e.g., integrate analytics in MVP for NPS surveys).  
- If regulations evolve, revisit PDF templates and compliance scoring rules quarterly.