# Tool 2 Placeholder Set — Employee File Documents

Canonical placeholder names for Tool 2 employee-file document generation. Templates use `{PascalCase}` tokens consumed by `easy-template-x`.

## Target placeholder set (Tool 2)

| Placeholder | Meaning | Source field |
|-------------|---------|--------------|
| `{FullName}` | Full employee name | `employee.fullName` |
| `{FirstName}` | Given name (parsed or stored) | *not yet in legacy code* |
| `{LastName}` | Family name (parsed or stored) | *not yet in legacy code* |
| `{Birthday}` | Date of birth | `employee.birthday` |
| `{StartDate}` | Employment start date | `employee.startDate` |
| `{RoleName}` | Primary role display name | resolved from `roleId` |
| `{CompanyName}` | Employer name | global properties |
| `{CompanyAddress}` | Employer address (combined) | global properties |
| `{CompanyEmail}` | Employer contact email | global properties |
| `{BewacherId}` | Bewacher-/Wachpersonal-ID | maps from legacy `{GuardIDNumber}` |
| `{QualificationLevel}` | Qualification level / Stufe | maps from legacy `{RoleType}` or new field |
| `{TrainingName}` | Training / Schulung name | per training selection |
| `{TrainingDate}` | Training date | per training date field |
| `{InstructionName}` | Unterweisung name | per instruction overlay |
| `{InstructionDate}` | Unterweisung date | per instruction date field |
| `{ProjectName}` | Linked project / Objekt | project-link (future) |
| `{SDLName}` | Linked SDL | project-link (future) |
| `{DocumentDate}` | Document issue date | global `documentDate` |
| `{CreatedBy}` | Document author | global properties |
| `{ApprovedBy}` | Approver | global properties |

### Additional legacy placeholders (keep until mapped)

| Legacy placeholder | Target mapping | Notes |
|--------------------|----------------|-------|
| `{GuardIDNumber}` | `{BewacherId}` | Rename in templates after mapping review |
| `{EmployeeIDNumber}` | keep or alias `{EmployeeId}` | Internal HR ID, distinct from BewacherId |
| `{RoleType}` | `{QualificationLevel}` | Semantic overlap — confirm with templates |
| `{TrainingHours}` | keep (no target rename yet) | Hours only, not training name/date |
| `{DocVersion}` | keep | Standard model metadata |
| `{DocDate}` | `{DocumentDate}` | Same intent, different name |
| `{CompanyStreet}` / `{Zip}` / `{City}` / `{Country}` | parts of `{CompanyAddress}` | Address decomposition |
| `{CompanyAddressLine}` | optional second line | |
| `{Logo}` | image descriptor | Not a text placeholder |
| `{currentDate}` | generation timestamp | Auto-injected |

## Mismatch policy

1. **Document before change** — this file is the mapping baseline.
2. **Do not silently replace** template tokens; maintain old→new alias layer in generator until templates are updated.
3. **Missing placeholders** (`FirstName`, `LastName`, `TrainingName`, `TrainingDate`, `InstructionName`, `InstructionDate`, `ProjectName`, `SDLName`) require schema/UI work in Tool 2 submodules — not in passive modules.

## Implementation location (after migration)

- Placeholder registry: `apps/certification-os/modules/03-mitarbeiterakte-tool-2/employee-generator/`
- Alias map (legacy → canonical): `shared/placeholders/` (this folder)

## Status

**Active documentation** — required by Tool 2 generator work. No runtime code here until migration step B3.
