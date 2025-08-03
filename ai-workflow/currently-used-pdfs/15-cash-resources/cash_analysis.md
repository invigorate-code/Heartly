# Affidavit Regarding Client/Resident Cash Resources Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Affidavit Regarding Client/Resident Cash Resources
- Printed form code / number: LIC 400
- Revision / version date: Not Visible
- Page count: 1
- Intended setting / regulatory context: Community care facilities licensed by the California Department of Social Services, Community Care Licensing Division, including Community Care Facilities (CCFs), Residential Care Facilities for the Elderly (RCFEs), and Residential Care Facilities for the Chronically Ill (RCF-CIs). Used to certify compliance with statutory bonding requirements for handling client/resident cash resources under California Health and Safety Code Sections 1560, 1568.021, and 1569.60 (Inferred from form content and statutory references).

## 2. Primary Purpose (1–3 sentences)
This form certifies whether a licensed facility needs a surety bond for handling client/resident cash resources and, if so, the required bond amount based on monthly cash handled. It ensures facilities comply with state laws by declaring the maximum cash managed and committing to safeguards and record-keeping. The affidavit is required for new applications, license renewals, or when reevaluating bonding needs.

## 3. Secondary / Embedded Objectives
- Declare the number of clients/residents in categories (children, adults, elderly) to assess bonding applicability.
- Specify if cash resources are handled and the maximum monthly amount.
- Calculate and state the required bond amount using the provided table.
- Certify ongoing compliance, including submitting new affidavits/bonds if cash handling increases.
- Affirm maintenance of safeguards and accurate records per regulations.
- Declare under penalty of perjury, with signatures for accountability.

## 4. Field Inventory
- **Demographics**
  - Not Applicable
- **Identifiers**
  - Name(s) of Applicant(s)/Licensee(s)
  - Facility Name
  - Facility Location: Street
  - Facility Location: City
  - Facility Location: County
  - License Number (if licensed)
- **Benefits/Financial**
  - Number of Children (0-17 years of age)
  - Number of Adults (clients) (18-59 years of age)
  - Number of Elderly (residents) (60 years and older)
  - Maximum amount of cash resources handled at any one time monthly ($)
  - Will not handle any cash resources (checkbox alternative)
  - Bond Amount Needed ($)
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
  - Certification Statements (checkboxes or implied yes for: submit new affidavit/bond if excess, maintain safeguards/records, maintain bond)
  - Declaration under penalty of perjury
- **Contacts & Providers**
  - Not Applicable
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Not Applicable
- **Signatures**
  - Signature of Applicant or Licensee
  - Date
- **Internal Use/Admin**
  - Not Applicable
- **[Repeating] Bond Coverage Table** (fixed reference table, not fillable)
  - Amount Safeguarded Per Month
  - Bond Required

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Name(s) of Applicant(s)/Licensee(s) | Identifiers | Admin | Y | Moderate | Y | Licensee PII. |
| Facility Name | Identifiers | Admin | N | Low | N | Facility ID. |
| Facility Location: Street | Identifiers | Admin | N | Low | N | Facility address. |
| Facility Location: City | Identifiers | Admin | N | Low | N | Facility city. |
| Facility Location: County | Identifiers | Admin | N | Low | N | Facility county. |
| License Number | Identifiers | Admin | N | Low | N | License ID. |
| Number of Children | Benefits/Financial | Admin | N | Low | N | Client count. |
| Number of Adults | Benefits/Financial | Admin | N | Low | N | Client count. |
| Number of Elderly | Benefits/Financial | Admin | N | Low | N | Client count. |
| Maximum cash handled monthly | Benefits/Financial | Financial | N | Low | N | Cash amount. |
| Will not handle cash | Benefits/Financial | Financial | N | Low | N | Checkbox. |
| Bond Amount Needed | Benefits/Financial | Financial | N | Low | N | Bond $. |
| Certification Statements | Legal/Authorizations | Admin | N | Low | N | Compliance certs. |
| Declaration under penalty | Legal/Authorizations | Admin | N | Low | N | Perjury statement. |
| Signature of Applicant/Licensee | Signatures | Admin | Y | Moderate | N | Signature. |
| Date | Signatures | Admin | N | Low | N | Signature date. |
| Amount Safeguarded Per Month | [Repeating] Bond Table | Financial | N | Low | N | Table reference. |
| Bond Required | [Repeating] Bond Table | Financial | N | Low | N | Table reference. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  None (no personal health info; form is administrative/financial for facilities).
- High-sensitivity subsets: None (financial bonding; no clinical data).
- Third-party identifiers: None.
- Free-text leakage risks: None (no free-text fields).

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `licensees`: Core for applicant/licensee info (purpose: signers).
  - `facilities`: Reference for facility details (purpose: location/bonding).
  - `affidavits`: Core transactional for affidavit (purpose: certification/bond).
- Relationships (text narrative): `affidavits` 1:1 with `licensees` and `facilities`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; license_number natural unique.

Example JSON for primary entity (facility):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Sample Facility",
  "street": "123 Main St",
  "city": "Anytown",
  "county": "Sample County"
}
```

Example JSON for transactional entity (affidavit):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "facility_id": "123e4567-e89b-12d3-a456-426614174000",
  "licensee_name": "John Doe",
  "num_children": 0,
  "num_adults": 5,
  "num_elderly": 10,
  "max_cash_monthly": 400,
  "bond_needed": 1000,
  "signature": "John Doe",
  "date": "2025-07-24"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Licensees
CREATE TABLE licensees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_licensees_tenant_id ON licensees (tenant_id);

-- Facilities
CREATE TABLE facilities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    street text,
    city text,
    county text,
    license_number text UNIQUE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_facilities_tenant_id ON facilities (tenant_id);

-- Affidavits
CREATE TABLE affidavits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    licensee_id uuid NOT NULL REFERENCES licensees(id) ON DELETE CASCADE,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    num_children integer DEFAULT 0,
    num_adults integer DEFAULT 0,
    num_elderly integer DEFAULT 0,
    max_cash_monthly numeric,
    no_cash_handled boolean DEFAULT false,
    bond_needed numeric,
    submit_new_if_excess boolean DEFAULT true,
    maintain_safeguards boolean DEFAULT true,
    maintain_bond boolean DEFAULT true,
    signature text NOT NULL,
    date date NOT NULL,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_affidavits_tenant_id ON affidavits (tenant_id);

-- Strategy for enumerations: Booleans for certifications (implied yes).
-- Optional partitioning note: Not applicable (low volume; one per facility/license cycle).
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE licensees ENABLE ROW LEVEL SECURITY; ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE affidavits ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients: Not Applicable (no clients; licensees/facilities).
  - For medications: Not Applicable.
  - For risk_assessments: Not Applicable.
  - For notes/narratives: Not Applicable (no narratives).
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): No high-sensitive like SSN; for signature:
  ```sql
  CREATE VIEW masked_affidavits AS
  SELECT id, tenant_id, licensee_id, facility_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE signature END AS signature
  FROM affidavits WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_affidavits_active ON affidavits (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_affidavit() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER affidavit_audit
  AFTER INSERT OR UPDATE ON affidavits
  FOR EACH ROW EXECUTE FUNCTION audit_affidavit();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Numbers for client counts/bond/cash; Date (YYYY-MM-DD).
  - Enumerations: None.
  - Required combinations: If cash handled, require max amount/bond; Signature/date required.
  - Temporal logic: Date = submission; effective_start <= end.
  - Dependency rules: Bond amount from table based on max cash; If no cash, no bond.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Licensee Name, Signature.
  - Generalize: Date to year; Cash/Bond to ranges.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Facility City/County, Client Counts.
  - Generalization/bucketing: Counts (0-10, 11+); Cash (buckets per table).
  - Tokenization: Pseudonym names.
  - k-anonymity & l-diversity targets: k=5; l=2.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Licensee Name | Tokenize | LICENSEE_001 |
  | Signature | Suppress | [REDACTED] |
  | Date | Generalize | 2025 |
  | Max Cash Monthly | Bucket | 751-1500 |
  | Bond Needed | Bucket | 2000 |
- Handling of free-text (NLP scrubbing, manual QA): Not Applicable.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Identifiers | Financial | Signatures |
  |---------------|-------------|-----------|------------|
  | subscriber_owner | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W |
  | direct_support_staff | R | R | R |
  | read_only_auditor | R (masked) | R | R (masked) |
  | system_service | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask signatures; audit submissions.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for financial amounts.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Signature, Cash amounts.
- Logging & anomaly detection recommendations: Log affidavit submissions; detect bond changes.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - DDL for affidavits; acceptance: Calculates bond from cash.
  - RLS enable; acceptance: Controls.
  - Validate bond table; acceptance: Matches amounts.
- **P2 (should)**
  - Masked views; acceptance: Redacts signatures.
  - De-ID script; acceptance: Buckets cash.
- **P3 (could)**
  - JSON exports; acceptance: Matches.
  - Auto-bond calculator; acceptance: Computes.

## 14. Open Questions / Assumptions
- Assumptions: Form for all CCF/RCFE/RCF-CI; client counts for bonding calculation.
- Uncertainties: If children/adults/elderly overlap; exact revision.