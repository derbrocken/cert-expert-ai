"use client";

import React from "react";
import { UserPlus, Users, FileOutput } from "lucide-react";
import { Button } from "@/components/ui";

export interface EmployeeFileOnboardingPanelProps {
  onCreateNew: () => void;
}

export const EmployeeFileOnboardingPanel: React.FC<
  EmployeeFileOnboardingPanelProps
> = ({ onCreateNew }) => {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <Users className="mx-auto mb-4 h-12 w-12 text-[#e30613]" />
      <h2 className="text-xl font-bold text-[#111827]">Personal erfassen</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
        Dieser Bereich ist für <strong className="text-[#111827]">Neuanstellungen</strong>:
        Name, Geburtsdatum, Vertragsbeginn, Grundrolle (SMA oder Führungskraft)
        und Zusatzbestellungen (Ersthelfer, Brandschutz, SiBe …). Eine Person
        pro Firma — Firmendaten je Kunde (Switcher oben).
      </p>
      <ol className="mt-6 space-y-3 text-left text-sm text-[#6b7280]">
        <li className="flex gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3">
          <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-[#e30613]" />
          <span>
            <strong className="text-[#111827]">Schritt 1 — Person anlegen</strong>
            <br />
            Stammdaten speichern → eigene Akte erscheint links im Index.
          </span>
        </li>
        <li className="flex gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#e30613]" />
          <span>
            <strong className="text-[#111827]">Schritt 2 — Akte öffnen</strong>
            <br />
            Je Person eine fertige Akte mit Nachweisen (Platzhalter).
          </span>
        </li>
        <li className="flex gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3">
          <FileOutput className="mt-0.5 h-4 w-4 shrink-0 text-[#e30613]" />
          <span>
            <strong className="text-[#111827]">Schritt 3 — Generator</strong>
            <br />
            Ausgewählte Personen + Dokumente → ZIP-Export.
          </span>
        </li>
      </ol>
      <Button
        type="button"
        variant="primary"
        className="mt-8"
        onClick={onCreateNew}
      >
        Neue Person anlegen
      </Button>
    </div>
  );
};

EmployeeFileOnboardingPanel.displayName = "EmployeeFileOnboardingPanel";
