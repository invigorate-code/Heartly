# Unusual Incident/Injury Report Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Unusual Incident/Injury Report
- Printed form code / number: LIC 624
- Revision / version date: 6/10
- Page count: 2
- Intended setting / regulatory context: Community care facilities licensed by the California Department of Social Services, Community Care Licensing Division. Used to report unusual incidents or injuries involving clients/residents, with requirements to notify licensing/placement agencies and responsible persons by next working day and submit written report within 7 days (Inferred from instructions and agency references).

## 2. Primary Purpose (1–3 sentences)
This form is used to document unusual incidents or injuries in community care facilities, including details on involved clients, incident type, description, treatment, actions taken, and notifications. It ensures timely reporting to licensing and placement agencies, responsible persons, and others to comply with regulations. The report must be retained in the client's file.

## 3. Secondary / Embedded Objectives
- Identify facility and involved clients for accountability.
- Classify incident type for categorization.
- Describe the incident and immediate actions for record.
- Document medical treatment if necessary.
- Record notifications to required parties.
- Provide administrator comments and follow-up for closure.

## 4. Field Inventory
- **Demographics**
  - Clients/Residents Involved: Name
  - Age
  - Sex
- **Identifiers**
  - Facility Name
  - Address
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - Date of Admission
- **Clinical/Medical**
  - Date Occurred
  - Type of Incident (enumerated checkboxes: Death, Injury/Illness, Medical Emergency)
  - Medical Treatment Necessary (checkbox YES/NO)
  - Nature of Treatment (free-text if YES)
  - Where Administered (free-text if YES)
  - Administered By (free-text if YES)
  - **Not on form (recommend adding)**: Specific diagnoses
- **Behavioral/Risk**
  - Type of Incident (enumerated checkboxes: Unauthorized Absence, Aggressive Act/Self, Aggressive Act/To Other, Aggressive Act/By Other, Alleged Violation of Rights, Suicide Attempt)
- **Functional/ADLs**
  - Not Applicable
- **Medications**
  - Not Applicable
- **Legal/Authorizations**
  - Type of Incident (enumerated checkboxes: Property Damage, Theft, Fire, Other)
- **Contacts & Providers**
  - Persons Notified: Name
  - Date (notified)
  - Time (notified)
  - By Whom (notified)
  - Enumerated categories: Licensing Agency, Placement Agency, Responsible Persons, Physician, Law Enforcement, Other
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Description of Incident
  - Immediate Action Taken
  - Administrator's Comments/Follow-up
- **Signatures**
  - Printed Name of Administrator/Designee
  - Signature
  - Date
- **Internal Use/Admin**
  - Not Applicable
- **[Repeating] Clients/Residents Involved Table**
  - Name
  - Date Occurred
  - Age
  - Sex
  - Date of Admission
- **[Repeating] Persons Notified Table**
  - Name
  - Date
  - Time
  - By Whom

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Facility Name | Identifiers | Admin | N | Low | N | Facility-level. |
| Address | Identifiers | Admin | N | Low | N | Facility address. |
| Name (client) | Demographics | Identifier | Y | High | N | Client name PHI. |
| Date Occurred | Clinical/Medical | Clinical | Y | Moderate | N | Incident date. |
| Age | Demographics | Clinical | Y | Moderate | N | Age quasi-identifier. |
| Sex | Demographics | Clinical | Y | Low | N | Enumerated. |
| Date of Admission | Placement/History | Admin | Y | Moderate | N | Admission date. |
| Type of Incident | Clinical/Medical | Clinical | Y | High | N | Enumerated types reveal health/behavior. |
| Description of Incident | Narrative/Free-Text | Narrative | Y | High | Y | Incident details leakage. |
| Medical Treatment Necessary | Clinical/Medical | Clinical | Y | Moderate | N | Yes/No. |
| Nature of Treatment | Clinical/Medical | Clinical | Y | High | Y | Treatment info. |
| Where Administered | Clinical/Medical | Clinical | Y | Moderate | Y | Location. |
| Administered By | Clinical/Medical | Clinical | Y | Moderate | Y | Provider. |
| Immediate Action Taken | Narrative/Free-Text | Narrative | Y | High | Y | Actions leakage. |
| Persons Notified Name | Contacts & Providers | Social | Y | Moderate | Y | Notified PII. |
| Date Notified | Contacts & Providers | Admin | N | Low | N | Notification date. |
| Time Notified | Contacts & Providers | Admin | N | Low | N | Notification time. |
| By Whom Notified | Contacts & Providers | Admin | Y | Moderate | Y | Notifier. |
| Administrator's Comments/Follow-up | Narrative/Free-Text | Narrative | Y | High | Y | Follow-up leakage. |
| Printed Name of Administrator/Designee | Signatures | Admin | Y | Moderate | N | Admin name. |
| Signature | Signatures | Admin | Y | Moderate | N | Authenticates. |
| Date (signature) | Signatures | Admin | N | Low | N | Signing date. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Client Name, Persons Notified Name, Admin Name.
  2. Dates: Date Occurred, Admission Date, Notified Date, Signature Date.
- High-sensitivity subsets: Type of Incident (death, suicide, aggression, rights violation), description/actions/comments (incident details, health/behavior).
- Third-party identifiers: Persons Notified, Administered By, By Whom.
- Free-text leakage risks: Description, Nature of Treatment, Immediate Action, Comments could include detailed PHI.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `facilities`: Reference for facility info (purpose: address/name).
  - `clients`: Core for resident (purpose: demographics).
  - `incidents`: Core transactional for incident report (purpose: details/treatment/actions).
  - `incident_types`: Reference for checkboxes (purpose: categories).
  - `notifications`: Reference for notified persons (purpose: repeating table).
- Relationships (text narrative): `incidents` 1:1 with `facilities`; 1:M with `clients` (multiple clients); `incident_types` M:M with `incidents`; `notifications` 1:M with `incidents`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Doe, John",
  "age": 75,
  "sex": "Male",
  "admission_date": "2024-01-01"
}
```

Example JSON for transactional entity (incident):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "facility_id": "fedcba98-7654-3210-9876-543210fedcba",
  "occurred_date": "2025-07-20",
  "description": "Fall in room",
  "medical_treatment": true,
  "treatment_nature": "Bandage"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
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

-- Clients
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    age integer,
    sex text,
    admission_date date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_clients_tenant_id ON clients (tenant_id);

-- Incidents
CREATE TABLE incidents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    occurred_date date NOT NULL,
    description text NOT NULL,
    medical_treatment boolean NOT NULL,
    treatment_nature text,
    treatment_where text,
    treatment_by text,
    immediate_action text,
    admin_comments text,
    admin_name text,
    admin_signature text,
    admin_date date,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_incidents_tenant_id ON incidents (tenant_id);
CREATE INDEX idx_incidents_facility_id ON incidents (facility_id);

-- Incident clients (repeating)
CREATE TABLE incident_clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    incident_id uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_incident_clients_tenant_id ON incident_clients (tenant_id);

-- Incident types (checkboxes)
CREATE TABLE incident_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    incident_id uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    type text CHECK (type IN ('Death', 'Injury/Illness', 'Medical Emergency', 'Unauthorized Absence', 'Aggressive Act/Self', 'Aggressive Act/To Other', 'Aggressive Act/By Other', 'Alleged Violation of Rights', 'Property Damage', 'Theft', 'Fire', 'Suicide Attempt', 'Other')), -- CHECK enum
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_incident_types_tenant_id ON incident_types (tenant_id);

-- Notifications (repeating)
CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    incident_id uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    notified_name text NOT NULL,
    notified_date date,
    notified_time text,
    notified_by text,
    category text CHECK (category IN ('Licensing Agency', 'Placement Agency', 'Responsible Persons', 'Physician', 'Law Enforcement', 'Other')),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_notifications_tenant_id ON notifications (tenant_id);

-- Strategy for enumerations: CHECK for type/category (fixed).
-- Optional partitioning note: Partition incidents by occurred_date if high volume.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE incidents ENABLE ROW LEVEL SECURITY; ALTER TABLE incident_clients ENABLE ROW LEVEL SECURITY; ALTER TABLE incident_types ENABLE ROW LEVEL SECURITY; ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications: Not Applicable.
  - For risk_assessments (map to behavioral types in incident_types):
    ```sql
    CREATE POLICY risk_policy ON incident_types
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            type NOT IN ('Aggressive Act/Self', 'Aggressive Act/To Other', 'Aggressive Act/By Other', 'Suicide Attempt')))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For notes/narratives (map to description in incidents):
    ```sql
    CREATE POLICY notes_policy ON incidents
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            description IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For description:
  ```sql
  CREATE VIEW masked_incidents AS
  SELECT id, tenant_id, facility_id, occurred_date,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE description END AS description,
         -- Similar for other narratives
  FROM incidents WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_incidents_active ON incidents (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_incident() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER incident_audit
  AFTER INSERT OR UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION audit_incident();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Ages (integer >0); Sex (M/F).
  - Enumerations: Type (checkboxes); Category (notified).
  - Required combinations: If medical treatment YES, require nature/where/by; At least one type checked.
  - Temporal logic: Occurred date <= signature date; Effective start <= end.
  - Dependency rules: If multiple clients, repeat rows; Notifications required for licensing etc.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Client Name, Notified Name, Admin Name, Description, Treatment Nature, Action, Comments.
  - Generalize: Dates to month/year; Age to buckets.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Age, Sex, Admission Date.
  - Generalization/bucketing: Age (10-year); Date (month).
  - Tokenization: Pseudonym names.
  - k-anonymity & l-diversity targets: k=5; l=2 for incident types.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Client Name | Tokenize | CLIENT_001 |
  | Date Occurred | Generalize | 2025-07 |
  | Description | Suppress | [REDACTED] |
  | Age | Bucket | 70-79 |
  | Admin Name | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): NLP for descriptions/comments (remove PHI); manual QA.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Clinical/Medical | Narrative/Free-Text | Signatures |
  |---------------|--------------|------------------|---------------------|------------|
  | subscriber_owner | R/W | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W | R/W |
  | direct_support_staff | R/W | R/W | R/W | R/W |
  | read_only_auditor | R (masked) | R (masked) | R (masked) | R |
  | system_service | R/W | R/W | R/W | R/W |
- First, the document is "SPECIAL INCIDENT REPORT.pdf", LIC 624, revision 6/10, for unusual incident/injury report.

From OCR: STATE OF CALIFORNIA - HEALTH AND HUMAN SERVICES AGENCY
CALIFORNIA DEPARTMENT OF SOCIAL SERVICES
COMMUNITY CARE LICENSING DIVISION
UNUSUAL INCIDENT/INJURY REPORT

Fields: Facility Name, Address, Telephone, Facility License Number

Clients/Residents Involved: Name, Date Occurred, Age, Sex, Date of Admission

Type of Incident: Death, Injury, Medical Emergency, Absence from Facility, Property Damage, Client/Resident Allegations of Abuse, Epidemic Outbreak, Poisonings, Catastrophes, Other

Description of Incident: (free-text)

Medical Treatment Necessary? Yes/No; If Yes, Nature of Treatment, Where Administered, Administered By

Agency or Person(s) Notified: Police/Fire, Paramedic/Ambulance, Licensing Agency, Placement Agency, Parent/Guardian/Authorized Representative, Other

Name, Title, Phone (for notified)

Administrative Action (free-text)

Prepared By, Title, Signature, Date

The OCR is garbled, but I can infer the standard LIC 624 form.

This is for reporting unusual incidents or injuries in community care facilities.

To analyze it.

No need for tools, as content is provided.

Output the Markdown.# Special Incident Report Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Unusual Incident/Injury Report
- Printed form code / number: LIC 624
- Revision / version date: 6/10
- Page count: 2
- Intended setting / regulatory context: Community care facilities licensed by the California Department of Social Services, Community Care Licensing Division. Used to report unusual incidents or injuries involving clients/residents, with notification to licensing/placement agencies and responsible persons within next working day, and written report within 7 days (Inferred from instructions and agency references).

## 2. Primary Purpose (1–3 sentences)
This form documents unusual incidents or injuries in community care facilities, including details of the event, involved parties, and actions taken. It ensures timely notification to authorities and responsible persons, and submission of a written report for regulatory compliance. The record must be retained in the client's file.

## 3. Secondary / Embedded Objectives
- Identify facility and involved clients/residents.
- Categorize the type of incident (e.g., death, injury, abuse).
- Describe the incident in detail.
- Indicate if medical treatment was necessary and details thereof.
- List agencies or persons notified.
- Outline administrative actions taken.

## 4. Field Inventory
- **Demographics**
  - Clients/Residents Involved: Name (Last/First/Middle)
  - Age
  - Sex
- **Identifiers**
  - Facility Name
  - Facility Address
  - Facility Telephone
  - Facility License Number
- **Benefits/Financial**
  - Not Applicable
- **Placement/History**
  - Date of Admission
- **Clinical/Medical**
  - Medical Treatment Necessary (checkbox YES/NO)
  - Nature of Treatment (if YES)
  - Where Administered
  - Administered By
  - **Not on form (recommend adding)**: Specific diagnoses
- **Behavioral/Risk**
  - Type of Incident (enumerated checkboxes: Death, Injury, Medical Emergency, Absence from Facility, Property Damage, Client/Resident Allegations of Abuse, Epidemic Outbreak, Poisonings, Catastrophes, Other)
- **Functional/ADLs**
  - Not Applicable
- **Medications**
  - Not Applicable
- **Legal/Authorizations**
  - Not Applicable
- **Contacts & Providers**
  - Agency or Person(s) Notified (enumerated checkboxes: Police/Fire, Paramedic/Ambulance, Licensing Agency, Placement Agency, Parent/Guardian/Authorized Representative, Other)
  - Name, Title, Phone (for notified persons)
- **Preferences (religious/dietary)**
  - Not Applicable
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Description of Incident
  - Administrative Action
- **Signatures**
  - Prepared By (name)
  - Title
  - Signature
  - Date
- **Internal Use/Admin**
  - Date Occurred
- **[Repeating] Clients/Residents Involved Table**
  - Name
  - Date Occurred
  - Age
  - Sex
  - Date of Admission

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Facility Name | Identifiers | Admin | N | Low | N | Facility info. |
| Facility Address | Identifiers | Admin | N | Low | N | Facility location. |
| Facility Telephone | Identifiers | Admin | N | Low | N | Facility contact. |
| Facility License Number | Identifiers | Admin | N | Low | N | License ID. |
| Name (clients) | Demographics | Identifier | Y | High | N | Client name. |
| Date Occurred | Internal Use/Admin | Admin | Y | Moderate | N | Incident date. |
| Age | Demographics | Clinical | Y | Moderate | N | Age PHI. |
| Sex | Demographics | Clinical | Y | Low | N | Sex. |
| Date of Admission | Placement/History | Admin | Y | Moderate | N | Admission date. |
| Type of Incident | Behavioral/Risk | Behavioral | Y | High | N | Enumerated incident type. |
| Description of Incident | Narrative/Free-Text | Narrative | Y | High | Y | Details leakage risk. |
| Medical Treatment Necessary | Clinical/Medical | Clinical | Y | High | N | Yes/No. |
| Nature of Treatment | Clinical/Medical | Clinical | Y | High | Y | Treatment details. |
| Where Administered | Clinical/Medical | Clinical | Y | Moderate | Y | Location. |
| Administered By | Clinical/Medical | Clinical | Y | Moderate | Y | Provider. |
| Agency or Person(s) Notified | Contacts & Providers | Social | Y | Moderate | N | Enumerated notified. |
| Name, Title, Phone (notified) | Contacts & Providers | Social | Y | High | Y | Contacts PII. |
| Administrative Action | Narrative/Free-Text | Narrative | Y | High | Y | Actions taken. |
| Prepared By | Signatures | Admin | Y | Moderate | N | Name. |
| Title | Signatures | Admin | N | Low | N | Title. |
| Signature | Signatures | Admin | Y | Moderate | N | Signature. |
| Date | Signatures | Admin | N | Low | N | Prep date. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  1. Names: Name (clients), Prepared By, Name (notified).
  2. Dates: Date Occurred, Date of Admission, Date (signature).
  3. Telephone numbers: Facility Telephone, Phone (notified).
  4. Addresses: Facility Address.
- High-sensitivity subsets: Incident type (abuse, death, medical), description (details of injury/abuse), treatment (health info).
- Third-party identifiers: Administered By, Agency/Person Notified (names/titles/phones).
- Free-text leakage risks: Description, Nature of Treatment, Administrative Action could include detailed PHI; Where Administered may reveal locations.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `facilities`: Reference for facility info (purpose: context).
  - `clients`: Core for resident details (purpose: demographics).
  - `incident_reports`: Core transactional for incident (purpose: main report).
  - `involved_clients`: Reference for repeating clients (purpose: multiple involved).
  - `notified_parties`: Reference for notified (purpose: contacts).
- Relationships (text narrative): `incident_reports` 1:1 with `facilities`; `involved_clients`, `notified_parties` 1:M with `incident_reports`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; license number natural unique.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "name": "Doe, John",
  "age": 75,
  "sex": "Male",
  "admission_date": "2024-01-01"
}
```

Example JSON for transactional entity (incident_report):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "facility_id": "fedcba98-7654-3210-9876-543210fedcba",
  "date_occurred": "2025-07-24",
  "incident_type": "Injury",
  "description": "Fell in bathroom"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Facilities
CREATE TABLE facilities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    address text,
    telephone text,
    license_number text UNIQUE NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_facilities_tenant_id ON facilities (tenant_id);

-- Clients
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    name text NOT NULL,
    age integer,
    sex text,
    admission_date date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_clients_tenant_id ON clients (tenant_id);

-- Incident reports
CREATE TABLE incident_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE RESTRICT,
    date_occurred date NOT NULL,
    incident_type text CHECK (incident_type IN ('Death', 'Injury', 'Medical Emergency', 'Absence from Facility', 'Property Damage', 'Client/Resident Allegations of Abuse', 'Epidemic Outbreak', 'Poisonings', 'Catastrophes', 'Other')), -- CHECK enum
    description text NOT NULL,
    medical_treatment boolean NOT NULL,
    treatment_nature text,
    treatment_where text,
    treatment_by text,
    administrative_action text,
    prepared_by text NOT NULL,
    title text NOT NULL,
    signature text NOT NULL,
    prep_date date NOT NULL,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_incident_reports_tenant_id ON incident_reports (tenant_id);
CREATE INDEX idx_incident_reports_facility_id ON incident_reports (facility_id);

-- Involved clients repeating
CREATE TABLE involved_clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    report_id uuid NOT NULL REFERENCES incident_reports(id) ON DELETE CASCADE,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_involved_clients_tenant_id ON involved_clients (tenant_id);

-- Notified parties repeating
CREATE TABLE notified_parties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    report_id uuid NOT NULL REFERENCES incident_reports(id) ON DELETE CASCADE,
    notified_type text CHECK (notified_type IN ('Police/Fire', 'Paramedic/Ambulance', 'Licensing Agency', 'Placement Agency', 'Parent/Guardian/Authorized Representative', 'Other')), -- CHECK enum
    name text,
    title text,
    phone text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_notified_parties_tenant_id ON notified_parties (tenant_id);

-- Strategy for enumerations: CHECK for incident_type, notified_type (fixed from form).
-- Optional partitioning note: Partition incident_reports by date_occurred range if high volume.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE facilities ENABLE ROW LEVEL SECURITY; ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY; ALTER TABLE involved_clients ENABLE ROW LEVEL SECURITY; ALTER TABLE notified_parties ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications: Not Applicable.
  - For risk_assessments (map to incident_type for behavioral like abuse):
    ```sql
    CREATE POLICY risk_policy ON incident_reports
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            incident_type NOT IN ('Client/Resident Allegations of Abuse')))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For notes/narratives (map to description in incident_reports):
    ```sql
    CREATE POLICY notes_policy ON incident_reports
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            description IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For description:
  ```sql
  CREATE VIEW masked_incidents AS
  SELECT id, tenant_id, facility_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE description END AS description,
         -- Similar
  FROM incident_reports WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_incident_reports_active ON incident_reports (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_incident() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER incident_audit
  AFTER INSERT OR UPDATE ON incident_reports
  FOR EACH ROW EXECUTE FUNCTION audit_incident();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Dates (YYYY-MM-DD); Ages (integer); Phones (formatted).
  - Enumerations: Incident Type (Death/Injury/etc.); Notified (Police/etc.); Sex (M/F).
  - Required combinations: If treatment YES, require nature/where/by; Description required.
  - Temporal logic: Date Occurred <= Prep Date; Admission < Occurred; effective_start <= end.
  - Dependency rules: If Abuse, notify licensing; Multiple clients require repeating rows.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Name, Description, Treatment Nature, Administrative Action.
  - Generalize: Dates to month/year; Age to buckets.
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Age, Sex, Incident Type.
  - Generalization/bucketing: Age (10-year); Type (group e.g., injury/abuse/other).
  - Tokenization: Pseudonym name.
  - k-anonymity & l-diversity targets: k=5; l=2 for type.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Name | Tokenize | CLIENT_001 |
  | Date Occurred | Generalize | 2025-07 |
  | Description | Suppress | [REDACTED] |
  | Age | Bucket | 70-79 |
  | Treatment Nature | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): NLP for descriptions; manual for sensitive.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Demographics | Clinical/Medical | Narrative/Free-Text | Admin (Signatures)|
  |---------------|--------------|------------------|---------------------|---------------------|
  | subscriber_owner | R/W | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W | R/W |
  | direct_support_staff | R/W | R/W | R/W | R/W |
  | read_only_auditor | R (masked) | R (masked) | R (masked) | R |
  | system_service | R/W | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Mask description/treatment; audit reports.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for description/treatment.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Description, Treatment Nature.
- Logging & anomaly detection recommendations: Log incident submissions; detect patterns like frequent injuries.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - DDL for incidents/notifications; acceptance: Stores repeating.
  - RLS enable; acceptance: Isolation.
  - Validate enums; acceptance: Rejects invalid type.
- **P2 (should)**
  - Masked views; acceptance: Redacts description.
  - De-ID script; acceptance: Suppresses narratives.
  - Auditing; acceptance: Logs.
- **P3 (could)**
  - JSON exports; acceptance: Matches.
  - Partitioning; acceptance: Improves.

## 14. Open Questions / Assumptions
- Assumptions: OCR garbled but standard LIC 624 fields inferred; repeating for multiple clients/notified.
- Uncertainties: Exact checkboxes; if other types added.
