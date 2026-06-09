"use client";

import React, { useRef } from "react";
import { FileText, Upload, X, ExternalLink } from "lucide-react";
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
}

function displayStatus(
  row: RequirementRow,
  hasFile: boolean,
): WorkingItemStatus {
  if (hasFile) return "vorhanden";
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
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFile = Boolean(storedFile);
  const status = displayStatus(row, hasFile);

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
                <span className="rounded border border-[#e5e7eb] bg-[#f9fafb] px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                  unchecked
                </span>
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
