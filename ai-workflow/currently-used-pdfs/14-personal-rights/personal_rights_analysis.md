# Personal Rights - Adult Community Care Facilities Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Personal Rights - Adult Community Care Facilities
- Printed form code / number: LIC 613C
- Revision / version date: 12/99
- Page count: 2
- Intended setting / regulatory context: Adult community care facilities licensed by the California Department of Social Services, Community Care Licensing Division. Used to advise clients of their personal rights upon admission, as required by California Code of Regulations, Title 22, and to obtain acknowledgment (Inferred from form content and regulatory references).

## 2. Primary Purpose (1–3 sentences)
This form informs clients admitted to adult community care facilities of their personal rights, including dignity, privacy, and humane care, as mandated by state regulations. It requires acknowledgment by the client and/or representative to confirm understanding and receipt. The form also provides complaint procedures and licensing agency contact for reporting issues.

## 3. Secondary / Embedded Objectives
- List specific rights (e.g., dignity, safe accommodations, religious participation, visitor access).
- Ensure clients are informed of complaint processes and confidentiality.
- Obtain signatures to document review and agreement.
- Provide licensing agency details for complaints.

## 4. Field Inventory
- **Demographics**
  - Client Name
- **Identifiers**
  - Facility Name
  - Facility Address
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
  - Acknowledgment of Rights (statement)
- **Contacts & Providers**
  - Licensing Agency Name
  - Licensing Agency Address
  - Licensing Agency City
  - Licensing Agency Zip Code
  - Licensing Agency Area Code/Telephone Number
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Not Applicable
- **Signatures**
  - Signature of the Client
  - Date (for client)
  - Signature of the Representative/Conservator
  - Title of the Representative/Conservator
  - Date (for representative)
- **Internal Use/Admin**
  - Not Applicable

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Facility Name | Identifiers | Admin | N | Low | N | Facility info. |
| Facility Address | Identifiers | Admin | N | Low | N | Facility location. |
| Client Name | Demographics | Identifier | Y | High | N | Name PHI. |
| Signature of the Client | Signatures | Admin | Y | Moderate | N | Authenticates. |
| Date (client) | Signatures | Admin | N | Low | N | Date. |
| Signature of the Representative/Conservator | Signatures | Admin | Y | Moderate | N | Authenticates. |
| Title of the Representative/Conservator | Legal/Authorizations | Admin | N | Low | N | Title. |
| Date (representative) | Signatures | Admin | N | Low | N | Date. |
| Licensing Agency Name | Contacts & Providers | Admin | N | Low | N | Agency name. |
| Licensing Agency Address | Contacts & Providers | Admin | N | Low | N | Agency address. |
| Licensing Agency City | Contacts & Providers | Admin | N | Low | N | Agency city. |
| Licensing Agency Zip Code | Contacts & Providers | Admin | N | Low | N | Agency zip. |
| Licensing Agency Area Code/Telephone Number | Contacts & Providers | Admin | N | Low | N | Agency phone. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Client Name.
  No dates (except signature dates, borderline), addresses (facility/agency, not personal).
- High-sensitivity subsets: None (rights acknowledgment; no health data).
- Third-party identifiers: Representative/Conservator (signature/title).
- Free-text leakage risks: None (no free-text fields).

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for client info (purpose: demographics/signatures).
  - `facilities`: Reference for facility details (purpose: context).
  - `rights_acknowledgments`: Core transactional for acknowledgment (purpose: signed rights).
  - `licensing_agencies`: Reference for agency contact (purpose: complaints).
- Relationships (text narrative): `rights_acknowledgments` 1:1 with `clients` and `facilities`; `licensing_agencies` 1:1 with `facilities`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Doe, John"
}
```

Example JSON for transactional entity (rights_acknowledgment):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "facility_id": "fedcba98-7654-3210-9876-543210fedcba",
  "client_signature": "John Doe",
  "client_date": "2025-07-24"
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
    address text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_facilities_tenant_id ON facilities (tenant_id);

-- Rights acknowledgments
CREATE TABLE rights_acknowledgments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    client_signature text,
    client_date date,
    rep_signature text,
    rep_title text CHECK (rep_title IN ('Client', 'Authorized Representative', 'Conservator')), -- CHECK enum
    rep_date date,
    agency_name text,
    agency_address text,
    agency_city text,
    agency_zip text,
    agency_phone text,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_rights_acknowledgments_tenant_id ON rights_acknowledgments (tenant_id);
CREATE INDEX idx_rights_acknowledgments_client_id ON rights_acknowledgments (client_id);

-- Strategy for enumerations: CHECK for rep_title (fixed).
-- Optional partitioning note: Not applicable (low volume).
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE rights_acknowledgments ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications: Not Applicable.
  - For risk_assessments: Not Applicable.
  - For notes/narratives: Not Applicable (no narratives).
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): No sensitive columns like SSN; for name:
  ```sql
  CREATE VIEW masked_clients AS
  SELECT id, tenant_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE name END AS name
  FROM clients WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_rights_acknowledgments_active ON rights_acknowledgments (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_rights() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER rights_audit
  AFTER INSERT OR UPDATE ON rights_acknowledgments
  FOR EACH ROW EXECUTE FUNCTION audit_rights();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Names/text; Phone (formatted).
  - Enumerations: Title (Client, Authorized Representative, Conservator).
  - Required combinations: Signature and date for client or rep; Agency details.
  - Temporal logic: Client date/rep date = admission (app logic); start <= end.
  - Dependency rules: If rep, require title; All rights listed (fixed).

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Client Name, Signatures, Agency Address/Phone.
  - Generalize: Dates to year.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Facility Name, Agency City/Zip.
  - Generalization/bucketing: Zip to region.
  - Tokenization: Pseudonym names.
  - k-anonymity & l-diversity targets: k=5; l=2.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Client Name | Tokenize | CLIENT_001 |
  | Signature | Suppress | [REDACTED] |
  | Date | Generalize | 2025 |
  | Agency Address | Suppress | [REDACTED] |
  | Agency Phone | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): Not Applicable.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Legal/Authorizations | Signatures |
  |---------------|--------------|----------------------|------------|
  | subscriber_owner | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W |
  | direct_support_staff | R | R | R |
  | read_only_auditor | R (masked) | R | R |
  | system_service | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask names/signatures; audit acknowledgments.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for names/signatures.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Client Name, Signatures.
- Logging & anomaly detection recommendations: Log acknowledgments; detect unsigned admissions.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - DDL for acknowledgments; acceptance: Stores signatures.
  - RLS enable; acceptance: Controls.
  - Validate signatures; acceptance: Requires date/title.
- **P2 (should)**
  - Masked views; acceptance: Redacts names.
  - De-ID script; acceptance: Tokenizes.
- **P3 (could)**
  - JSON exports; acceptance: Matches.
  - Agency lookup; acceptance: Pre-fills.

## 14. Open Questions / Assumptions
- Assumptions: Rights list fixed (1-18); form signed upon admission.
- Uncertainties: Communication method for clients with disabilities; if digital signatures allowed.
