"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CERT_OS_V1_MAIN_AREAS,
  V1_AREA_STATUS_LABELS,
  V1_SUBTOPIC_STATUS_LABELS,
  type V1MainArea,
  type V1Subtopic,
  type V1SubtopicStatus,
} from "./module-overview-data";

function areaStatusBadge(status: V1MainArea["status"]) {
  switch (status) {
    case "active":
      return "bg-green-50 text-[#16a34a] border border-green-200";
    case "working":
      return "bg-[rgba(227,6,19,0.08)] text-[#b80510] border border-[rgba(227,6,19,0.2)]";
    default:
      return "bg-[#f1f3f6] text-[#6b7280] border border-[#e5e7eb]";
  }
}

function subtopicStatusBadge(status: V1SubtopicStatus) {
  switch (status) {
    case "active":
      return "bg-green-50 text-[#16a34a] border border-green-200";
    case "working":
      return "bg-[rgba(227,6,19,0.08)] text-[#b80510] border border-[rgba(227,6,19,0.2)]";
    case "read-only":
      return "bg-[#f1f3f6] text-[#111827] border border-[#e5e7eb]";
    case "placeholder":
      return "bg-amber-50 text-[#d97706] border border-amber-200";
    default:
      return "bg-[#f1f3f6] text-[#6b7280] border border-[#e5e7eb]";
  }
}

function SubtopicTable({
  title,
  rows,
  emptyHint,
}: {
  title: string;
  rows: V1Subtopic[];
  emptyHint?: string;
}) {
  if (rows.length === 0) {
    return emptyHint ? (
      <p className="text-sm text-[#6b7280]">{emptyHint}</p>
    ) : null;
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-[#111827]">{title}</h3>
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
        <table className="w-full text-sm">
          <thead className="bg-[#f1f3f6] text-left text-xs uppercase tracking-wide text-[#6b7280]">
            <tr>
              <th className="px-3 py-2 font-semibold">Bereich</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="hidden px-3 py-2 font-semibold md:table-cell">
                Aktion
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[#e5e7eb] hover:bg-[#f9fafb]"
              >
                <td className="px-3 py-2.5 font-medium text-[#111827]">
                  {row.title}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                      subtopicStatusBadge(row.status),
                    )}
                  >
                    {V1_SUBTOPIC_STATUS_LABELS[row.status]}
                  </span>
                </td>
                <td className="hidden px-3 py-2.5 md:table-cell">
                  {row.href ? (
                    <Link
                      href={row.href}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#e30613] hover:underline"
                    >
                      Öffnen
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-xs text-[#6b7280]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function OutputPanel({ area }: { area: V1MainArea }) {
  const isEmployeeFile = area.id === "mitarbeiterakte";

  if (isEmployeeFile) {
    return (
      <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] bg-linear-to-r from-[rgba(227,6,19,0.08)] to-transparent px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#e30613]">
                Mitarbeiterakte
              </p>
              <p className="mt-0.5 text-sm text-[#6b7280]">
                Person links anlegen oder wählen — Akte rechts öffnen
              </p>
            </div>
            <span
              className={cn(
                "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                areaStatusBadge(area.status),
              )}
            >
              {V1_AREA_STATUS_LABELS[area.status]}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6 py-12">
          <p className="max-w-md text-sm text-[#6b7280]">
            Wähle in der Mitarbeiterakte zuerst eine Firma (Kunden-/Mitarbeiterpool)
            und öffne dann die Akten der jeweiligen Firma — oder lege eine neue
            Firma an.
          </p>
          <Link
            href="/employee-automation"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e30613] bg-[#e30613] px-4 py-2 text-sm font-medium text-white hover:brightness-105"
          >
            Mitarbeiterakte öffnen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="border-b border-[#e5e7eb] bg-linear-to-r from-[rgba(227,6,19,0.08)] to-transparent px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#e30613]">
          Output
        </p>
        <h2 className="mt-1 text-xl font-bold text-[#111827]">{area.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#6b7280]">
          {area.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
              areaStatusBadge(area.status),
            )}
          >
            {V1_AREA_STATUS_LABELS[area.status]}
          </span>
          {area.href ? (
            <Link
              href={area.href}
              className="inline-flex items-center gap-2 rounded-lg border border-[#e30613] bg-[#e30613] px-4 py-2 text-sm font-medium text-white hover:brightness-105"
            >
              Workspace öffnen
              <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        {area.id === "qm-auditordner" && (
          <p className="mt-3 text-xs text-[#6b7280]">
            Document Creator / Tool 1 ist hier integriert — Ordner und Dokumente
            auswählen.
          </p>
        )}
        {area.id === "unternehmensprofil" && (
          <p className="mt-3 text-xs text-[#6b7280]">
            Unternehmensdokumente und Stammdaten werden hier abgelegt.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-auto p-5">
        <SubtopicTable title="Unterthemen" rows={area.subtopics} />
      </div>
    </div>
  );
}

function areaSidebarMeta(area: V1MainArea): string {
  if (area.id === "mitarbeiterakte") {
    return "Personal erfassen · Aktenliste";
  }
  return `${area.subtopics.length} Unterthemen`;
}

export function CertificationOsModuleOverview() {
  const [selectedId, setSelectedId] = useState(CERT_OS_V1_MAIN_AREAS[0].id);
  const selectedArea =
    CERT_OS_V1_MAIN_AREAS.find((a) => a.id === selectedId) ??
    CERT_OS_V1_MAIN_AREAS[0];

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 bg-[#f4f5f7] lg:grid-cols-[minmax(260px,300px)_1fr]">
      <aside className="flex flex-col border-b border-[#e5e7eb] bg-white lg:border-b-0 lg:border-r">
        <div className="border-b border-[#e5e7eb] p-4">
          <Link href="/" title="Cert-Expert">
            <Image
              src="/assets/cert-expert-logo.png"
              alt="Cert-Expert"
              width={228}
              height={48}
              className="h-9 w-auto max-w-full object-contain"
              priority
            />
          </Link>
          <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
            Certification OS V1
          </p>
        </div>

        <div className="flex-1 overflow-auto p-3">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
            Hauptbereiche
          </p>
          <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f1f3f6] text-xs uppercase tracking-wide text-[#6b7280]">
                <tr>
                  <th className="px-2 py-2 font-semibold">Modul</th>
                  <th className="hidden px-2 py-2 font-semibold sm:table-cell">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {CERT_OS_V1_MAIN_AREAS.map((area) => {
                  const isActive = area.id === selectedId;
                  return (
                    <tr
                      key={area.id}
                      className={cn(
                        "cursor-pointer border-t border-[#e5e7eb] transition-colors",
                        isActive
                          ? "bg-[rgba(227,6,19,0.08)]"
                          : "hover:bg-[#f9fafb]",
                      )}
                      onClick={() => setSelectedId(area.id)}
                    >
                      <td className="px-2 py-2.5">
                        <span
                          className={cn(
                            "block font-medium leading-snug",
                            isActive ? "text-[#b80510]" : "text-[#111827]",
                          )}
                        >
                          {area.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-[#6b7280]">
                          {areaSidebarMeta(area)}
                        </span>
                      </td>
                      <td className="hidden px-2 py-2.5 sm:table-cell">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                            areaStatusBadge(area.status),
                          )}
                        >
                          {V1_AREA_STATUS_LABELS[area.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="border-b border-[#e5e7eb] bg-white px-4 py-4 shadow-sm sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#e30613]">
            Customer-facing V1
          </p>
          <h1 className="mt-0.5 text-xl font-bold text-[#111827] sm:text-2xl">
            Certification OS
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Links wählen — Output rechts. Mitarbeiterakte: eine Akte pro
            Mitarbeiter.
          </p>
        </header>

        <nav
          className="flex gap-2 overflow-x-auto border-b border-[#e5e7eb] bg-white px-4 py-2 sm:px-6"
          aria-label="Modul-Reiter"
        >
          {CERT_OS_V1_MAIN_AREAS.map((area) => {
            const isActive = area.id === selectedId;
            const tabLabel =
              area.id === "mitarbeiterakte"
                ? "Mitarbeiterakte"
                : area.title.split(" / ")[0].split(" + ")[0];
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => setSelectedId(area.id)}
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                  isActive
                    ? "border-[#e30613] bg-[rgba(227,6,19,0.08)] text-[#111827]"
                    : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[rgba(227,6,19,0.35)]",
                )}
              >
                {tabLabel}
              </button>
            );
          })}
        </nav>

        <main className="flex-1 p-4 sm:p-6">
          <OutputPanel area={selectedArea} />
        </main>
      </div>
    </div>
  );
}
