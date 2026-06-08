"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Building2, Users } from "lucide-react";
import { CompanyCreateDialog } from "./CompanyCreateDialog";

export interface CompanyHubCompany {
  slug: string;
  displayName: string;
}

/**
 * Firmen-Übersicht — der Einstieg in die Mitarbeiterakte.
 *
 * Listet alle Firmen (Kunden-/Mitarbeiterpools) als Karten mit Mitarbeiterzahl.
 * Klick auf eine Karte betritt deren Pool (`onEnter`). „Neue Firma" über den
 * bestehenden Dialog. Reine Navigation/Präsentation — keine Norm-/Engine-Logik.
 */
export interface CompanyHubViewProps {
  companies: CompanyHubCompany[];
  counts: Record<string, number>;
  onEnter: (slug: string) => void;
  onCreate: (displayName: string) => Promise<void>;
  /** Optional: „Zur Übersicht"-Zurück (z. B. zum Haupt-Dashboard). */
  onBack?: () => void;
}

export const CompanyHubView: React.FC<CompanyHubViewProps> = ({
  companies,
  counts,
  onEnter,
  onCreate,
  onBack,
}) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#6b7280] hover:text-[#111827]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Zur Übersicht
        </button>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
            Mitarbeiterakte
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Firma wählen
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Kunden-/Mitarbeiterpool auswählen, um die Akten zu öffnen — oder eine
            neue Firma anlegen.
          </p>
        </div>
        <CompanyCreateDialog onCreate={onCreate} />
      </div>

      {companies.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-[#e5e7eb] bg-white px-4 py-10 text-center text-sm text-[#6b7280]">
          Noch keine Firma vorhanden — über „Neue Firma" anlegen.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => {
            const count = counts[c.slug] ?? 0;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => onEnter(c.slug)}
                className="group flex flex-col gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4 text-left shadow-sm transition-colors hover:border-[rgba(227,6,19,0.45)] hover:shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(227,6,19,0.08)] text-[#e30613]">
                    <Building2 className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#9ca3af] transition-colors group-hover:text-[#e30613]" />
                </div>
                <div>
                  <p className="text-base font-bold text-[#111827]">
                    {c.displayName}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-[#6b7280]">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {count} {count === 1 ? "Mitarbeiter" : "Mitarbeiter"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

CompanyHubView.displayName = "CompanyHubView";
