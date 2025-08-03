# Centrally Stored Medication and Destruction Record Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Centrally Stored Medication and Destruction Record
- Printed form code / number: LIC 622
- Revision / version date: 3/99
- Page count: 4
- Intended setting / regulatory context: Community care facilities licensed by the California Department of Social Services, Community Care Licensing, including Residential Care Facilities for the Elderly (RCFE) and Residential Care Facilities for the Chronically Ill (RCFCI). Used to document centrally stored medications and their destruction upon termination of services or disposal, ensuring compliance with retention requirements (1-3 years depending on facility type) (Inferred from instructions and regulatory notes).

## 2. Primary Purpose (1–3 sentences)
This form records the storage and destruction of prescription medications in community care facilities that are centrally stored and not accessible to unauthorized individuals. It ensures accountability for medication inventory from receipt to disposal or destruction, preventing misuse and complying with state regulations. The record helps track meds not taken upon service termination and requires signatures for destruction.

## 3. Secondary / Embedded Objectives
- Document client/resident and facility details for identification.
- Track medication details like name, strength, instructions, and prescription info.
- Maintain records of medication receipt, start date, and balance (though not explicit fields).
- Outline destruction procedures for different facility types (e.g., RCFE vs others).
- Require witnesses and signatures for destruction to ensure proper disposal.
- Retain records for specified periods (1 year general, 3 years for RCFE/RCFCI).

## 4. Field Inventory
- **Demographics**
  - Name (Last, First, Middle)
  - Admission Date
- **Identifiers**
  - Facility Name
  - Facility Number
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - Not Applicable
- **Clinical/Medical**
  - Medication Name (embedded in both tables)
  - Strength/Quantity (embedded in both tables)
  - Instructions (Dosage, Frequency) (embedded in both tables)
  - Control/Custody (embedded in both tables)
  - Expiration Date (embedded in both tables)
  - Date Filled (embedded in both tables)
  - Date Started (embedded in both tables)
  - Prescribing Physician (embedded in both tables)
  - Prescription Number (embedded in both tables)
  - No. of Refills (embedded in both tables)
  - Name of Pharmacy (embedded in both tables)
  - **Not on form (recommend adding)**: Route
- **Behavioral/Risk**
  - Not Applicable
- **Functional/ADLs**
  - Not Applicable
- **Medications**
  - Medication Name (repeated in Clinical/Medical)
  - Strength/Quantity (repeated)
  - Instructions (repeated)
  - Control/Custody (repeated)
  - Expiration Date (repeated)
  - Date Filled (repeated)
  - Date Started (repeated)
  - Prescribing Physician (repeated)
  - Prescription Number (repeated)
  - No. of Refills (repeated)
  - Name of Pharmacy (repeated)
  - **Not on form (recommend adding)**: Dosage (explicit, though in instructions)
  - **Not on form (recommend adding)**: Frequency (explicit in instructions)
- **Legal/Authorizations**
  - Disposal Date (in Destruction table)
- **Contacts & Providers**
  - Attending Physician
  - Prescribing Physician (repeated)
  - Name of Pharmacy (repeated)
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Not Applicable
- **Signatures**
  - Administrator (header)
  - Signature of Administrator or Designated Representative (in Destruction table)
  - Signature of Witness Adult Non-Client (in Destruction table)
- **Internal Use/Admin**
  - Not Applicable
- **[Repeating] Centrally Stored Medication Table**
  - Medication Name
  - Strength/Quantity
  - Instructions
  - Control/Custody
  - Expiration Date
  - Date Filled
  - Date Started
  - Prescribing Physician
  - Prescription Number
  - No. of Refills
  - Name of Pharmacy
- **[Repeating] Medication Destruction Table**
  - Medication Name
  - Strength/Quantity
  - Instructions
  - Control/Custody
  - Expiration Date
  - Date Filled
  - Date Started
  - Prescribing Physician
  - Prescription Number
  - Disposal Date
  - Signature of Administrator or Designated Representative
  - Signature of Witness Adult Non-Client
  - No. of Refills
  - Name of Pharmacy

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Name (Last, First, Middle) | Demographics | Identifier | Y | High | N | Full name PHI. |
| Admission Date | Demographics | Identifier | Y | High | N | Date PHI. |
| Facility Name | Identifiers | Admin | N | Low | N | Facility. |
| Facility Number | Identifiers | Admin | N | Low | N | License number. |
| Attending Physician | Contacts & Providers | Admin | Y | Moderate | N | Physician name. |
| Administrator | Signatures | Admin | Y | Moderate | N | Admin name. |
| Medication Name | Medications | Clinical | Y | High | N | Drug details. |
| Strength/Quantity | Medications | Clinical | Y | High | N | Dose/amount. |
| Instructions | Medications | Clinical | Y | High | Y | Dosage/frequency. |
| Control/Custody | Medications | Clinical | Y | Moderate | N | Controlled status. |
| Expiration Date | Medications | Clinical | Y | Low | N | Expiry. |
| Date Filled | Medications | Clinical | Y | Moderate | N | Fill date. |
| Date Started | Medications | Clinical | Y | Moderate | N | Start date. |
| Prescribing Physician | Contacts & Providers | Clinical | Y | Moderate | N | Physician name. |
| Prescription Number | Medications | Clinical | Y | Moderate | N | Rx ID. |
| No. of Refills | Medications | Clinical | Y | Low | N | Refills. |
| Name of Pharmacy | Contacts & Providers | Admin | N | Low | N | Pharmacy. |
| Disposal Date | Legal/Authorizations | Admin | Y | Moderate | N | Destruction date. |
| Signature of Administrator/Designee | Signatures | Admin | Y | Moderate | N | Signature. |
| Signature of Witness | Signatures | Admin | Y | Moderate | N | Witness signature. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Name (Last, First, Middle).
  2. Dates: Admission Date, Expiration Date, Date Filled, Date Started, Disposal Date.
  No telephone, addresses, SSN.
- High-sensitivity subsets: Medication name/strength/instructions (imply conditions, controlled substances).
- Third-party identifiers: Attending/Prescribing Physician, Name of Pharmacy, Witness (non-client adult).
- Free-text leakage risks: Instructions could include health details; no other free-text.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for resident (purpose: demographics).
  - `facilities`: Reference for facility (purpose: admin details).
  - `stored_medications`: Core for storage table (purpose: inventory).
  - `destroyed_medications`: Core for destruction table (purpose: disposal log).
- Relationships (text narrative): `stored_medications` and `destroyed_medications` 1:M with `clients` and `facilities`; destruction may link to storage via med details.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; prescription number natural unique.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "last_name": "Doe",
  "first_name": "John",
  "middle_name": "A",
  "admission_date": "2025-01-01"
}
```

Example JSON for transactional entity (stored_medication):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "med_name": "Aspirin",
  "strength_quantity": "81mg/30 tablets",
  "instructions": "1 daily"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Clients
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    last_name text NOT NULL,
    first_name text NOT NULL,
    middle_name text,
    admission_date date,
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
    number text NOT NULL,
    administrator text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_facilities_tenant_id ON facilities (tenant_id);

-- Stored medications
CREATE TABLE stored_medications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    med_name text NOT NULL,
    strength_quantity text NOT NULL,
    instructions text,
    control_custody text,
    expiration_date date,
    date_filled date,
    date_started date,
    prescribing_physician text,
    prescription_number text UNIQUE,
    no_refills integer,
    pharmacy_name text,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_stored_medications_tenant_id ON stored_medications (tenant_id);
CREATE INDEX idx_stored_medications_client_id ON stored_medications (client_id);
CREATE INDEX idx_stored_medications_effective ON stored_medications (effective_start, effective_end);

-- Destroyed medications
CREATE TABLE destroyed_medications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    med_name text NOT NULL,
    strength_quantity text NOT NULL,
    instructions text,
    control_custody text,
    expiration_date date,
    date_filled date,
    date_started date,
    prescribing_physician text,
    prescription_number text,
    disposal_date date NOT NULL,
    admin_signature text NOT NULL,
    witness_signature text NOT NULL,
    no_refills integer,
    pharmacy_name text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_destroyed_medications_tenant_id ON destroyed_medications (tenant_id);

-- Strategy for enumerations: None (text fields); date CHECK for temporal.
-- Optional partitioning note: Partition stored_medications by effective_start if high volume.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE stored_medications ENABLE ROW LEVEL SECURITY; ALTER TABLE destroyed_medications ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications (map to stored_medications):
    ```sql
    CREATE POLICY meds_policy ON stored_medications
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service'))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For risk_assessments: Not Applicable (no behavioral/risk; if added for controlled).
  - For notes/narratives: Not Applicable (no free-text narratives; instructions text).
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For med_name:
  ```sql
  CREATE VIEW masked_stored_meds AS
  SELECT id, tenant_id, client_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE med_name END AS med_name,
         -- Similar
  FROM stored_medications WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_stored_medications_active ON stored_medications (tenant_id) WHERE deleted_at IS NULL;`
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
  AFTER INSERT OR UPDATE ON stored_medications
  FOR EACH ROW EXECUTE FUNCTION audit_med();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Names/text; Quantity/numeric.
  - Enumerations: None.
  - Required combinations: If destruction, require signatures; All med fields for entry.
  - Temporal logic: Date Filled <= Date Started <= Expiration Date; Disposal Date > Date Started.
  - Dependency rules: Prescription number unique; Refills non-negative.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Name, Physician/Pharmacy names, Instructions (if detailed).
  - Generalize: Dates to year/month; Strength to categories.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Admission Date, Prescription Number.
  - Generalization/bucketing: Dates (year); Quantity (small/large).
  - Tokenization: Pseudonym names.
  - k-anonymity & l-diversity targets: k=5; l=2 for meds.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Name | Tokenize | RESIDENT_001 |
  | Admission Date | Generalize | 2025 |
  | Medication Name | Suppress | [REDACTED] |
  | Instructions | Suppress | [REDACTED] |
  | Prescribing Physician | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): Scrub instructions for conditions; manual for details.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Medications | Signatures |
  |---------------|--------------|-------------|------------|
  | subscriber_owner | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W |
  | direct_support_staff | R/W | R/W | R/W |
  | read_only_auditor | R (masked) | R (masked) | R |
  | system_service | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask med names; audit destruction.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for med details.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Medication name, instructions.
- Logging & anomaly detection recommendations: Log destruction; detect unusual disposals.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - Implement DDL for storage/destruction; acceptance: Tables created.
  - Enable RLS; acceptance: Access controlled.
  - Add temporal validation; acceptance: Errors on bad dates.
- **P2 (should)**
  - Create masked views; acceptance: Redacts meds.
  - Build de-ID function; acceptance: Suppresses PHI.
  - Add auditing; acceptance: Logs changes.
- **P3 (could)**
  - JSON serialization; acceptance: Matches examples.
  - Retention policy enforcement; acceptance: Auto-delete old.

## 14. Open Questions / Assumptions
- Assumptions: OCR typos corrected (e.g., "DESTRCTION" as Destruction); form for prescription meds only.
- Uncertainties: Exact table rows; if balance tracked in storage.