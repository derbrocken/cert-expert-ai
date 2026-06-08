/**
 * Termin-Planung Schulungen (Queue C) — reine Gap-Logik + Plan-Status.
 *
 * React-frei und seiteneffektfrei (wie `compliance-status.ts`), damit unit-bar.
 *
 * Leitplanken (Norm-Cross-Check):
 *  - Soll bleibt **CL-11 (40/24)** bzw. der jeweilige Engine-Soll-Posten. Die
 *    Lücke ist rein rechnerisch (`Soll − Ist`), kein neuer Normwert.
 *  - **Kein Auto-Ist:** Ein Plan-Eintrag erhöht NICHT `weiterbildungIstUE`/
 *    `einmaligIstUE`. Plan-Status und Ist-UE sind entkoppelt.
 *  - EC-10: Plan-Status ist rechnerisch/operativ — kein Freigabe-/Auditstatus.
 */

import type { Employee, TrainingPlanItem } from "@/lib/types/employee";
import type { TrainingTarget, WorkingItemStatus } from "./requirement-engine";
import type { RequirementRow } from "./employee-file-requirements";

/** Rechnerische Lücke je Soll-Posten (Soll − Ist). */
export interface TrainingGap {
  id: string;
  label: string;
  clauseId: string | null;
  /** Engine-Soll (CL-belegt) bzw. `null`, wenn fachlich zu prüfen. */
  soll: number | null;
  /** Manuell erfasstes Ist (Slice-2-Feld). */
  ist: number;
  /** Rest = max(soll − ist, 0); `null`, wenn `soll === null`. */
  rest: number | null;
}

/** Operativer Status eines geplanten Schulungs-Eintrags. */
export type PlanItemStatus =
  | "geplant"
  | "ueberfaellig"
  | "nachweis-vorhanden"
  | "ohne-datum";

/**
 * Ist-Quelle exakt wie `EmployeeFileTrainingTargets`:
 * `jahres-weiterbildung` → `weiterbildungIstUE`, sonst `einmaligIstUE[id]`.
 */
function istForTarget(target: TrainingTarget, employee: Employee): number {
  if (target.id === "jahres-weiterbildung") {
    return employee.weiterbildungIstUE ?? 0;
  }
  return employee.einmaligIstUE?.[target.id] ?? 0;
}

/** Soll − Ist − Lücke je Soll-Posten (rein rechnerisch). */
export function computeTrainingGaps(
  targets: TrainingTarget[],
  employee: Employee,
): TrainingGap[] {
  return targets.map((t) => {
    const soll = t.ue;
    const ist = istForTarget(t, employee);
    const rest = soll === null ? null : Math.max(soll - ist, 0);
    return {
      id: t.id,
      label: t.label,
      clauseId: t.clauseId,
      soll,
      ist,
      rest,
    };
  });
}

/** Heutiges ISO-Datum (lokaler Kalender) für den Default-Stichtag. */
function todayIso(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}

/**
 * Plan-Status eines Eintrags. `referenceDate` (ISO) macht Tests deterministisch
 * (analog Engine-`referenceDate`); ohne Angabe = heute.
 */
export function derivePlanItemStatus(
  item: TrainingPlanItem,
  hasProof: boolean,
  referenceDate?: string,
): PlanItemStatus {
  if (hasProof) return "nachweis-vorhanden";
  if (!item.plannedDate) return "ohne-datum";
  const today = referenceDate ?? todayIso();
  if (item.plannedDate < today) return "ueberfaellig";
  return "geplant";
}

/**
 * Mapping Plan-Status → `WorkingItemStatus` (für die Ampel via
 * `compliance-status.ts`). Nutzt ausschließlich bestehende Stati/`severityOf`-
 * Buckets — KEINE neuen Stati:
 *  - geplant            → "beantragt"   (offen)
 *  - ueberfaellig       → "abgelaufen"  (kritisch)
 *  - nachweis-vorhanden → "vorhanden"   (erfüllt)
 *  - ohne-datum         → "offen"       (offen)
 */
export function planStatusToWorkingItemStatus(
  status: PlanItemStatus,
): WorkingItemStatus {
  switch (status) {
    case "geplant":
      return "beantragt";
    case "ueberfaellig":
      return "abgelaufen";
    case "nachweis-vorhanden":
      return "vorhanden";
    case "ohne-datum":
      return "offen";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

/** Evidence-Slot-Konvention je Plan-Eintrag (bestehende Evidence-Infra). */
export function planEvidenceId(itemId: string): string {
  return `training-plan:${itemId}`;
}

/**
 * Plan-Einträge als `RequirementRow`-Fristen für die Ampel (§6, operativer
 * Merge an der Aufrufstelle — `compliance-status.ts` bleibt unverändert).
 * `hasProof(evidenceId)` liefert, ob ein Nachweis-Slot belegt ist.
 *
 * EC-10: Plan-Beiträge heben den Gesamtzustand höchstens auf „in Arbeit"/„offen"
 * (geplant→beantragt, ohne-datum→offen) bzw. „überfällig"→kritisch; ein Nachweis
 * zählt nur als „vorhanden"/erfüllt — nie „freigegeben".
 */
export function buildPlanDeadlineRows(
  plan: TrainingPlanItem[],
  hasProof: (evidenceId: string) => boolean,
  referenceDate?: string,
): RequirementRow[] {
  return plan.map((item) => {
    const status = derivePlanItemStatus(
      item,
      hasProof(planEvidenceId(item.id)),
      referenceDate,
    );
    return {
      id: `plan-${item.id}`,
      label: `Schulung geplant: ${item.label}`,
      value: item.plannedDate,
      status: planStatusToWorkingItemStatus(status),
      clauseId: item.clauseId,
      trigger:
        item.source === "katalog"
          ? "Geplante Schulung (Lehrbaustein)"
          : "Geplanter Soll-Posten",
    };
  });
}
