# Client Weight Record Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Client Weight Record
- Printed form code / number: SGIPRC 005
- Revision / version date: 5/03
- Page count: 1
- Intended setting / regulatory context: Community care facilities, likely licensed by the California Department of Social Services or similar health agencies. Used to document monthly weight measurements for clients/residents to monitor health status, particularly for those on medications or with conditions requiring tracking (Inferred from form title and context).

## 2. Primary Purpose (1–3 sentences)
This form records monthly weight measurements for clients/residents in a care facility to monitor health changes, especially related to medication side effects or nutritional status. It ensures consistent documentation for regulatory compliance and health oversight. The form supports tracking trends over time to inform care decisions.

## 3. Secondary / Embedded Objectives
- Identify client and facility for accurate record-keeping.
- Document weight and corresponding dates for longitudinal tracking.
- Support health monitoring for medication or dietary needs.

## 4. Field Inventory
- **Demographics**
  - Client Name (Inferred; standard for client records)
- **Identifiers**
  - Facility Name (Inferred; typical for care forms)
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - Not Applicable
- **Clinical/Medical**
  - Monthly Weight (Inferred; core field for weight record)
  - Date of Weight Measurement (Inferred; paired with weight)
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
  - Not Applicable
- **Signatures**
  - Not Applicable (No signatures inferred; weight typically recorded by staff)
- **Internal Use/Admin**
  - Not Applicable
- **[Repeating] Weight Record Table** (Inferred; typical for monthly tracking)
  - Monthly Weight
  - Date of Weight Measurement

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Client Name | Demographics | Identifier | Y | High | N | Inferred; name PHI. |
| Facility Name | Identifiers | Admin | N | Low | N | Inferred; facility info. |
| Monthly Weight | Clinical/Medical | Clinical | Y | Moderate | N | Health metric. |
| Date of Weight Measurement | Clinical/Medical | Clinical | Y | Moderate | N | Date PHI. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Client Name (Inferred).
  2. Dates: Date of Weight Measurement (Inferred).
  No other identifiers like addresses or phone numbers.
- High-sensitivity subsets: None; weights are moderate (health data but not specific conditions).
- Third-party identifiers: None.
- Free-text leakage risks: None (no free-text fields inferred).

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for client identification (purpose: demographics).
  - `facilities`: Reference for facility details (purpose: context).
  - `weight_records`: Core transactional for weight measurements (purpose: track monthly weights).
- Relationships (text narrative): `weight_records` 1:M with `clients` (multiple weights per client) and 1:1 with `facilities`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; no natural keys inferred.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Doe, John"
}
```

Example JSON for transactional entity (weight_record):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "facility_id": "fedcba98-7654-3210-9876-543210fedcba",
  "weight": 150.5,
  "measurement_date": "2025-07-01"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Clients
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_clients_tenant_id ON clients (tenant_id);

-- Facilities
CREATE TABLE facilities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_facilities_tenant_id ON facilities (tenant_id);

-- Weight records
CREATE TABLE weight_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    weight numeric NOT NULL CHECK (weight > 0),
    measurement_date date NOT NULL,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_weight_records_tenant_id ON weight_records (tenant_id);
CREATE INDEX idx_weight_records_client_id ON weight_records (client_id);
CREATE INDEX idx_weight_records_effective ON weight_records (effective_start, effective_end);

-- Strategy for enumerations: None (numeric/date fields).
-- Optional partitioning note: Partition weight_records by measurement_date range (e.g., yearly) if high volume.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications: Not Applicable (no medication fields).
  - For risk_assessments: Not Applicable (no behavioral/risk fields).
  - For notes/narratives: Not Applicable (no free-text fields).
  - For weight records (clinical data):
    ```sql
    CREATE POLICY weight_policy ON weight_records
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service', 'read_only_auditor'))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For name (no sensitive clinical data like SSN):
  ```sql
  CREATE VIEW masked_clients AS
  SELECT id, tenant_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE name END AS name
  FROM clients WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_weight_records_active ON weight_records (tenant_id, client_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_weight() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id, timestamp)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid, CURRENT_TIMESTAMP);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER weight_audit
  AFTER INSERT OR UPDATE ON weight_records
  FOR EACH ROW EXECUTE FUNCTION audit_weight();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Weight (numeric, positive); Date (YYYY-MM-DD).
  - Enumerations: None.
  - Required combinations: Weight and Date paired for each entry.
  - Temporal logic: Measurement Date within effective_start/end; effective_start <= effective_end.
  - Dependency rules: Client Name required for all records; Weight must be plausible (e.g., <1000 lbs).

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Client Name.
  - Generalize: Measurement Date to month/year; Weight to ranges (e.g., 100-150 lbs).
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Facility Name, Measurement Date.
  - Generalization/bucketing: Weight ranges (50-lb increments); Date to year.
  - Tokenization: Pseudonym for Client Name.
  - k-anonymity & l-diversity targets: k=5 (each combo appears 5+ times); l=2 for weight ranges.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Client Name | Tokenize | CLIENT_001 |
  | Monthly Weight | Generalize | 150-200 lbs |
  | Date of Weight Measurement | Generalize | 2025-07 |
  | Facility Name | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): Not Applicable (no free-text).

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Clinical/Medical | Admin |
  |---------------|--------------|------------------|-------|
  | subscriber_owner | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W |
  | direct_support_staff | R/W | R/W | R/W |
  | read_only_auditor | R (masked) | R | R |
  | system_service | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask Client Name for auditors; audit weight updates for significant changes (e.g., >10% change).
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column-level encryption for Client Name and Weight (pgcrypto for sensitive data).
  - In-transit: TLS for all connections.
  - Key management: Use external KMS (e.g., AWS KMS) with annual rotation.
  - Field-level candidates: Client Name, Monthly Weight (health data).
- Logging & anomaly detection recommendations: Log all weight record updates; detect anomalies like rapid weight changes or frequent updates using tools like ELK stack.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - As a developer, implement DDL for clients and weight_records tables so that weight data can be stored; acceptance: Schema deploys, weight inserts succeed with valid data.
  - As a security engineer, enable RLS on all tables with tenant isolation so that data is segregated; acceptance: Cross-tenant queries fail.
  - As a data engineer, add auditing triggers to weight_records so that changes are logged; acceptance: Insert/update logs entry in audit_logs.
- **P2 (should)**
  - As a developer, create masked views for Client Name so that auditors see redacted data; acceptance: View returns 'REDACTED' for non-authorized roles.
  - As a QA tester, validate weight constraints (positive, plausible) so that invalid data is rejected; acceptance: CHECK violation on bad insert.
  - As a developer, implement de-ID pipeline for export so that Safe Harbor compliance is achieved; acceptance: Exported data has suppressed names and generalized weights.
- **P3 (could)**
  - As a developer, add weight trend analysis function so that health monitoring is enhanced; acceptance: Function calculates monthly changes.
  - As an analyst, generate sample INSERTs for seed data so that testing has realistic examples; acceptance: Scripts populate 10 test records.

## 14. Open Questions / Assumptions
- Assumptions: Form focuses on monthly weights (Inferred from title and context); Client Name and Facility Name are standard fields; no signatures due to staff recording.
- Uncertainties: Exact table structure (rows for months inferred); whether additional fields like staff initials are included; frequency of measurements (assumed monthly).
- Clarifications needed: Stakeholder confirmation on table layout; if used for specific conditions (e.g., psychotropic meds); retention period for records.