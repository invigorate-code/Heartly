# Placement Information Analysis

> **Scope:** Comprehensive analysis of the *Placement Information* form to support digitization, privacy (HIPAA) compliance, security design, and data governance. *(Not legal advice; implement with privacy officer / counsel review.)*

---
## 1. Concise Purpose Statement
The form functions as an **intake & ongoing placement record** for a residential care client, consolidating identity, benefits/payment sources, placement history, involved agencies & representatives, clinical / risk profile, medications, providers, authorizations, and special instructions so staff can safely admit, coordinate care, administer medications, and manage authorized releases / visits.

---
## 2. Field Inventory (Normalized Logical Groups)
**Identifying & Demographics:** Client Name, AKA/Nickname, Date of Birth, Gender, Marital Status, UCI#, Social Security Number, Language(s).

**Benefits / Insurance / Payee:** SSI, SSI Payee, SSA, SSA Payee, Other Benefit, Other Benefit Payee, Medi‑Cal Number, Medi‑Care Number, Other Insurance.

**Current Placement:** Date of Placement, Facility Name, Facility Street, Facility City, Facility ZIP, Facility Phone.

**Previous Placement:** Previous Street, Previous City, Previous ZIP, Previous Phone, Previous Contact.

**Placement Agency:** Agency Name, Agency Street, Agency City, Agency ZIP, Agency Phone, Agency Contact.

**Other Agency:** Other Agency Name, Street, City, ZIP, Phone, Contact.

**Religious / Burial:** Religious Preference, Advisor Name, Advisor Street, Advisor City, Advisor ZIP, Advisor Phone, Burial Arrangements (free text).

**Representatives:** Legal Representative Name, Relation, Street, City, ZIP, Home Phone, Work Phone. Other Representative (same fields).

**Authorizations:** Persons Authorized to Take Client From Home, Approval Signature 1 + Date, Approval Signature 2 + Date.

**Physical Description:** Height, Weight, Eyes, Hair, Distinguishing Marks, Allergies, Client Photo.

**Risk & Clinical:** Dangerous Propensities (Yes/No + Description), Diagnosis, Medical Needs, Communicable Conditions, Special Instructions, Visitation Restrictions, Other Significant Information (free text).

**Medication Regimen (Repeating Rows):** Medication Name, Dosage, Frequency, Prescribing MD (multiple lines).

**Providers:** Primary Physician (Address, City, ZIP, Phone), Dentist (Address, City, ZIP, Phone), Other Specialist #1 (Address, City, ZIP, Phone), Other Specialist #2 (Address, City, ZIP, Phone).

**Misc / Structural:** Form Headings, Section Labels (not data but structural metadata).

---
## 3. PHI / PII Classification Overview
| Category | Fields (Examples) | Rationale | Handling Emphasis |
|----------|-------------------|-----------|-------------------|
| **Direct Identifiers** | Name, SSN, Full DOB, UCI#, Full Addresses, Phone Numbers, Signatures, Photo | Enumerated HIPAA identifiers | Strong encryption, masking, audited access |
| **Quasi‑Identifiers** | Gender, Marital Status, Language, Height, Weight, Distinguishing Marks | Re-identification risk in combination | Generalize / bin for analytics |
| **Clinical PHI** | Diagnosis, Medical Needs, Medications, Allergies, Communicable Conditions | Health condition & treatment | Role-based access; integrity controls |
| **Behavioral / Risk** | Dangerous Propensities, Visitation Restrictions | Safety & behavioral data | Access justification logging |
| **Sensitive Cultural/Spiritual** | Religious Preference, Burial Arrangements | Potential stigma/sensitivity | Segmentation + purpose-of-use prompts |
| **Payment / Admin PHI** | Benefit numbers, Payees, Placement histories, Authorized Persons | Payment & operations info | Tokenize numbers; minimize exposure |
| **Free Text High-Risk** | Other Significant Information, Special Instructions, Risk Descriptions | Could contain incidental identifiers | NLP/DLP scrubbing & restricted export |
| **Third-Party Identifiers** | Representatives, Providers, Advisors | Linked to patient’s care context (becomes PHI) | Protect & audit disclosures |

**Bottom Line:** Treat *all* populated fields as PHI within the Designated Record Set; tier controls by sensitivity and re-identification risk.

---
## 4. De‑Identification Strategies (Safe Harbor vs Expert Determination)
### 4.1 Safe Harbor Summary
Remove all 18 enumerated identifiers—names, geographic subdivisions smaller than state (convert ZIP to first 3 digits only if population > 20k, else suppress), all elements of dates (except year) related to the individual, phone/fax numbers, email, SSN, medical record/UCI numbers, health plan numbers, account numbers, certificate/license numbers, vehicle/device IDs, URLs/IPs, biometric identifiers (photo), full-face images, and any unique identifying characteristics (distinguishing marks, rare diagnoses, religious specifics).

**Utility Impact:** Loses day/month resolution, fine geography, provider specificity, detailed narrative nuance; best for simple counts and high-level benchmarking.

### 4.2 Expert Determination Summary
Retain analytical value via controlled *generalization, suppression, aggregation, tokenization, date shifting,* and *quantitative risk assessment* (k-anonymity, l-diversity, t-closeness). Allows retention of: month or quarter of placement, 3-digit ZIP, age bands, medication class, diagnosis category, relative event sequences.

**Utility Gain:** Enables temporal trends, regional planning, regimen analytics, outcome correlations.

### 4.3 Technique Mapping
| Data Element | Safe Harbor | Expert Determination Option |
|-------------|------------|-----------------------------|
| DOB | Year only or age band | Age band (5-year) or year (if k ≥ threshold) |
| Placement Date | Remove month/day | Shift +/- constant; reduce to month/quarter |
| Addresses | Remove (state only) | 3-digit ZIP; suppress rare ZIPs |
| Medications | Remove names if identifying | Map to therapeutic class (e.g., CNS stimulant) |
| Diagnosis | Remove rare text | ICD chapter / high-level category |
| Height/Weight | Remove or leave if not re-identifying | Bin (e.g., Height 60–65 in; Weight 150–174 lb) |
| Distinguishing Marks | Remove details | General flag: “Physical mark present” |
| Communicable Conditions | Remove rare; generalize | Category (e.g., Airborne vs Bloodborne) |
| Religious Preference | Remove | High-level category (e.g., Christian, None, Other) |
| Provider Names | Remove | Specialty only; hashed provider code |
| UCI# / IDs | Remove | Random study ID (non-derivable) |
| Free Text | Remove / manual scrub | NLP scrub + redact residual identifiers |

### 4.4 Quantitative Risk Targets (Illustrative)
| Metric | Target | Notes |
|--------|--------|-------|
| k-Anonymity | k ≥ 11 | Quasi-set: {Age Band, 3-digit ZIP, Gender, Diagnosis Category} |
| l-Diversity | l ≥ 2–3 for medications, ≥ 2 for diagnosis | Ensure sensitive attribute variance |
| t-Closeness | t ≤ 0.2 for highly sensitive fields | Distribution similarity for Religious / Communicable |

---
## 5. Implementation Checklists
### 5.1 Preparation
- Build *Data Element Register* with column-level metadata: `category`, `is_direct_identifier`, `is_clinical`, `is_sensitive`, `contains_free_text`.
- Classify initial risk & required control level.

### 5.2 Safe Harbor Flow
1. Strip enumerated identifiers.
2. Generalize unique characteristics.
3. Scrub free text (NLP + RegEx + manual spot checks).
4. Validate absence of all 18 identifier classes.
5. Produce *No Actual Knowledge* attestation.

### 5.3 Expert Determination Flow
1. Define analytic requirements (temporal, geographic granularity, longitudinal linkage).
2. Transform dataset iteratively:
   - Generalize dates -> month/quarter or shift.
   - Bin numeric / anthropometric values.
   - Aggregate meds / diagnoses.
   - Tokenize IDs (secure mapping).
3. Compute risk metrics (k, l, t). Adjust generalization until thresholds met.
4. Document methodology, transformations & risk results.
5. Obtain expert certification letter.
6. Implement release governance (DUAs, access logs, prohibition of re-identification attempts).

### 5.4 Cross-Cutting Controls
- **Free Text Sanitization Pipeline:** NER for names, addresses, numbers; redact or replace.
- **High-Sensitivity Segmentation:** Religious/Burial, Behavioral Risk, Communicable Conditions → optional exclusion layer for external datasets.
- **Audit & Monitoring:** Capture reason codes for viewing direct identifiers; alert on bulk exports.
- **Version Control:** Store transformation scripts in repository; hash outputs for integrity.

---
## 6. Security & Privacy Control Recommendations
| Control Layer | Measures |
|---------------|----------|
| **Storage** | AES-256 encryption; separate KMS-managed keys for especially sensitive subsets. |
| **Field-Level Protection** | Dynamic masking (e.g., last-4 of SSN) unless privileged role & justification. |
| **Access Control** | RBAC with attribute-based overlays (role + purpose + sensitivity). Minimal default scopes. |
| **Logging & Monitoring** | Immutable append-only audit trail (user, field group, purpose, timestamp). Shadow log for high-sensitivity views. |
| **Data Loss Prevention** | Real-time scanning on free-text inputs; deny storing prohibited identifiers in narrative fields. |
| **De-Identification Service** | Stateless microservice applying configured rule set; outputs version-tagged dataset. |
| **Incident Response** | Playbook for suspected re-identification (suspend access, forensic log review, notify privacy officer). |

---
## 7. Suggested Database Normalization (High-Level)
| Table | Key Fields | Notes & PHI Flags |
|-------|-----------|-------------------|
| `client` | client_id (UUID), UCI#, name fields, DOB, gender, language | Direct Identifiers; partition; unique index on UCI#. |
| `placement` | placement_id, client_id FK, facility_id FK, start_date, end_date | Dates considered PHI; can extract year for analytics view. |
| `facility` | facility_id, name, address fields | Tie to client → PHI; facility alone is not. |
| `benefit_enrollment` | benefit_id, client_id, type, member_number (tokenized), payee_id FK | Tokenize member_number. |
| `representative` | representative_id, client_id, type (legal/other), contact info | Third-party PHI association. |
| `provider` | provider_id, specialty, hashed_provider_code | Store raw provider identity separately if needed. |
| `client_provider` | id, client_id, provider_id, relationship_type | Enables de-ident output via provider specialty only. |
| `medication_order` | med_id, client_id, drug_code, dose, frequency, prescribing_provider_id | Map `drug_code` -> class in analytic mart. |
| `risk_profile` | risk_id, client_id, danger_flag, risk_notes | Danger notes high sensitivity (segment). |
| `clinical_profile` | clinical_id, client_id, diagnosis_code(s), medical_needs, allergies | Normalize allergies to controlled vocab table. |
| `communicable_condition` | condition_id, client_id, condition_code | Optional segmentation. |
| `authorization` | auth_id, client_id, person_name, relation, approved_date | Person name = direct identifier; secure logs. |
| `notes` | note_id, client_id, category, note_text (encrypted) | NLP classification for prohibited patterns. |

---
## 8. Field → De‑ID Transformation Reference (Excerpt)
| Original Field | Classification | Safe Harbor Action | Expert Determination Action |
|----------------|---------------|--------------------|-----------------------------|
| Social Security # | Direct Identifier | Remove | Remove (no retention) |
| Date of Birth | Direct Identifier | Keep Year only | Age Band (5-year) |
| Facility Address | Direct Identifier | Remove (< State) | 3-digit ZIP (if pop >20k) |
| Placement Date | Temporal PHI | Remove month/day | Shift + Quarter label |
| Diagnosis | Clinical | Remove if rare / general category only | ICD Chapter / SNOMED High-Level |
| Medication Name | Clinical | Remove names | Map to therapeutic class |
| Allergies | Clinical | Remove specifics | Substance class (e.g., “Penicillin class”) |
| Religious Preference | Sensitive | Remove | High-level category |
| Dangerous Propensities Desc. | Behavioral | Remove free text | Generalized risk category |
| Distinguishing Marks | Quasi | Remove | Present/Absent flag |
| Representative Names | Direct | Remove | Role code + hashed surrogate |
| UCI# | Identifier | Remove | Random study ID |
| Free Text Notes | Mixed | Remove or heavy redact | NLP scrub + release |

---
## 9. Operational Release Checklist
**Before Release:**
1. ✅ Transformation rules applied.
2. ✅ All direct identifiers removed or generalized per chosen path.
3. ✅ Free-text scrubbed & QA sample passed.
4. ✅ Risk metrics (k / l / t) meet thresholds (Expert path only).
5. ✅ Codebook & mapping tables stored separately w/ restricted access.
6. ✅ Data Use Agreements executed (external release).
7. ✅ Audit baseline snapshot taken.

**After Release:**
- Monitor for abnormal query patterns.
- Reassess risk if new external linkage datasets appear (e.g., public facility rosters with dates).
- Version bump & re-certification on schema changes.

---
## 10. Next Step Options
Choose any (request for implementation details):
1. **JSON Field Metadata Schema** (to drive automated masking & de-ID engine).
2. **SQL / Pseudocode** for k-anonymity equivalence class computation.
3. **Data Use Agreement (DUA) Template** draft.
4. **NLP Redaction Rule Set** example.
5. **RBAC Matrix** aligned with table & field sensitivity.

Let me know which artifact you’d like generated next and in what format (Markdown, JSON, or code).

