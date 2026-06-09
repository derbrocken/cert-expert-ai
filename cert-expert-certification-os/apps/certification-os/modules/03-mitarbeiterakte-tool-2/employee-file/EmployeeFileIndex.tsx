"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui";
import {
  Search,
  Plus,
  Folder,
  Trash2,
  ArrowLeft,
  Users,
  CheckSquare,
  Square,
} from "lucide-react";
import { formatIsoToInput } from "@/lib/utils/date";
import type { Employee, Role } from "@/lib/types/employee";

export interface EmployeeFileIndexProps {
  employees: Employee[];
  roles: Role[];
  selectedEmployeeId: string | null;
  isCreatingNew: boolean;
  batchSelectedIds: Set<string>;
  /** True while localStorage queue is being read */
  isHydrating?: boolean;
  /** Embedded in dashboard output — hides Cert-OS back link */
  embedded?: boolean;
  /** Tool 2 workspace — per-customer export settings, not Upload Manager */
  perCompanyMode?: boolean;
  companyDisplayName?: string;
  onSelectEmployee: (employeeId: string) => void;
  onCreateNew: () => void;
  onBackToOverview: () => void;
  onDeleteEmployee: (employeeId: string) => void;
  onToggleBatch: (employeeId: string) => void;
  onToggleAllBatch: (selected: boolean) => void;
}

export const EmployeeFileIndex: React.FC<EmployeeFileIndexProps> = ({
  employees,
  roles,
  selectedEmployeeId,
  isCreatingNew,
  batchSelectedIds,
  isHydrating = false,
  embedded = false,
  perCompanyMode = false,
  companyDisplayName,
  onSelectEmployee,
  onCreateNew,
  onBackToOverview,
  onDeleteEmployee,
  onToggleBatch,
  onToggleAllBatch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter((e) => e.fullName.toLowerCase().includes(q));
  }, [employees, searchQuery]);

  const allFilteredSelected =
    filtered.length > 0 &&
    filtered.every((e) => batchSelectedIds.has(e.id));

  const getRoleName = (roleId: string) =>
    roles.find((r) => r.id === roleId)?.name || roleId;

  const handleDeleteClick = (e: React.MouseEvent, employeeId: string) => {
    e.stopPropagation();
    if (deleteConfirmId === employeeId) {
      onDeleteEmployee(employeeId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(employeeId);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const showOverviewLink =
    selectedEmployeeId !== null || isCreatingNew;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#e5e7eb] p-4">
        {!embedded ? (
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280] hover:text-[#e30613]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Certification OS
          </Link>
        ) : null}
        {showOverviewLink ? (
          <button
            type="button"
            onClick={onBackToOverview}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280] hover:text-[#e30613]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Übersicht
          </button>
        ) : null}
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
          Mitarbeiterakte
        </p>
        <h1 className="mt-0.5 text-lg font-bold text-[#111827]">
          {showOverviewLink ? "Person" : "Übersicht"}
        </h1>
        <p className="mt-1 text-xs text-[#6b7280]">
          {showOverviewLink
            ? "Akte dieser Person — zurück zur Gesamtübersicht oben"
            : "Alle Personen · Export-Auswahl links"}
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
            isCreatingNew
              ? "border-[#e30613] bg-[rgba(227,6,19,0.08)] text-[#b80510]"
              : "border-[#e30613] bg-[#e30613] text-white hover:brightness-105",
          )}
        >
          <Plus className="h-4 w-4" />
          Neue Person
        </button>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Name suchen…"
            className="pl-9 text-sm"
          />
        </div>
        {employees.length > 0 ? (
          // #9 Selektion: sichtbare Auswahl-Leiste mit Alle/Keine-Toggle +
          // Zähler (noch keine benannten/gespeicherten Gruppen).
          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-2.5 py-2">
            <button
              type="button"
              onClick={() => onToggleAllBatch(!allFilteredSelected)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280] hover:text-[#111827]"
            >
              {allFilteredSelected ? (
                <CheckSquare className="h-3.5 w-3.5 text-[#e30613]" />
              ) : (
                <Square className="h-3.5 w-3.5" />
              )}
              {allFilteredSelected ? "Alle abwählen" : "Alle auswählen"}
            </button>
            <span className="shrink-0 text-xs font-semibold text-[#111827]">
              {batchSelectedIds.size} ausgewählt
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <Users className="mb-3 h-10 w-10 text-[#d1d5db]" />
            <p className="text-sm font-medium text-[#111827]">
              {isHydrating
                ? "Akten laden…"
                : employees.length === 0
                  ? "Noch keine Akten"
                  : "Keine Treffer"}
            </p>
            <p className="mt-1 text-xs text-[#6b7280]">
              {isHydrating
                ? "Gespeicherte Personen werden geladen."
                : employees.length === 0
                  ? perCompanyMode
                    ? "Person anlegen — Firmendaten je Kunde (Switcher oben)."
                    : "Person anlegen — Firmendaten liegen im Upload Manager."
                  : "Anderen Suchbegriff versuchen."}
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {filtered.map((employee) => {
              const isActive =
                !isCreatingNew && selectedEmployeeId === employee.id;
              const inBatch = batchSelectedIds.has(employee.id);
              return (
                <li key={employee.id}>
                  <div
                    className={cn(
                      "group flex w-full items-stretch rounded-lg border transition-colors",
                      isActive
                        ? "border-[rgba(227,6,19,0.35)] bg-[rgba(227,6,19,0.08)]"
                        : "border-transparent hover:border-[#e5e7eb] hover:bg-white",
                    )}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBatch(employee.id);
                      }}
                      className="flex shrink-0 items-center px-2.5"
                      title={
                        inBatch
                          ? "Vom Export abwählen"
                          : "Für Export auswählen"
                      }
                    >
                      {inBatch ? (
                        <CheckSquare className="h-4 w-4 text-[#e30613]" />
                      ) : (
                        <Square className="h-4 w-4 text-[#9ca3af]" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectEmployee(employee.id)}
                      className="flex min-w-0 flex-1 items-start gap-2 py-2.5 pr-2 text-left"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                          isActive
                            ? "bg-[rgba(227,6,19,0.12)] text-[#e30613]"
                            : "bg-[#f1f3f6] text-[#6b7280]",
                        )}
                      >
                        <Folder className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-[#111827]">
                          {employee.fullName}
                        </span>
                        <span className="block truncate text-xs text-[#6b7280]">
                          {getRoleName(employee.roleId)}
                          {employee.birthday
                            ? ` · ${formatIsoToInput(employee.birthday) || employee.birthday}`
                            : ""}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(e, employee.id)}
                      className={cn(
                        "shrink-0 self-center rounded p-1.5 mr-1 opacity-0 transition-opacity group-hover:opacity-100",
                        deleteConfirmId === employee.id
                          ? "bg-red-100 text-red-600 opacity-100"
                          : "text-[#6b7280] hover:bg-red-50 hover:text-red-600",
                      )}
                      title={
                        deleteConfirmId === employee.id
                          ? "Erneut klicken zum Löschen"
                          : "Akte entfernen"
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-[#e5e7eb] p-3">
        {perCompanyMode ? (
          <div className="rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-3 py-2 text-xs text-[#6b7280]">
            <span className="font-semibold text-[#111827]">Firmendaten</span>
            <span className="mt-0.5 block">
              Logo, Adresse &amp; Footer — je Kunde
              {companyDisplayName ? ` (${companyDisplayName})` : ""}
            </span>
          </div>
        ) : (
          <Link
            href="/uploads"
            className="block rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-3 py-2 text-xs text-[#6b7280] hover:border-[rgba(227,6,19,0.3)] hover:text-[#111827]"
          >
            <span className="font-semibold text-[#111827]">Firmendaten</span>
            <span className="mt-0.5 block">
              Logo, Adresse &amp; Footer → Upload Manager
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

EmployeeFileIndex.displayName = "EmployeeFileIndex";
