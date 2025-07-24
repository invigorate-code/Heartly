# Dental Visit Information Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Dental Visit Information
- Printed form code / number (if any): Not Visible
- Revision / version date (or “Not Visible”): Not Visible
- Page count: 1
- Intended setting / regulatory context: Community care facilities licensed by the California Department of Social Services or similar health agencies. Used to document pre-visit information from the facility and post-visit details from the dentist for client/resident dental care (Inferred from content and structure).

## 2. Primary Purpose (1–3 sentences)
This form captures essential information for a dental visit, with Section A filled by the facility representative to provide client details and reason for the visit, and Section B completed by the dentist to record recommendations, treatment, and follow-up. It ensures coordinated communication between the facility and dental provider for client health management. The form supports documentation of procedures and signatures for accountability.

## 3. Secondary / Embedded Objectives
- Identify client and relevant contacts for the dental visit.
- Specify the reason for the visit to guide the dentist.
- Document dentist's recommendations and current treatment.
- Outline progress notes and follow-up plans.
- Record performed procedures via checkboxes.
- Obtain signatures from dentist and facility representative for verification.

## 4. Field Inventory
- **Demographics**
  - Client Name
  - DOB
- **Identifiers**
  - UC# (Inferred; unique client identifier)
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - Not Applicable
- **Clinical/Medical**
  - Physician Name (Inferred as primary physician)
  - Reason for Visit
  - Dentist's Recommendations
  - Current Treatment
  - Progress Note/Follow-up Plan
  - EXAM (checkbox)
  - X-RAY (checkbox)
  - PROPHY (checkbox)
  - EXTRACTIONS (checkbox)
  - RESTORATIONS (checkbox)
  - **Not on form (recommend adding)**: Specific diagnoses
  - **Not on form (recommend adding)**: Allergies
- **Behavioral/Risk**
  - Not Applicable
- **Functional/ADLs**
  - Not Applicable
- **Medications**
  - Not Applicable
- **Legal/Authorizations**
  - Not Applicable
- **Contacts & Providers**
  - Physician Name (repeated in Clinical/Medical)
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Reason for Visit
  - Dentist's Recommendations
  - Current Treatment
  - Progress Note/Follow-up Plan
- **Signatures**
  - Dentist’s Signature
  - Date (for dentist)
  - Facility Representative
  - Date (for facility representative)
- **Internal Use/Admin**
  - Not Applicable

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Client Name | Demographics | Identifier | Y | High | N | Full name PHI. |
| UC# | Identifiers | Identifier | Y | High | N | Unique ID. |
| DOB | Demographics | Identifier | Y | High | N | Date PHI. |
| Physician Name | Contacts & Providers | Identifier | Y | Moderate | N | Provider name. |
| Reason for Visit | Narrative/Free-Text | Clinical | Y | High | Y | Dental issue. |
| Dentist's Recommendations | Narrative/Free-Text | Clinical | Y | High | Y | Advice. |
| Current Treatment | Narrative/Free-Text | Clinical | Y | High | Y | Treatment details. |
| Progress Note/Follow-up Plan | Narrative/Free-Text | Clinical | Y | High | Y | Plan. |
| EXAM | Clinical/Medical | Clinical | Y | Moderate | N | Checkbox procedure. |
| X-RAY | Clinical/Medical | Clinical | Y | Moderate | N | Checkbox procedure. |
| PROPHY | Clinical/Medical | Clinical | Y | Moderate | N | Checkbox procedure. |
| EXTRACTIONS | Clinical/Medical | Clinical | Y | Moderate | N | Checkbox procedure. |
| RESTORATIONS | Clinical/Medical | Clinical | Y | Moderate | N | Checkbox procedure. |
| Dentist’s Signature | Signatures | Admin | Y | Moderate | N | Signature. |
| Date (dentist) | Signatures | Admin | N | Low | N | Date. |
| Facility Representative | Signatures | Admin | Y | Moderate | N | Name/signature. |
| Date (facility) | Signatures | Admin | N | Low | N | Date. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Client Name.
  2. Dates: DOB.
  3. Medical record numbers: UC# (potential).
- High-sensitivity subsets: Reason for Visit, Recommendations, Treatment, Progress Note (dental health details).
- Third-party identifiers: Physician Name, Dentist (signature).
- Free-text leakage risks: Reason, Recommendations, Treatment, Progress Note could contain detailed PHI like conditions or history.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for demographics (purpose: client info).
  - `dental_visits`: Core transactional for visit details (purpose: pre/post visit data).
  - `procedures`: Reference for checkboxes (purpose: performed services).
- Relationships (text narrative): `dental_visits` 1:1 with `clients`; `procedures` 1:M with `dental_visits` (if expanded).
- Indicate surrogate vs natural keys: Surrogate UUID PKs; UC# natural unique.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Doe, John",
  "uc_number": "UC12345",
  "dob": "1950-01-01"
}
```

Example JSON for transactional entity (dental_visit):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "physician_name": "Dr. Smith",
  "reason_for_visit": "Tooth pain",
  "recommendations": "Extraction recommended"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Clients
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    uc_number text UNIQUE,
    dob date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_clients_tenant_id ON clients (tenant_id);

-- Dental visits
CREATE TABLE dental_visits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    physician_name text,
    reason_for_visit text,
    recommendations text,
    current_treatment text,
    progress_note text,
    exam boolean DEFAULT false,
    x_ray boolean DEFAULT false,
    prophy boolean DEFAULT false,
    extractions boolean DEFAULT false,
    restorations boolean DEFAULT false,
    dentist_signature text,
    dentist_date date,
    facility_rep text,
    facility_date date,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_dental_visits_tenant_id ON dental_visits (tenant_id);
CREATE INDEX idx_dental_visits_client_id ON dental_visits (client_id);
CREATE INDEX idx_dental_visits_effective ON dental_visits (effective_start, effective_end);

-- Strategy for enumerations: Booleans for checkboxes (simple yes/no); text for narratives.
-- Optional partitioning note: Not applicable (low volume).
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE dental_visits ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications: Not Applicable (no meds).
  - For risk_assessments: Not Applicable (no risks).
  - For notes/narratives (map to recommendations in dental_visits):
    ```sql
    CREATE POLICY notes_policy ON dental_visits
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            recommendations IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For reason_for_visit:
  ```sql
  CREATE VIEW masked_dental_visits AS
  SELECT id, tenant_id, client_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE reason_for_visit END AS reason_for_visit,
         -- Similar
  FROM dental_visits WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_dental_visits_active ON dental_visits (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_dental() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER dental_audit
  AFTER INSERT OR UPDATE ON dental_visits
  FOR EACH ROW EXECUTE FUNCTION audit_dental();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Names/text.
  - Enumerations: Procedures (booleans/checkboxes).
  - Required combinations: If procedures checked, require recommendations/note.
  - Temporal logic: Dentist date = facility date (same visit); Effective start <= end.
  - Dependency rules: All Section A before visit; Section B during/after.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Client Name, Physician Name, Recommendations, Treatment, Note.
  - Generalize: DOB to year.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: DOB, UC#.
  - Generalization/bucketing: Age (5-year); Procedures count (0-2, 3+).
  - Tokenization: Pseudonym name.
  - k-anonymity & l-diversity targets: k=5; l=2 for procedures.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Client Name | Tokenize | CLIENT_001 |
  | DOB | Generalize | 1950 |
  | Reason for Visit | Suppress | [REDACTED] |
  | Recommendations | Suppress | [REDACTED] |
  | Progress Note | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): NLP for conditions in reason/recommendations; manual QA.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Clinical/Medical | Narrative/Free-Text |
  |---------------|--------------|------------------|---------------------|
  | subscriber_owner | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W |
  | direct_support_staff | R | R/W | R/W |
  | read_only_auditor | R (masked) | R (masked) | R (masked) |
  | system_service | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask recommendations/note; audit updates.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for narratives.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Reason, Recommendations, Note.
- Logging & anomaly detection recommendations: Log visit updates; detect frequent visits.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - DDL for visits/procedures; acceptance: Stores checkboxes.
  - RLS enable; acceptance: Controls access.
  - Validate dates; acceptance: Errors on invalid.
- **P2 (should)**
  - Masked views; acceptance: Redacts narratives.
  - De-ID script; acceptance: Suppresses PHI.
  - Auditing; acceptance: Logs changes.
- **P3 (could)**
  - JSON exports; acceptance: Matches examples.
  - Procedure enums; acceptance: Future-proof.

## 14. Open Questions / Assumptions
- Assumptions: UC# is unique identifier; Procedures are checkboxes.
- Uncertainties: If multiple visits per form; signature digital/scanned.