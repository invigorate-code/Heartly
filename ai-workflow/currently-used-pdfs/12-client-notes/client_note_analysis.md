# Client Notes Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Client Notes
- Printed form code / number: Not Visible
- Revision / version date: Not Visible
- Page count: 1
- Intended setting / regulatory context: Community care facilities licensed by the California Department of Social Services, Community Care Licensing, specifically Service Level 2, 3, or 4 facilities for persons with developmental disabilities. Used for ongoing written consumer notes as required by California Code of Regulations, Title 17, Section 56026(a) (Inferred from OCR reference and regulatory context).

## 2. Primary Purpose (1–3 sentences)
This form is used to document ongoing written notes about clients/residents in community care facilities, as mandated by regulations for monitoring and reporting purposes. It ensures administrators maintain records of consumer activities, progress, and needs. The notes support quarterly and semi-annual reports required under Section 56026.

## 3. Secondary / Embedded Objectives
- Facilitate preparation of consumer notes by facility administrators.
- Support compliance with reporting requirements (quarterly/semi-annual).
- Provide a structured format for documenting client-related information.

## 4. Field Inventory
- **Demographics**
  - Not Applicable
- **Identifiers**
  - Not Applicable
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - Not Applicable
- **Clinical/Medical**
  - Not Applicable
- **Behavioral/Risk**
  - Not Applicable
- **Functional/ADLs**
  - Not Applicable
- **Medications**
  - Not Applicable
- **Legal/Authorizations**
  - Not Applicable
- **Contacts & Providers**
  - Not Applicable
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Client Notes (free-text; ongoing written notes)
- **Signatures**
  - Not Applicable
- **Internal Use/Admin**
  - Not Applicable

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Client Notes | Narrative/Free-Text | Narrative | Y | High | Y | Free-text; high leakage risk for PHI. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  None explicit (no names, dates, etc., visible).
- High-sensitivity subsets: Potential behavioral or medical details in notes.
- Third-party identifiers: None.
- Free-text leakage risks: Client Notes could contain unstructured PHI; recommend structured fields or guidelines.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for client linkage (purpose: associate notes).
  - `client_notes`: Core transactional for notes (purpose: store free-text entries).
- Relationships (text narrative): `client_notes` 1:M with `clients` (multiple notes per client).
- Indicate surrogate vs natural keys: Surrogate UUID PKs.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543"
}
```

Example JSON for transactional entity (client_note):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "note_text": "Client participated in activity",
  "note_date": "2025-07-24"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Clients
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_clients_tenant_id ON clients (tenant_id);

-- Client notes
CREATE TABLE client_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    note_text text NOT NULL,
    note_date date NOT NULL,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_client_notes_tenant_id ON client_notes (tenant_id);
CREATE INDEX idx_client_notes_client_id ON client_notes (client_id);
CREATE INDEX idx_client_notes_effective ON client_notes (effective_start, effective_end);

-- Strategy for enumerations: None (free-text notes).
-- Optional partitioning note: Partition client_notes by note_date range if high volume.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications: Not Applicable.
  - For risk_assessments: Not Applicable.
  - For notes/narratives (map to note_text in client_notes):
    ```sql
    CREATE POLICY notes_policy ON client_notes
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service'))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For note_text:
  ```sql
  CREATE VIEW masked_client_notes AS
  SELECT id, tenant_id, client_id, note_date,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE note_text END AS note_text
  FROM client_notes WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_client_notes_active ON client_notes (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_notes() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER notes_audit
  AFTER INSERT OR UPDATE ON client_notes
  FOR EACH ROW EXECUTE FUNCTION audit_notes();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Text for notes; Date for note_date.
  - Enumerations: None.
  - Required combinations: Note_text and note_date per entry.
  - Temporal logic: Note_date within effective_start/end; start <= end.
  - Dependency rules: Notes required ongoing per regulation.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Note_text (free-text PHI).
  - Generalize: Note_date to month/year.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Note_date.
  - Generalization/bucketing: Date to quarter.
  - Tokenization: None.
  - k-anonymity & l-diversity targets: k=5; l=2.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Client Notes | Suppress | [REDACTED] |
  | Note Date | Generalize | 2025-Q3 |
- Handling of free-text (NLP scrubbing, manual QA): NLP scrub notes for PHI; manual QA.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Narrative/Free-Text |
  |---------------|---------------------|
  | subscriber_owner | R/W |
  | administrator | R/W |
  | direct_support_staff | R/W |
  | read_only_auditor | R (masked) |
  | system_service | R/W |
- Mask/unmask workflow & audit events: Mask note_text; audit updates.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for note_text.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Note_text.
- Logging & anomaly detection recommendations: Log note entries; detect sensitive keywords.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - DDL for notes; acceptance: Stores free-text.
  - RLS enable; acceptance: Controls access.
  - Auditing; acceptance: Logs.
- **P2 (should)**
  - Masked views; acceptance: Redacts notes.
  - De-ID script; acceptance: Suppresses.
- **P3 (could)**
  - JSON exports; acceptance: Matches.
  - Partitioning; acceptance: Improves.

## 14. Open Questions / Assumptions
- Assumptions: Form is blank template for free-text notes; client/facility info inferred.
- Uncertainties: Specific format (table for dates/notes?); signatures.
