"use client";

import React from "react";
import { Check } from "lucide-react";
import type { RoleClass } from "./requirement-engine";
import {
  BEWACHUNG_CLASS_OPTIONS,
  NICHT_BEWACHUNG_CLASS_OPTIONS,
} from "./employee-stammdaten-options";

/**
 * EK/FK-Refinement — Norm-Klasse als Mehrfachauswahl.
 *
 * - Bewachung: EK + FK unabhängig wählbar (FK baut auf EK auf; EK+FK = FK-Set).
 * - Nicht-Bewachung (Verwaltung/Praktikant/Subunternehmer): untereinander
 *   exklusiv, aber mit EK/FK kombinierbar (der „Verwaltung geht mit auf
 *   Schicht"-Doppelrolle-Fall).
 *
 * Keine erfundene Pflicht: das Set steuert nur die bestehenden CL-Regeln.
 */
export interface RoleClassSelectorProps {
  value: RoleClass[];
  onChange: (next: RoleClass[]) => void;
  hasError?: boolean;
  /** Kompakte Variante (Akte-Inline-Tabelle). */
  compact?: boolean;
}

const NICHT_BEWACHUNG_IDS: readonly RoleClass[] = [
  "verwaltung",
  "praktikant",
  "subunternehmer",
];

export const RoleClassSelector: React.FC<RoleClassSelectorProps> = ({
  value,
  onChange,
  hasError,
  compact,
}) => {
  const set = new Set(value);

  const toggleBewachung = (id: RoleClass) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(orderClasses(next));
  };

  const selectNichtBewachung = (id: RoleClass) => {
    const next = new Set(set);
    const wasSelected = next.has(id);
    // Nicht-Bewachung untereinander exklusiv.
    for (const other of NICHT_BEWACHUNG_IDS) next.delete(other);
    if (!wasSelected) next.add(id);
    onChange(orderClasses(next));
  };

  const box = (checked: boolean) => (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
        checked
          ? "border-[#e30613] bg-[#e30613]"
          : "border-[#d1d5db] bg-white"
      }`}
    >
      {checked ? <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} /> : null}
    </span>
  );

  const rowClass = compact
    ? "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs cursor-pointer transition-colors"
    : "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors";

  const renderRow = (
    id: RoleClass,
    name: string,
    hint: string,
    checked: boolean,
    onClick: () => void,
  ) => (
    <button
      key={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className={`${rowClass} ${
        checked
          ? "border-[rgba(227,6,19,0.35)] bg-[rgba(227,6,19,0.06)]"
          : "border-[#e5e7eb] bg-white hover:border-[#d1d5db]"
      }`}
    >
      {box(checked)}
      <span className="min-w-0 text-left">
        <span className="font-medium text-[#111827]">{name}</span>
        {!compact ? (
          <span className="ml-1.5 text-[11px] text-[#9ca3af]">{hint}</span>
        ) : null}
      </span>
    </button>
  );

  return (
    <div
      className={`space-y-2 ${
        hasError ? "rounded-lg ring-1 ring-[rgba(227,6,19,0.4)] p-2" : ""
      }`}
    >
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
          Bewachung
        </p>
        <div className={compact ? "flex flex-wrap gap-1.5" : "grid gap-2 sm:grid-cols-2"}>
          {BEWACHUNG_CLASS_OPTIONS.map((o) =>
            renderRow(
              o.id as RoleClass,
              o.name,
              o.hint,
              set.has(o.id as RoleClass),
              () => toggleBewachung(o.id as RoleClass),
            ),
          )}
        </div>
      </div>
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">
          Keine / andere Tätigkeit
        </p>
        <div className={compact ? "flex flex-wrap gap-1.5" : "grid gap-2 sm:grid-cols-3"}>
          {NICHT_BEWACHUNG_CLASS_OPTIONS.map((o) =>
            renderRow(
              o.id as RoleClass,
              o.name,
              o.hint,
              set.has(o.id as RoleClass),
              () => selectNichtBewachung(o.id as RoleClass),
            ),
          )}
        </div>
      </div>
      <p className="text-[10px] text-[#6b7280]">
        FK baut auf EK auf; EK + FK = FK-Pflichtset. Verwaltung/Praktikant lassen
        sich mit EK/FK kombinieren (Doppelrolle).
      </p>
    </div>
  );
};

/** Stabile Reihenfolge: EK, FK, Verwaltung, Praktikant, Subunternehmer. */
function orderClasses(set: Set<RoleClass>): RoleClass[] {
  const order: RoleClass[] = ["ek", "fk", "verwaltung", "praktikant", "subunternehmer"];
  return order.filter((c) => set.has(c));
}

RoleClassSelector.displayName = "RoleClassSelector";
