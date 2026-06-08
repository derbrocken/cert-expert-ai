import type { WorkingItemStatus } from "./requirement-engine";

/**
 * Slice 4 — rechnerischer Pflicht-Status (Ampel).
 *
 * EC-10 (hart): Dies ist ein **rechnerischer Arbeitsstand** aus den erfassten
 * Angaben — KEINE Freigabe-/Auditfähigkeits-/Zertifizierungsaussage. Eingehende
 * Nachweise gelten als ungeprüft (`unchecked`). „rechnerisch vollständig" ≠
 * „auditfähig/freigegeben/einsatzbereit". Es wird KEINE neue Normpflicht
 * abgeleitet — nur die bestehenden Engine-Stati werden aggregiert.
 */

/** Severität eines Einzelpostens für die Aggregation. */
export type ItemSeverity = "kritisch" | "offen" | "erfuellt" | "neutral";

/** Aggregierter rechnerischer Gesamtzustand (NIE „freigegeben"). */
export type ComputedOverall =
  | "kein-pflichtset"
  | "offen"
  | "in-arbeit"
  | "rechnerisch-vollstaendig";

export interface ComplianceItem {
  status: WorkingItemStatus;
}

export interface ComplianceDeadline {
  label: string;
  status: WorkingItemStatus;
  /** ISO-Datum (YYYY-MM-DD), falls berechenbar. */
  dueDate?: string;
}

export interface NextDeadline {
  label: string;
  dueDate?: string;
  overdue: boolean;
}

export interface ComplianceStatusSummary {
  overall: ComputedOverall;
  counts: {
    kritisch: number;
    offen: number;
    erfuellt: number;
    neutral: number;
    /** kritisch + offen + erfuellt (ohne „nicht erforderlich"). */
    relevant: number;
  };
  nextDeadline?: NextDeadline;
}

/** Einzel-Status → Severität. */
export function severityOf(status: WorkingItemStatus): ItemSeverity {
  switch (status) {
    case "abgelaufen":
    case "fehlt":
    case "nicht lesbar":
      return "kritisch";
    case "offen":
    case "unvollständig":
    case "beantragt":
    case "fachlich prüfen":
    case "vorbereitet":
      return "offen";
    case "vorhanden":
      return "erfuellt";
    case "nicht erforderlich":
      return "neutral";
    default: {
      // Erschöpfungsprüfung — neue Stati müssen hier zugeordnet werden.
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

const DEADLINE_NEEDS_ACTION: ReadonlySet<WorkingItemStatus> = new Set([
  "abgelaufen",
  "beantragt",
  "offen",
  "unvollständig",
  "fehlt",
]);

/**
 * Aggregiert Pflicht-Set + Fristen (bereits Engine-abgeleitet, clauseId-belegt)
 * zu einem rechnerischen Status. Reine Funktion, keine Norm-Logik.
 */
export function computeComplianceStatus(
  pflichtSet: ComplianceItem[],
  fristen: ComplianceDeadline[] = [],
): ComplianceStatusSummary {
  const counts = { kritisch: 0, offen: 0, erfuellt: 0, neutral: 0, relevant: 0 };

  for (const item of pflichtSet) {
    const sev = severityOf(item.status);
    counts[sev] += 1;
  }
  // Fristen zählen in dieselben Severitäts-Buckets ein (abgelaufen = kritisch).
  for (const frist of fristen) {
    const sev = severityOf(frist.status);
    counts[sev] += 1;
  }
  counts.relevant = counts.kritisch + counts.offen + counts.erfuellt;

  let overall: ComputedOverall;
  if (counts.relevant === 0) {
    overall = "kein-pflichtset";
  } else if (counts.kritisch > 0) {
    overall = "offen";
  } else if (counts.offen > 0) {
    overall = "in-arbeit";
  } else {
    overall = "rechnerisch-vollstaendig";
  }

  const nextDeadline = pickNextDeadline(fristen);

  return { overall, counts, nextDeadline };
}

/** Früheste handlungsbedürftige Frist (überfällig priorisiert). */
function pickNextDeadline(
  fristen: ComplianceDeadline[],
): NextDeadline | undefined {
  const actionable = fristen.filter((f) => DEADLINE_NEEDS_ACTION.has(f.status));
  if (actionable.length === 0) return undefined;

  // Überfällige zuerst; dann nach frühestem dueDate; Einträge ohne Datum ans Ende.
  const sorted = [...actionable].sort((a, b) => {
    const aOver = a.status === "abgelaufen" ? 0 : 1;
    const bOver = b.status === "abgelaufen" ? 0 : 1;
    if (aOver !== bOver) return aOver - bOver;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const top = sorted[0]!;
  return {
    label: top.label,
    dueDate: top.dueDate,
    overdue: top.status === "abgelaufen",
  };
}

/** UI-Label + neutrale Beschreibung für den Gesamtzustand (EC-10-konform). */
export function overallLabel(overall: ComputedOverall): {
  label: string;
  tone: "red" | "amber" | "green" | "neutral";
} {
  switch (overall) {
    case "offen":
      return { label: "Offen — kritische Posten", tone: "red" };
    case "in-arbeit":
      return { label: "In Arbeit — unvollständig", tone: "amber" };
    case "rechnerisch-vollstaendig":
      return { label: "Rechnerisch vollständig (ungeprüft)", tone: "green" };
    case "kein-pflichtset":
    default:
      return { label: "Kein Pflicht-Set ableitbar", tone: "neutral" };
  }
}
