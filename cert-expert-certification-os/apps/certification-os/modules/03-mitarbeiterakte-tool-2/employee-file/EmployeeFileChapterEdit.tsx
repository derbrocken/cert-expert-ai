"use client";

import React from "react";
import { Pencil, Check, X } from "lucide-react";
import type { Employee, Role, Appointment } from "@/lib/types/employee";
import {
  EmployeeFilePersonRolleEditTable,
  type PersonRolleChapterId,
} from "./EmployeeFilePersonRolleEditTable";
import type { RequirementRow } from "./employee-file-requirements";

/**
 * M4 / §3.4 — Bearbeiten je Kapitel (statt globalem evidenceEditMode-Toggle).
 *
 * In der Ansicht ist jedes Kapitel read-only. Ein Stift „Bearbeiten" öffnet
 * GENAU dieses eine Kapitel im Edit-Modus: dieselbe vertikale Edit-Form
 * (`EmployeeFilePersonRolleEditTable`, kapitelgefiltert via `chapters`-Prop),
 * jedoch gegen einen LOKALEN Draft-Puffer — kein Auto-Speichern beim Tippen
 * (S1b-Lehre, §3.7). „Speichern" ruft EINMAL den unveränderten
 * `onSave`-Pfad (`applyEmployeePatchWithDocSync`, EC-09) mit dem Draft.
 * „Abbrechen" verwirft die ungespeicherten Eingaben dieses Kapitels.
 *
 * Read-only-Darstellung = dieselbe Edit-Form mit `pointer-events-none`
 * (identisches Layout, keine versehentliche Bearbeitung). Reine Interaktions-/
 * Anzeige-Schicht: kein Schema-/Engine-/Datenmodell-Eingriff.
 */
export interface EmployeeFileChapterEditProps {
  employee: Employee;
  roles: Role[];
  appointments: Appointment[];
  companyName: string;
  rows: RequirementRow[];
  chapters: PersonRolleChapterId[];
  /** Bestehender Speicher-Pfad (applyEmployeePatchWithDocSync upstream). */
  onSave: (employee: Employee) => void;
}

export const EmployeeFileChapterEdit: React.FC<
  EmployeeFileChapterEditProps
> = ({ employee, roles, appointments, companyName, rows, chapters, onSave }) => {
  const [editing, setEditing] = React.useState(false);
  // Lokaler Draft-Puffer — erst „Speichern" persistiert (kein Auto-Save).
  const [draft, setDraft] = React.useState<Employee>(employee);

  // Wechselt die Akte (anderer Datensatz), während dieses Kapitel offen ist,
  // den Edit-Modus schließen und den Draft an die neue Akte angleichen.
  const employeeIdRef = React.useRef(employee.id);
  React.useEffect(() => {
    if (employeeIdRef.current !== employee.id) {
      employeeIdRef.current = employee.id;
      setEditing(false);
      setDraft(employee);
    }
  }, [employee]);

  const startEdit = () => {
    setDraft(employee);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(employee);
    setEditing(false);
  };

  const saveEdit = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-end">
        {editing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] px-2.5 py-1 text-xs font-medium text-[#6b7280] hover:border-[#d1d5db] hover:text-[#111827]"
            >
              <X className="h-3 w-3" />
              Abbrechen
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="inline-flex items-center gap-1 rounded-md border border-[#e30613] bg-[#e30613] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#b80510]"
            >
              <Check className="h-3 w-3" />
              Speichern
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] px-2.5 py-1 text-xs font-medium text-[#6b7280] hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
          >
            <Pencil className="h-3 w-3" />
            Bearbeiten
          </button>
        )}
      </div>

      <div
        className={editing ? "" : "pointer-events-none select-none opacity-95"}
        aria-disabled={!editing}
      >
        <EmployeeFilePersonRolleEditTable
          employee={editing ? draft : employee}
          roles={roles}
          appointments={appointments}
          companyName={companyName}
          rows={rows}
          // Im Edit-Modus puffern wir lokal (setDraft); read-only wird onSave
          // nie aufgerufen (pointer-events-none). Erst „Speichern" → echter
          // onSave-Pfad oben.
          onSave={editing ? setDraft : () => {}}
          chapters={chapters}
        />
      </div>
    </div>
  );
};

EmployeeFileChapterEdit.displayName = "EmployeeFileChapterEdit";
