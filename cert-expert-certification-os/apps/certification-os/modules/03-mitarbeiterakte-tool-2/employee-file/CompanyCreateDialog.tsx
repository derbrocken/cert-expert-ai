"use client";

import React, { useCallback, useState } from "react";
import { Building2, Loader2, Plus, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * „Firma anlegen" — schlanker Dialog neben dem CompanySwitcher.
 *
 * Reine UI: nimmt einen Anzeigenamen entgegen und ruft `onCreate(name)` auf
 * (Server-Action legt die `Company`-Row an + erzeugt den Slug). Kein Norm-/
 * Engine-Bezug, keine Compliance-Aussage. Nach Erfolg schließt der Dialog;
 * der Aufrufer wechselt auf die neue Firma.
 */
export interface CompanyCreateDialogProps {
  /** Legt die Firma an; resolved, wenn Liste aktualisiert + umgeschaltet ist. */
  onCreate: (displayName: string) => Promise<void>;
  className?: string;
}

export const CompanyCreateDialog: React.FC<CompanyCreateDialogProps> = ({
  onCreate,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    if (busy) return;
    setOpen(false);
    setName("");
    setError(null);
  }, [busy]);

  const submit = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Bitte einen Firmennamen eingeben.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onCreate(trimmed);
      setBusy(false);
      setOpen(false);
      setName("");
    } catch (err) {
      setBusy(false);
      setError(
        err instanceof Error ? err.message : "Anlegen fehlgeschlagen.",
      );
    }
  }, [name, onCreate]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        leftIcon={<Plus className="h-4 w-4" />}
        className={className}
      >
        Neue Firma
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Neue Firma anlegen"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#e30613]" aria-hidden />
                <h2 className="text-base font-bold text-[#111827]">
                  Neue Firma anlegen
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                disabled={busy}
                aria-label="Schließen"
                className="rounded-md p-1 text-[#6b7280] hover:bg-[#f4f5f7] disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-[#6b7280]">
              Legt einen neuen Kunden-/Mitarbeiterpool an. Mitarbeiter fügst du
              danach manuell („Neue Person") oder — bei passendem Tally-Alias —
              per Formular hinzu.
            </p>

            <label className="mt-4 block text-sm font-medium text-[#111827]">
              Firmenname
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submit();
                }}
                placeholder="z. B. Müller Security GmbH"
                disabled={busy}
                className="mt-1"
              />
            </label>

            {error ? (
              <p className="mt-2 text-sm text-red-700">{error}</p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={close}
                disabled={busy}
              >
                Abbrechen
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => void submit()}
                disabled={busy || !name.trim()}
                leftIcon={
                  busy ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined
                }
              >
                {busy ? "Lege an…" : "Anlegen"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

CompanyCreateDialog.displayName = "CompanyCreateDialog";
