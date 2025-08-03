# Physician’s Report for Community Care Facilities Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Physician’s Report for Community Care Facilities
- Printed form code / number: LIC 602
- Revision / version date: 7/22
- Page count: 4
- Intended setting / regulatory context: Community care facilities licensed by the California Department of Social Services, Health & Human Services Agency. Completed by a physician to assess a client/resident's physical and mental health status, ambulatory ability, self-care capacity, and medication needs for admission or ongoing care (Inferred from form content and agency references).

## 2. Primary Purpose (1–3 sentences)
This form is used by physicians to report on a client/resident's health status, including contagious diseases, allergies, ambulatory capabilities, impairments, mental condition, self-care abilities, and approved over-the-counter medications. It ensures facilities can determine suitability for placement and provide appropriate care without skilled nursing. The report supports regulatory compliance for fire clearance and health management in community care settings.

## 3. Secondary / Embedded Objectives
- Identify contagious or infectious diseases and allergies with treatments.
- Assess ambulatory status for emergency evacuation and fire clearance purposes.
- Evaluate physical health impairments and assistive devices needed.
- Gauge mental health issues like confusion or depression.
- Determine capacity for self-care in daily activities and medication management.
- List approved OTC medications for common conditions.

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
  - Other Contagious/Infectious Diseases (checkbox YES/NO; if YES, list below)
  - Treatment/Medication (for contagious diseases; free-text)
  - Allergies (checkbox YES/NO; if YES, list below)
  - Treatment/Medication (for allergies; free-text)
  - Physical Health Status (enumerated: Good, Fair, Poor)
  - Auditory impairment (checkbox YES/NO; assistive device; comments)
  - Visual impairment (checkbox YES/NO; assistive device; comments)
  - Wears dentures (checkbox YES/NO; assistive device; comments)
  - Special Diet (checkbox YES/NO; assistive device; comments)
  - Substance abuse problem (checkbox YES/NO; assistive device; comments)
  - Bowel impairment (checkbox YES/NO; assistive device; comments)
  - Bladder impairment (checkbox YES/NO; assistive device; comments)
  - Motor impairment (checkbox YES/NO; assistive device; comments)
  - Requires continuous bed care (checkbox YES/NO; assistive device; comments)
  - **Not on form (recommend adding)**: Specific diagnoses (beyond impairments)
- **Behavioral/Risk**
  - Confused (checkbox Problem/Occasional/Frequent; comments if exists)
  - Able to follow instructions (checkbox YES/NO; comments if problem)
  - Depressed (checkbox Problem/Occasional/Frequent; comments if exists)
  - Able to communicate (checkbox YES/NO; comments if problem)
  - Needs constant supervision (checkbox YES/NO; comments)
- **Functional/ADLs**
  - Able to independently transfer to and from bed (checkbox YES/NO)
  - For purposes of fire clearance, this person is considered (enumerated: Ambulatory, Nonambulatory, Bedridden)
  - Able to care for all personal needs (checkbox YES/NO; comments)
  - Bathes self (checkbox YES/NO; comments)
  - Dresses self (checkbox YES/NO; comments)
  - Feeds self (checkbox YES/NO; comments)
  - Cares for his/her own toilet (checkbox YES/NO; comments)
  - Able to leave facility unassisted (checkbox YES/NO; comments)
  - Able to move without assistance (checkbox YES/NO; comments)
- **Medications**
  - Can administer and store medications (checkbox YES/NO; comments)
  - Currently taking prescribed medications (checkbox YES/NO; comments)
  - **Not on form (recommend adding)**: Prescribed Medication Name
  - **Not on form (recommend adding)**: Dosage
  - **Not on form (recommend adding)**: Route
  - **Not on form (recommend adding)**: Frequency
- **Legal/Authorizations**
  - Not Applicable
- **Contacts & Providers**
  - Not Applicable
- **Preferences (religious/dietary)**
  - Special Diet (repeated in Clinical/Medical)
  - **Not on form (recommend adding)**: Religious affiliation
  - **Not on form (recommend adding)**: Dietary restrictions (beyond special diet)
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Comments (for physical health status)
  - Comments (for each impairment/assistive device)
  - Comments (for mental health status)
  - Comments (for each self-care item)
- **Signatures**
  - Not Applicable (No signatures visible in OCR; inferred physician signature may be on full form)
- **Internal Use/Admin**
  - Able to manage own cash resources (checkbox YES/NO; comments)
- **[Repeating] OTC Medications Table**
  - Conditions (pre-filled: Headache, Constipation, Diarrhea, Indigestion, Others (specify condition))
  - Over-the-Counter Medication(s) (free-text)

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Contagious/Infectious Diseases | Clinical/Medical | Clinical | Y | High | Y | Yes/No with list; communicable health. |
| Treatment/Medication (diseases) | Clinical/Medical | Clinical | Y | High | Y | Free-text; treatment details. |
| Allergies | Clinical/Medical | Clinical | Y | High | Y | Yes/No with list; allergy PHI. |
| Treatment/Medication (allergies) | Clinical/Medical | Clinical | Y | High | Y | Free-text; meds. |
| Able to transfer bed | Functional/ADLs | Clinical | Y | Moderate | N | Yes/No; mobility. |
| Fire clearance status | Functional/ADLs | Clinical | Y | Moderate | N | Enumerated; evacuation ability. |
| Physical Health Status | Clinical/Medical | Clinical | Y | Moderate | N | Enumerated good/fair/poor. |
| Auditory impairment | Clinical/Medical | Clinical | Y | Moderate | Y | Yes/No with device/comments. |
| Visual impairment | Clinical/Medical | Clinical | Y | Moderate | Y | Yes/No with device/comments. |
| Wears dentures | Clinical/Medical | Clinical | Y | Low | Y | Yes/No with device/comments. |
| Special Diet | Preferences | Preference | Y | Moderate | Y | Yes/No with device/comments. |
| Substance abuse problem | Clinical/Medical | Behavioral | Y | High | Y | Yes/No with device/comments. |
| Bowel impairment | Clinical/Medical | Clinical | Y | High | Y | Yes/No with device/comments. |
| Bladder impairment | Clinical/Medical | Clinical | Y | High | Y | Yes/No with device/comments. |
| Motor impairment | Clinical/Medical | Clinical | Y | Moderate | Y | Yes/No with device/comments. |
| Requires continuous bed care | Clinical/Medical | Clinical | Y | High | Y | Yes/No with device/comments. |
| Comments (physical) | Narrative/Free-Text | Narrative | Y | High | Y | Free-text leakage. |
| Confused | Behavioral/Risk | Behavioral | Y | High | Y | Problem scale with comments. |
| Able to follow instructions | Behavioral/Risk | Behavioral | Y | Moderate | Y | Yes/No with comments. |
| Depressed | Behavioral/Risk | Behavioral | Y | High | Y | Problem scale with comments. |
| Able to communicate | Behavioral/Risk | Behavioral | Y | Moderate | Y | Yes/No with comments. |
| Comments (mental) | Narrative/Free-Text | Narrative | Y | High | Y | Free-text. |
| Able to care personal needs | Functional/ADLs | Clinical | Y | Moderate | Y | Yes/No with comments. |
| Can administer medications | Medications | Clinical | Y | High | Y | Yes/No with comments. |
| Needs constant supervision | Behavioral/Risk | Behavioral | Y | High | Y | Yes/No with comments. |
| Taking prescribed meds | Medications | Clinical | Y | High | Y | Yes/No with comments. |
| Bathes self | Functional/ADLs | Clinical | Y | Moderate | Y | Yes/No with comments. |
| Dresses self | Functional/ADLs | Clinical | Y | Moderate | Y | Yes/No with comments. |
| Feeds self | Functional/ADLs | Clinical | Y | Moderate | Y | Yes/No with comments. |
| Cares for toilet | Functional/ADLs | Clinical | Y | High | Y | Yes/No with comments. |
| Leave facility unassisted | Functional/ADLs | Clinical | Y | Moderate | Y | Yes/No with comments. |
| Move without assistance | Functional/ADLs | Clinical | Y | Moderate | Y | Yes/No with comments. |
| Manage cash resources | Internal Use/Admin | Financial | Y | Moderate | Y | Yes/No with comments. |
| Conditions (OTC) | [Repeating] OTC Table | Clinical | N | Low | N | Pre-filled. |
| OTC Medication(s) | [Repeating] OTC Table | Clinical | Y | High | Y | Free-text meds. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  No direct names, dates, addresses, etc., visible; but comments/free-text could embed them (e.g., treatment details with dates).
- High-sensitivity subsets: Contagious diseases (communicable), allergies, substance abuse, depression/confusion (behavioral/mental health), bowel/bladder (continence), OTC meds (imply conditions).
- Third-party identifiers: None explicit.
- Free-text leakage risks: Comments, treatment/medication lists, OTC specifics could include PHI like detailed conditions or names; attachments not mentioned but recommend scrubbing.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for linking (purpose: associate report to resident).
  - `physician_reports`: Core transactional for overall status (purpose: store ambulatory, health ratings).
  - `impairments`: Reference for physical/mental checkboxes (purpose: itemized yes/no with comments).
  - `self_care_capacities`: Reference for self-care items (purpose: yes/no with comments).
  - `otc_medications`: Reference for repeating table (purpose: condition-med pairs).
- Relationships (text narrative): `physician_reports` 1:1 with `clients`; `impairments`, `self_care_capacities`, `otc_medications` 1:M with `physician_reports`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; no natural keys.

Example JSON for primary entity (client):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543"
}
```

Example JSON for transactional entity (physician_report):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "physical_status": "Good",
  "fire_clearance_status": "Ambulatory"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Client core (minimal)
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_clients_tenant_id ON clients (tenant_id);

-- Physician reports
CREATE TABLE physician_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    contagious_diseases boolean,
    contagious_list text,
    contagious_treatment text,
    allergies boolean,
    allergies_list text,
    allergies_treatment text,
    able_transfer_bed boolean,
    fire_clearance_status text CHECK (fire_clearance_status IN ('Ambulatory', 'Nonambulatory', 'Bedridden')), -- Enum CHECK
    physical_health_status text CHECK (physical_health_status IN ('Good', 'Fair', 'Poor')),
    mental_confused text CHECK (mental_confused IN ('Problem', 'Occasional', 'Frequent', 'No')),
    mental_follow_instructions boolean,
    mental_depressed text CHECK (mental_depressed IN ('Problem', 'Occasional', 'Frequent', 'No')),
    mental_communicate boolean,
    self_care_personal_needs boolean,
    self_care_admin_medications boolean,
    self_care_constant_supervision boolean,
    self_care_taking_prescribed boolean,
    self_care_bathes boolean,
    self_care_dresses boolean,
    self_care_feeds boolean,
    self_care_toilet boolean,
    self_care_leave_unassisted boolean,
    self_care_move_without_assist boolean,
    self_care_manage_cash boolean,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_physician_reports_tenant_id ON physician_reports (tenant_id);
CREATE INDEX idx_physician_reports_client_id ON physician_reports (client_id);
CREATE INDEX idx_physician_reports_effective ON physician_reports (effective_start, effective_end);

-- Impairments (physical/mental comments combined)
CREATE TABLE impairments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    report_id uuid NOT NULL REFERENCES physician_reports(id) ON DELETE CASCADE,
    type text NOT NULL, -- e.g., 'auditory', 'confused'
    has_impairment boolean,
    assistive_device text,
    comments text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_impairments_tenant_id ON impairments (tenant_id);

-- OTC medications repeating
CREATE TABLE otc_medications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    report_id uuid NOT NULL REFERENCES physician_reports(id) ON DELETE CASCADE,
    condition text NOT NULL CHECK (condition IN ('Headache', 'Constipation', 'Diarrhea', 'Indigestion', 'Others')), -- CHECK for fixed
    medication text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_otc_medications_tenant_id ON otc_medications (tenant_id);

-- Strategy for enumerations: CHECK for status scales (fixed options); text for comments (flexible).
-- Optional partitioning note: Partition physician_reports by effective_start if multiple reports per client over time.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE physician_reports ENABLE ROW LEVEL SECURITY; ALTER TABLE impairments ENABLE ROW LEVEL SECURITY; ALTER TABLE otc_medications ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications (map to otc_medications):
    ```sql
    CREATE POLICY medications_policy ON otc_medications
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service'))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For risk_assessments (map to mental/behavioral in physician_reports):
    ```sql
    CREATE POLICY risk_policy ON physician_reports
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            (current_setting('app.role') = 'read_only_auditor' AND mental_confused = 'No' AND mental_depressed = 'No')))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For notes/narratives (map to comments in impairments):
    ```sql
    CREATE POLICY notes_policy ON impairments
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            (current_setting('app.role') = 'read_only_auditor' AND comments IS NULL)))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For contagious_list:
  ```sql
  CREATE VIEW masked_reports AS
  SELECT id, tenant_id, client_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE contagious_list END AS contagious_list,
         -- Similar for other sensitive
  FROM physician_reports WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_physician_reports_active ON physician_reports (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_report() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER report_audit
  AFTER INSERT OR UPDATE ON physician_reports
  FOR EACH ROW EXECUTE FUNCTION audit_report();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Booleans for yes/no; Text for lists/comments.
  - Enumerations: Physical status (Good/Fair/Poor); Fire status (Ambulatory/Nonambulatory/Bedridden); Mental scales (Problem/Occasional/Frequent/No); Condition (Headache/etc.).
  - Required combinations: If YES for diseases/allergies/impairments, require list/comments; If Problem for mental, require comments.
  - Temporal logic: effective_start <= effective_end.
  - Dependency rules: If Nonambulatory/Bedridden, flag self-care move/leave as No; If taking prescribed, recommend meds list (though not on form).

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Contagious/allergies lists, treatments, comments (free-text).
  - Generalize: Status to categories (e.g., impairment yes/no without type).
- **Expert Determination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Physical status, fire clearance, impairments count.
  - Generalization/bucketing: Health status (good/poor); Impairments (0-3, 4+).
  - Tokenization: None (no names).
  - k-anonymity & l-diversity targets: k=5; l=2 for behavioral.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------ First, the user uploaded "PHYSICIAN’S REPORT FOR COMMUNITY CARE FACILITIES.pdf", LIC 602 (7/22), 4 pages.

The OCR content has many typos, like "Inffectious" for "Infectious", "Confured" for "Confused", etc. I need to infer the correct fields.

This is a physician's report form for community care facilities.

To analyze it per the prompt.

But the query is just the document and "Refer to the following content:", but it's cut off. Wait, the message ends with "Refer to the following content:", but then the document is provided.

The current date is July 24, 2025.

Tools are listed, but for this, since it's uploaded PDF, I can analyze directly.

The prompt is to produce the Markdown analysis.

But wait, the user question is the document, and "Refer to the following content:", but perhaps it's to analyze this form.

Similar to previous.

I need to produce the # Physician’s Report for Community Care Facilities Analysis

Canonical title: Physician’s Report for Community Care Facilities

Code: LIC 602

Revision: 7/22

Page count: 4

Intended: California Department of Social Services, for physician assessment of client/resident health for community care facilities.

Primary purpose: Physician's evaluation of physical/mental health, ambulatory status, self-care capacity, diseases, allergies, etc.

Fields: Other Contagious/Infectious Diseases (yes/no, list)

Treatment/Medication (free-text)

Allergies (yes/no, list)

Treatment/Medication

Ambulatory: able to transfer independently (yes/no)

For fire clearance: Ambulatory, Nonambulatory, Bedridden (with definitions)

Physical Health Status: Good, Fair, Poor

Comments

Assistive Device: Auditory impairment (yes/no, comments)

Visual, Dentures, Special Diet, Substance abuse, Bowel, Bladder, Motor impairment, Continuous bed care

Mental Health: Confused (no, occasional, frequent, comments)

Able to follow instructions, Depressed, Able to communicate

Capacity for Self Care: Able to care for all personal needs (yes/no, comments)

Can administer/store medications, Needs constant supervision, Currently taking prescribed meds, Bathes self, Dresses self, Feeds self, Cares for toilet, Able to leave unassisted, Able to move without assistance, Able to manage own cash

Then [Repeating] Over-the-counter medication table: Conditions (Headache, Constipation, Diarrhea, Indigestion, Others specify), Over-the-counter medication(s)

The table is repeating for conditions.

OCR has repeated "1. Headache 2. Constipation..." many times, probably a scanning error, but it's a table with those conditions.

Now, for analysis, similar structure.

No need for tools, as content is provided.

Output the Markdown.# Physician’s Report for Community Care Facilities Analysis

## 1. Form Identification & Metadata
- Canonical title (normalized): Physician’s Report for Community Care Facilities
- Printed form code / number: LIC 602
- Revision / version date: 7/22
- Page count: 4
- Intended setting / regulatory context: Community care facilities licensed by the California Department of Social Services, Health & Human Services Agency. Used for physician assessment of client/resident's physical, mental, and functional health status to determine suitability for placement and fire clearance (Inferred from content and agency references).

## 2. Primary Purpose (1–3 sentences)
This form is completed by a physician to report on a client/resident's health status, including contagious diseases, allergies, ambulatory ability, physical/mental conditions, and self-care capacity. It aids in determining if the individual can be safely placed in a non-medical community care facility and complies with regulations for fire safety and care needs. It also lists approved over-the-counter medications for common conditions.

## 3. Secondary / Embedded Objectives
- Identify contagious/infectious diseases and allergies with treatments.
- Assess ambulatory status for fire clearance and emergency evacuation.
- Evaluate physical health impairments and assistive needs.
- Assess mental health issues like confusion or depression.
- Determine capacity for self-care and independence in ADLs.
- Specify over-the-counter medications for minor conditions.

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
  - Other Contagious/Infectious Diseases (checkbox YES/NO; if YES, list below)
  - Treatment/Medication (for diseases; free-text)
  - Allergies (checkbox YES/NO; if YES, list below)
  - Treatment/Medication (for allergies; free-text)
  - Physical Health Status (enumerated: Good, Fair, Poor)
  - Comments (for physical health; free-text)
  - Auditory impairment (checkbox YES/NO; assistive device comments free-text)
  - Visual impairment (checkbox YES/NO; assistive device comments free-text)
  - Wears dentures (checkbox YES/NO; comments free-text)
  - Special Diet (checkbox YES/NO; comments free-text)
  - Substance abuse problem (checkbox YES/NO; comments free-text)
  - Bowel impairment (checkbox YES/NO; comments free-text)
  - Bladder impairment (checkbox YES/NO; comments free-text)
  - Motor impairment (checkbox YES/NO; comments free-text)
  - Requires continuous bed care (checkbox YES/NO; comments free-text)
- **Behavioral/Risk**
  - Confused (enumerated: No Problem, Occasional, Frequent; comments free-text)
  - Depressed (enumerated: No Problem, Occasional, Frequent; comments free-text)
- **Functional/ADLs**
  - This person is able to independently transfer to and from bed (checkbox YES/NO)
  - For purposes of a fire clearance, this person is considered (enumerated: Ambulatory, Nonambulatory, Bedridden)
  - Able to follow instructions (enumerated: No Problem, Occasional, Frequent; comments free-text)
  - Able to communicate (enumerated: No Problem, Occasional, Frequent; comments free-text)
  - Able to care for all personal needs (checkbox YES/NO; comments free-text)
  - Can administer and store medications (checkbox YES/NO; comments free-text)
  - Needs constant supervision (checkbox YES/NO; comments free-text)
  - Currently taking prescribed medications (checkbox YES/NO; comments free-text)
  - Bathes self (checkbox YES/NO; comments free-text)
  - Dresses self (checkbox YES/NO; comments free-text)
  - Feeds self (checkbox YES/NO; comments free-text)
  - Cares for his/her own toilet (checkbox YES/NO; comments free-text)
  - Able to leave facility unassisted (checkbox YES/NO; comments free-text)
  - Able to move without assistance (checkbox YES/NO; comments free-text)
  - Able to manage own cash resources (checkbox YES/NO; comments free-text)
- **Medications**
  - **Not on form (recommend adding)**: Prescription Medication Name
  - **Not on form (recommend adding)**: Dosage
  - **Not on form (recommend adding)**: Route
  - **Not on form (recommend adding)**: Frequency
- **Legal/Authorizations**
  - Not Applicable
- **Contacts & Providers**
  - Not Applicable
- **Preferences (religious/dietary)**
  - Special Diet (repeated in Clinical/Medical)
  - **Not on form (recommend adding)**: Religious affiliation
  - **Not on form (recommend adding)**: Dietary restrictions
- **Consents/Approvals**
  - Not Applicable
- **Narrative/Free-Text**
  - Comments (multiple instances for physical/mental/self-care)
- **Signatures**
  - Not Applicable (No signature fields visible in OCR; inferred may be on page 1 or separate)
- **Internal Use/Admin**
  - Not Applicable
- **[Repeating] Over-the-Counter Medication Table**
  - Conditions (pre-printed: Headache, Constipation, Diarrhea, Indigestion, Others (specify condition))
  - Over-the-Counter Medication(s) (free-text per condition)

## 5. Data Classification Table

| Field | Domain | Category (Identifier/Clinical/Admin/Financial/Behavioral/Social/Preference/Narrative) | PHI/PII (Y/N) | Sensitivity (High/Moderate/Low) | Free-Text? (Y/N) | Notes |
|-------|--------|----------|---------------|---------------------------------|------------------|-------|
| Other Contagious/Infectious Diseases | Clinical/Medical | Clinical | Y | High | Y | List implies communicable health. |
| Treatment/Medication (diseases) | Clinical/Medical | Clinical | Y | High | Y | Med details. |
| Allergies | Clinical/Medical | Clinical | Y | High | Y | List sensitive. |
| Treatment/Medication (allergies) | Clinical/Medical | Clinical | Y | High | Y | Med details. |
| Able to independently transfer | Functional/ADLs | Clinical | Y | Moderate | N | Checkbox mobility. |
| Fire clearance status | Functional/ADLs | Clinical | Y | Moderate | N | Enumerated ambulatory. |
| Physical Health Status | Clinical/Medical | Clinical | Y | Moderate | N | Enumerated good/fair/poor. |
| Comments (physical) | Narrative/Free-Text | Narrative | Y | High | Y | Free-text health. |
| Auditory impairment | Clinical/Medical | Clinical | Y | Moderate | N | Checkbox with comments. |
| Visual impairment | Clinical/Medical | Clinical | Y | Moderate | N | Checkbox with comments. |
| Wears dentures | Clinical/Medical | Clinical | Y | Low | N | Checkbox with comments. |
| Special Diet | Clinical/Medical | Preference | Y | Moderate | N | Checkbox with comments. |
| Substance abuse problem | Clinical/Medical | Behavioral | Y | High | N | Checkbox with comments. |
| Bowel impairment | Clinical/Medical | Clinical | Y | High | N | Checkbox with comments. |
| Bladder impairment | Clinical/Medical | Clinical | Y | High | N | Checkbox with comments. |
| Motor impairment | Clinical/Medical | Clinical | Y | Moderate | N | Checkbox with comments. |
| Requires continuous bed care | Clinical/Medical | Clinical | Y | High | N | Checkbox with comments. |
| Confused | Behavioral/Risk | Behavioral | Y | High | N | Enumerated with comments. |
| Able to follow instructions | Behavioral/Risk | Behavioral | Y | Moderate | N | Enumerated with comments. |
| Depressed | Behavioral/Risk | Behavioral | Y | High | N | Enumerated with comments. |
| Able to communicate | Behavioral/Risk | Behavioral | Y | Moderate | N | Enumerated with comments. |
| Able to care for all personal needs | Functional/ADLs | Clinical | Y | Moderate | N | Checkbox with comments. |
| Can administer/store medications | Functional/ADLs | Clinical | Y | High | N | Checkbox with comments. |
| Needs constant supervision | Functional/ADLs | Behavioral | Y | High | N | Checkbox with comments. |
| Currently taking prescribed medications | Functional/ADLs | Clinical | Y | High | N | Checkbox with comments. |
| Bathes self | Functional/ADLs | Clinical | Y | Moderate | N | Checkbox with comments. |
| Dresses self | Functional/ADLs | Clinical | Y | Moderate | N | Checkbox with comments. |
| Feeds self | Functional/ADLs | Clinical | Y | Moderate | N | Checkbox with comments. |
| Cares for own toilet | Functional/ADLs | Clinical | Y | High | N | Checkbox with comments. |
| Able to leave facility unassisted | Functional/ADLs | Clinical | Y | Moderate | N | Checkbox with comments. |
| Able to move without assistance | Functional/ADLs | Clinical | Y | Moderate | N | Checkbox with comments. |
| Able to manage own cash resources | Functional/ADLs | Financial | Y | Moderate | N | Checkbox with comments. |
| Conditions | [Repeating] OTC Table | Clinical | N | Low | N | Pre-printed. |
| Over-the-Counter Medication(s) | [Repeating] OTC Table | Clinical | Y | High | Y | Med list per condition. |

## 6. Regulatory & Privacy Notes
- HIPAA direct identifiers found (mapped to 18 categories):
  No direct identifiers like names, dates, or addresses visible; form focuses on health status.
- High-sensitivity subsets: Contagious diseases (communicable), allergies, substance abuse, bowel/bladder impairment (continence), depression, confusion, constant supervision, continuous bed care, medication details.
- Third-party identifiers: None.
- Free-text leakage risks: Comments sections, disease/allergy lists, OTC medications could include detailed PHI; treatment/medication fields may reveal conditions.

## 7. Normalization / Proposed Schema (Conceptual)
- Proposed tables (core + reference) with purpose:
  - `clients`: Core for linking (purpose: associate report).
  - `physician_reports`: Core transactional for overall status (purpose: main report data).
  - `health_impairments`: Reference for physical/mental checkboxes (purpose: detailed impairments).
  - `self_care_capacities`: Reference for self-care yes/no (purpose: ADL assessments).
  - `otc_medications`: Reference for repeating table (purpose: condition-med mappings).
- Relationships (text narrative): `physician_reports` 1:1 with `clients`; `health_impairments`, `self_care_capacities`, `otc_medications` 1:M with `physician_reports`.
- Indicate surrogate vs natural keys: Surrogate UUID PKs; no natural keys.

Example JSON for primary entity (physician_report):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenant_id": "987f6543-21ab-43cd-8765-432109876543",
  "physical_status": "Fair",
  "ambulatory_status": "Nonambulatory"
}
```

Example JSON for transactional entity (otc_medication):
```json
{
  "id": "abcdef12-3456-7890-abcd-ef1234567890",
  "report_id": "123e4567-e89b-12d3-a456-426614174000",
  "condition": "Headache",
  "medication": "Acetaminophen"
}
```

## 8. Sample SQL DDL (PostgreSQL)
```sql
-- Client link
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_clients_tenant_id ON clients (tenant_id);

-- Main report
CREATE TABLE physician_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    contagious_diseases boolean,
    diseases_list text,
    diseases_treatment text,
    allergies boolean,
    allergies_list text,
    allergies_treatment text,
    independent_transfer boolean,
    fire_clearance_status text CHECK (fire_clearance_status IN ('Ambulatory', 'Nonambulatory', 'Bedridden')),
    physical_health_status text CHECK (physical_health_status IN ('Good', 'Fair', 'Poor')),
    physical_comments text,
    effective_start date NOT NULL,
    effective_end date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp,
    CHECK (effective_start <= effective_end)
);
CREATE INDEX idx_physician_reports_tenant_id ON physician_reports (tenant_id);
CREATE INDEX idx_physician_reports_client_id ON physician_reports (client_id);
CREATE INDEX idx_physician_reports_effective ON physician_reports (effective_start, effective_end);

-- Impairments
CREATE TABLE health_impairments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    report_id uuid NOT NULL REFERENCES physician_reports(id) ON DELETE CASCADE,
    impairment_type text NOT NULL CHECK (impairment_type IN ('Auditory', 'Visual', 'Dentures', 'Special Diet', 'Substance abuse', 'Bowel', 'Bladder', 'Motor', 'Continuous bed care', 'Confused', 'Follow instructions', 'Depressed', 'Communicate')), -- CHECK for types; justification: fixed
    has_impairment text CHECK (has_impairment IN ('Yes', 'No', 'No Problem', 'Occasional', 'Frequent')),
    comments text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_health_impairments_tenant_id ON health_impairments (tenant_id);

-- Self care
CREATE TABLE self_care_capacities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    report_id uuid NOT NULL REFERENCES physician_reports(id) ON DELETE CASCADE,
    capacity_type text NOT NULL CHECK (capacity_type IN ('Personal needs', 'Administer meds', 'Constant supervision', 'Taking meds', 'Bathes self', 'Dresses self', 'Feeds self', 'Toilet care', 'Leave unassisted', 'Move without assistance', 'Manage cash')),
    able boolean,
    comments text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_self_care_capacities_tenant_id ON self_care_capacities (tenant_id);

-- OTC meds repeating
CREATE TABLE otc_medications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    report_id uuid NOT NULL REFERENCES physician_reports(id) ON DELETE CASCADE,
    condition text NOT NULL CHECK (condition IN ('Headache', 'Constipation', 'Diarrhea', 'Indigestion', 'Others')), -- CHECK; justification: pre-printed
    medication text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp
);
CREATE INDEX idx_otc_medications_tenant_id ON otc_medications (tenant_id);

-- Strategy for enumerations: CHECK for status/impairment types (fixed on form).
-- Optional partitioning note: Partition physician_reports by effective_start if multiple assessments per client.
```

## 9. Row-Level Security (RLS) Strategy & Sample Policies
- Assume roles: `subscriber_owner`, `administrator`, `direct_support_staff`, `read_only_auditor`, `system_service`.
- Assume session context via `current_setting('app.tenant_id', true)` and `current_setting('app.role', true)` (or JWT claims).
- Show enabling RLS per table: `ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE physician_reports ENABLE ROW LEVEL SECURITY; ALTER TABLE health_impairments ENABLE ROW LEVEL SECURITY; ALTER TABLE self_care_capacities ENABLE ROW LEVEL SECURITY; ALTER TABLE otc_medications ENABLE ROW LEVEL SECURITY;`
- Provide `CREATE POLICY` examples for: patients (or clients), medications, risk_assessments, notes/narratives.
  - For clients (patients equivalent):
    ```sql
    CREATE POLICY clients_policy ON clients
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For medications (map to otc_medications):
    ```sql
    CREATE POLICY medications_policy ON otc_medications
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service'))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For risk_assessments (map to health_impairments for behavioral like confused/depressed):
    ```sql
    CREATE POLICY risk_policy ON health_impairments
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            impairment_type NOT IN ('Confused', 'Depressed')))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - For notes/narratives (map to comments in physician_reports):
    ```sql
    CREATE POLICY notes_policy ON physician_reports
    USING (tenant_id = current_setting('app.tenant_id')::uuid AND deleted_at IS NULL AND
           (current_setting('app.role') IN ('subscriber_owner', 'administrator', 'direct_support_staff', 'system_service') OR
            physical_comments IS NULL))
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
- Enforce: tenant isolation (`tenant_id = current_setting('app.tenant_id')::uuid`), role-based access, exclude soft-deleted rows (`deleted_at IS NULL`).
- Include an example masking approach (view or column expression) for highly sensitive columns (e.g., ssn, communicable_conditions): For diseases_list (communicable):
  ```sql
  CREATE VIEW masked_physician_reports AS
  SELECT id, tenant_id, client_id,
         CASE WHEN current_setting('app.role') = 'read_only_auditor' THEN 'REDACTED' ELSE diseases_list END AS diseases_list,
         -- Similar for other sensitive
  FROM physician_reports WHERE deleted_at IS NULL;
  ```
- Recommend supporting indexes for RLS performance (tenant + PK, partial indexes): `CREATE INDEX idx_physician_reports_active ON physician_reports (tenant_id) WHERE deleted_at IS NULL;`
- Include an auditing trigger suggestion (outline function stub):
  ```sql
  CREATE FUNCTION audit_report() RETURNS trigger AS $$
  BEGIN
    INSERT INTO audit_logs (table_name, operation, row_id, role, tenant_id)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, current_setting('app.role'), current_setting('app.tenant_id')::uuid);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER report_audit
  AFTER INSERT OR UPDATE ON physician_reports
  FOR EACH ROW EXECUTE FUNCTION audit_report();
  ```

## 10. Data Quality & Validation Rules
- Field formats, enumerations, required combinations, temporal logic (e.g., start_date <= end_date), dependency rules.
  - Formats: Booleans for yes/no; Text for lists/comments; Enumerated strings.
  - Enumerations: Fire status (Ambulatory/Nonambulatory/Bedridden); Physical (Good/Fair/Poor); Mental frequency (No Problem/Occasional/Frequent); Conditions (Headache/etc.).
  - Required combinations: If YES for diseases/allergies/impairments, require list/comments; All self-care assessed.
  - Temporal logic: effective_start <= effective_end.
  - Dependency rules: If Nonambulatory/Bedridden, review transfer ability; If taking meds, check administer ability.

## 11. De-Identification Strategy
- **Safe Harbor:** explicit fields to suppress or generalize.
  - Suppress: Diseases/allergies lists, treatments, comments, OTC meds.
  - Generalize: Status to categories (e.g., ambulatory yes/no).
- **ExpertDetermination:** quasi-identifiers set, generalization/bucketing, tokenization, k-anonymity & l-diversity targets.
  - Quasi-identifiers: Physical status, impairments, fire status.
  - Generalization/bucketing: Impairments count (0-2, 3+); Status (independent/dependent).
  - Tokenization: None.
  - k-anonymity & l-diversity targets: k=5; l=2 for behavioral/mental.
- Transformation table (Original → De-ID Rule → Example Output).
  | Original | De-ID Rule | Example Output |
  |----------|------------|----------------|
  | Diseases list | Suppress | [REDACTED] |
  | Allergies list | Suppress | [REDACTED] |
  | Physical status | Generalize | Moderate |
  | Comments | Suppress | [REDACTED] |
  | OTC Medication | Suppress | [REDACTED] |
- Handling of free-text (NLP scrubbing, manual QA): NLP to remove conditions/meds; manual for comments.

## 12. Access Control & Security Controls
- Role vs Domain permission matrix.
  | Role / Domain | Clinical/Medical | Behavioral/Risk | Functional/ADLs | Narrative/Free-Text |
  |---------------|------------------|-----------------|-----------------|---------------------|
  | subscriber_owner | R/W | R/W | R/W | R/W |
  | administrator | R/W | R/W | R/W | R/W |
  | direct_support_staff | R | R/W | R/W | R/W |
  | read_only_auditor | R (masked) | R (masked) | R | R (masked) |
  | system_service | R/W | R/W | R/W | R/W |
- Mask/unmask workflow & audit events: Views mask diseases/comments; audit unmask.
- Encryption guidance: at-rest (column vs tablespace), in-transit, key management, potential field-level encryption candidates.
  - At-rest: Column for lists/comments.
  - In-transit: TLS.
  - Key management: Rotate.
  - Field-level: Diseases, allergies, comments.
- Logging & anomaly detection recommendations: Log sensitive access; detect patterns in behavioral fields.

## 13. Implementation Backlog (Actionable Tickets)
- **P1 (must)**
  - Create DDL with enums; acceptance: Deploys.
  - Enable RLS; acceptance: Isolation tests.
  - Add auditing; acceptance: Logs changes.
- **P2 (should)**
  - Mask views; acceptance: Redacted for auditors.
  - Validate combos; acceptance: Errors on missing.
  - De-ID script; acceptance: Suppresses free-text.
- **P3 (could)**
  - JSON exports; acceptance: Matches examples.
  - Partitioning; acceptance: Improves queries.

## 14. Open Questions / Assumptions
- Assumptions: OCR typos corrected (e.g., "Confured" as Confused); no signatures (may be on unextracted page 1).
- Uncertainties: Full page 1 content; if prescribed meds list added in practice.