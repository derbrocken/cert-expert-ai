"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "@/components/layout";
import CEBadge from "@/components/ui/CEBadge";
import { ModelCreatorWorkspace } from "@/app/model-creator/ModelCreatorWorkspace";
import { loadCompaniesForSwitcher } from "@/modules/03-mitarbeiterakte-tool-2/employee-file/load-companies-client";
import { fetchEmployeeCountsAction } from "@/app/actions/employee-file-actions";
import { loadEmployeeQueue } from "@/lib/employee-queue-storage";
import { setActiveCompanySlug } from "@/lib/company-session";
import type { Employee } from "@/lib/types/employee";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  FileText,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

type GeneratorArea = "company" | "employee";

/**
 * G4 (Top-Level) — EIN vereinter Generator-Einstieg mit Bereichs-Umschalter
 * (DM3/DM4). Erreichbar OHNE vorher eine Einzelakte zu öffnen.
 *
 * - „Firmen-Dokumente" = der bestehende Tool-1-Generator (`ModelCreatorWorkspace`,
 *   ZIP via `generateDocument`) — wiederverwendet, NICHT neu gebaut.
 * - „Mitarbeiter-Dokumente" = zuerst Firma→Person wählen (bestehende Loader),
 *   dann Deep-Link in den bestehenden, voll funktionsfähigen MA-Generator der
 *   Akte (`/employee-automation?id=…&tab=generator`, ZIP via
 *   `generateEmployeeDocs`). Der EC-09-kritische MA-ZIP-Pfad (Batch/Datum/Queue-
 *   State) bleibt unverändert in der `EmployeeAutomationPage` — hier wird er nur
 *   ohne Umweg über die Firmen-Übersicht erreichbar gemacht.
 *
 * EC-09: keine Änderung an `generateDocument`/`generateEmployeeDocs`/ZIP-Logik.
 * EC-10: reine Navigation/IA, kein Status, keine Freigabeaussage.
 */
export default function GeneratorPageClient() {
  const router = useRouter();
  const [area, setArea] = useState<GeneratorArea>("company");

  // Firma→Person-Auswahl (nur im MA-Bereich genutzt).
  const [companies, setCompanies] = useState<
    { slug: string; displayName: string }[]
  >([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const list = await loadCompaniesForSwitcher();
        if (cancelled) return;
        setCompanies(list);
      } catch {
        // Fehler still — Liste bleibt leer, UI zeigt Hinweis.
      } finally {
        if (!cancelled) setCompaniesLoaded(true);
      }
      try {
        const c = await fetchEmployeeCountsAction();
        if (!cancelled) setCounts(c);
      } catch {
        /* counts optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectCompany = useCallback(async (slug: string) => {
    setSelectedCompany(slug);
    setActiveCompanySlug(slug);
    setEmployeesLoading(true);
    try {
      const snapshot = await loadEmployeeQueue(slug);
      setEmployees(snapshot.employees);
    } catch {
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  }, []);

  // Person → bestehender MA-Generator der Akte (Deep-Link, Generator-Tab).
  const openEmployeeGenerator = useCallback(
    (employeeId: string) => {
      if (selectedCompany) setActiveCompanySlug(selectedCompany);
      router.push(
        `/employee-automation?id=${encodeURIComponent(employeeId)}&tab=generator`,
      );
    },
    [router, selectedCompany],
  );

  const selectedCompanyName = useMemo(
    () =>
      companies.find((c) => c.slug === selectedCompany)?.displayName ??
      selectedCompany ??
      "",
    [companies, selectedCompany],
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:pt-24 sm:pb-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="flex justify-center gap-4">
              <CEBadge />
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Generator
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-600 sm:text-base lg:text-lg">
              Firmen- und mitarbeiterbezogene Dokumente an einem Ort erzeugen
            </p>
          </div>

          {/* Bereichs-Umschalter (DM4) */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              {(
                [
                  ["company", "Firmen-Dokumente", Building2],
                  ["employee", "Mitarbeiter-Dokumente", Users],
                ] as const
              ).map(([id, label, Icon]) => {
                const active = area === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setArea(id)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                      active
                        ? "bg-[rgba(227,6,19,0.08)] text-[#e30613]"
                        : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Firmen-Bereich = bestehender Tool-1-Generator */}
          {area === "company" ? <ModelCreatorWorkspace /> : null}

          {/* Mitarbeiter-Bereich = Firma→Person → bestehender MA-Generator */}
          {area === "employee" ? (
            <div className="mx-auto max-w-4xl">
              {!selectedCompany ? (
                <CompanyPicker
                  companies={companies}
                  counts={counts}
                  loaded={companiesLoaded}
                  onSelect={handleSelectCompany}
                />
              ) : (
                <EmployeePicker
                  companyName={selectedCompanyName}
                  employees={employees}
                  loading={employeesLoading}
                  onBack={() => {
                    setSelectedCompany(null);
                    setEmployees([]);
                  }}
                  onSelect={openEmployeeGenerator}
                  onOpenAkte={() =>
                    router.push(
                      `/employee-automation?company=${encodeURIComponent(
                        selectedCompany,
                      )}`,
                    )
                  }
                />
              )}
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CompanyPicker({
  companies,
  counts,
  loaded,
  onSelect,
}: {
  companies: { slug: string; displayName: string }[];
  counts: Record<string, number>;
  loaded: boolean;
  onSelect: (slug: string) => void;
}) {
  return (
    <div>
      <div className="mb-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
          Mitarbeiter-Dokumente
        </p>
        <h2 className="mt-1 text-xl font-bold text-gray-900">
          1. Firma wählen
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Wähle die Firma, deren Mitarbeiter-Dokumente du erzeugen willst.
        </p>
      </div>

      {!loaded ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-white px-4 py-10 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Firmen laden…
        </div>
      ) : companies.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
          Noch keine Firma vorhanden — über die Mitarbeiterakte anlegen.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => {
            const count = counts[c.slug] ?? 0;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => onSelect(c.slug)}
                className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-[rgba(227,6,19,0.45)] hover:shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(227,6,19,0.08)] text-[#e30613]">
                    <Building2 className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-[#e30613]" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">
                    {c.displayName}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {count} Mitarbeiter
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmployeePicker({
  companyName,
  employees,
  loading,
  onBack,
  onSelect,
  onOpenAkte,
}: {
  companyName: string;
  employees: Employee[];
  loading: boolean;
  onBack: () => void;
  onSelect: (employeeId: string) => void;
  onOpenAkte: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Andere Firma wählen
      </button>

      <div className="mb-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#e30613]">
          {companyName}
        </p>
        <h2 className="mt-1 text-xl font-bold text-gray-900">
          2. Person wählen
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Person auswählen → öffnet den Mitarbeiter-Generator dieser Akte (freie
          Einzelauswahl, ZIP-Export).
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-white px-4 py-10 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Mitarbeiter laden…
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
          <p>Noch keine Person in dieser Firma.</p>
          <button
            type="button"
            onClick={onOpenAkte}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[rgba(227,6,19,0.35)] hover:text-[#e30613]"
          >
            Zur Mitarbeiterakte
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {employees.map((emp) => (
            <li key={emp.id}>
              <button
                type="button"
                onClick={() => onSelect(emp.id)}
                className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[rgba(227,6,19,0.04)]"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <FileText className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {emp.fullName || "(ohne Namen)"}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-[#e30613]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
