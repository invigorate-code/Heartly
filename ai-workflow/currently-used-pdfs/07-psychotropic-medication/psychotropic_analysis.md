# Psychotropic Medication Administration Record (MAR) Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Psychotropic Medication Administration Record (MAR)
- Printed form code / number: LIC 622B
- Revision / version date: 9/17
- Page count: 4
- Intended setting / regulatory context: Licensed community care facilities or foster/certified/resource family agencies under the California Department of Social Services, Community Care Licensing. Used to document self-administration of psychotropic medications by children/residents, in accordance with Welfare and Institutions Code sections 369.5 or 739.5 and Health and Safety Code section 1507.6(b)(1), requiring court authorization and close monitoring for effectiveness and side effects (Inferred from instructions and code references).

## 2. Primary Purpose (1–3 sentences)
This form records the self-administration of psychotropic medications in community care facilities, tracking daily intake, missed doses, side effects, and home visit transfers to ensure compliance with court orders and physician guidelines. It emphasizes monitoring for side effects and effectiveness as per California guidelines for psychotropic use. The MAR supports safe medication management, refill planning, and notification for issues.

## 3. Secondary / Embedded Objectives
- Identify child/resident and facility for accountability.
- Document court authorization (JV-223 date) for psychotropic meds.
- Track prescription details and administration in a grid.
- Record allergies, lab dates, side effects, and weights for health oversight.
- Log missed medications with reasons and results.
- Manage medication transfer during home visits (leaving/returning).
- Provide contacts for pharmacy, physician, and placement worker.

## 4. Field Inventory
- **Demographics**
  - Child’s Name
  - Date of Birth
  - Sex (biological at birth)
- **Identifiers**
  - Facility Name & Number or Foster/Certified/Resource Family Agency Name
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - JV-223 Date (court order date)
  - MO/YR (month/year)
- **Clinical/Medical**
  - Allergies (free-text)
  - Date of Last Lab
  - Date and Description of Any Observed Side Effects (free-text)
  - Monthly Weight & Date
  - Anticipated Refill Date
  - Additional Instructions From Physician (free-text)
- **Behavioral/Risk**
  - Not Applicable
- **Functional/ADLs**
  - Not Applicable
- **Medications**
  - Medication Name (embedded in Prescription Details)
  - Required Dosage (embedded in Prescription Details)
  - Time & Frequency of Dose (embedded in Prescription Details)
  - Quantity Prescribed (embedded in Prescription Details)
  - Prescription Filled Date (embedded in Prescription Details)
  - Prescription # (embedded in Prescription Details)
  - # of Refills (embedded in Prescription Details)
  - **Not on form (recommend adding)**: Route
- **Legal/Authorizations**
  - Not Applicable
- **Contacts & Providers**
  - Pharmacy Name & Number
  - Physician Name & Number
  - Placement Worker Name & Number
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Reason (for missed medication)
  - Result (observed/reported behaviors from missed medication)
- **Signatures**
  - Initials of Person Releasing Medication (home visits leaving)
  - Received By (signature for home visits leaving)
  - Initials of Person Receiving Medication (home visits returning)
  - Released By (signature for home visits returning)
  - Initials (in administration grid and missed table)
  - Staff Signature (in missed table)
- **Internal Use/Admin**
  - Not Applicable
- **[Repeating] Prescription Details** (up to 3 instances)
  - Medication Name
  - Required Dosage
  - Time & Frequency of Dose
  - Quantity Prescribed
  - Prescription Filled Date
  - Prescription #
  - # of Refills
- **[Repeating] Home Visits Leaving Table**
  - Date
  - Name of Medication
  - Quantity
  - Initials of Person Releasing Medication
  - Received By (signature)
- **[Repeating] Home Visits Returning Table**
  - Date
  - Name of Medication
  - Quantity
  - Initials of Person Receiving Medication
  - Released By (signature)
- **[Repeating] Medications Not Administered Table**
  - Date
  - Hour
  - Medication Name
  - Reason
  - Result
  - Initials
  - Staff Signature
- **Administration Grid** (tabular; hours x 31 days)
  - Time (hours)
  - Days 1-31 (initials or codes: S=School, H=Home visit, W=Work, P=Program, R=Refusal, O=Other)

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Child’s Name | Demographics | Identifier | Y | High | N | Direct PHI. |
| Date of Birth | Demographics | Identifier | Y | High | N | Date PHI. |
| Sex | Demographics | Clinical | Y | Low | N | Biological sex. |
| JV-223 Date | Placement/History | Admin | Y | Moderate | N | Court order date. |
| Facility Name & Number | Identifiers | Admin | N | Low | N | Facility info. |
| MO/YR | Placement/History | Admin | N | Low | N | Log period. |
| Medication Name | Medications | Clinical | Y | High | N | Psychotropic drug. |
| Required Dosage | Medications | Clinical | Y | High | N | Dose info. |
| Time & Frequency of Dose | Medications | Clinical | Y | High | N | Schedule. |
| Quantity Prescribed | Medications | Clinical | Y | Moderate | N | Amount. |
| Prescription Filled Date | Medications | Clinical | Y | Moderate | N | Date. |
| Prescription # | Medications | Clinical | Y | Moderate | N | Rx ID. |
| # of Refills | Medications | Clinical | Y | Low | N | Refill count. |
| Date of Last Lab | Clinical/Medical | Clinical | Y | High | N | Lab date. |
| Allergies | Clinical/Medical | Clinical | Y | High | Y | Allergy list. |
| Date and Description of Side Effects | Clinical/Medical | Clinical | Y | High | Y | Observations. |
| Monthly Weight & Date | Clinical/Medical | Clinical | Y | Moderate | N | Metric/date. |
| Anticipated Refill Date | Clinical/Medical | Admin | Y | Low | N | Refill. |
| Additional Instructions From Physician | Clinical/Medical | Clinical | Y | High | Y | Guidance. |
| Pharmacy Name & Number | Contacts & Providers | Admin | N | Low | N | Contact. |
| Physician Name & Number | Contacts & Providers | Admin | Y | Moderate | N | Provider PII. |
| Placement Worker Name & Number | Contacts & Providers | Social | Y | Moderate | N | Worker contact. |
| Date (leaving home visit) | [Repeating] Home Visits Leaving | Clinical | Y | Moderate | N | Visit date. |
| Name of Medication (leaving) | [Repeating] Home Visits Leaving | Clinical | Y | High | N | Drug. |
| Quantity (leaving) | [Repeating] Home Visits Leaving | Clinical | Y | Moderate | N | Count. |
| Initials Releasing (leaving) | [Repeating] Home Visits Leaving | Admin | Y | Moderate | N | Staff ID. |
| Received By (leaving) | [Repeating] Home Visits Leaving | Admin | Y | Moderate | N | Signature. |
| Date (returning home visit) | [Repeating] Home Visits Returning | Clinical | Y | Moderate | N | Visit date. |
| Name of Medication (returning) | [Repeating] Home Visits Returning | Clinical | Y | High | N | Drug. |
| Quantity (returning) | [Repeating] Home Visits Returning | Clinical | Y | Moderate | N | Count. |
| Initials Receiving (returning) | [Repeating] Home Visits Returning | Admin | Y | Moderate | N | Staff ID. |
| Released By (returning) | [Repeating] Home Visits Returning | Admin | Y | Moderate | N | Signature. |
| Date (missed) | [Repeating] Not Administered | Clinical | Y | Moderate | N | Missed date. |
| Hour (missed) | [Repeating] Not Administered | Clinical | Y | Low | N | Missed time. |
| Medication Name (missed) | [Repeating] Not Administered | Clinical | Y | High | N | Drug. |
| Reason (missed) | Narrative/Free-Text | Narrative | Y | High | Y | Explanation. |
| Result (missed) | Narrative/Free-Text | Narrative | Y | High | Y | Behaviors. |
| Initials (missed) | [Repeating] Not Administered | Admin | Y | Moderate | N | Staff ID. |
| Staff Signature (missed) | [Repeating] Not Administered | Admin | Y | Moderate | N | Signature. |
| Time (grid) | Administration Grid | Clinical | N | Low | N | Hours. |
| Days 1-31 (grid) | Administration Grid | Clinical | Y | High | N | Initials/codes. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Child’s Name.
  2. Dates: Date of Birth, JV-223 Date, Prescription Filled Date, Last Lab Date, Anticipated Refill Date, Side Effects Date, Home Visit Dates, Missed Date.
  3. Telephone numbers: Pharmacy/Physician/Placement Worker Number.
- High-sensitivity subsets: Psychotropic meds (mental health implied), side effects, missed reasons/results (behavioral), lab dates (monitoring).
- Third-party identifiers: Physician, Pharmacy, Placement Worker, Received/Released By (signatures).
- Free-text leakage risks: Reason/result for missed, side effects, additional instructions could reveal mental health details; allergies sensitive.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for demographics (purpose: resident).
  - `facilities`: Reference for facility (purpose: context).
  - `psych_med_records`: Core transactional for MAR (purpose: monthly psychotropic log).
  - `prescriptions`: Reference for details (purpose: med info).
  - `home_visits_leaving`: Reference for leaving table (purpose: transfers out).
  - `home_visits_returning`: Reference for returning table (purpose: transfers in).
  - `missed_meds`: Reference for not administered (purpose: misses).
- Relationships (text narrative): `psych_med_records` 1:1 with `clients`/`facilities`; `prescriptions`, `home_visits_leaving`, `home_visits_returning`, `missed_meds` 1:M with `psych_med_records`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; Rx # unique.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Doe, Jane",
  "dob": "2010-05-15",
  "sex": "Female"
}
```

Example JSON for transactional entity (prescription):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "record_id": "fedcba98-7654-3210-9876-543210fedcba",
  "med_name": "Risperidone",
  "dosage": "1mg",
  "time_frequency": "Bedtime"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Clients
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    dob date,
    sex text,
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
    number text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_facilities_tenant_id ON facilities (tenant_id);

-- Psych med records
CREATE TABLE psych_med_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    jv223_date date,
    month_year text NOT NULL,
    allergies text,
    last_lab_date date,
    side_effects text,
    monthly_weight numeric,
    monthly_weight_date date,
    anticipated_refill date,
    pharmacy_name text,
    pharmacy_number text,
    physician_name text,
    physician_number text,
    additional_instructions text,
    placement_worker_name text,
    placement_worker_number text,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_psych_med_records_tenant_id ON psych_med_records (tenant_id);
CREATE INDEX idx_psych_med_records_client_id ON psych_med_records (client_id);

-- Prescriptions repeating
CREATE TABLE prescriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES psych_med_records(id) ON DELETE CASCADE,
    med_name text NOT NULL,
    dosage text,
    time_frequency text,
    quantity_prescribed integer,
    filled_date date,
    prescription_number text,
    refills integer,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_prescriptions_tenant_id ON prescriptions (tenant_id);

-- Home visits leaving repeating
CREATE TABLE home_visits_leaving (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES psych_med_records(id) ON DELETE CASCADE,
    visit_date date,
    med_name text,
    quantity integer,
    releasing_initials text,
    received_by text, -- Signature
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_home_visits_leaving_tenant_id ON home_visits_leaving (tenant_id);

-- Home visits returning repeating
CREATE TABLE home_visits_returning (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES psych_med_records(id) ON DELETE CASCADE,
    visit_date date,
    med_name text,
    quantity integer,
    receiving_initials text,
    released_by text, -- Signature
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_home_visits_returning_tenant_id ON home_visits_returning (tenant_id);

-- Missed meds repeating
CREATE TABLE missed_meds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES psych_med_records(id) ON DELETE CASCADE,
    missed_date date,
    missed_hour text,
    med_name text,
    reason text,
    result text,
    initials text,
    staff_signature text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_missed_meds_tenant_id ON missed_meds (tenant_id);

-- Strategy for enumerations: None explicit (codes from general MAR); text for flexibility.
-- Optional partitioning note: Partition psych_med_records by month_year for time-series.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE psych_med_records ENABLE ROW LEVEL SECURITY; ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY; ALTER TABLE home_visits_leaving ENABLE ROW LEVEL SECURITY; ALTER TABLE home_visits_returning ENABLE ROW LEVEL SECURITY; ALTER TABLE missed_meds ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications (map to prescriptions):
    ```sql
    CREATE POLICY meds_policy ON prescriptions
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service'))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For risk_assessments (map to side effects in psych_med_records):
    ```sql
    CREATE POLICY risk_policy ON psych_med_records
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            side_effects IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For notes/narratives (map to reason in missed_meds):
    ```sql
    CREATE POLICY notes_policy ON missed_meds
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            reason IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For allergies:
  ```sql
  CREATE VIEW masked_records AS
  SELECT id, tenant_id, client_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE allergies END AS allergies,
         -- Similar
  FROM psych_med_records WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_psych_med_records_active ON psych_med_records (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_psych() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER psych_audit
  AFTER INSERT OR UPDATE ON psych_med_records
  FOR EACH ROW EXECUTE FUNCTION audit_psych();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Weights (numeric).
  - Enumerations: Codes (S, H, W, P, R, O from general MAR).
  - Required combinations: If missed, require reason/result; If home visit, log quantity/initials/signature.
  - Temporal logic: JV-223 < filled date; Last lab < current; Missed date within month/year.
  - Dependency rules: Quantity leaving = returning unless used; Initials for administered.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Name, DOB, Allergies, Side effects, Reason/result.
  - Generalize: Dates to month/year; Weights to ranges.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Sex, Facility, Month/year.
  - Generalization/bucketing: Dosage (low/high); Misses (low/high).
  - Tokenization: Pseudonym name.
  - k-anonymity & l-diversity targets: k=5; l=2 for psychotropics.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Child’s Name | Tokenize | CHILD_001 |
  | DOB | Suppress | [REDACTED] |
  | Allergies | Suppress | [REDACTED] |
  | Side effects | Suppress | [REDACTED] |
  | Reason (missed) | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): Scrub for conditions/behaviors; manual for psychotropic sensitivity.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Clinical/Medical | Medications | Narrative/Free-Text |
  |---------------|--------------|------------------|-------------|---------------------|
  | subscriber_owner | R/W | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W | R/W |
  | direct_support_staff | R/W | R/W | R/W | R/W |
  | read_only_auditor | R (masked) | R (masked) | R (masked) | R (masked) |
  | system_service | R/W | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask allergies/side effects; audit psychotropic changes.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for meds, allergies.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Med names, dosages, side effects.
- Logging & anomaly detection recommendations: Log misses/side effects; detect missed patterns.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - Implement DDL with home visit tables; acceptance: Stores transfers.
  - Enable RLS; acceptance: Role access.
  - Validate court/lab dates; acceptance: Rejects invalid.
- **P2 (should)**
  - Create masked views; acceptance: Redacts for auditors.
  - Build de-ID export; acceptance: Suppresses PHI.
  - Add auditing; acceptance: Logs updates.
- **P3 (could)**
  - JSON exports; acceptance: Matches examples.
  - Partition by month; acceptance: Performance.

## 14. Open Questions / Assumptions
- Assumptions: OCR typos corrected (e.g., "PSYCHOTOPIC" as Psychotropic); similar to LIC 622A but for psychotropic with extra fields.
- Uncertainties: Exact grid details; staff identification table (assumed similar to general MAR).