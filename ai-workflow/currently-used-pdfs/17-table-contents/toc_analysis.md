# Client File Table of Contents Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Client File Table of Contents
- Printed form code / number (if any): Not Visible
- Revision / version date (or “Not Visible”): Not Visible
- Page count: 1 (Inferred, as presented as a single table)
- Intended setting / regulatory context (mark inferred parts): Organizational tool for care facility client files, likely in residential or long-term care settings (Inferred); regulatory context: Compliance with documentation requirements in health/social services, possibly under HIPAA or state licensing for tracking medical, legal, and administrative records (Assumption based on content like medical exams and consents)

## 2. Primary Purpose (1–3 sentences)
This document serves as a table of contents to organize and index various forms, records, and reports within a client's file in a care setting. It ensures all required documentation is accounted for, with notations on timing (e.g., within 30 days, yearly). It facilitates quick reference and auditing for completeness in client intake, placement, and ongoing care.

## 3. Secondary / Embedded Objectives
- Guide staff on required timelines for document completion (e.g., within 30 days for assessments)
- Support compliance audits by categorizing records into sections like Forms, Medical, Reports
- Aid in file maintenance by listing miscellaneous sections for uncategorized items
- Ensure holistic client file coverage across administrative, medical, and legal domains

## 4. Field Inventory
The document is a structured list without atomic data entry fields; instead, it enumerates categories and sub-items as a checklist. No checkboxes, radios, or enumerated options visible. Grouped under domains where applicable; many are references to other forms.

**Demographics**: Not Applicable  
**Identifiers**: Not Applicable  
**Benefits/Financial**:  
- Financial Documents (Social Security Correspondence/Medi-Cal)  
- P & I Ledgers and Supporting Receipts  
**Placement/History**:  
- Intake Information  
- Placement Information Form  
- Admission Agreement with Rate Page (Upon Placement)  
**Clinical/Medical**:  
- Physical Exam & TB Test (Within 30 days)  
- Dental Exam (Within 30 days)  
- Vision Exam (Within 30 days)  
- Immunization Records  
- Annual Physical Exams and T.B. Clearance (Yearly)  
- Weight Records (Monthly)  
- Lab work/ X-Rays  
- Neurological Consults  
- Seizure Records  
- Psychiatric/Psychological Consults  
**Behavioral/Risk**:  
- Behavioral Assessment (BCBA) (Within 30 days)  
- Psychological / Social Assessments  
**Functional/ADLs**: Not Applicable  
**Medications**:  
- Medication Logs  
- Centrally Stored Medication and Destruction Record  
**Legal/Authorizations**:  
- Conservatorship/Legal Guardian Documentation  
- Consent for Medical Treatment (Upon placement)  
**Contacts & Providers**: Not Applicable  
**Preferences (religious/dietary)**: Not Applicable  
**Consents/Approvals**:  
- Client Rights and House Rules (Upon placement) [Appears multiple times]  
**Narrative/Free-Text**:  
- Needs and Services Plan (Within 30 days)  
- Consumer Notes  
- Special Incident Reports  
- Quarterly Reports  
- Annual Reports  
**Signatures**: Not Applicable  
**Internal Use/Admin**:  
- Personal Inventory Record  
- Miscellaneous [Repeating] (blank lines for additions)  

**Not on form (recommend adding)**: Date completed/tracked for each item, responsible staff signature.

## 5. Data Classification Table
| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|-----------------------------------------------------------------------------|---------------|---------------------------------|------------------|-------|
| Intake Information | Placement/History | Admin | Y | Moderate | N | References client entry data |
| Placement Information Form | Placement/History | Admin | Y | Moderate | N | Placement details |
| Admission Agreement with Rate Page | Placement/History | Financial | Y | High | N | Includes rates, agreements |
| Personal Inventory Record | Internal Use/Admin | Admin | N | Low | N | Belongings list |
| Client Rights and House Rules | Consents/Approvals | Admin | N | Low | N | Standard rules |
| Consent for Medical Treatment | Legal/Authorizations | Clinical | Y | High | N | Treatment authorization |
| Financial Documents (Social Security Correspondence/Medi-Cal) | Benefits/Financial | Financial | Y | High | N | Benefits info |
| Conservatorship/Legal Guardian Documentation | Legal/Authorizations | Admin | Y | High | N | Legal status |
| Physical Exam & TB Test | Clinical/Medical | Clinical | Y | High | N | Health exams |
| Dental Exam | Clinical/Medical | Clinical | Y | High | N | Health exams |
| Vision Exam | Clinical/Medical | Clinical | Y | High | N | Health exams |
| Immunization Records | Clinical/Medical | Clinical | Y | High | N | Vaccination history |
| Annual Physical Exams and T.B. Clearance | Clinical/Medical | Clinical | Y | High | N | Ongoing health |
| Weight Records | Clinical/Medical | Clinical | Y | Moderate | N | Vital signs |
| Lab work/ X-Rays | Clinical/Medical | Clinical | Y | High | N | Diagnostic results |
| Medication Logs | Medications | Clinical | Y | High | N | Rx tracking |
| Centrally Stored Medication and Destruction Record | Medications | Clinical | Y | High | N | Controlled substances |
| Behavioral Assessment (BCBA) | Behavioral/Risk | Behavioral | Y | High | N | Behavior eval |
| Needs and Services Plan | Narrative/Free-Text | Social | Y | High | Y | Care planning |
| Consumer Notes | Narrative/Free-Text | Narrative | Y | High | Y | Free-text notes |
| Special Incident Reports | Narrative/Free-Text | Admin | Y | High | Y | Incidents |
| Quarterly Reports | Narrative/Free-Text | Admin | Y | Moderate | Y | Progress |
| Annual Reports | Narrative/Free-Text | Admin | Y | Moderate | Y | Progress |
| Neurological Consults | Clinical/Medical | Clinical | Y | High | N | Specialist |
| Seizure Records | Clinical/Medical | Clinical | Y | High | N | Condition tracking |
| Psychological / Social Assessments | Behavioral/Risk | Behavioral | Y | High | N | Psych eval |
| Psychiatric/Psychological Consults | Clinical/Medical | Clinical | Y | High | N | Mental health |
| P & I Ledgers and Supporting Receipts | Benefits/Financial | Financial | Y | High | N | Financial records |
| Miscellaneous | Internal Use/Admin | Admin | N | Low | Y | Catch-all |

## 6. Regulatory & Privacy Notes
- Enumerate HIPAA direct identifiers found (map to the 18 categories): None directly in this TOC, but references imply presence in file: Names (client forms), Dates (exams within 30 days, yearly), SSNs (Social Security correspondence), Medical record numbers (exams, logs), Health plan beneficiary numbers (Medi-Cal).
- High-sensitivity subsets (behavioral risk, communicable disease, religious affiliation, etc.): Behavioral assessments, psychiatric consults (mental health); TB tests (communicable disease); Seizure records (neurological conditions).
- Third-party identifiers (representatives, providers): Conservatorship/legal guardians; Providers implied in consults/exams.
- Free-text leakage risks: High in consumer notes, reports, needs plans—could contain unprotected PII/PHI like names, conditions, incidents; Recommend structured fields or redaction protocols.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:  
  - `clients`: Core for client identifiers (purpose: central entity).  
  - `file_sections`: Reference for TOC categories (e.g., Forms, Medical) (purpose: organize structure).  
  - `documents`: Core for listed items (purpose: track each form/report with dates, status).  
  - `timelines`: Reference for due periods (e.g., within 30 days) (purpose: enforce compliance).  
- Relationships (text narrative): One-to-many from `clients` to `documents` (client has multiple docs); Many-to-one from `documents` to `file_sections` (docs belong to sections); Many-to-one from `documents` to `timelines` (docs have due rules).  
- Indicate surrogate vs natural keys: Surrogate UUID for PKs (e.g., document_id); Natural keys like document_name unique per client/section.

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Reference table for sections
CREATE TABLE file_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    section_number integer NOT NULL,  -- e.g., 1 for Forms
    section_name text NOT NULL,  -- e.g., 'Forms'
    created_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp WITH TIME ZONE,
    UNIQUE (tenant_id, section_number),
    CHECK (created_at <= updated_at)
);
CREATE INDEX idx_file_sections_tenant_id ON file_sections (tenant_id);

-- Core documents table
CREATE TABLE documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id),  -- Assuming clients table exists
    section_id uuid NOT NULL REFERENCES file_sections(id),
    document_name text NOT NULL,  -- e.g., 'Intake Information'
    due_timeline text,  -- e.g., 'Within 30 days'
    effective_start timestamp WITH TIME ZONE,
    effective_end timestamp WITH TIME ZONE,
    created_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp WITH TIME ZONE,
    CHECK (effective_start < effective_end),
    CHECK (created_at <= updated_at)
);
CREATE INDEX idx_documents_tenant_id ON documents (tenant_id);
CREATE INDEX idx_documents_client_id ON documents (client_id);
CREATE INDEX idx_documents_section_id ON documents (section_id);
CREATE INDEX idx_documents_effective ON documents (effective_start, effective_end);

-- Strategy for enumerations: Lookup table for file_sections (justification: sections are fixed but extensible); Inline text for due_timeline (justification: variable, non-enum).
-- Optional partitioning note: Partition documents by tenant_id or client_id if high volume per client files justifies it.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)`.
- Show enabling RLS per table: ALTER TABLE file_sections ENABLE ROW LEVEL SECURITY; ALTER TABLE documents ENABLE ROW LEVEL SECURITY; (clients assumed; no medications/risk_assessments, use documents for notes).
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  ```sql
  -- For clients (patients)
  CREATE POLICY clients_policy ON clients
  USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

  -- For medications (example, if added for logs)
  CREATE POLICY medications_policy ON medications  -- Hypothetical
  USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND (
      current_setting('app.role') IN ('administrator', 'direct_support_staff')
  ));

  -- For risk_assessments (example, for behavioral)
  CREATE POLICY risk_assessments_policy ON risk_assessments  -- Hypothetical
  USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND current_setting('app.role') != 'read_only_auditor');

  -- For notes/narratives (as documents with narrative items)
  CREATE POLICY notes_policy ON documents
  USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
  ```
- Enforce: tenant isolation, role-based access, exclude soft-deleted.
- Example masking: CREATE VIEW masked_documents AS SELECT id, tenant_id, client_id, section_id, document_name, CASE WHEN current_setting('app.role') = 'read_only_auditor' AND document_name LIKE '%Notes%' THEN 'REDACTED' ELSE due_timeline END AS due_timeline FROM documents;
- Recommend indexes: CREATE INDEX idx_documents_tenant_deleted ON documents (tenant_id) WHERE deleted_at IS NULL;
- Auditing trigger:
  ```sql
  CREATE FUNCTION audit_log() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, tenant_id, changed_by, changed_at)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, NEW.tenant_id, current_setting('app.user_id')::uuid, CURRENT_TIMESTAMP);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER audit_documents AFTER INSERT OR UPDATE OR DELETE ON documents FOR EACH ROW EXECUTE FUNCTION audit_log();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules: Section_number: positive integer; Document_name: text, required; Due_timeline: text matching patterns like 'Within % days', 'Yearly' (enum lookup if formalized); Temporal: effective_start < effective_end; Dependency: Medical docs require client_id; Combinations: Behavioral items required with clinical if present.

## 11. De-Identification Strategy
- **Safe Harbor:** Suppress: Financial docs, conservatorship (names/SSNs); Generalize: Dates/timelines to ranges (e.g., 'monthly' → 'periodic').
- **Expert Determination:** Quasi-identifiers: Document_name (if specific), due_timeline; Generalization: Bucket timelines (e.g., <30 days, annual); Tokenization: Hash client_id; k-anonymity=5, l-diversity=3 for report types.
- Transformation table:  
  | Original | De-ID Rule | Example Output |  
  |----------|------------|----------------|  
  | Client Rights and House Rules | Generalize | Standard Consent Form |  
  | Physical Exam & TB Test | Suppress details | Health Exam |  
  | Consumer Notes | NLP scrub | [REDACTED NOTES] |  
- Handling of free-text: NLP to remove PHI (e.g., names, conditions); Manual QA for reports/notes.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix:  
  | Role / Domain | Clinical/Medical | Financial | Behavioral/Risk | Narrative/Free-Text |  
  |---------------|------------------|-----------|-----------------|---------------------|  
  | subscriber_owner | Read/Write own | Read/Write own | Read/Write own | Read/Write own |  
  | administrator | Read/Write all | Read/Write all | Read/Write all | Read/Write all |  
  | direct_support_staff | Read/Write assigned | Read assigned | Read/Write assigned | Read/Write assigned |  
  | read_only_auditor | Read masked | Read masked | Read | Read masked |  
  | system_service | Bypass | Bypass | Bypass | Bypass |  
- Mask/unmask: Role-based views; Audit unmask requests.
- Encryption: Column-level for sensitive (e.g., document_name if PHI); Tablespace for all; In-transit TLS; Key mgmt: HSM; Candidates: Financial, medical fields.
- Logging: pgAudit for queries; Anomaly: Alert on bulk reads.

## 13. Implementation Backlog (Actionable Tickets)
- P1 (must): As developer, create tables with constraints; AC: DDL executes, sample insert succeeds.
- P1 (must): As security, implement RLS/policies; AC: Access denied without proper role/tenant.
- P2 (should): As data, add validation for timelines; AC: Invalid timelines rejected.
- P2 (should): As dev, add auditing triggers; AC: Changes audited.
- P3 (could): As dev, build masked views; AC: Auditors see masked data.
- P3 (could): As analyst, implement de-ID scripts; AC: Transformed data matches rules.

## 14. Open Questions / Assumptions
- Assumed as TOC for care files; confirm if specific to certain regulations (e.g., California DDS).
- No dates populated; assumed 'Date' column for tracking.
- Miscellaneous blanks inferred as repeating; clarify if for custom additions.
- High sensitivity assumed for referenced docs; stakeholder input on actual content.

Example JSON for primary entity (e.g., patient/client):
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "tenant_id": "0987fedc-ba65-4321-0987-654321fedcba",
  "client_identifier": "CLIENT-123"
}
```

Example JSON for transactional entity (e.g., medication/document):
```json
{
  "id": "1234abcd-5678-ef90-1234-abcd5678ef90",
  "tenant_id": "0987fedc-ba65-4321-0987-654321fedcba",
  "client_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "section_id": "fedcba09-8765-4321-fedc-ba0987654321",
  "document_name": "Physical Exam & TB Test",
  "due_timeline": "Within 30 days"
}
```

**Next Options**
- Generate FHIR mapping
- Provide seed data INSERTs
- Add ER diagram description
- Extend RLS to column-level masking view