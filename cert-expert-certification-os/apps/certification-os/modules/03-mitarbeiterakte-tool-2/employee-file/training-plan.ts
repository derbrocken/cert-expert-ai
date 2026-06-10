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
 * **Manuelles** Ist exakt wie `EmployeeFileTrainingTargets`:
 * `jahres-weiterbildung` → `weiterbildungIstUE`, sonst `einmaligIstUE[id]`.
 */
function manualIstForTarget(target: TrainingTarget, employee: Employee): number {
  if (target.id === "jahres-weiterbildung") {
    return employee.weiterbildungIstUE ?? 0;
  }
  return employee.einmaligIstUE?.[target.id] ?? 0;
}

/**
 * **Effektives** Ist eines Soll-Postens = manuell erfasstes Ist
 * **+ anerkannter UE-Beitrag aus dem `trainingPlan`** (#5, Variante C). So
 * reagiert die Soll/Ist-Ampel auf eine anerkannte Schulung, ohne dass die
 * Engine (liest nur die manuellen Ist-Felder) angefasst wird.
 *  - `jahres-weiterbildung` (CL-11) bekommt die **Summe** aller anerkannten UE
 *    (CL-27-Anrechnung jeder Einmal-/Eigen-Schulung im Erwerbsjahr).
 *  - Ein Einmal-Soll-Posten bekommt zusätzlich die ihm zugeordneten UE.
 * Unbestätigte externe Vorschläge (`unchecked`) tragen NICHT bei (EC-10).
 */
export function effectiveIstForTarget(
  target: TrainingTarget,
  employee: Employee,
  contribution?: RecognizedIstContribution,
): number {
  const manual = manualIstForTarget(target, employee);
  const contrib =
    contribution ?? computeRecognizedIstContribution(employee.trainingPlan ?? []);
  if (target.id === "jahres-weiterbildung") {
    return manual + contrib.weiterbildung;
  }
  return manual + (contrib.einmalig[target.id] ?? 0);
}

/**
 * Soll − Ist − Lücke je Soll-Posten (rein rechnerisch). Das Ist enthält jetzt
 * den **anerkannten** UE-Beitrag aus dem `trainingPlan` (#5), sodass eine
 * anerkannte Schulung die Lücke verkleinert. Engine unberührt.
 */
export function computeTrainingGaps(
  targets: TrainingTarget[],
  employee: Employee,
): TrainingGap[] {
  const contribution = computeRecognizedIstContribution(
    employee.trainingPlan ?? [],
  );
  return targets.map((t) => {
    const soll = t.ue;
    const ist = effectiveIstForTarget(t, employee, contribution);
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

// --- #3 Datum-Default Gruppe 1 (Mark D3) ----------------------------------
//
// Mark D3: „Gruppe 1 = Erst-Standardunterweisungen + -erklärungen" → das
// Default-Datum eines neu erzeugten Plan-/Unterweisungs-Eintrags ist das
// **Einstellungs-/Unterschriftsdatum** (`startDate`), überall + immer
// editierbar (kein gesperrtes Datum). **Einzelschulungen = manuelles Datum**
// (kein Default).
//
// Klassifizierung (rein operativ, KEINE neue Normpflicht, kein Auto-Status):
//  - Engine-Soll-Posten (`source:"soll-posten"`) = Erst-/Standard-Anforderung
//    aus dem abgeleiteten Pflicht-Set → Gruppe 1 → Default = `startDate`.
//  - DIN-1-Katalog-Module (`source:"katalog"`) = einzelne Lehrbaustein-
//    Schulungen → manuelles Datum (kein Default).
// Das gesetzte Datum bleibt in jedem Fall frei überschreibbar (#3).

/**
 * Gehört ein Plan-Eintrag zur „Gruppe 1" (Erst-Standardunterweisungen/
 * -erklärungen, Mark D3)? Nur dann bekommt er das `startDate`-Default.
 * Einzel-/Katalog-Schulungen → `false` (manuelles Datum).
 */
export function isErstStandardGruppe1(item: TrainingPlanItem): boolean {
  return item.source === "soll-posten";
}

/**
 * Default-`plannedDate` für einen **neu erzeugten** Plan-/Unterweisungs-Eintrag
 * (Mark D3). Gruppe-1-Einträge erhalten das Einstellungs-/Unterschriftsdatum
 * (`startDate`); Einzelschulungen bleiben ohne Datum (manuell zu setzen).
 * Liefert `undefined`, wenn kein `startDate` erfasst ist → kein erfundenes Datum.
 * Das Ergebnis ist nur ein **Default**: an jeder Stelle frei überschreibbar.
 */
export function defaultPlannedDateForNewItem(
  item: TrainingPlanItem,
  employee: Pick<Employee, "startDate">,
): string | undefined {
  if (!isErstStandardGruppe1(item)) return undefined;
  const start = employee.startDate;
  return typeof start === "string" && start.length > 0 ? start : undefined;
}

// --- #5 UE-Anerkennung (Variante C) --------------------------------------
//
// Norm-Leitplanken (hart):
//  - UE-Werte nur CL-belegt: Jahres-Weiterbildung CL-11 (40/24), Einmalschulungen
//    CL-20/21/24/25/29/30 — bzw. der im Katalog hinterlegte Eigen-Schulungs-UE.
//    Keine erfundenen UE.
//  - **Anrechnung CL-27:** Eine im Erwerbsjahr anerkannte Einmalschulung wird auf
//    die Jahres-Weiterbildung (§4.19.2 / CL-11) angerechnet. In diesem Tool fließt
//    jeder anerkannte Plan-Eintrag in `weiterbildungIstUE` (CL-11-Bucket); ein
//    `source:"soll-posten"`-Eintrag zusätzlich in `einmaligIstUE[refId]` (sein
//    eigener Soll-Posten). So reagiert die Soll/Ist-Ampel ohne Engine-Eingriff.
//  - **EC-10:** Eigen-Katalog = bekannt → automatisch anerkannt (keine Unterschrift,
//    Schulungsnachweis ≠ Unterweisung). Extern = best-effort extrahierter Vorschlag,
//    der **erst nach fachlicher Bestätigung** (`ueBestaetigt === true`) zählt — sonst
//    `unchecked`/0 Beitrag. Keine Auto-Anerkennung, keine Freigabeaussage.

/**
 * Anrechenbarer UE-Wert eines Plan-Eintrags (Variante C). Liefert nur dann > 0,
 * wenn die UE **anerkannt** ist:
 *  - `ueAnerkennung === "eigen-katalog"` → der bekannte Katalog-/Snapshot-UE
 *    (`item.ue`) zählt sofort (UE bekannt, EC-10-konform, keine Unterschrift).
 *  - `ueAnerkennung === "extern"` → nur wenn `ueBestaetigt === true`; dann zählt
 *    der bestätigte `ueVorschlag` (Heuristik-Treffer). Sonst 0 (`unchecked`).
 * Alles andere → 0 (kein Auto-Ist).
 */
export function recognizedUe(item: TrainingPlanItem): number {
  if (item.ueAnerkennung === "eigen-katalog") {
    return typeof item.ue === "number" && Number.isFinite(item.ue) && item.ue > 0
      ? item.ue
      : 0;
  }
  if (item.ueAnerkennung === "extern" && item.ueBestaetigt === true) {
    return typeof item.ueVorschlag === "number" &&
      Number.isFinite(item.ueVorschlag) &&
      item.ueVorschlag > 0
      ? item.ueVorschlag
      : 0;
  }
  return 0;
}

/** Aufschlüsselung der aus dem Plan **anerkannten** Ist-UE je Bucket. */
export interface RecognizedIstContribution {
  /** Summe aller anerkannten UE → CL-11 Jahres-Weiterbildung (CL-27-Anrechnung). */
  weiterbildung: number;
  /** Anerkannte UE je Einmal-Soll-Posten (`source:"soll-posten"` → `refId`). */
  einmalig: Record<string, number>;
}

/**
 * Summiert die aus dem `trainingPlan` **anerkannten** UE (Variante C) in die
 * beiden Ist-Buckets, die die Engine liest. Reine Berechnung (kein Seiteneffekt,
 * kein Auto-Ist für unbestätigte Externe). CL-27: jeder anerkannte Eintrag zählt
 * für die Jahres-Weiterbildung; Soll-Posten-Einträge zusätzlich für ihren Posten.
 */
export function computeRecognizedIstContribution(
  plan: TrainingPlanItem[],
): RecognizedIstContribution {
  const out: RecognizedIstContribution = { weiterbildung: 0, einmalig: {} };
  for (const item of plan) {
    const ue = recognizedUe(item);
    if (ue <= 0) continue;
    out.weiterbildung += ue;
    if (item.source === "soll-posten" && item.refId.length > 0) {
      out.einmalig[item.refId] = (out.einmalig[item.refId] ?? 0) + ue;
    }
  }
  return out;
}

/**
 * Markiert einen Plan-Eintrag als **eigene Cert-Expert-Schulung** (Variante C):
 * die im Katalog hinterlegte/Snapshot-UE wird automatisch anerkannt (keine
 * Unterschrift). Idempotent; ändert keinen anderen Eintrag.
 */
export function markEigenKatalogAnerkennung(
  item: TrainingPlanItem,
): TrainingPlanItem {
  return {
    ...item,
    ueAnerkennung: "eigen-katalog",
    // Eigen-Katalog ist bekannt → kein Vorschlag/Bestätigungs-Flow nötig.
    ueVorschlag: undefined,
    ueVorschlagQuelle: undefined,
    ueBestaetigt: undefined,
  };
}

/**
 * Hängt einen **externen** UE-Vorschlag an einen Plan-Eintrag (best-effort
 * extrahiert). Bleibt `unchecked` (`ueBestaetigt` wird NICHT gesetzt) →
 * fließt erst nach fachlicher Bestätigung in den Ist-Wert (EC-10).
 */
export function attachExternerUeVorschlag(
  item: TrainingPlanItem,
  vorschlag: number | null,
  quelle?: string,
): TrainingPlanItem {
  return {
    ...item,
    ueAnerkennung: "extern",
    ueVorschlag:
      typeof vorschlag === "number" && vorschlag > 0 ? vorschlag : undefined,
    ueVorschlagQuelle: quelle,
    // Bewusst NICHT bestätigen — bleibt Vorschlag bis zum fachlichen Klick.
    ueBestaetigt: false,
  };
}

/**
 * Setzt die fachliche Bestätigung eines externen UE-Vorschlags (EC-10: bewusster
 * Klick). Nur sinnvoll bei `ueAnerkennung === "extern"`. `confirmed=false` zieht
 * die Anerkennung zurück (Ist-Beitrag wird wieder 0).
 */
export function setUeBestaetigt(
  item: TrainingPlanItem,
  confirmed: boolean,
): TrainingPlanItem {
  return { ...item, ueBestaetigt: confirmed };
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
