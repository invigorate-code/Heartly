# Consent for Emergency Medical Treatment - Adult and Elderly Residential Facilities Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Consent for Emergency Medical Treatment - Adult and Elderly Residential Facilities
- Printed form code / number: LIC 627C
- Revision / version date: 4/00
- Page count: 1
- Intended setting / regulatory context: Adult and elderly residential facilities licensed by the California Department of Social Services, Community Care Licensing. Used to obtain consent from clients/residents or representatives for emergency medical or dental treatment (Inferred from form title and agency).

## 2. Primary Purpose (1–3 sentences)
This form documents consent for emergency medical or dental treatment in adult and elderly residential facilities, authorizing care by licensed physicians, osteopaths, or dentists. It includes client identification, allergies, and contact information to facilitate quick response in emergencies. The form ensures legal authorization and is marked confidential.

## 3. Secondary / Embedded Objectives
- Identify the facility and client for treatment purposes.
- List medication allergies to inform emergency care.
- Obtain signature from client, authorized representative, or conservator.
- Provide home and work contact details for follow-up.

## 4. Field Inventory
- **Demographics**
  - Client Name
- **Identifiers**
  - Facility Name
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - Not Applicable
- **Clinical/Medical**
  - Client has the following medication allergies (free-text list)
- **Behavioral/Risk**
  - Not Applicable
- **Functional/ADLs**
  - Not Applicable
- **Medications**
  - Not Applicable
- **Legal/Authorizations**
  - Consent for emergency medical or dental treatment (statement)
  - Title (enumerated to circle: Client, Authorized Representative, Conservator)
- **Contacts & Providers**
  - Home Address
  - Home Phone
  - Work Phone
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Not Applicable
- **Signatures**
  - Signature (of Client/Authorized Representative/Conservator)
  - Date
- **Internal Use/Admin**
  - Not Applicable

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Facility Name | Identifiers | Admin | N | Low | N | Facility info. |
| Client Name | Demographics | Identifier | Y | High | N | Name PHI. |
| Medication Allergies | Clinical/Medical | Clinical | Y | High | Y | Allergy details. |
| Title | Legal/Authorizations | Admin | N | Low | N | Enumerated circle. |
| Signature | Signatures | Admin | Y | Moderate | N | Authenticates. |
| Date | Signatures | Admin | N | Low | N | Signature date. |
| Home Address | Contacts & Providers | Identifier | Y | High | N | Address PHI. |
| Home Phone | Contacts & Providers | Identifier | Y | High | N | Phone PHI. |
| Work Phone | Contacts & Providers | Identifier | Y | High | N | Phone PHI. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Client Name.
  2. Addresses: Home Address.
  3. Telephone numbers: Home Phone, Work Phone.
- High-sensitivity subsets: Medication allergies (health conditions).
- Third-party identifiers: None explicit.
- Free-text leakage risks: Allergies field could include detailed medical info.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for client details (purpose: demographics/contacts).
  - `consents`: Core transactional for consent (purpose: emergency authorization).
- Relationships (text narrative): `consents` 1:1 with `clients`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; no natural.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Doe, John",
  "home_address": "123 Main St",
  "home_phone": "555-1234"
}
```

Example JSON for transactional entity (consent):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "facility_name": "Care Facility XYZ",
  "med_allergies": "Penicillin",
  "title": "Client",
  "signature": "John Doe",
  "date": "2025-07-24"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Clients
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    home_address text,
    home_phone text,
    work_phone text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_clients_tenant_id ON clients (tenant_id);

-- Consents
CREATE TABLE consents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    facility_name text NOT NULL,
    med_allergies text,
    title text CHECK (title IN ('Client', 'Authorized Representative', 'Conservator')), -- CHECK enum
    signature text NOT NULL,
    consent_date date NOT NULL,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_consents_tenant_id ON consents (tenant_id);
CREATE INDEX idx_consents_client_id ON consents (client_id);
CREATE INDEX idx_consents_effective ON consents (effective_start, effective_end);

-- Strategy for enumerations: CHECK for title (fixed options).
-- Optional partitioning note: Not applicable (low volume).
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE consents ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications: Not Applicable.
  - For risk_assessments: Not Applicable.
  - For notes/narratives (map to med_allergies in consents):
    ```sql
    CREATE POLICY notes_policy ON consents
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            med_allergies IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For med_allergies:
  ```sql
  CREATE VIEW masked_consents AS
  SELECT id, tenant_id, client_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE med_allergies END AS med_allergies
  FROM consents WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_consents_active ON consents (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_consent() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER consent_audit
  AFTER INSERT OR UPDATE ON consents
  FOR EACH ROW EXECUTE FUNCTION audit_consent();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Names/text; Phones (formatted).
  - Enumerations: Title (Client, Authorized Representative, Conservator).
  - Required combinations: Signature and date required; Title circled.
  - Temporal logic: Consent date >= effective_start; start <= end.
  - Dependency rules: If conservator, verify legal status (app logic).

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Client Name, Signature, Allergies, Address, Phones.
  - Generalize: None needed (minimal dates).
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Facility Name.
  - Generalization/bucketing: None.
  - Tokenization: Pseudonym name.
  - k-anonymity & l-diversity targets: k=5; l=2.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Client Name | Tokenize | CLIENT_001 |
  | Medication Allergies | Suppress | [REDACTED] |
  | Home Address | Suppress | [REDACTED] |
  | Home Phone | Suppress | [REDACTED] |
  | Signature | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): Scrub allergies for details; manual QA.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Clinical/Medical | Signatures |
  |---------------|--------------|------------------|------------|
  | subscriber_owner | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W |
  | direct_support_staff | R | R/W | R/W |
  | read_only_auditor | R (masked) | R (masked) | R |
  | system_service | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask allergies; audit signatures.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for allergies/phones.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Allergies, address, phones.
- Logging & anomaly detection recommendations: Log consent updates; detect unsigned.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - DDL for consents; acceptance: Stores signatures.
  - RLS enable; acceptance: Controls.
  - Validate title; acceptance: Enforces enum.
- **P2 (should)**
  - Masked views; acceptance: Redacts allergies.
  - De-ID script; acceptance: Suppresses.
  - Auditing; acceptance: Logs.
- **P3 (could)**
  - JSON exports; acceptance: Matches.
  - Title dropdown; acceptance: UI.

## 14. Open Questions / Assumptions
- Assumptions: Form for adults/elderly; circle for title is enumerated.
- Uncertainties: If allergies list structured; additional sections in full PDF.
