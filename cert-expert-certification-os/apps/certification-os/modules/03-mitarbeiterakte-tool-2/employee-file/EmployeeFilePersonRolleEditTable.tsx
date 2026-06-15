"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Input, Select, MultiSelect, DatePicker } from "@/components/ui";
import { Check, Settings2 } from "lucide-react";
import type { Employee, Role, Appointment } from "@/lib/types/employee";
import {
  appointmentLabelDe,
  roleSelectDescription,
  roleSelectLabel,
  sortAppointmentsForSelect,
  sortRolesForSelect,
} from "./employee-display-labels";
import {
  BESCHAEFTIGUNGSART_OPTIONS,
  DIENSTFAHRZEUG_OPTIONS,
  GESCHLECHT_OPTIONS,
  ORG_TITLE_OPTIONS,
  ROLE_CLASS_LABEL_MULTI,
  ROLLE_TYPE_OPTIONS,
  SDL_SCOPE_CATALOG,
} from "./employee-stammdaten-options";
import { setKategorieLabel } from "./vorlagen-set-catalog";
import { resolveRoleClasses, type RoleClass } from "./requirement-engine";
import { RoleClassSelector } from "./RoleClassSelector";
import {
  joinFullName,
  splitFullName,
  type RequirementRow,
} from "./employee-file-requirements";
import {
  QUALIFICATION_CATALOG,
  parseQualifications,
  serializeQualifications,
} from "./qualification-catalog";
import {
  applyEmployeePatchWithDocSync,
} from "./employee-doc-selection-sync";
import { EmployeeFileStatusBadge } from "./EmployeeFileStatusBadge";

const COMPACT_SELECT =
  "[&_button]:rounded-lg [&_button]:py-2 [&_button]:text-sm [&_button]:shadow-none";

/** Kapitel der Eingabe-Maske (M1) — für die kapitelweise Reiter-Aufteilung (Mockup). */
export type PersonRolleChapterId =
  | "stammdaten"
  | "beschaeftigung"
  | "rolle-norm"
  | "sdl"
  | "bestellungen"
  | "quali";

export interface EmployeeFilePersonRolleEditTableProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
  companyName: string;
  rows: RequirementRow[];
  onSave: (employee: Employee) => void;
  /** Nur diese Kapitel rendern (default: alle). Für die 6-Reiter-Akte. */
  chapters?: PersonRolleChapterId[];
}

function statusForRow(rows: RequirementRow[], id: string) {
  return rows.find((r) => r.id === id)?.status ?? "offen";
}

/**
 * M3 — Pflichtfelder der Akte (Zod-Pflicht, AKTE_MASKE_KONZEPT §3.6). Eine
 * leere Pflichtangabe ist eine ○-Pflicht-Lücke (rot, `fehlt`); ein leeres
 * optionales Feld ist eine ◇-Lücke (grau, `offen`). Reine Anzeige-Ableitung.
 */
const PFLICHT_ROW_IDS = new Set([
  "vorname",
  "nachname",
  "geburtsdatum",
  "vertragsbeginn",
  "dokumenten-vorlage",
]);

/**
 * M3 — einheitliche Glyph-/Status-Ableitung je Zeile (●/○/◇/▲, §3.5/§3.6).
 * Vereinheitlicht die zuvor uneinheitlichen `statusOverride`s: Wert gesetzt →
 * `vorhanden` (●); Pflichtfeld leer → `fehlt` (○); optionales Feld leer →
 * `offen` (◇). `fachlich prüfen` (▲) wird gezielt von den vorhandenen
 * Hinweis-Triggern (gender=weiblich, drivesServiceVehicle, NON-DIN-SDL) gesetzt.
 * EC-10: keine Erledigt-/Freigabe-Aussage — „vorhanden" = nur „Wert erfasst".
 */
function deriveRowStatus(
  id: string,
  hasValue: boolean,
): RequirementRow["status"] {
  if (hasValue) return "vorhanden";
  return PFLICHT_ROW_IDS.has(id) ? "fehlt" : "offen";
}

export const EmployeeFilePersonRolleEditTable: React.FC<
  EmployeeFilePersonRolleEditTableProps
> = ({ employee, roles, appointments, companyName, rows, onSave, chapters }) => {
  const { vorname, nachname } = splitFullName(employee.fullName);
  const currentRoleClasses = resolveRoleClasses(employee);

  const roleOptions = useMemo(
    () =>
      sortRolesForSelect(roles).map((r) => ({
        id: r.id,
        name: roleSelectLabel(r.id, r.name),
        description: roleSelectDescription(r.id) ?? r.description,
      })),
    [roles],
  );

  const bestellungOptions = useMemo(
    () =>
      sortAppointmentsForSelect(appointments).map((a) => ({
        id: a.id,
        name: appointmentLabelDe(a.id, a.name),
        description: a.description,
      })),
    [appointments],
  );

  const sdlOptions = useMemo(
    () =>
      SDL_SCOPE_CATALOG.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.geltungsbereich,
      })),
    [],
  );

  // Qualifikation als strukturierte Mehrfachauswahl (DM5) statt Freitext.
  const qualificationOptions = useMemo(
    () =>
      QUALIFICATION_CATALOG.map((q) => ({
        id: q.id,
        name: q.label,
        description: q.description,
      })),
    [],
  );
  // Aktuelle Auswahl: strukturiertes Feld gewinnt; sonst tolerant aus dem
  // Legacy-Freitext ableiten (round-trip-stabil, kein Datenverlust).
  const currentQualificationIds =
    employee.qualifications && employee.qualifications.length > 0
      ? employee.qualifications
      : parseQualifications(employee.qualification).ids;

  const dienstfahrzeugValue =
    employee.drivesServiceVehicle === true
      ? "ja"
      : employee.drivesServiceVehicle === false
        ? "nein"
        : "";

  const patch = (partial: Partial<Employee>) => {
    onSave(applyEmployeePatchWithDocSync(employee, partial, roles, appointments));
  };

  const handleNameChange = (part: "vorname" | "nachname", value: string) => {
    const nextVorname = part === "vorname" ? value : vorname;
    const nextNachname = part === "nachname" ? value : nachname;
    patch({ fullName: joinFullName(nextVorname, nextNachname) });
  };

  const handleGuardIdChange = (value: string) => {
    patch({
      guardIDNumber: value,
      ...(employee.useGuardAsEmployeeId
        ? { employeeIDNumber: value }
        : undefined),
    });
  };

  // M3 — einheitliche Wert-Präsenz je Zeile (Quelle für ●/○/◇). Pflicht-leer
  // → ○ (fehlt), optional-leer → ◇ (offen), gesetzt → ● (vorhanden). Reine
  // Anzeige-Ableitung aus dem Modell (kein Engine-/Datenmodell-Eingriff).
  const ROW_VALUE_PRESENT: Record<string, boolean> = {
    vorname: Boolean(vorname.trim()),
    nachname: Boolean(nachname.trim()),
    geburtsdatum: Boolean(employee.birthday?.trim()),
    geschlecht: Boolean(employee.gender),
    "bewacher-id": Boolean(employee.guardIDNumber?.trim()),
    "dienst-id": Boolean(employee.employeeIDNumber?.trim()),
    vertragsbeginn: Boolean(employee.startDate?.trim()),
    beschaeftigungsart: Boolean(employee.employmentType?.trim()),
    "norm-klasse": currentRoleClasses.length > 0,
    "org-titel": Boolean(employee.roleType?.trim()),
    "dokumenten-vorlage": Boolean(employee.roleId?.trim()),
    "set-kategorie": Boolean(employee.setKategorie),
    "sdl-scopes": (employee.sdlScopes ?? []).length > 0,
    dienstfahrzeug: employee.drivesServiceVehicle !== undefined,
    bestellungen: (employee.appointmentIds ?? []).length > 0,
    qualifikation: currentQualificationIds.length > 0,
    "erste-hilfe-frist": Boolean(employee.ersteHilfeGueltigBis?.trim()),
    "brandschutz-frist": Boolean(employee.brandschutzGueltigBis?.trim()),
    "ist-ue-verweis": employee.weiterbildungIstUE !== undefined,
  };

  // M3 — ▲-„fachlich prüfen"-Zeilen aus den BESTEHENDEN Hinweis-Triggern
  // (keine neuen Trigger erfunden): gender=weiblich (CL-77), Dienstfahrzeug=ja
  // (CL-73), NON-DIN-SDL (CL-72). EC-10: ▲ ist KEINE Erledigt-/Freigabe-Aussage.
  const sdlScopes = employee.sdlScopes ?? [];
  const ROW_PRUEFEN: Record<string, boolean> = {
    geschlecht: employee.gender === "weiblich",
    dienstfahrzeug: employee.drivesServiceVehicle === true,
    "sdl-scopes": sdlScopes.includes("non-din"),
  };

  const rowShell = (
    id: string,
    label: string,
    control: React.ReactNode,
    hint?: string,
    statusOverride?: RequirementRow["status"],
  ) => {
    // §3.5/§3.6 — Glyph-Status konsistent ableiten: expliziter Override gewinnt
    // (z. B. engine-getriebene Frist-Zeilen); sonst ▲ bei Prüf-Trigger; sonst
    // ●/○/◇ aus der Wert-Präsenz; Fallback = vorhandene RequirementRow.
    let status: RequirementRow["status"];
    if (statusOverride) {
      status = statusOverride;
    } else if (ROW_PRUEFEN[id]) {
      status = "fachlich prüfen";
    } else if (id in ROW_VALUE_PRESENT) {
      status = deriveRowStatus(id, ROW_VALUE_PRESENT[id]);
    } else {
      status = statusForRow(rows, id);
    }
    return (
      <li
        key={id}
        className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
      >
        <div className="min-w-0 sm:w-40 shrink-0">
          <p className="text-sm text-[#111827]">{label}</p>
          {hint ? (
            <p className="mt-0.5 text-[10px] text-[#6b7280]">{hint}</p>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">{control}</div>
        <EmployeeFileStatusBadge status={status} />
      </li>
    );
  };

  // M1 — Felder in die 6 Kapitel gruppiert (Stammdaten → Beschäftigung → Rolle &
  // Norm → Geltungsbereich → Bestellungen → Qualifikationen/Fristen). Reine
  // Reorganisation: alle rowShell-Zeilen + Logik (patch/onSave/Doc-Sync)
  // unverändert, nur visuell in Kapitel-Cards mit Überschrift gegliedert.
  const chapter = (
    id: PersonRolleChapterId,
    title: string,
    children: React.ReactNode,
  ) => {
    if (chapters && !chapters.includes(id)) return null;
    return (
      <section className="space-y-2">
        <h4 className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
          {title}
        </h4>
        <ul className="divide-y divide-[#e5e7eb] rounded-lg border border-[#e5e7eb]">
          {children}
        </ul>
      </section>
    );
  };

  return (
    <div className="space-y-5">
      {chapter(
        "stammdaten",
        "Stammdaten",
        <>
          {rowShell(
            "vorname",
            "Vorname",
            <Input
              value={vorname}
              onChange={(e) => handleNameChange("vorname", e.target.value)}
              placeholder="Vorname"
              className="py-2 text-sm"
            />,
          )}
          {rowShell(
            "nachname",
            "Nachname",
            <Input
              value={nachname}
              onChange={(e) => handleNameChange("nachname", e.target.value)}
              placeholder="Nachname"
              className="py-2 text-sm"
            />,
          )}
          {rowShell(
            "geburtsdatum",
            "Geburtsdatum",
            <DatePicker
              value={employee.birthday}
              onChange={(birthday) => patch({ birthday })}
              placeholder="TT.MM.JJJJ"
              className="text-sm"
            />,
          )}
          {rowShell(
            "geschlecht",
            "Geschlecht",
            <>
              <div className={COMPACT_SELECT}>
                <Select
                  options={[...GESCHLECHT_OPTIONS]}
                  value={employee.gender || ""}
                  onChange={(v) =>
                    patch({
                      gender: v
                        ? (v as NonNullable<Employee["gender"]>)
                        : undefined,
                    })
                  }
                  placeholder="keine Angabe"
                />
              </div>
              {employee.gender === "weiblich" ? (
                <p className="mt-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-900">
                  Mutterschutz-relevant — fachlich prüfen (CL-77, MuSchG; kein
                  Auto-Status)
                </p>
              ) : null}
            </>,
            "Optionale PII — leer = keine Angabe",
          )}
          {rowShell(
            "bewacher-id",
            "Bewacher-ID",
            <Input
              value={employee.guardIDNumber || ""}
              onChange={(e) => handleGuardIdChange(e.target.value)}
              placeholder="Bewacher-ID"
              className="py-2 text-sm"
            />,
            "Stammdaten — getrennt vom Bundesauszug",
          )}
          {rowShell(
            "dienst-id",
            "Dienstausweisnummer",
            <div className="space-y-2">
              <Input
                value={employee.employeeIDNumber || ""}
                onChange={(e) => patch({ employeeIDNumber: e.target.value })}
                placeholder="Dienstausweisnummer"
                disabled={employee.useGuardAsEmployeeId}
                className="py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-xs text-[#374151]">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={employee.useGuardAsEmployeeId}
                  onClick={() => {
                    const useGuard = !employee.useGuardAsEmployeeId;
                    patch({
                      useGuardAsEmployeeId: useGuard,
                      employeeIDNumber: useGuard
                        ? employee.guardIDNumber || ""
                        : employee.employeeIDNumber,
                    });
                  }}
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                    employee.useGuardAsEmployeeId
                      ? "border-[#e30613] bg-[#e30613]"
                      : "border-[#d1d5db] bg-white"
                  }`}
                >
                  {employee.useGuardAsEmployeeId ? (
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  ) : null}
                </button>
                Bewacher-ID als Dienstausweisnummer verwenden
              </label>
            </div>,
          )}
        </>,
      )}

      {chapter(
        "beschaeftigung",
        "Beschäftigung",
        <>
          {rowShell(
            "vertragsbeginn",
            "Vertragsbeginn",
            <DatePicker
              value={employee.startDate}
              onChange={(startDate) => patch({ startDate })}
              placeholder="Vertragsbeginn"
              className="text-sm"
            />,
          )}
          {rowShell(
            "austritt",
            "Austrittsdatum",
            <Input
              value=""
              disabled
              placeholder="Nur bei Beendigung"
              className="bg-[#fafbfc] py-2 text-sm"
            />,
            "Nur bei Beendigung erfassen",
          )}
          {rowShell(
            "beschaeftigungsart",
            "Beschäftigungsart",
            <div className={COMPACT_SELECT}>
              <Select
                options={[...BESCHAEFTIGUNGSART_OPTIONS]}
                value={employee.employmentType || ""}
                onChange={(employmentType) => patch({ employmentType })}
                placeholder="Beschäftigungsart wählen…"
              />
            </div>,
          )}
          {rowShell(
            "aktiv",
            "Aktiver Status",
            <Input
              value="aktiv"
              disabled
              className="bg-[#fafbfc] py-2 text-sm"
            />,
            "Working UI",
          )}
          {rowShell(
            "unternehmen",
            "Unternehmen",
            <div>
              <Input
                value={companyName || "— nicht hinterlegt"}
                disabled
                className="bg-[#fafbfc] py-2 text-sm"
              />
              <Link
                href="/uploads"
                className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#e30613] hover:underline"
              >
                <Settings2 className="h-3 w-3" />
                Firmendaten im Upload Manager
              </Link>
            </div>,
            "Aus Firmendaten",
          )}
        </>,
      )}

      {chapter(
        "rolle-norm",
        "Rolle & Norm-Klasse",
        <>
          {rowShell(
            "norm-klasse",
            ROLE_CLASS_LABEL_MULTI,
            <RoleClassSelector
              value={currentRoleClasses}
              onChange={(roleClasses) => patch({ roleClasses })}
              compact
            />,
            "DIN 77200: EK + FK frei kombinierbar; Verwaltung/Praktikant/Sub mit EK/FK kombinierbar (Doppelrolle) — maßgeblich fürs Pflicht-Set.",
          )}
          {rowShell(
            "org-titel",
            "Org-Titel (Anzeige)",
            <div className={COMPACT_SELECT}>
              <Select
                options={[...ROLLE_TYPE_OPTIONS]}
                value={employee.roleType || ""}
                onChange={(roleType) => {
                  const def = ORG_TITLE_OPTIONS.find(
                    (o) => o.id === roleType,
                  )?.defaultClass;
                  patch({
                    roleType,
                    // Default-Klasse nur setzen, wenn noch keine Norm-Klasse
                    // erfasst ist (Org-Titel überschreibt eine bewusst gewählte
                    // Klasse nicht).
                    ...(def && currentRoleClasses.length === 0
                      ? { roleClasses: [def as RoleClass] }
                      : {}),
                  });
                }}
                placeholder="Org-Titel wählen…"
              />
            </div>,
            "Org-Chart-Titel — keine direkte Engine-Wirkung (G4).",
          )}
          {rowShell(
            "dokumenten-vorlage",
            "Dokumenten-Vorlage",
            <div className={COMPACT_SELECT}>
              <Select
                options={roleOptions}
                value={employee.roleId}
                onChange={(roleId) => patch({ roleId })}
                placeholder="Vorlagen-Rolle wählen…"
              />
            </div>,
            "Steuert die Generator-Dokumentenpalette",
          )}
          {rowShell(
            "set-kategorie",
            "Set-Kategorie (Vorlagen)",
            <Input
              value={
                employee.setKategorie
                  ? setKategorieLabel(employee.setKategorie)
                  : "— nicht gesetzt"
              }
              disabled
              className="bg-[#fafbfc] py-2 text-sm"
            />,
            "Wird im Generator-Tab gesetzt — hier nur Anzeige",
          )}
        </>,
      )}

      {chapter(
        "sdl",
        "Geltungsbereich (SDL)",
        <>
          {rowShell(
            "sdl-scopes",
            "SDL / Geltungsbereich",
            <div className={COMPACT_SELECT}>
              <MultiSelect
                options={sdlOptions}
                value={employee.sdlScopes ?? []}
                onChange={(sdlScopes) => patch({ sdlScopes })}
                placeholder="DIN 77200-1/-2, Veranstaltung, Objekt, Asyl …"
              />
            </div>,
            "Eingang der Pflicht-Engine — Mehrfachauswahl",
          )}
          {rowShell(
            "dienstfahrzeug",
            "Fährt Dienstfahrzeug?",
            <div className={COMPACT_SELECT}>
              <Select
                options={[...DIENSTFAHRZEUG_OPTIONS]}
                value={dienstfahrzeugValue}
                onChange={(v) =>
                  patch({
                    drivesServiceVehicle:
                      v === "ja" ? true : v === "nein" ? false : undefined,
                  })
                }
                placeholder="unbekannt"
              />
            </div>,
            "Ja → Fahrer-/UVV-Unterweisung (fachlich prüfen, CL-73)",
          )}
          {rowShell(
            "projekte",
            "Projektzuordnung",
            <Input
              value=""
              disabled
              placeholder="SDL/Projekt — folgt"
              className="bg-[#fafbfc] py-2 text-sm"
            />,
            "SDL/Projekt-Referenz folgt",
          )}
        </>,
      )}

      {chapter(
        "bestellungen",
        "Bestellungen",
        <>
          {rowShell(
            "bestellungen",
            "Bestellungen",
            <div className={COMPACT_SELECT}>
              <MultiSelect
                options={bestellungOptions}
                value={employee.appointmentIds}
                onChange={(appointmentIds) => patch({ appointmentIds })}
                placeholder="Ersthelfer, Brandschutzhelfer, SiBe …"
              />
            </div>,
            "Mehrfachauswahl — ergänzt die Grundrolle",
          )}
        </>,
      )}

      {chapter(
        "quali",
        "Qualifikationen & Fristen",
        <>
          {rowShell(
            "qualifikation",
            "Qualifikation",
            <div className={COMPACT_SELECT}>
              <MultiSelect
                options={qualificationOptions}
                value={currentQualificationIds}
                onChange={(ids) =>
                  patch({
                    qualifications: ids,
                    // Legacy-Freitext round-trip-stabil mitschreiben (Engine-/
                    // Presenter-Fallback). Leere Auswahl → Freitext leeren.
                    qualification:
                      ids.length > 0
                        ? serializeQualifications(ids)
                        : undefined,
                  })
                }
                placeholder="Unterrichtung, Sachkunde, Meister, Studium, Polizei …"
              />
            </div>,
            "Mehrfachauswahl — höchste Stufe zählt; Studium/Polizei = fachlich prüfen (keine Auto-Anrechnung)",
          )}
          {rowShell(
            "erste-hilfe-frist",
            "Erste Hilfe gültig bis",
            <DatePicker
              value={employee.ersteHilfeGueltigBis || ""}
              onChange={(ersteHilfeGueltigBis) =>
                patch({ ersteHilfeGueltigBis })
              }
              placeholder="Ablaufdatum Erste Hilfe"
              className="text-sm"
            />,
            "2-Jahres-Frist (CL-08)",
          )}
          {rowShell(
            "brandschutz-frist",
            "Brandschutzhelfer gültig bis",
            <DatePicker
              value={employee.brandschutzGueltigBis || ""}
              onChange={(brandschutzGueltigBis) =>
                patch({ brandschutzGueltigBis })
              }
              placeholder="Ablaufdatum Brandschutzhelfer"
              className="text-sm"
            />,
            "3-Jahres-Frist (CL-23)",
          )}
          {rowShell(
            "ist-ue-verweis",
            "Ist-UE (Weiterbildung)",
            <Input
              value={
                employee.weiterbildungIstUE === undefined
                  ? "— bei den Schulungszielen pflegen"
                  : `${employee.weiterbildungIstUE} h erfasst`
              }
              disabled
              className="bg-[#fafbfc] py-2 text-sm"
            />,
            "Soll/Ist wird bei den Schulungszielen gepflegt (engine-gekoppelt) — hier nur Anzeige",
          )}
        </>,
      )}
    </div>
  );
};

EmployeeFilePersonRolleEditTable.displayName = "EmployeeFilePersonRolleEditTable";
