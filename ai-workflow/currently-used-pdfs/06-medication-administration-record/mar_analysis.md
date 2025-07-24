# Medication Administration Record (MAR) Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Medication Administration Record (MAR)
- Printed form code / number: LIC 622A
- Revision / version date: 6/17
- Page count: 4
- Intended setting / regulatory context: Licensed community care facilities or foster/certified/resource family agencies under the California Department of Social Services, Community Care Licensing. Used to record self-administration of non-psychotropic medications by children/residents, ensuring compliance with Health and Safety Code section 1507.6(b)(2)(B)(i)-(vi) for right medication, person, time, and route (Inferred from instructions and agency references).

## 2. Primary Purpose (1–3 sentences)
This form documents the self-administration of medications in community care facilities, tracking daily intake, missed doses, side effects, and refills to ensure accurate and timely medication management. It helps verify that medications are taken correctly and allows monitoring for reactions or issues. It supports regulatory requirements for medication records in licensed settings.

## 3. Secondary / Embedded Objectives
- Identify child/resident and facility for accountability.
- Detail prescription information for each medication.
- Track daily administration with initials and codes for missed doses.
- Record allergies, side effects, and monthly weight for health monitoring.
- Document reasons and results for missed medications.
- Provide contact info for pharmacy, physician, and placement worker.
- Identify staff through signatures and initials.

## 4. Field Inventory
- **Demographics**
  - Child’s Name
  - Date of Birth
  - Sex
- **Identifiers**
  - Facility Name & Number or Foster/Certified/Resource Family Agency Name
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - Placement Worker Name & Number
- **Clinical/Medical**
  - Allergies
  - Date and Description of Any Observed Side Effects
  - Monthly Weight & Date
  - **Not on form (recommend adding)**: Specific diagnoses
- **Behavioral/Risk**
  - Result (for missed medication; observed/reported behaviors/symptoms)
- **Functional/ADLs**
  - Not Applicable
- **Medications**
  - Medication Name
  - Required Dosage
  - Time & Frequency of Dose
  - Quantity Prescribed
  - Prescription Filled Date
  - Prescription #
  - # of Refills
  - Anticipated Refill Date
  - Additional Instructions From Physician
  - **Not on form (recommend adding)**: Route
- **Legal/Authorizations**
  - Not Applicable
- **Contacts & Providers**
  - Pharmacy Name & Number
  - Physician Name & Number
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Reason (for missed medication)
- **Signatures**
  - Staff Signature
  - Initials (for staff identification)
- **Internal Use/Admin**
  - MO/YR (month/year)
- **[Repeating] Prescription Details** (up to 3 instances)
  - Medication Name
  - Required Dosage
  - Time & Frequency of Dose
  - Quantity Prescribed
  - Prescription Filled Date
  - Prescription #
  - # of Refills
- **[Repeating] Administration Grid**
  - Time (hours)
  - Days 1-31 (initials or codes: S=School, H=Home visit, W=Work, P=Program, R=Refusal, O=Other)
- **[Repeating] Medications Not Administered Table**
  - Date
  - Hour
  - Medication Name
  - Reason
  - Result
  - Initials
  - Staff Signature
- **[Repeating] Staff Identification Table**
  - Signature
  - Initials

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Child’s Name | Demographics | Identifier | Y | High | N | Full name PHI. |
| Date of Birth | Demographics | Identifier | Y | High | N | Date PHI. |
| Sex | Demographics | Clinical | Y | Low | N | Biological sex. |
| Facility Name & Number | Identifiers | Admin | N | Low | N | Facility ID. |
| MO/YR | Internal Use/Admin | Admin | N | Low | N | Month/year. |
| Medication Name | Medications | Clinical | Y | High | N | Med details. |
| Required Dosage | Medications | Clinical | Y | High | N | Dosage info. |
| Time & Frequency of Dose | Medications | Clinical | Y | High | N | Schedule. |
| Quantity Prescribed | Medications | Clinical | Y | Moderate | N | Qty. |
| Prescription Filled Date | Medications | Clinical | Y | Moderate | N | Fill date. |
| Prescription # | Medications | Clinical | Y | Moderate | N | Rx number. |
| # of Refills | Medications | Clinical | Y | Low | N | Refills. |
| Anticipated Refill Date | Medications | Clinical | Y | Moderate | N | Refill date. |
| Additional Instructions From Physician | Medications | Clinical | Y | High | Y | Instructions. |
| Time (grid) | [Repeating] Administration Grid | Clinical | Y | High | N | Hours. |
| Days 1-31 (initials/codes) | [Repeating] Administration Grid | Clinical | Y | High | N | Daily record with codes. |
| Allergies | Clinical/Medical | Clinical | Y | High | Y | Allergy info. |
| Date and Description of Side Effects | Clinical/Medical | Clinical | Y | High | Y | Side effects. |
| Monthly Weight & Date | Clinical/Medical | Clinical | Y | Moderate | N | Weight monitoring. |
| Pharmacy Name & Number | Contacts & Providers | Admin | N | Low | N | Pharmacy contact. |
| Physician Name & Number | Contacts & Providers | Admin | Y | Moderate | N | Physician PII. |
| Placement Worker Name & Number | Placement/History | Social | Y | Moderate | N | Worker contact. |
| Date (not administered) | [Repeating] Not Administered Table | Clinical | Y | Moderate | N | Missed date. |
| Hour (not administered) | [Repeating] Not Administered Table | Clinical | Y | Moderate | N | Missed hour. |
| Medication Name (not administered) | [Repeating] Not Administered Table | Clinical | Y | High | N | Med name. |
| Reason (not administered) | Narrative/Free-Text | Narrative | Y | High | Y | Reason free-text. |
| Result (not administered) | Behavioral/Risk | Behavioral | Y | High | Y | Behaviors/symptoms. |
| Initials (not administered) | [Repeating] Not Administered Table | Admin | Y | Moderate | N | Staff initials. |
| Staff Signature (not administered) | Signatures | Admin | Y | Moderate | N | Signature. |
| Signature (staff ID) | [Repeating] Staff Table | Admin | Y | Moderate | N | Staff signature. |
| Initials (staff ID) | [Repeating] Staff Table | Admin | Y | Moderate | N | Staff initials. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Child’s Name.
  2. Dates: Date of Birth, Prescription Filled Date, Anticipated Refill Date, Monthly Weight Date, Side Effects Date, Missed Date.
  3. Telephone numbers: Pharmacy Number, Physician Number, Placement Worker Number.
  No other direct categories like SSN or addresses.
- High-sensitivity subsets: Medication names/dosages/schedules (health conditions implied), allergies, side effects (reactions/behaviors), result for missed (symptoms).
- Third-party identifiers: Physician, Pharmacy, Placement Worker (names/numbers).
- Free-text leakage risks: Reason for missed, side effects description, additional instructions could reveal conditions or behaviors.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for resident info (purpose: demographics).
  - `facilities`: Reference for facility details (purpose: context).
  - `med_admin_records`: Core transactional for MAR header (purpose: monthly record).
  - `prescriptions`: Reference for repeating details (purpose: med info).
  - `admin_entries`: Reference for daily grid (purpose: time/day initials).
  - `missed_meds`: Reference for not administered table (purpose: misses).
  - `staff_identifications`: Reference for staff table (purpose: signatures).
- Relationships (text narrative): `med_admin_records` 1:1 with `clients` and `facilities`; `prescriptions`, `admin_entries`, `missed_meds`, `staff_identifications` 1:M with `med_admin_records`. Use effective month for versioning.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; natural like prescription # (unique index).

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Doe, John",
  "dob": "2010-05-15",
  "sex": "Male"
}
```

Example JSON for transactional entity (prescription):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "record_id": "fedcba98-7654-3210-9876-543210fedcba",
  "med_name": "Ibuprofen",
  "dosage": "200mg",
  "time_freq": "Every 6 hours"
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

-- Med admin records
CREATE TABLE med_admin_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    mo_yr text NOT NULL, -- e.g., '07/2025'
    allergies text,
    monthly_weight numeric,
    monthly_weight_date date,
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
CREATE INDEX idx_med_admin_records_tenant_id ON med_admin_records (tenant_id);
CREATE INDEX idx_med_admin_records_client_id ON med_admin_records (client_id);
CREATE INDEX idx_med_admin_records_effective ON med_admin_records (effective_start, effective_end);

-- Prescriptions repeating
CREATE TABLE prescriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES med_admin_records(id) ON DELETE CASCADE,
    med_name text NOT NULL,
    dosage text NOT NULL,
    time_freq text NOT NULL,
    qty_prescribed integer,
    fill_date date,
    rx_number text,
    refills integer,
    anticipated_refill date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_prescriptions_tenant_id ON prescriptions (tenant_id);

-- Admin entries (daily grid)
CREATE TABLE admin_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES med_admin_records(id) ON DELETE CASCADE,
    admin_date date NOT NULL,
    admin_time text,
    initials text,
    code text CHECK (code IN ('S', 'H', 'W', 'P', 'R', 'O')), -- Enum for codes
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_admin_entries_tenant_id ON admin_entries (tenant_id);

-- Missed meds repeating
CREATE TABLE missed_meds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES med_admin_records(id) ON DELETE CASCADE,
    missed_date date NOT NULL,
    missed_hour text,
    med_name text NOT NULL,
    reason text,
    result text,
    initials text,
    staff_signature text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_missed_meds_tenant_id ON missed_meds (tenant_id);

-- Staff identifications repeating
CREATE TABLE staff_identifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES med_admin_records(id) ON DELETE CASCADE,
    signature text,
    initials text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_staff_identifications_tenant_id ON staff_identifications (tenant_id);

-- Strategy for enumerations: CHECK for codes (fixed); text for other flexible fields.
-- Optional partitioning note: Partition med_admin_records by range on effective_start for monthly volumes.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE med_admin_records ENABLE ROW LEVEL SECURITY; ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY; ALTER TABLE admin_entries ENABLE ROW LEVEL SECURITY; ALTER TABLE missed_meds ENABLE ROW LEVEL SECURITY; ALTER TABLE staff_identifications ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications (map to prescriptions):
    ```sql
    CREATE POLICY medications_policy ON prescriptions
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service'))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For risk_assessments (map to side effects in med_admin_records):
    ```sql
    CREATE POLICY risk_policy ON med_admin_records
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            side_effects_description IS NULL))
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
  CREATE VIEW masked_med_records AS
  SELECT id, tenant_id, client_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE allergies END AS allergies,
         -- Similar
  FROM med_admin_records WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_med_admin_records_active ON med_admin_records (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_med() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER med_audit
  AFTER INSERT OR UPDATE ON med_admin_records
  FOR EACH ROW EXECUTE FUNCTION audit_med();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Weights (numeric); Names/text.
  - Enumerations: Codes (S, H, W, P, R, O).
  - Required combinations: If missed, require reason/result/initials/signature; Initials for administered.
  - Temporal logic: Fill date < refill date; Missed date within mo/yr.
  - Dependency rules: If code used, no initials; Qty/refills positive integers.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Name, DOB, Allergies, Side effects, Reason/result.
  - Generalize: Dates to month/year; Weights to ranges.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Sex, Facility, Med name.
  - Generalization/bucketing: Dosage (low/high); Freq (daily/weekly).
  - Tokenization: Pseudonym name.
  - k-anonymity & l-diversity targets: k=5; l=2 for meds.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------ The browse_page returned the full form details for LIC 622A (6/17).

It's a Medication Administration Record for children in care facilities.

Structure:

- Header: Child's Name, DOB, Sex, Facility Name/Number, MO/YR

- Prescription Details (repeating up to 3): Med Name, Dosage, Time/Frequency, Quantity, Filled Date, Rx #, Refills

- Administration Grid: Time (hours), Days 1-31 (initials)

- Allergies

- Monthly Weight & Date

- Anticipated Refill Date

- Pharmacy Name & Number

- Physician Name & Number

- Additional Instructions from Physician

- Placement Worker Name & Number

- Side Effects: Date & Description

- Medications Not Administered Table (repeating): Date, Hour, Med Name, Reason, Result, Initials, Signature

- Staff Identification Table: Signature, Initials

Now, I can analyze this form.

Note: Revision 6/17, but user has  (no revision in query, but instructions mention LIC 622A).

Canonical: Medication Administration Record (MAR)

Code: LIC 622A

Revision: 6/17 (from tool)

Page count: 4

Intended: For recording self-administration of non-psychotropic meds in community care facilities for children.

Primary purpose: To document daily medication administration, misses, side effects, etc.

Fields as above.

For field inventory, group.

Demographics: Child's Name, DOB, Sex

Identifiers: Facility Name & Number

Clinical/Medical: Allergies, Prescription Details (name, dosage, time/frequency, quantity, filled date, rx #, refills), Additional Instructions, Side Effects (date, description), Medications Not Administered (date, hour, name, reason, result)

Functional/ADLs: N/A

Medications: The main, with grid for administration (hours, days, initials)

Contacts: Pharmacy Name & Number, Physician Name & Number, Placement Worker Name & Number

Narrative: Reason for not administered, Result, Comments not explicit.

Signatures: Staff Signature in not administered table, Staff Identification (signature, initials)

Internal: Monthly Weight & Date, Anticipated Refill Date

[Repeating] Prescription Details (up to 3), Not Administered table, Staff Identification.

[Repeating] Administration grid is tabular for days.

Now, produce the analysis.# Medication Administration Record (MAR) Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Medication Administration Record (MAR)
- Printed form code / number: LIC 622A
- Revision / version date: 6/17
- Page count: 4
- Intended setting / regulatory context: Licensed community care facilities or foster/certified/resource family agencies in California, under the Department of Social Services, Community Care Licensing. Used to document self-administration of non-psychotropic medications by children/residents, ensuring accurate tracking of doses, misses, side effects, and refills for regulatory compliance and safety (Inferred from instructions and Health and Safety Code references).

## 2. Primary Purpose (1–3 sentences)
This form is used to record the self-administration of medications by children in licensed care facilities, documenting each dose with initials, times, and dates to ensure the right medication is taken correctly. It tracks missed doses, side effects, allergies, weights, and refill needs to support health monitoring and regulatory requirements. The MAR helps prevent errors by requiring immediate recording and notification for issues.

## 3. Secondary / Embedded Objectives
- Identify child/resident and facility for accountability.
- Document prescription details for verification.
- Track daily administration in a grid for 31 days.
- Record allergies, side effects, and monthly weights for health oversight.
- Log missed medications with reasons and results for follow-up.
- Provide contact info for pharmacy, physician, and placement worker.
- Include staff identification for initials/signature verification.

## 4. Field Inventory
- **Demographics**
  - Child’s Name
  - Date of Birth
  - Sex (Inferred; biological at birth)
- **Identifiers**
  - Facility Name & Number or Foster/Certified/Resource Family Agency Name
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - MO/YR (month/year of log)
- **Clinical/Medical**
  - Allergies (free-text)
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
  - Staff Signature (in Medications Not Administered table)
- **Internal Use/Admin**
  - Initials (in administration grid and not administered table)
- **[Repeating] Prescription Details** (up to 3 instances)
  - Medication Name
  - Required Dosage
  - Time & Frequency of Dose
  - Quantity Prescribed
  - Prescription Filled Date
  - Prescription #
  - # of Refills
- **[Repeating] Medications Not Administered Table**
  - Date (missed)
  - Hour (missed)
  - Medication Name (missed)
  - Reason
  - Result
  - Initials
  - Staff Signature
- **[Repeating] Staff Identification Table**
  - Signature
  - Initials
- **Administration Grid** (tabular; hours x 31 days)
  - Time (hours)
  - Days 1-31 (initials or codes: S=School, H=Home visit, W=Work, P=Program, R=Refusal, O=Other)

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Child’s Name | Demographics | Identifier | Y | High | N | Direct PHI. |
| Date of Birth | Demographics | Identifier | Y | High | N | Date PHI. |
| Sex | Demographics | Clinical | Y | Low | N | Biological sex. |
| Facility Name & Number | Identifiers | Admin | N | Low | N | Facility info. |
| MO/YR | Placement/History | Admin | N | Low | N | Log period. |
| Medication Name | Medications | Clinical | Y | High | N | Drug details. |
| Required Dosage | Medications | Clinical | Y | High | N | Dose info. |
| Time & Frequency of Dose | Medications | Clinical | Y | High | N | Schedule. |
| Quantity Prescribed | Medications | Clinical | Y | Moderate | N | Amount. |
| Prescription Filled Date | Medications | Clinical | Y | Moderate | N | Date. |
| Prescription # | Medications | Clinical | Y | Moderate | N | Rx ID. |
| # of Refills | Medications | Clinical | Y | Low | N | Refill count. |
| Allergies | Clinical/Medical | Clinical | Y | High | Y | Allergy list. |
| Date and Description of Side Effects | Clinical/Medical | Clinical | Y | High | Y | Observations. |
| Monthly Weight & Date | Clinical/Medical | Clinical | Y | Moderate | N | Health metric. |
| Anticipated Refill Date | Clinical/Medical | Admin | Y | Low | N | Refill planning. |
| Additional Instructions From Physician | Clinical/Medical | Clinical | Y | High | Y | Med guidance. |
| Pharmacy Name & Number | Contacts & Providers | Admin | N | Low | N | Contact. |
| Physician Name & Number | Contacts & Providers | Admin | Y | Moderate | N | Provider PII. |
| Placement Worker Name & Number | Contacts & Providers | Social | Y | Moderate | N | Worker contact. |
| Date (missed) | [Repeating] Not Administered | Clinical | Y | Moderate | N | Missed date. |
| Hour (missed) | [Repeating] Not Administered | Clinical | Y | Low | N | Missed time. |
| Medication Name (missed) | [Repeating] Not Administered | Clinical | Y | High | N | Drug. |
| Reason (missed) | Narrative/Free-Text | Narrative | Y | High | Y | Explanation. |
| Result (missed) | Narrative/Free-Text | Narrative | Y | High | Y | Behaviors. |
| Initials (missed) | [Repeating] Not Administered | Admin | Y | Moderate | N | Staff ID. |
| Staff Signature (missed) | [Repeating] Not Administered | Admin | Y | Moderate | N | Signature. |
| Signature (staff ID) | [Repeating] Staff ID | Admin | Y | Moderate | N | Staff sig. |
| Initials (staff ID) | [Repeating] Staff ID | Admin | Y | Moderate | N | Staff initials. |
| Time (grid) | Administration Grid | Clinical | N | Low | N | Hours. |
| Days 1-31 (grid) | Administration Grid | Clinical | Y | High | N | Initials/codes per day. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Child’s Name.
  2. Dates: Date of Birth, Prescription Filled Date, Anticipated Refill Date, Monthly Date, Side Effects Date, Missed Date.
  3. Telephone numbers: Pharmacy/Physician/Placement Worker Number.
  No SSN, addresses, but contacts borderline.
- High-sensitivity subsets: Medication names/dosages/schedules (controlled substances risk), allergies, side effects (health conditions), missed reasons/results (behavioral issues).
- Third-party identifiers: Physician, Pharmacy, Placement Worker (names/numbers).
- Free-text leakage risks: Reason/Result for missed, side effects description, additional instructions could reveal diagnoses or behaviors; allergies list sensitive.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for demographics (purpose: resident profile).
  - `facilities`: Reference for facility info (purpose: placement context).
  - `med_admin_records`: Core transactional for MAR metadata (purpose: monthly log).
  - `prescriptions`: Reference for repeating details (purpose: med info).
  - `admin_entries`: Reference for grid (purpose: daily initials/codes).
  - `missed_meds`: Reference for not administered table (purpose: misses).
  - `staff_ids`: Reference for signatures/initials (purpose: staff verification).
- Relationships (text narrative): `med_admin_records` 1:1 with `clients`/`facilities`; `prescriptions`, `missed_meds`, `staff_ids` 1:M with `med_admin_records`; `admin_entries` 1:M (daily per med).
- Indicate surrogate vs natural keys: Surrogate UUID PKs; natural like Rx # unique index.

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
  "med_name": "Ibuprofen",
  "dosage": "200mg",
  "time_frequency": "Every 6 hours as needed"
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

-- Med admin records
CREATE TABLE med_admin_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    month_year text NOT NULL,
    allergies text,
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
CREATE INDEX idx_med_admin_records_tenant_id ON med_admin_records (tenant_id);
CREATE INDEX idx_med_admin_records_client_id ON med_admin_records (client_id);

-- Prescriptions repeating
CREATE TABLE prescriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES med_admin_records(id) ON DELETE CASCADE,
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

-- Admin entries (grid data)
CREATE TABLE admin_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES med_admin_records(id) ON DELETE CASCADE,
    prescription_id uuid REFERENCES prescriptions(id),
    admin_date date NOT NULL,
    admin_hour text,
    initials text,
    code text CHECK (code IN ('S', 'H', 'W', 'P', 'R', 'O')), -- CHECK for codes
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_admin_entries_tenant_id ON admin_entries (tenant_id);

-- Missed meds repeating
CREATE TABLE missed_meds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES med_admin_records(id) ON DELETE CASCADE,
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

-- Staff IDs repeating
CREATE TABLE staff_ids (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    record_id uuid NOT NULL REFERENCES med_admin_records(id) ON DELETE CASCADE,
    signature text,
    initials text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_staff_ids_tenant_id ON staff_ids (tenant_id);

-- Strategy for enumerations: CHECK for codes (fixed); text for others (flexible).
-- Optional partitioning note: Partition med_admin_records by month_year if high volume.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE med_admin_records ENABLE ROW LEVEL SECURITY; ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY; ALTER TABLE admin_entries ENABLE ROW LEVEL SECURITY; ALTER TABLE missed_meds ENABLE ROW LEVEL SECURITY; ALTER TABLE staff_ids ENABLE ROW LEVEL SECURITY;`
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
  - For risk_assessments (map to missed_meds for behaviors/results):
    ```sql
    CREATE POLICY risk_policy ON missed_meds
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            result IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For notes/narratives (map to side_effects in med_admin_records):
    ```sql
    CREATE POLICY notes_policy ON med_admin_records
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            side_effects IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For allergies:
  ```sql
  CREATE VIEW masked_records AS
  SELECT id, tenant_id, client_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE allergies END AS allergies,
         -- Similar
  FROM med_admin_records WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_med_admin_records_active ON med_admin_records (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_mar() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER mar_audit
  AFTER INSERT OR UPDATE ON med_admin_records
  FOR EACH ROW EXECUTE FUNCTION audit_mar();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Weights (numeric); Names/text.
  - Enumerations: Codes (S, H, W, P, R, O).
  - Required combinations: If missed, require reason/result; Initials match staff ID.
  - Temporal logic: Filled date < refill date; Admin date within month/year; Weight date in month.
  - Dependency rules: Initial or code per grid cell; If not administered, log in table.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Name, DOB, Allergies, Side effects, Reason/result.
  - Generalize: Dates to month/year; Weights to ranges.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Sex, Facility number, Month/year.
  - Generalization/bucketing: Age from DOB (buckets); Misses count (low/high).
  - Tokenization: Pseudonym name.
  - k-anonymity & l-diversity targets: k=5; l=2 for meds.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Child’s Name | Tokenize | CHILD_001 |
  | DOB | Suppress | [REDACTED] |
  | Allergies | Suppress | [REDACTED] |
  | Side effects | Suppress | [REDACTED] |
  | Reason (missed) | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): Scrub allergies/side effects for conditions; manual for reason/result.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Clinical/Medical | Medications | Narrative/Free-Text |
  |---------------|--------------|------------------|-------------|---------------------|
  | subscriber_owner | R/W | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W | R/W |
  | direct_support_staff | R/W | R/W | R/W | R/W |
  | read_only_auditor | R (masked) | R (masked) | R (masked) | R (masked) |
  | system_service | R/W | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask allergies/side effects; audit med changes.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for meds, allergies.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Med names, dosages, side effects.
- Logging & anomaly detection recommendations: Log misses/side effects; detect patterns in missed doses.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - Implement DDL with repeating tables; acceptance: Stores multiple prescriptions/misses.
  - Enable RLS; acceptance: Role access tests.
  - Add validation for grid codes; acceptance: Rejects invalid.
- **P2 (should)**
  - Create masked views; acceptance: Redacts for auditors.
  - Build de-ID export; acceptance: Suppresses PHI.
  - Add auditing; acceptance: Logs updates.
- **P3 (could)**
  - Generate JSON for records; acceptance: Matches examples.
  - Partition by month; acceptance: Improves performance.

## 14. Open Questions / Assumptions
- Assumptions: Form for children (from instructions); OCR garbled page 4 assumed as form grid.
- Uncertainties: Exact hours in grid; if psychotropic meds separate form.