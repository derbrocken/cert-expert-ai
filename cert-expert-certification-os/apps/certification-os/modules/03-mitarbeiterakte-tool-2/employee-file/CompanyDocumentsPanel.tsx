"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText,
  Upload,
  X,
  ExternalLink,
  ShieldCheck,
  FolderArchive,
} from "lucide-react";
import { getActiveCompanySlug } from "@/lib/company-session";
import {
  COMPANY_DOCUMENT_CATALOG,
  type CompanyDocumentDef,
} from "@/lib/company-documents-catalog";
import {
  loadCompanyDocuments,
  uploadCompanyDocument,
  removeCompanyDocument,
  setCompanyDocumentChecked,
  type CompanyDocumentMap,
} from "./company-documents-storage";

export interface CompanyDocumentsPanelProps {
  compact?: boolean;
  companySlug?: string;
}

interface RowProps {
  def: CompanyDocumentDef;
  stored?: CompanyDocumentMap[string];
  busy: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onToggleChecked: () => void;
}

const DocumentRow: React.FC<RowProps> = ({
  def,
  stored,
  busy,
  onUpload,
  onRemove,
  onToggleChecked,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFile = Boolean(stored);
  const checked = Boolean(stored?.checked);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  return (
    <li className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#111827]">{def.label}</p>
          {!hasFile ? (
            <p className="mt-0.5 text-[10px] text-[#9ca3af]">Noch keine Datei</p>
          ) : null}
        </div>
        {hasFile ? (
          checked ? (
            <span className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-green-700">
              <ShieldCheck className="h-2.5 w-2.5" />
              geprüft
            </span>
          ) : (
            <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
              vorhanden · ungeprüft
            </span>
          )
        ) : (
          <span className="rounded border border-[#e5e7eb] bg-[#f9fafb] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            fehlt
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {hasFile ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-3 py-2">
            <FileText className="h-8 w-8 shrink-0 text-[#e30613]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[#111827]">
                {stored!.fileName}
              </p>
              <p className="text-[10px] text-[#6b7280]">Firmen-Dokument</p>
            </div>
            {stored!.previewUrl ? (
              <a
                href={stored!.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-[#e30613] hover:underline"
              >
                Öffnen
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className="rounded p-1 text-[#6b7280] hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Datei entfernen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-dashed border-[#d1d5db] bg-[#fafbfc] px-3 py-2">
            <FileText className="h-8 w-8 shrink-0 text-[#d1d5db]" />
            <p className="text-xs text-[#6b7280]">Noch keine Datei</p>
          </div>
        )}

        {/* EC-10 — „geprüft" ist ein bewusster menschlicher Klick (kein Auto-Grün). */}
        {hasFile ? (
          <button
            type="button"
            onClick={onToggleChecked}
            disabled={busy}
            aria-pressed={checked}
            className={
              checked
                ? "inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                : "inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-50"
            }
            title={
              checked
                ? "Prüfung zurücknehmen (Dokument wird wieder als ungeprüft gewertet)"
                : "Dokument als geprüft markieren (Admin/Mark)"
            }
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {checked ? "Geprüft ✓" : "Als geprüft markieren"}
          </button>
        ) : null}

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
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e30613] bg-[rgba(227,6,19,0.06)] px-3 py-2 text-xs font-semibold text-[#b80510] hover:bg-[rgba(227,6,19,0.1)] disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          {hasFile ? "Ersetzen" : "Hochladen"}
        </button>
      </div>
    </li>
  );
};

export const CompanyDocumentsPanel: React.FC<CompanyDocumentsPanelProps> = ({
  compact = false,
  companySlug: companySlugProp,
}) => {
  const companySlug = companySlugProp ?? getActiveCompanySlug();
  const [docs, setDocs] = useState<CompanyDocumentMap>({});
  const [hydrated, setHydrated] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setHydrated(false);
    void loadCompanyDocuments(companySlug)
      .then((map) => {
        if (!cancelled) {
          setDocs(map);
          setHydrated(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Firmen-Dokumente konnten nicht geladen werden.");
          setHydrated(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [companySlug]);

  const handleUpload = useCallback(
    async (documentId: string, file: File) => {
      setBusyId(documentId);
      setError(null);
      try {
        const saved = await uploadCompanyDocument(companySlug, documentId, file);
        setDocs((prev) => ({ ...prev, [documentId]: saved }));
      } catch {
        setError("Upload fehlgeschlagen (S3 nicht erreichbar?).");
      } finally {
        setBusyId(null);
      }
    },
    [companySlug],
  );

  const handleRemove = useCallback(
    async (documentId: string) => {
      setBusyId(documentId);
      setError(null);
      try {
        await removeCompanyDocument(companySlug, documentId);
        setDocs((prev) => {
          const next = { ...prev };
          delete next[documentId];
          return next;
        });
      } catch {
        setError("Entfernen fehlgeschlagen.");
      } finally {
        setBusyId(null);
      }
    },
    [companySlug],
  );

  const handleToggle = useCallback(
    async (documentId: string) => {
      const current = docs[documentId];
      if (!current) return;
      setBusyId(documentId);
      setError(null);
      try {
        const updated = await setCompanyDocumentChecked(
          companySlug,
          documentId,
          !current.checked,
        );
        if (updated) setDocs((prev) => ({ ...prev, [documentId]: updated }));
      } catch {
        setError("Status konnte nicht gesetzt werden.");
      } finally {
        setBusyId(null);
      }
    },
    [companySlug, docs],
  );

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(227,6,19,0.1)] text-[#e30613]">
          <FolderArchive className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-[#111827]">Firmen-Dokumente</h3>
          <p className="mt-0.5 text-xs text-[#6b7280]">
            Pro Kunde ({companySlug}) — kommen automatisch aus dem Tally-Formular
            „Unternehmensunterlagen" oder per manuellem Upload. Liegen auf Hetzner
            S3. Eingehend ungeprüft — „geprüft" erst nach bewusstem Klick.
          </p>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {error}
        </p>
      ) : null}

      {!hydrated ? (
        <p className="text-sm text-[#6b7280]">Firmen-Dokumente laden…</p>
      ) : (
        <ul className="space-y-2">
          {COMPANY_DOCUMENT_CATALOG.map((def) => (
            <DocumentRow
              key={def.documentId}
              def={def}
              stored={docs[def.documentId]}
              busy={busyId === def.documentId}
              onUpload={(file) => void handleUpload(def.documentId, file)}
              onRemove={() => void handleRemove(def.documentId)}
              onToggleChecked={() => void handleToggle(def.documentId)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

CompanyDocumentsPanel.displayName = "CompanyDocumentsPanel";
