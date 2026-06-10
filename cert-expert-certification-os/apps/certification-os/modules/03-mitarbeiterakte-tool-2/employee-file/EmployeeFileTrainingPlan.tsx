"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  CalendarRange,
  Plus,
  Trash2,
  Upload,
  FileText,
  X,
  ExternalLink,
  Target,
  ShieldCheck,
} from "lucide-react";
import type { Employee, TrainingPlanItem } from "@/lib/types/employee";
import type { TrainingTarget } from "./requirement-engine";
import type { EmployeeEvidenceMap } from "./employee-evidence-storage";
import {
  computeTrainingGaps,
  derivePlanItemStatus,
  planEvidenceId,
  attachExternerUeVorschlag,
  setUeBestaetigt,
  recognizedUe,
  defaultPlannedDateForNewItem,
  isEvidenceChecked,
  type PlanItemStatus,
} from "./training-plan";
import { TRAINING_CATALOG, extractUeFromText } from "./training-catalog";

/**
 * Termin-Planung Schulungen (Queue C) — gap-getriebener Planungsbereich.
 *
 * Zeigt je Soll-Posten die Lücke (Soll−Ist−Rest, read-only — die Ist-Eingabe
 * bleibt in `EmployeeFileTrainingTargets`) und erlaubt gezielte Modul-/Soll-
 * Posten-Zuweisung mit geplantem Datum (Bulk + Override) und eigenem Nachweis-
 * Slot je Eintrag (bestehende Evidence-Infra, `training-plan:{id}`).
 *
 * EC-10 (hart): rein rechnerischer Planungsstand — KEIN Freigabe-/Audit-/
 * Zertifizierungsstatus. Module = Lehrbausteine (kein Norm-Soll). Kein Auto-Ist.
 * Ohne `onSave` = read-only (kein Add/Edit/Upload/Remove).
 */

export interface EmployeeFileTrainingPlanProps {
  targets: TrainingTarget[];
  employee: Employee;
  evidenceFiles?: EmployeeEvidenceMap;
  /** Edit-Modus nur, wenn gesetzt (wie TrainingTargets). */
  onSave?: (employee: Employee) => void;
  onEvidenceUpload?: (evidenceId: string, file: File) => void;
  onEvidenceRemove?: (evidenceId: string) => void;
  /** Stichtag für die Überfällig-Berechnung (Tests/SSR). */
  referenceDate?: string;
}

const STATUS_PILL: Record<PlanItemStatus, { label: string; cls: string }> = {
  geplant: {
    label: "geplant",
    cls: "bg-amber-50 text-amber-800 border-amber-200",
  },
  ueberfaellig: {
    label: "überfällig",
    cls: "bg-red-50 text-red-800 border-red-200",
  },
  // P3 / #7: Nachweis liegt vor, aber noch nicht (menschlich) geprüft →
  // in-Arbeit/gelb (kein Auto-Grün, EC-10).
  "vorhanden-ungeprueft": {
    label: "vorhanden · ungeprüft",
    cls: "bg-amber-50 text-amber-800 border-amber-200",
  },
  // P3 / #7: Nachweis vorhanden UND „geprüft" gesetzt → erfüllt/grün.
  "nachweis-vorhanden": {
    label: "Nachweis geprüft",
    cls: "bg-green-50 text-green-800 border-green-200",
  },
  "ohne-datum": {
    label: "ohne Datum",
    cls: "bg-gray-50 text-gray-600 border-gray-200",
  },
};

function makeItemId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `tp-${crypto.randomUUID()}`;
  }
  return `tp-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export const EmployeeFileTrainingPlan: React.FC<
  EmployeeFileTrainingPlanProps
> = ({
  targets,
  employee,
  evidenceFiles = {},
  onSave,
  onEvidenceUpload,
  onEvidenceRemove,
  referenceDate,
}) => {
  const editable = Boolean(onSave);
  const plan = employee.trainingPlan ?? [];
  const gaps = useMemo(
    () => computeTrainingGaps(targets, employee),
    [targets, employee],
  );

  const [selection, setSelection] = useState<string>("");
  const [bulkDate, setBulkDate] = useState<string>("");

  const writePlan = (next: TrainingPlanItem[]) => {
    if (!onSave) return;
    onSave({ ...employee, trainingPlan: next });
  };

  // P3 / #7 (Mark D1) — Prüf-/„geschlossen"-Toggle je Plan-Nachweis (nur Admin/
  // Mark, d. h. nur im Edit-Modus `onSave`). EC-10 (kein Auto-Grün): „geprüft" =
  // bewusster menschlicher Klick. Persistiert additiv über
  // `employee.evidenceChecks` (Lane-J-Json) im bestehenden Akten-Save.
  const togglePlanChecked = (item: TrainingPlanItem) => {
    if (!onSave) return;
    const evidenceId = planEvidenceId(item.id);
    const current = employee.evidenceChecks ?? {};
    const wasChecked = current[evidenceId]?.geprueft === true;
    const next = { ...current };
    if (wasChecked) {
      delete next[evidenceId];
    } else {
      next[evidenceId] = {
        geprueft: true,
        am: new Date().toISOString(),
        von: "Admin",
      };
    }
    onSave({
      ...employee,
      evidenceChecks: Object.keys(next).length > 0 ? next : undefined,
    });
  };

  const handleAdd = () => {
    if (!selection || !onSave) return;
    let item: TrainingPlanItem | null = null;
    if (selection.startsWith("katalog:")) {
      const id = selection.slice("katalog:".length);
      const mod = TRAINING_CATALOG.find((m) => m.id === id);
      if (mod) {
        item = {
          id: makeItemId(),
          source: "katalog",
          refId: mod.id,
          label: mod.label,
          ue: mod.ue,
          clauseId: mod.clauseId,
          // #5 — eigene Cert-Expert-Schulung: Katalog-UE bekannt → automatisch
          // anerkannt (keine Unterschrift, Schulungsnachweis ≠ Unterweisung).
          // Fließt über CL-27-Anrechnung in den Ist-Wert (Lücke verkleinert sich).
          ueAnerkennung: "eigen-katalog",
        };
      }
    } else if (selection.startsWith("soll:")) {
      const id = selection.slice("soll:".length);
      const t = targets.find((x) => x.id === id);
      if (t) {
        item = {
          id: makeItemId(),
          source: "soll-posten",
          refId: t.id,
          label: t.label,
          ue: t.ue,
          clauseId: t.clauseId,
        };
      }
    }
    if (item) {
      // #3 (Mark D3) — Default-Datum eines NEU erzeugten Eintrags = Einstellungs-/
      // Unterschriftsdatum (`startDate`) für Gruppe-1-Erst-Standardposten;
      // Einzelschulungen (Katalog-Module) bleiben ohne Datum. In jedem Fall frei
      // überschreibbar (das Datum-Feld unten ist immer editierbar).
      const defaultDate = defaultPlannedDateForNewItem(item, employee);
      if (defaultDate) item = { ...item, plannedDate: defaultDate };
      writePlan([...plan, item]);
      setSelection("");
    }
  };

  const handleDateChange = (itemId: string, value: string) => {
    writePlan(
      plan.map((p) =>
        p.id === itemId
          ? { ...p, plannedDate: value || undefined }
          : p,
      ),
    );
  };

  const handleBulkApply = () => {
    if (!bulkDate || plan.length === 0) return;
    writePlan(plan.map((p) => ({ ...p, plannedDate: bulkDate })));
  };

  const handleRemove = (item: TrainingPlanItem) => {
    onEvidenceRemove?.(planEvidenceId(item.id));
    writePlan(plan.filter((p) => p.id !== item.id));
  };

  /**
   * #5 — externer Upload an einem Plan-Eintrag: Nachweis hochladen (bestehende
   * Evidence-Infra) **und** UE best-effort aus dem Dateinamen extrahieren. Der
   * Treffer bleibt **Vorschlag/`unchecked`** (EC-10), bis er fachlich bestätigt
   * wird. Eigen-Katalog-Einträge (UE bereits bekannt) werden NICHT überschrieben.
   */
  const handlePlanUpload = (item: TrainingPlanItem, file: File) => {
    onEvidenceUpload?.(planEvidenceId(item.id), file);
    if (!onSave) return;
    if (item.ueAnerkennung === "eigen-katalog") return; // UE bekannt — kein Vorschlag.
    const vorschlag = extractUeFromText(file.name);
    if (vorschlag === null && item.ueAnerkennung !== "extern") return;
    writePlan(
      plan.map((p) =>
        p.id === item.id
          ? attachExternerUeVorschlag(p, vorschlag, file.name)
          : p,
      ),
    );
  };

  /** #5 — fachliche Bestätigung/Rücknahme eines externen UE-Vorschlags (EC-10). */
  const handleConfirmVorschlag = (item: TrainingPlanItem, confirmed: boolean) => {
    writePlan(
      plan.map((p) => (p.id === item.id ? setUeBestaetigt(p, confirmed) : p)),
    );
  };

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white">
      <div className="flex items-start justify-between gap-2 border-b border-[#e5e7eb] px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Planung
          </p>
          <h4 className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-[#111827]">
            <CalendarRange className="h-3.5 w-3.5 text-[#e30613]" />
            Termin-Planung Schulungen (lücken-getrieben)
          </h4>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6b7280]">
          rechnerisch · kein Freigabestatus
        </span>
      </div>

      {/* Lücke je Soll-Posten (read-only — Ist-Eingabe bleibt im Schulungs-Soll) */}
      {gaps.length > 0 ? (
        <div className="border-b border-[#e5e7eb] px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
            <Target className="h-3 w-3" />
            Lücke je Soll-Posten (Soll − Ist)
          </p>
          <ul className="space-y-1.5">
            {gaps.map((g) => (
              <li
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md border border-[#f1f3f5] bg-[#fafbfc] px-2.5 py-1.5 text-xs"
              >
                <span className="min-w-0 flex-1 text-[#111827]">{g.label}</span>
                {g.soll === null ? (
                  <span className="text-[#6b7280]">
                    Kein belegter UE-Wert — fachlich prüfen
                  </span>
                ) : (
                  <span className="flex flex-wrap items-center gap-x-3 text-[#374151]">
                    <span>
                      Soll{" "}
                      <span className="font-semibold text-[#111827]">
                        {g.soll}
                      </span>
                    </span>
                    <span>
                      Ist{" "}
                      <span className="font-semibold text-[#111827]">
                        {g.ist}
                      </span>
                    </span>
                    <span
                      className={
                        g.rest && g.rest > 0
                          ? "font-semibold text-amber-700"
                          : "font-semibold text-green-700"
                      }
                    >
                      Lücke {g.rest}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Hinzufügen + Bulk-Datum (nur Edit) */}
      {editable ? (
        <div className="flex flex-col gap-2 border-b border-[#e5e7eb] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <select
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-[#e5e7eb] px-2 py-1.5 text-xs text-[#111827] focus:border-[#e30613] focus:outline-none"
            >
              <option value="">Schulung/Modul zum Lücke-Schließen wählen …</option>
              {targets.length > 0 ? (
                <optgroup label="Soll-Posten (Engine)">
                  {targets.map((t) => (
                    <option key={`soll:${t.id}`} value={`soll:${t.id}`}>
                      {t.label}
                      {t.ue !== null ? ` (${t.ue} UE)` : ""}
                    </option>
                  ))}
                </optgroup>
              ) : null}
              <optgroup label="DIN-1 Module (Lehrbausteine — kein Norm-Soll)">
                {TRAINING_CATALOG.map((m) => (
                  <option key={`katalog:${m.id}`} value={`katalog:${m.id}`}>
                    {m.label} ({m.ue} UE)
                  </option>
                ))}
              </optgroup>
            </select>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selection}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e30613] bg-[rgba(227,6,19,0.06)] px-2.5 py-1.5 text-xs font-semibold text-[#b80510] hover:bg-[rgba(227,6,19,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Zuweisen
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <input
              type="date"
              value={bulkDate}
              onChange={(e) => setBulkDate(e.target.value)}
              className="rounded-md border border-[#e5e7eb] px-2 py-1.5 text-xs text-[#111827] focus:border-[#e30613] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleBulkApply}
              disabled={!bulkDate || plan.length === 0}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e5e7eb] px-2.5 py-1.5 text-xs font-medium text-[#374151] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613] disabled:cursor-not-allowed disabled:opacity-50"
              title="Datum für alle Plan-Einträge setzen"
            >
              <CalendarRange className="h-3.5 w-3.5" />
              Datum für alle
            </button>
          </div>
        </div>
      ) : null}

      {/* Plan-Liste */}
      {plan.length === 0 ? (
        <p className="px-4 py-4 text-xs text-[#6b7280]">
          {editable
            ? "Noch keine Schulung geplant. Modul/Posten oben auswählen, um eine Lücke gezielt zu schließen."
            : "Keine geplanten Schulungen."}
        </p>
      ) : (
        <ul className="divide-y divide-[#f1f3f5]">
          {plan.map((item) => {
            const evidenceId = planEvidenceId(item.id);
            const stored = evidenceFiles[evidenceId];
            const hasProof = Boolean(stored);
            const checked = isEvidenceChecked(employee.evidenceChecks, evidenceId);
            const status = derivePlanItemStatus(
              item,
              hasProof,
              referenceDate,
              checked,
            );
            const pill = STATUS_PILL[status];
            return (
              <li key={item.id} className="px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm text-[#111827]">
                      {item.label}
                      {/* #4 — Schulungsnachweis = nur anhängen (keine Unterschrift). */}
                      <span className="rounded border border-[#e5e7eb] bg-[#f9fafb] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                        nur anhängen
                      </span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#9ca3af]">
                      {item.ue !== null ? `${item.ue} UE · ` : ""}
                      {item.source === "katalog"
                        ? "Lehrbaustein — kein eigener Norm-UE-Wert"
                        : `Soll-Posten${item.clauseId ? ` · ${item.clauseId}` : ""}`}
                    </p>
                    {/* #5 — UE-Anerkennung (Variante C) */}
                    <UeAnerkennungInfo
                      item={item}
                      editable={editable}
                      onConfirm={(confirmed) =>
                        handleConfirmVorschlag(item, confirmed)
                      }
                    />
                  </div>
                  <span
                    className={`inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${pill.cls}`}
                  >
                    {pill.label}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[#374151]">
                    Geplant:
                    <input
                      type="date"
                      value={item.plannedDate ?? ""}
                      onChange={(e) =>
                        handleDateChange(item.id, e.target.value)
                      }
                      disabled={!editable}
                      className="rounded-md border border-[#e5e7eb] px-2 py-1 text-xs text-[#111827] focus:border-[#e30613] focus:outline-none disabled:bg-[#fafbfc] disabled:text-[#6b7280]"
                    />
                  </label>

                  {/* Nachweis-Slot (bestehende Evidence-Infra). Upload läuft über
                      handlePlanUpload → speichert Datei + extrahiert externen
                      UE-Vorschlag (best-effort, unchecked bis Bestätigung, #5). */}
                  <PlanEvidenceSlot
                    evidenceId={evidenceId}
                    stored={stored}
                    editable={editable}
                    onUpload={(_id, file) => handlePlanUpload(item, file)}
                    onRemove={onEvidenceRemove}
                  />

                  {/* P3 / #7 (Mark D1) — Prüf-Toggle, nur Admin/Mark (Edit-Modus)
                      und nur bei vorhandenem Nachweis. EC-10: kein Auto-Grün. */}
                  {editable && hasProof ? (
                    <button
                      type="button"
                      onClick={() => togglePlanChecked(item)}
                      aria-pressed={checked}
                      className={
                        checked
                          ? "inline-flex items-center gap-1 rounded-md border border-green-300 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
                          : "inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                      }
                      title={
                        checked
                          ? "Prüfung zurücknehmen"
                          : "Nachweis als geprüft markieren (Admin/Mark)"
                      }
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {checked ? "Geprüft ✓" : "Als geprüft markieren"}
                    </button>
                  ) : null}

                  {editable ? (
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="ml-auto inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] px-2 py-1 text-xs text-[#6b7280] hover:border-red-300 hover:text-red-600"
                      title="Plan-Eintrag entfernen"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Entfernen
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="border-t border-[#e5e7eb] px-4 py-2.5 text-[10px] text-[#9ca3af]">
        Operative Planung — Module füllen das CL-11-Jahres-Soll, sie verändern es
        nicht. Erst-Standardposten (Gruppe 1) erhalten beim Zuweisen das
        Einstellungsdatum als Default — jederzeit überschreibbar; Einzelschulungen
        bekommen ein manuelles Datum. Hochgeladene Nachweise gelten als ungeprüft;
        keine Freigabe-, Auditfähigkeits- oder Zertifizierungsaussage.
      </p>
    </div>
  );
};

EmployeeFileTrainingPlan.displayName = "EmployeeFileTrainingPlan";

interface PlanEvidenceSlotProps {
  evidenceId: string;
  stored?: EmployeeEvidenceMap[string];
  editable: boolean;
  onUpload?: (evidenceId: string, file: File) => void;
  onRemove?: (evidenceId: string) => void;
}

const PlanEvidenceSlot: React.FC<PlanEvidenceSlotProps> = ({
  evidenceId,
  stored,
  editable,
  onUpload,
  onRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFile = Boolean(stored);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(evidenceId, file);
    e.target.value = "";
  };

  if (hasFile) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-2 py-1">
        <FileText className="h-4 w-4 shrink-0 text-[#e30613]" />
        <span className="max-w-[10rem] truncate text-[10px] text-[#111827]">
          {stored!.fileName}
        </span>
        {stored!.dataUrl ? (
          <a
            href={stored!.dataUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#e30613] hover:underline"
          >
            Öffnen
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
        {editable ? (
          <button
            type="button"
            onClick={() => onRemove?.(evidenceId)}
            className="rounded p-0.5 text-[#6b7280] hover:bg-red-50 hover:text-red-600"
            title="Nachweis entfernen"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    );
  }

  if (!editable) {
    return (
      <span className="text-[10px] text-[#9ca3af]">Kein Nachweis</span>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf,image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] px-2 py-1 text-xs text-[#6b7280] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
      >
        <Upload className="h-3.5 w-3.5" />
        Nachweis
      </button>
    </>
  );
};

interface UeAnerkennungInfoProps {
  item: TrainingPlanItem;
  editable: boolean;
  onConfirm: (confirmed: boolean) => void;
}

/**
 * #5 UE-Anerkennung (Variante C) — kompakte Statuszeile je Plan-Eintrag:
 *  - **Eigen-Katalog:** UE bekannt → automatisch anerkannt, fließt in den
 *    Ist-Wert (CL-27). Keine Unterschrift, keine Bestätigung nötig.
 *  - **Extern:** best-effort extrahierter UE-Vorschlag — bleibt `unchecked`
 *    (Vorschlag) bis zur **fachlichen Bestätigung** (bewusster Klick, EC-10).
 *    Erst dann zählt er für den Ist-Wert.
 */
const UeAnerkennungInfo: React.FC<UeAnerkennungInfoProps> = ({
  item,
  editable,
  onConfirm,
}) => {
  if (item.ueAnerkennung === "eigen-katalog") {
    const ue = recognizedUe(item);
    return (
      <p className="mt-1 text-[10px] text-green-700">
        Eigene Cert-Expert-Schulung — {ue} UE automatisch angerechnet (CL-27),
        keine Unterschrift.
      </p>
    );
  }

  if (item.ueAnerkennung === "extern") {
    const bestaetigt = item.ueBestaetigt === true;
    const hatVorschlag =
      typeof item.ueVorschlag === "number" && item.ueVorschlag > 0;
    return (
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {hatVorschlag ? (
          <span
            className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium ${
              bestaetigt
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-violet-200 bg-violet-50 text-violet-900"
            }`}
          >
            {bestaetigt
              ? `${item.ueVorschlag} UE bestätigt (angerechnet)`
              : `Vorschlag: ${item.ueVorschlag} UE — fachlich prüfen (ungeprüft)`}
          </span>
        ) : (
          <span className="inline-flex items-center rounded border border-[#e5e7eb] bg-[#fafbfc] px-1.5 py-0.5 text-[10px] text-[#6b7280]">
            Kein UE-Wert erkannt — fachlich prüfen
          </span>
        )}
        {editable && hatVorschlag ? (
          <button
            type="button"
            onClick={() => onConfirm(!bestaetigt)}
            className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
              bestaetigt
                ? "border-[#e5e7eb] text-[#6b7280] hover:border-amber-300 hover:text-amber-700"
                : "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
            }`}
            title={
              bestaetigt
                ? "Bestätigung zurücknehmen (Ist-Beitrag entfällt)"
                : "UE-Wert fachlich bestätigen → fließt in den Ist-Wert"
            }
          >
            {bestaetigt ? "Bestätigung zurücknehmen" : "Fachlich bestätigen"}
          </button>
        ) : null}
      </div>
    );
  }

  return null;
};
