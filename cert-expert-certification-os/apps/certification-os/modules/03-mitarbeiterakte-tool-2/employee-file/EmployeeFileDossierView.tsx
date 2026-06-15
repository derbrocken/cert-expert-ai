"use client";

import React from "react";
import {
  User,
  FileCheck,
  AlertCircle,
  Check,
  Pencil,
  GraduationCap,
  BookOpen,
  ListChecks,
  CalendarClock,
  Info,
  ClipboardSignature,
  Upload,
  FilePlus2,
} from "lucide-react";
import { formatIsoToInput } from "@/lib/utils/date";
import type {
  Employee,
  Role,
  Appointment,
  BestellungTyp,
} from "@/lib/types/employee";
import {
  roleLabelDe,
  BESTELLUNG_DEFS,
  getBestelltAls,
  setBestelltAlsPatch,
} from "./employee-display-labels";
import {
  GRUNDROLLE_CATALOG,
  ZUSATZROLLEN_CATALOG,
  getEmployeeFileSummary,
  type RequirementRow,
} from "./employee-file-requirements";
import { EmployeeFileStatusBadge } from "./EmployeeFileStatusBadge";
import { EmployeeFilePflichtStatusPanel } from "./EmployeeFilePflichtStatusPanel";
import { EmployeeFileEvidenceRow } from "./EmployeeFileEvidenceRow";
import { EmployeeFileChapterEdit } from "./EmployeeFileChapterEdit";
import { EmployeeFileTrainingTargets } from "./EmployeeFileTrainingTargets";
import { EmployeeFileTrainingPlan } from "./EmployeeFileTrainingPlan";
import { buildPlanDeadlineRows, isEvidenceChecked } from "./training-plan";
import { computeComplianceStatus } from "./compliance-status";
import type { EmployeeEvidenceMap } from "./employee-evidence-storage";

export interface EmployeeFileDossierViewProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
  companyName?: string;
  evidenceEditMode?: boolean;
  onToggleEvidenceEdit?: () => void;
  evidenceFiles?: EmployeeEvidenceMap;
  onEvidenceUpload?: (evidenceId: string, file: File) => void;
  onEvidenceRemove?: (evidenceId: string) => void;
  /**
   * P3 / #7 (Mark D1) — Prüf-Toggle je Nachweis (nur Admin/Mark). Fehlt der
   * Handler, ist die Prüfung nicht setzbar. EC-10: „geprüft" = bewusster Klick.
   */
  onToggleEvidenceChecked?: (evidenceId: string) => void;
  onSavePerson?: (employee: Employee) => void;
  onOpenGenerator?: () => void;
}

function formatValue(value: string | undefined): string {
  if (!value) return "—";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return formatIsoToInput(value) || value;
  }
  return value;
}

function SectionHeader({
  icon,
  title,
  subtitle,
  level,
  onEdit,
  editLabel,
  editActive,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  level?: "bedingung" | "anforderung" | "nachweis";
  onEdit?: () => void;
  editLabel?: string;
  /**
   * UX-Fix (M4-Geist): ist der Bearbeiten-Einstieg aktuell „an" (z. B. der
   * Nachweis-Upload-Modus läuft), wird der Button als Vermillion-Primäraktion
   * gezeigt (wie „Speichern“ im Kapitel-Stift). EC-10: schaltet nur den
   * Upload-/Bearbeiten-Modus, keine Prüf-/Freigabeaussage.
   */
  editActive?: boolean;
}) {
  const levelLabel =
    level === "bedingung"
      ? "Bedingung"
      : level === "anforderung"
        ? "Anforderung"
        : level === "nachweis"
          ? "Nachweis"
          : null;

  return (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div>
        {levelLabel ? (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            {levelLabel}
          </p>
        ) : null}
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
          {icon}
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-[#6b7280]">{subtitle}</p>
        ) : null}
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className={
            editActive
              ? "inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e30613] bg-[#e30613] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#b80510]"
              : "inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e30613] bg-[rgba(227,6,19,0.06)] px-2.5 py-1.5 text-xs font-semibold text-[#b80510] hover:bg-[rgba(227,6,19,0.1)]"
          }
        >
          {editActive ? <Check className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
          {editLabel ?? "Bearbeiten"}
        </button>
      ) : null}
    </div>
  );
}

function ClauseBadge({ clauseId }: { clauseId?: string | null }) {
  if (clauseId === undefined) return null;
  if (clauseId === null) {
    return (
      <span className="inline-flex shrink-0 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-800">
        ohne CL
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 rounded border border-[#e5e7eb] bg-[#f9fafb] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#6b7280]">
      {clauseId}
    </span>
  );
}

function RequirementTable({ rows }: { rows: RequirementRow[] }) {
  return (
    <ul className="divide-y divide-[#e5e7eb] rounded-lg border border-[#e5e7eb]">
      {rows.map((row) => (
        <li
          key={row.id}
          className="flex flex-col gap-1 px-3 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-[#111827]">{row.label}</p>
              <ClauseBadge clauseId={row.clauseId} />
            </div>
            {row.value ? (
              <p className="mt-0.5 text-xs text-[#374151]">
                {formatValue(row.value)}
              </p>
            ) : null}
            {row.trigger ? (
              <p className="mt-0.5 text-[10px] text-[#9ca3af]">
                Bedingung: {row.trigger}
              </p>
            ) : null}
            {row.hint ? (
              <p className="mt-0.5 text-[10px] text-[#6b7280]">{row.hint}</p>
            ) : null}
          </div>
          <EmployeeFileStatusBadge status={row.status} />
        </li>
      ))}
    </ul>
  );
}

function SubSectionHeader({
  icon,
  title,
  subtitle,
  level,
  onEdit,
  editLabel,
  editActive,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  level?: "bedingung" | "anforderung" | "nachweis";
  onEdit?: () => void;
  editLabel?: string;
  editActive?: boolean;
}) {
  const levelLabel =
    level === "bedingung"
      ? "Bedingung"
      : level === "anforderung"
        ? "Anforderung"
        : level === "nachweis"
          ? "Nachweis"
          : null;

  return (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div>
        {levelLabel ? (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            {levelLabel}
          </p>
        ) : null}
        <h4 className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-[#111827]">
          {icon}
          {title}
        </h4>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[#6b7280]">{subtitle}</p>
        ) : null}
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className={
            editActive
              ? "inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e30613] bg-[#e30613] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#b80510]"
              : "inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e30613] bg-[rgba(227,6,19,0.06)] px-2.5 py-1.5 text-xs font-semibold text-[#b80510] hover:bg-[rgba(227,6,19,0.1)]"
          }
        >
          {editActive ? <Check className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
          {editLabel ?? "Bearbeiten"}
        </button>
      ) : null}
    </div>
  );
}

/**
 * #4 — Unterschrifts-Logik je Schulung-/Unterweisungs-Slot (sichtbar machen).
 * Unterweisungen + Standarddokumente = unterschriftspflichtig (Datenschutz CL-04,
 * Verschwiegenheit CL-05, Dienstanweisung CL-03, Arbeitsschutz/Wiederholung
 * CL-75 „fachlich prüfen"); reine Schulungs-/Qualifikationsnachweise = nur
 * anhängen (kein Unterschrifts-Badge). Werte/Norm-Bezug nur Anzeige — keine neue
 * Engine-Pflicht. Upload nutzt dieselbe Evidence-Infra (`unterweisung:{id}`).
 * EC-10: hochgeladene Nachweise bleiben `unchecked`, keine Auto-Freigabe.
 */
const SCHULUNG_UNTERWEISUNG_SIGNATURE: Record<string, boolean> = {
  allgemein: true, // Allgemeine Unterweisung / Dienstanweisung — CL-03
  "datenschutz-u": true, // Datenschutzunterweisung — CL-04
  "verschwiegenheit-u": true, // Verschwiegenheitsunterweisung — CL-05
  "objekt-u": true, // Objektbezogene Einweisung (Unterweisung, scope-sensitiv)
  "sdl-u": true, // SDL-bezogene Unterweisung
  wiederholung: true, // Wiederholungsunterweisung — Arbeitsschutz CL-75 (fachlich prüfen)
  qualifikation: false, // Schulungs-/Qualifikationsnachweis — nur anhängen
};

/** Stabiler Evidence-Slot je Schulung-/Unterweisungs-Anforderung (#4). */
function unterweisungEvidenceId(rowId: string): string {
  return `unterweisung:${rowId}`;
}

/**
 * #4 — Unterschrifts-Logik je Pflichtnachweis-Slot (Standarddokumente).
 * Standarddokumente, die der MA unterschreibt (Datenschutz CL-04,
 * Verschwiegenheit CL-05), = unterschriftspflichtig. Reine Schulungsnachweise
 * = nur anhängen. Übrige Dokument-Slots (Vertrag/Auszug/Ausweis/…) ohne
 * explizite Unterschrifts-Aussage → kein Badge (`undefined`). Nur Anzeige.
 */
const PFLICHTNACHWEIS_SIGNATURE: Record<string, boolean> = {
  datenschutz: true, // Datenschutz-Erklärung (Standarddokument) — CL-04
  verschwiegenheit: true, // Verschwiegenheitserklärung (Standarddokument) — CL-05
  schulungsnachweise: false, // Sammel-Schulungsnachweise — nur anhängen
};

function catalogMatch(active: string, catalogLabel: string): boolean {
  const a = active.toLowerCase();
  const c = catalogLabel.toLowerCase();
  return (
    a.includes(c.slice(0, 6)) ||
    c.includes(a.split("/")[0].trim().slice(0, 6)) ||
    a.includes(c.split("/")[0].trim())
  );
}

/**
 * #C — Bestellungen-Panel: Multiselect-Akte-Flag „bestellt als …" (NUR die drei
 * formalen Ernennungen Ersthelfer/Brandschutzhelfer/SiBe — CL-08/CL-23/CL-74),
 * sauber getrennt von Schulungen/Unterweisungen. Persistenz über `appointmentIds`
 * (kein neuer DB-Spalt). Jede Bestellung ist unterschriftspflichtig; Generator
 * bietet zwei Wege: aus Vorlage generieren ODER bestehende Bestellung hochladen.
 * EC-10: kein Freigabe-/Auditfähigkeits-Wording, hochgeladene Nachweise bleiben
 * `unchecked`.
 */
function BestellungenPanel({
  employee,
  onSavePerson,
  evidenceFiles,
  evidenceEditMode,
  onToggleEvidenceEdit,
  onEvidenceUpload,
  onEvidenceRemove,
  onOpenGenerator,
}: {
  employee: Employee;
  onSavePerson?: (employee: Employee) => void;
  evidenceFiles: EmployeeEvidenceMap;
  evidenceEditMode: boolean;
  onToggleEvidenceEdit?: () => void;
  onEvidenceUpload?: (evidenceId: string, file: File) => void;
  onEvidenceRemove?: (evidenceId: string) => void;
  onOpenGenerator?: () => void;
}) {
  const active = new Set<BestellungTyp>(getBestelltAls(employee));

  function toggle(typ: BestellungTyp) {
    if (!onSavePerson) return;
    const next = new Set(active);
    if (next.has(typ)) next.delete(typ);
    else next.add(typ);
    // Lane J / Lane N P1: `bestelltAls` ist die echte persistierte Quelle →
    // direkt setzen. Die drei Bestellungen liegen in EINEM realen S3-Ordner
    // (`bestellungen`, drei Dateien); der Patch hält darum sowohl `appointmentIds`
    // (Ordner) als auch `selectedAppointmentDocIds` (genau die gewählten
    // Bestell-`.docx`) synchron, damit der Generator nur die ausgewählten
    // Bestellungen erzeugt (EC-09). KEIN Auto-Status (EC-10).
    const { appointmentIds, selectedAppointmentDocIds } = setBestelltAlsPatch(
      employee,
      [...next],
    );
    onSavePerson({
      ...employee,
      appointmentIds,
      selectedAppointmentDocIds,
      bestelltAls: [...next],
    });
  }

  return (
    <div>
      <SubSectionHeader
        icon={<ClipboardSignature className="h-3.5 w-3.5 text-[#e30613]" />}
        title="Bestellungen (bestellt als …)"
        subtitle="Formale Ernennung (unterschriftspflichtig) — Ersthelfer / Brandschutzhelfer / SiBe. Bestellung ≠ Schulung."
        level="anforderung"
        onEdit={onToggleEvidenceEdit}
        editActive={evidenceEditMode}
        editLabel={
          evidenceEditMode ? "Fertig" : "Bestellungen hochladen / bearbeiten"
        }
      />
      <div className="mb-3 flex flex-wrap gap-1.5">
        {BESTELLUNG_DEFS.map((def) => {
          const isOn = active.has(def.typ);
          return (
            <button
              key={def.typ}
              type="button"
              disabled={!onSavePerson || !evidenceEditMode}
              onClick={() => toggle(def.typ)}
              className={
                isOn
                  ? "inline-flex items-center gap-1.5 rounded-md border border-[rgba(227,6,19,0.35)] bg-[rgba(227,6,19,0.08)] px-2.5 py-1 text-xs font-medium text-[#b80510] disabled:cursor-default"
                  : "inline-flex items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1 text-xs text-[#6b7280] hover:border-[rgba(227,6,19,0.35)] disabled:cursor-default disabled:hover:border-[#e5e7eb]"
              }
              aria-pressed={isOn}
              title={def.schulungHint}
            >
              {def.label}
              <span className="rounded border border-[#e5e7eb] bg-[#f9fafb] px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                {def.clauseId}
              </span>
            </button>
          );
        })}
      </div>

      {active.size > 0 ? (
        <ul className="space-y-2">
          {BESTELLUNG_DEFS.filter((d) => active.has(d.typ)).map((def) => {
            const evidenceId = `bestellung:${def.typ}`;
            const stored = evidenceFiles[evidenceId];
            return (
              <li
                key={def.typ}
                className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm text-[#111827]">
                      {def.label}
                      <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                        unterschriftspflichtig
                      </span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#9ca3af]">
                      {def.schulungHint}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {onOpenGenerator ? (
                    <button
                      type="button"
                      onClick={onOpenGenerator}
                      className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] px-2 py-1 text-[11px] text-[#374151] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
                    >
                      <FilePlus2 className="h-3 w-3" />
                      Aus Vorlage generieren
                    </button>
                  ) : null}
                  {evidenceEditMode ? (
                    <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#e5e7eb] px-2 py-1 text-[11px] text-[#374151] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]">
                      <Upload className="h-3 w-3" />
                      {stored ? "Ersetzen" : "Bestellung hochladen"}
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onEvidenceUpload?.(evidenceId, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  ) : null}
                  {stored ? (
                    <span className="inline-flex items-center gap-2 text-[11px] text-[#6b7280]">
                      {stored.fileName}
                      <span className="rounded border border-[#e5e7eb] bg-[#f9fafb] px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                        unchecked
                      </span>
                      {evidenceEditMode && onEvidenceRemove ? (
                        <button
                          type="button"
                          onClick={() => onEvidenceRemove(evidenceId)}
                          className="text-[#9ca3af] underline hover:text-[#e30613]"
                        >
                          Entfernen
                        </button>
                      ) : null}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#9ca3af]">
                      Kein Dokument hinterlegt
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-[#e5e7eb] px-3 py-3 text-xs text-[#6b7280]">
          Keine Bestellung erfasst. Bestellung wählen → aus Vorlage generieren
          oder bestehende Bestellung hochladen. Keine Schulungen/Unterweisungen
          unter Bestellungen.
        </p>
      )}
    </div>
  );
}

export const EmployeeFileDossierView: React.FC<EmployeeFileDossierViewProps> = ({
  employee,
  roles,
  appointments,
  companyName = "",
  evidenceEditMode = false,
  onToggleEvidenceEdit,
  evidenceFiles = {},
  onEvidenceUpload,
  onEvidenceRemove,
  onToggleEvidenceChecked,
  onSavePerson,
  onOpenGenerator,
}) => {
  // Mockup-Akte — 6 horizontale Sektions-Reiter (Dossier-Cockpit). „Offene
  // Punkte" = Default/Cockpit; beim Bearbeiten auf „Stammdaten" springen, damit
  // Eingabefelder sichtbar sind. Reine Anzeige/IA, kein Engine-/Daten-Eingriff.
  type AkteTab =
    | "offene-punkte"
    | "stammdaten"
    | "rollen-sdl"
    | "nachweise"
    | "unterweisungen"
    | "generator";
  const [activeTab, setActiveTab] = React.useState<AkteTab>("offene-punkte");
  // M4 / §3.4 — Stammdaten/Rollen werden je Kapitel über einen eigenen Stift
  // bearbeitet (EmployeeFileChapterEdit), nicht mehr über den globalen Toggle.
  // Der globale `evidenceEditMode` steuert nur noch die Upload-/Nachweis-Schicht
  // (Bestellungen-Dokumente, Nachweise, Unterweisungen) — kein automatischer
  // Kapitel-Sprung mehr nötig.

  const role = roles.find((r) => r.id === employee.roleId);
  const apiRoleName = role?.name ?? employee.roleId;
  // P3 / #7 — Prüf-Status je Nachweis (Mark D1). Lese-Helfer; EC-10: nur
  // explizit gesetzte „geprüft"-Vermerke gelten.
  const evidenceChecks = employee.evidenceChecks;
  const isChecked = (evidenceId: string) =>
    isEvidenceChecked(evidenceChecks, evidenceId);

  const summary = getEmployeeFileSummary(
    employee,
    appointments,
    companyName,
    roleLabelDe(employee.roleId, apiRoleName),
  );

  const docCount =
    employee.selectedRoleDocIds.length +
    employee.selectedAppointmentDocIds.length;

  // Queue C — Plan-Fristen operativ in die Ampel mergen (Engine unberührt).
  // P3 / #7: ein vorhandener Nachweis zählt erst nach menschlicher Prüfung als
  // erfüllt; ungeprüft bleibt er in-Arbeit/gelb (kein Auto-Grün, EC-10).
  const planDeadlineRows = buildPlanDeadlineRows(
    employee.trainingPlan ?? [],
    (evidenceId) => Boolean(evidenceFiles[evidenceId]),
    undefined,
    isChecked,
  );
  const mergedFristen = [...summary.fristen, ...planDeadlineRows];

  // Phase 2 — Gesamt-Status-Pille im Akte-Kopf (rechnerisch, EC-10: kein
  // Freigabe-/Auditstatus). Status-Farben getrennt vom Brand (Visual-Direction).
  const compliance = computeComplianceStatus(summary.pflichtSet, mergedFristen);
  const openCount = compliance.counts.kritisch + compliance.counts.offen;
  const statusPill =
    compliance.overall === "offen"
      ? { dot: "bg-red-500", cls: "border-red-200 bg-red-50 text-red-700", text: `${openCount} offen` }
      : compliance.overall === "in-arbeit"
        ? { dot: "bg-amber-500", cls: "border-amber-200 bg-amber-50 text-amber-700", text: `${openCount} offen` }
        : compliance.overall === "rechnerisch-vollstaendig"
          ? { dot: "bg-green-500", cls: "border-green-200 bg-green-50 text-green-700", text: "rechnerisch vollständig" }
          : { dot: "bg-gray-300", cls: "border-gray-200 bg-gray-50 text-gray-500", text: "kein Pflicht-Set" };
  const orgTitle = employee.roleType?.trim() || summary.roleName;
  const scopeLabels = summary.geltungsbereich.map((r) => r.label).join(", ");

  // Phase 3 — „Was fehlt → nächster Schritt": Handlungs-Hinweis je offenem Punkt.
  // DM-A (Default): extern = behördlich/Anbieter-Nachweis (§34a, Erste Hilfe,
  // Brandschutz, Bundesauszug, Dienstausweis, Weiterbildung, Studium/Polizei) →
  // anfordern/nachreichen; sonst intern erzeugbar (Standarddoks/Bestellungen).
  // Reine Anzeige-Heuristik, KEINE Norm-Wirkung.
  const resolveActionHint = (
    label: string,
  ): { kind: "intern" | "extern"; text: string } => {
    const l = label.toLowerCase();
    const extern =
      /sachkunde|unterrichtung|34a|erste hilfe|ersthelfer|brandschutz|bundesauszug|bewacherregister|dienstausweis|weiterbildung|schulung|polizei|studium|meister|gssk|fachkraft/.test(
        l,
      );
    return extern
      ? { kind: "extern", text: "extern · anfordern/nachreichen" }
      : { kind: "intern", text: "intern · erzeugen" };
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="border-b border-[#e5e7eb] bg-linear-to-r from-[rgba(227,6,19,0.06)] to-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
              Mitarbeiterakte
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#111827]">
              {employee.fullName || "Unbenannt"}
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              {orgTitle}
              {companyName ? ` · ${companyName}` : ""}
              {scopeLabels ? ` · Geltungsbereich: ${scopeLabels}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {/* Phase 2 — Gesamt-Status-Pille (Status-Farbe, kein Brand; EC-10). */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusPill.cls}`}
              title="Rechnerischer Stand — eingehende Nachweise gelten als ungeprüft (keine Freigabe-/Auditaussage)."
            >
              <span className={`h-2 w-2 rounded-full ${statusPill.dot}`} aria-hidden />
              {statusPill.text}
            </span>
            {onToggleEvidenceEdit ? (
              <button
                type="button"
                onClick={onToggleEvidenceEdit}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  evidenceEditMode
                    ? "border-[#e30613] bg-[rgba(227,6,19,0.08)] text-[#b80510]"
                    : "border-[#e5e7eb] text-[#6b7280] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
                }`}
                title={
                  evidenceEditMode
                    ? "Nachweis-Bearbeitung beenden (zurück zu Ansehen)"
                    : "Nachweise & Dokumente bearbeiten — Bestellungen/Nachweise/Unterweisungen hochladen (Stammdaten/Rollen je Kapitel über den Stift)"
                }
              >
                <Pencil className="h-3.5 w-3.5" />
                {evidenceEditMode ? "Nachweise fertig" : "Nachweise bearbeiten"}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* M2 — horizontale Kapitel-Reiter (Dossier-Cockpit). Aktiver Reiter
          Vermillion (Visual-Direction); Status-Punkt (amber) je Kapitel mit
          offenen Punkten. Reine IA/Anzeige, EC-10. */}
      <nav
        className="flex flex-wrap gap-1 border-b border-[#e5e7eb] bg-white px-3 py-2"
        aria-label="Akte-Kapitel"
      >
        {(
          [
            ["offene-punkte", "Offene Punkte", summary.openIssues.length > 0],
            ["stammdaten", "Stammdaten", summary.missingPflichtangaben > 0],
            ["rollen-sdl", "Rollen & SDL", false],
            ["nachweise", "Nachweise", summary.missingNachweise > 0],
            ["unterweisungen", "Unterweisungen", false],
            ["generator", "Generator", false],
          ] as ReadonlyArray<readonly [AkteTab, string, boolean]>
        ).map(([id, label, dot]) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              aria-pressed={active}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-lg border border-[#e30613] bg-[rgba(227,6,19,0.08)] px-3 py-1.5 text-xs font-semibold text-[#b80510]"
                  : "inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-[#6b7280] hover:text-[#111827]"
              }
            >
              {label}
              {dot ? (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-amber-500"
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* OFFENE PUNKTE — Cockpit: Status, „was fehlt → nächster Schritt", Pflicht-Set */}
      {activeTab === "offene-punkte" ? (
        <div className="grid gap-0 divide-y divide-[#e5e7eb]">
          <EmployeeFilePflichtStatusPanel
            pflichtSet={summary.pflichtSet}
            fristen={mergedFristen}
          />
          <section className="p-5">
            <SectionHeader
              icon={<ListChecks className="h-4 w-4 text-[#e30613]" />}
              title="Pflicht-Set (abgeleitet)"
              subtitle="Automatisch aus Rolle × Beauftragung × SDL × Beschäftigungsart × Dienstfahrzeug — jede Pflicht mit Norm-Fundstelle (CL-xx)"
              level="anforderung"
            />
            {summary.pflichtSet.length > 0 ? (
              <RequirementTable rows={summary.pflichtSet} />
            ) : (
              <p className="rounded-lg border border-dashed border-[#e5e7eb] px-3 py-4 text-sm text-[#6b7280]">
                Kein Pflicht-Set ableitbar — Rolle und ggf. SDL/Geltungsbereich
                erfassen.
              </p>
            )}

            {summary.fristen.length > 0 ? (
              <div className="mt-6">
                <SubSectionHeader
                  icon={
                    <CalendarClock className="h-3.5 w-3.5 text-[#e30613]" />
                  }
                  title="Fristen / Termine"
                  subtitle="Frist-Vorstufe (volle Ampel folgt) — Sachkunde 6 Monate, Erste Hilfe 2 J., Brandschutz 3 J."
                  level="anforderung"
                />
                <RequirementTable rows={summary.fristen} />
              </div>
            ) : null}

            {summary.engineHinweise.length > 0 ? (
              <ul className="mt-4 space-y-1.5">
                {summary.engineHinweise.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-2.5 py-2 text-[11px] text-[#6b7280]"
                  >
                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-[#9ca3af]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section className="bg-[#fafbfc] p-5">
            <SectionHeader
              icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
              title="Was fehlt — nächster Schritt"
              subtitle="Konsolidiert je offenem Punkt: intern erzeugen vs. extern anfordern/nachreichen (Heuristik, EC-10 — kein Freigabestatus)"
            />
            {summary.openIssues.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
                Keine offenen Punkte aus den erfassten Angaben abgeleitet.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {summary.openIssues.map((issue) => {
                  const action = resolveActionHint(issue.label);
                  return (
                    <li
                      key={issue.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-[#e5e7eb] bg-white px-2.5 py-2"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="text-xs text-[#111827]">
                          {issue.label}
                        </span>
                        <EmployeeFileStatusBadge status={issue.status} />
                      </span>
                      <span
                        className={
                          action.kind === "intern"
                            ? "shrink-0 rounded border border-[rgba(227,6,19,0.3)] bg-[rgba(227,6,19,0.06)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#b80510]"
                            : "shrink-0 rounded border border-[#e5e7eb] bg-[#f9fafb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]"
                        }
                      >
                        {action.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            {compliance.counts.erfuellt > 0 ? (
              <p className="mt-3 flex items-center gap-2 text-xs text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
                {compliance.counts.erfuellt} Pflichtposten erfüllt (rechnerisch,
                ungeprüft)
              </p>
            ) : null}
          </section>

          <section className="border-t border-[#e5e7eb] bg-white px-5 py-3">
            <p className="flex items-start gap-2 text-xs text-[#6b7280]">
              <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Generator (Schritt 2):{" "}
                <span className="font-medium text-[#374151]">
                  {docCount} Dokument(e)
                </span>{" "}
                vorgemerkt — keine Freigabe oder Zertifizierungsaussage.
                {onOpenGenerator ? (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={onOpenGenerator}
                      className="font-semibold text-[#e30613] hover:underline"
                    >
                      Generator öffnen →
                    </button>
                  </>
                ) : null}
              </span>
            </p>
          </section>
        </div>
      ) : null}

      {/* STAMMDATEN — Person & Beschäftigung (Eingabe-Kapitel) */}
      {activeTab === "stammdaten" ? (
        <section className="p-5">
          <SectionHeader
            icon={<User className="h-4 w-4 text-[#e30613]" />}
            title="Stammdaten"
            subtitle="Person & Beschäftigung — „Bearbeiten“ je Kapitel zum Ändern"
          />
          {/* M4 / §3.4 — Stift je Kapitel: read-only bis „Bearbeiten“, dann
              lokaler Draft + „Speichern“/„Abbrechen“ (kein Auto-Save). */}
          {onSavePerson ? (
            <EmployeeFileChapterEdit
              employee={employee}
              roles={roles}
              appointments={appointments}
              companyName={companyName}
              rows={summary.personUndRollePflichtangaben}
              onSave={onSavePerson}
              chapters={["stammdaten", "beschaeftigung"]}
            />
          ) : (
            <RequirementTable rows={summary.personUndRollePflichtangaben} />
          )}
        </section>
      ) : null}

      {/* ROLLEN & SDL — Norm-Klasse, Geltungsbereich, Qualifikation, Bestellungen */}
      {activeTab === "rollen-sdl" ? (
        <section className="p-5">
          <SectionHeader
            icon={<ListChecks className="h-4 w-4 text-[#e30613]" />}
            title="Rollen & SDL"
            subtitle="Norm-Klasse, Geltungsbereich (SDL), Qualifikation, Bestellungen — „Bearbeiten“ je Kapitel zum Ändern"
          />
          <div className="space-y-6">
            {/* M4 / §3.4 — Stift je Kapitel (Rolle & Norm, SDL, Qualifikation):
                read-only bis „Bearbeiten“, dann lokaler Draft + Speichern/
                Abbrechen (kein Auto-Save). Bestellungen-Panel unten behält
                den Upload-bezogenen Edit-Modus (Nachweis-Schicht). */}
            {onSavePerson ? (
              <EmployeeFileChapterEdit
                employee={employee}
                roles={roles}
                appointments={appointments}
                companyName={companyName}
                rows={summary.personUndRollePflichtangaben}
                onSave={onSavePerson}
                chapters={["rolle-norm", "sdl", "quali"]}
              />
            ) : null}

            <div className="border-t border-[#e5e7eb] pt-6">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                Grundrollen-Taxonomie
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {GRUNDROLLE_CATALOG.map((label) => (
                  <span
                    key={label}
                    className={
                      catalogMatch(summary.roleName, label)
                        ? "rounded-md border border-[rgba(227,6,19,0.35)] bg-[rgba(227,6,19,0.08)] px-2 py-0.5 text-[10px] font-medium text-[#b80510]"
                        : "rounded-md border border-[#e5e7eb] bg-white px-2 py-0.5 text-[10px] text-[#6b7280]"
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
              {summary.overlayLabels.length > 0 ? (
                <>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Bestellungen-Katalog (zugeordnet hervorgehoben)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ZUSATZROLLEN_CATALOG.map((label) => (
                      <span
                        key={label}
                        className={
                          summary.overlayLabels.some((o) =>
                            catalogMatch(o, label),
                          )
                            ? "rounded-md border border-[rgba(227,6,19,0.35)] bg-[rgba(227,6,19,0.08)] px-2 py-0.5 text-[10px] font-medium text-[#b80510]"
                            : "rounded-md border border-[#e5e7eb] px-2 py-0.5 text-[10px] text-[#6b7280]"
                        }
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div className="border-t border-[#e5e7eb] pt-6">
              <BestellungenPanel
                employee={employee}
                onSavePerson={onSavePerson}
                evidenceFiles={evidenceFiles}
                evidenceEditMode={evidenceEditMode}
                onToggleEvidenceEdit={onToggleEvidenceEdit}
                onEvidenceUpload={onEvidenceUpload}
                onEvidenceRemove={onEvidenceRemove}
                onOpenGenerator={onOpenGenerator}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* NACHWEISE — Pflichtnachweise + Schulung & Unterweisung (Prüf-Schritt ④) */}
      {activeTab === "nachweise" ? (
        <section
          className={
            evidenceEditMode
              ? "bg-[rgba(227,6,19,0.03)] p-5 ring-2 ring-inset ring-[rgba(227,6,19,0.15)]"
              : "p-5"
          }
        >
          <SectionHeader
            icon={<FileCheck className="h-4 w-4 text-[#e30613]" />}
            title="Nachweise"
            subtitle={
              evidenceEditMode
                ? "Pflichtnachweise hochladen — Platzhalter wenn leer"
                : "Dokumente / Nachweisgruppen — je Nachweis prüfbar (geprüft-Klick)"
            }
            onEdit={onToggleEvidenceEdit}
            editActive={evidenceEditMode}
            editLabel={
              evidenceEditMode ? "Fertig" : "Nachweise hochladen / bearbeiten"
            }
          />
          {!evidenceEditMode ? (
            <p className="mb-3 -mt-1 text-[11px] text-[#9ca3af]">
              Zum Hochladen oben auf „Nachweise hochladen / bearbeiten“. EC-10:
              eingehende Nachweise gelten als ungeprüft.
            </p>
          ) : null}
          <ul className="space-y-2">
            {summary.pflichtnachweise.map((row) => (
              <EmployeeFileEvidenceRow
                key={row.id}
                row={row}
                storedFile={evidenceFiles[row.id]}
                editMode={evidenceEditMode}
                signatureRequired={PFLICHTNACHWEIS_SIGNATURE[row.id]}
                onUpload={(file) => onEvidenceUpload?.(row.id, file)}
                onRemove={() => onEvidenceRemove?.(row.id)}
                checked={isChecked(row.id)}
                onToggleChecked={
                  onToggleEvidenceChecked
                    ? () => onToggleEvidenceChecked(row.id)
                    : undefined
                }
              />
            ))}
          </ul>
        </section>
      ) : null}

      {/* UNTERWEISUNGEN — Schulung/Unterweisung + Schulungen (Soll/Ist + Plan) */}
      {activeTab === "unterweisungen" ? (
        <section
          className={
            evidenceEditMode
              ? "bg-[rgba(227,6,19,0.03)] p-5 ring-2 ring-inset ring-[rgba(227,6,19,0.15)]"
              : "p-5"
          }
        >
          <SectionHeader
            icon={<GraduationCap className="h-4 w-4 text-[#e30613]" />}
            title="Unterweisungen & Schulungen"
            subtitle="Unterweisungen/Schulungsnachweise + Soll/Ist-Schulungen — fließt in den Audit-Export. EC-10: rechnerisch, kein Freigabestatus."
            onEdit={onToggleEvidenceEdit}
            editActive={evidenceEditMode}
            editLabel={
              evidenceEditMode ? "Fertig" : "Nachweise hochladen / bearbeiten"
            }
          />
          <div className="space-y-6">
            <div>
              <SubSectionHeader
                icon={<GraduationCap className="h-3.5 w-3.5 text-[#e30613]" />}
                title="Schulung & Unterweisung"
                subtitle={
                  evidenceEditMode
                    ? "Unterschriebene Unterweisung / Schulungsnachweis je Position hochladen — unterschriftspflichtig vs. nur anhängen"
                    : "Verpflichtende Qualifikationen und Anforderungen — unterschriftspflichtig vs. nur anhängen"
                }
                level="anforderung"
              />
              <ul className="space-y-2">
                {summary.schulungUnterweisung.map((row) => {
                  const evidenceId = unterweisungEvidenceId(row.id);
                  return (
                    <EmployeeFileEvidenceRow
                      key={row.id}
                      row={row}
                      storedFile={evidenceFiles[evidenceId]}
                      editMode={evidenceEditMode}
                      signatureRequired={SCHULUNG_UNTERWEISUNG_SIGNATURE[row.id]}
                      onUpload={(file) => onEvidenceUpload?.(evidenceId, file)}
                      onRemove={() => onEvidenceRemove?.(evidenceId)}
                      checked={isChecked(evidenceId)}
                      onToggleChecked={
                        onToggleEvidenceChecked
                          ? () => onToggleEvidenceChecked(evidenceId)
                          : undefined
                      }
                    />
                  );
                })}
              </ul>
            </div>

            {summary.schulungsSoll.length > 0 ? (
              <div className="border-t border-[#e5e7eb] pt-6">
                <SubSectionHeader
                  icon={<GraduationCap className="h-3.5 w-3.5 text-[#e30613]" />}
                  title="Schulungen (Soll/Ist · fürs Audit)"
                  subtitle="Jahresweiterbildung, modulare DIN-1-Schulungen und einmalige SDL-Schulungen — Soll/Ist + Termin-Planung."
                  level="anforderung"
                />
                <div className="space-y-6">
                  <EmployeeFileTrainingTargets
                    targets={summary.schulungsSoll}
                    employee={employee}
                    onSave={onSavePerson}
                  />
                  <EmployeeFileTrainingPlan
                    targets={summary.schulungsSoll}
                    employee={employee}
                    evidenceFiles={evidenceFiles}
                    onSave={onSavePerson}
                    onEvidenceUpload={onEvidenceUpload}
                    onEvidenceRemove={onEvidenceRemove}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* GENERATOR — Doc-Auswahl/ZIP bleibt der bestehende Generator-Tab (EC-09). */}
      {activeTab === "generator" ? (
        <section className="p-5">
          <SectionHeader
            icon={<BookOpen className="h-4 w-4 text-[#e30613]" />}
            title="Generator"
            subtitle="Dokumentenauswahl & ZIP-Erzeugung (getrennter Schritt, EC-09). „erzeugt = Entwurf, kein Freigabe-Nachweis“."
          />
          <p className="text-sm text-[#6b7280]">
            <span className="font-medium text-[#374151]">
              {docCount} Dokument(e)
            </span>{" "}
            vorgemerkt.
          </p>
          {onOpenGenerator ? (
            <button
              type="button"
              onClick={onOpenGenerator}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#e30613] bg-[#e30613] px-3 py-2 text-xs font-semibold text-white hover:brightness-105"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              Dokumente erzeugen
            </button>
          ) : null}
        </section>
      ) : null}

      {/* Aktionen-Footer (Mockup): Nachweis hochladen + Dokumente erzeugen */}
      <section className="flex flex-wrap items-center gap-2 border-t border-[#e5e7eb] bg-[#fafbfc] px-5 py-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab("nachweise");
            if (!evidenceEditMode) onToggleEvidenceEdit?.();
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-semibold text-[#374151] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
        >
          <Upload className="h-3.5 w-3.5" />
          Nachweis hochladen
        </button>
        {onOpenGenerator ? (
          <button
            type="button"
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e30613] bg-[#e30613] px-3 py-2 text-xs font-semibold text-white hover:brightness-105"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            Dokumente erzeugen
          </button>
        ) : null}
        <span className="ml-auto text-[10px] text-[#9ca3af]">
          erzeugt = Entwurf, kein Freigabe-Nachweis
        </span>
      </section>
    </div>
  );
};

EmployeeFileDossierView.displayName = "EmployeeFileDossierView";
