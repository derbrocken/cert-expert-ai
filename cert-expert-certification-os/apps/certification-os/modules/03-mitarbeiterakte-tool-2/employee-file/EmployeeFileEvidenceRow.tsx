"use client";

import React, { useRef } from "react";
import { FileText, Upload, X, ExternalLink, ShieldCheck } from "lucide-react";
import type { RequirementRow, WorkingItemStatus } from "./employee-file-requirements";
import type { StoredEvidenceFile } from "./employee-evidence-storage";
import { EmployeeFileStatusBadge } from "./EmployeeFileStatusBadge";

export interface EmployeeFileEvidenceRowProps {
  row: RequirementRow;
  storedFile?: StoredEvidenceFile;
  editMode: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  /**
   * #4 — Unterschrifts-Logik sichtbar machen: `true` = unterschriftspflichtig
   * (Unterweisungen/Standarddokumente/Bestellungen), `false` = nur anhängen
   * (reine Schulungsnachweise). `undefined` = kein Unterschrifts-Badge (Default,
   * Pflichtnachweise/Dokument-Slots ohne explizite Unterschrifts-Aussage).
   */
  signatureRequired?: boolean;
  /**
   * P3 / #7 (Mark D1) — wurde der vorhandene Nachweis (menschlich) „geprüft"?
   * EC-10: eingehend `false` (ungeprüft). Nur `true` macht den Status erfüllt/grün.
   */
  checked?: boolean;
  /**
   * P3 / #7 — Prüf-Toggle-Handler (nur Admin/Mark). Fehlt er, ist die Prüfung
   * nicht setzbar (kein Toggle). EC-10: „geprüft" nur durch bewussten Klick.
   */
  onToggleChecked?: () => void;
  /**
   * P4 (c, Mark D4) — optionales **Durchführungsdatum** (ISO `YYYY-MM-DD`) zu
   * diesem Nachweis (z. B. Schulung/Unterweisung). Nur angezeigt, wenn ein
   * Änderungs-Handler (`onDateChange`) durchgereicht wird → so kann der
   * Nachweis-Upload ein Datum-Feld anbieten, ohne dass Slots ohne Datums-Infra
   * eines bekommen. `undefined`/leer = kein Datum (kein erfundenes Datum).
   * EC-10: das Datum ist nur das Durchführungsdatum, KEINE Freigabe.
   */
  evidenceDate?: string;
  /**
   * P4 (c) — Handler für das Durchführungsdatum. Fehlt er, wird KEIN Datum-Feld
   * gezeigt (Default: bestehende Nachweis-Slots ohne Datums-Struktur bleiben
   * unverändert). Leerer Wert = Datum entfernen.
   */
  onDateChange?: (value: string) => void;
}

/**
 * P3 / #7 (EC-10, **kein Auto-Grün**): Nachweis-Status für die Anzeige.
 *  - kein File         → die rohe Anforderung (fehlt/offen/…).
 *  - File + ungeprüft  → `beantragt` (vorhanden, ungeprüft = in-Arbeit/gelb).
 *  - File + geprüft     → `vorhanden` (erfüllt/grün — erst nach menschl. Prüfung).
 */
function displayStatus(
  row: RequirementRow,
  hasFile: boolean,
  checked: boolean,
): WorkingItemStatus {
  if (hasFile) return checked ? "vorhanden" : "beantragt";
  if (row.status === "nicht erforderlich") return "nicht erforderlich";
  return row.status;
}

export const EmployeeFileEvidenceRow: React.FC<EmployeeFileEvidenceRowProps> = ({
  row,
  storedFile,
  editMode,
  onUpload,
  onRemove,
  signatureRequired,
  checked = false,
  onToggleChecked,
  evidenceDate,
  onDateChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFile = Boolean(storedFile);
  const status = displayStatus(row, hasFile, checked);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  return (
    <li className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#111827]">
            {row.label}
            {signatureRequired === true ? (
              <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                unterschriftspflichtig
              </span>
            ) : null}
            {signatureRequired === false ? (
              <span className="rounded border border-[#e5e7eb] bg-[#f9fafb] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                nur anhängen
              </span>
            ) : null}
          </p>
          {row.trigger ? (
            <p className="mt-0.5 text-[10px] text-[#9ca3af]">
              Bedingung: {row.trigger}
            </p>
          ) : null}
          {row.hint ? (
            <p className="mt-0.5 text-[10px] text-[#6b7280]">{row.hint}</p>
          ) : null}
        </div>
        <EmployeeFileStatusBadge status={status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {hasFile ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-3 py-2">
            <FileText className="h-8 w-8 shrink-0 text-[#e30613]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[#111827]">
                {storedFile!.fileName}
              </p>
              <p className="flex items-center gap-1.5 text-[10px] text-[#6b7280]">
                PDF / Nachweisdatei
                {checked ? (
                  <span className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-50 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-green-700">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    geprüft
                  </span>
                ) : (
                  <span className="rounded border border-amber-200 bg-amber-50 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                    vorhanden · ungeprüft
                  </span>
                )}
              </p>
            </div>
            {storedFile!.dataUrl ? (
              <a
                href={storedFile!.dataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-[#e30613] hover:underline"
              >
                Öffnen
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
            {editMode ? (
              <button
                type="button"
                onClick={onRemove}
                className="rounded p-1 text-[#6b7280] hover:bg-red-50 hover:text-red-600"
                title="Datei entfernen"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-dashed border-[#d1d5db] bg-[#fafbfc] px-3 py-2">
            <FileText className="h-8 w-8 shrink-0 text-[#d1d5db]" />
            <div>
              <p className="text-xs text-[#6b7280]">PDF — Platzhalter</p>
              <p className="text-[10px] text-[#9ca3af]">Noch keine Datei</p>
            </div>
          </div>
        )}

        {/* P4 (c, Mark D4) — Durchführungsdatum-Input zum Nachweis. Nur sichtbar,
            wenn ein `onDateChange`-Handler durchgereicht ist (Datums-Infra
            vorhanden). Kein Auto-Datum (kein erfundenes Datum); Hinweis, wenn
            Nachweis vorliegt, aber Datum fehlt. EC-10: nur Durchführungsdatum. */}
        {editMode && onDateChange ? (
          <label className="flex items-center gap-1.5 text-xs text-[#374151]">
            Durchführung:
            <input
              type="date"
              value={evidenceDate ?? ""}
              onChange={(e) => onDateChange(e.target.value)}
              aria-label="Durchführungsdatum"
              className="rounded-md border border-[#e5e7eb] px-2 py-1 text-xs text-[#111827] focus:border-[#e30613] focus:outline-none"
            />
            {hasFile && !evidenceDate ? (
              <span className="text-[10px] text-amber-700">
                Datum eintragen
              </span>
            ) : null}
          </label>
        ) : null}

        {/* P3 / #7 (Mark D1) — Prüf-/„geschlossen"-Toggle, nur Admin/Mark
            (`onToggleChecked` gesetzt) und nur bei vorhandenem Nachweis. EC-10:
            „geprüft" ist ein bewusster menschlicher Klick — erst dann grün. */}
        {hasFile && onToggleChecked ? (
          <button
            type="button"
            onClick={onToggleChecked}
            aria-pressed={checked}
            className={
              checked
                ? "inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                : "inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100"
            }
            title={
              checked
                ? "Prüfung zurücknehmen (Nachweis wird wieder als ungeprüft gewertet)"
                : "Nachweis als geprüft markieren (Admin/Mark) — zählt erst dann als erfüllt"
            }
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {checked ? "Geprüft ✓" : "Als geprüft markieren"}
          </button>
        ) : null}

        {editMode ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf,image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e30613] bg-[rgba(227,6,19,0.06)] px-3 py-2 text-xs font-semibold text-[#b80510] hover:bg-[rgba(227,6,19,0.1)]"
            >
              <Upload className="h-3.5 w-3.5" />
              {hasFile ? "Ersetzen" : "Hochladen"}
            </button>
          </>
        ) : null}
      </div>
    </li>
  );
};

EmployeeFileEvidenceRow.displayName = "EmployeeFileEvidenceRow";
