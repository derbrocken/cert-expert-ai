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

import type {
  Employee,
  EvidenceChecks,
  TrainingPlanItem,
} from "@/lib/types/employee";
import type { TrainingTarget, WorkingItemStatus } from "./requirement-engine";
import type { RequirementRow } from "./employee-file-requirements";
import {
  findCatalogModule,
  schulungTemplateLogicalPath,
} from "./training-catalog";

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

/**
 * Operativer Status eines geplanten Schulungs-Eintrags.
 *
 * P3 / #7 (Mark D1, EC-10 hart): Ein hochgeladener Nachweis ist eingehend
 * `unchecked`. Er macht den Eintrag NICHT automatisch grün:
 *  - `vorhanden-ungeprueft` = Nachweis liegt vor, aber noch nicht (menschlich)
 *    geprüft → in-Arbeit/gelb (KEIN Auto-Grün).
 *  - `nachweis-vorhanden`   = Nachweis vorhanden UND „geprüft" gesetzt → erfüllt.
 */
export type PlanItemStatus =
  | "geplant"
  | "ueberfaellig"
  | "vorhanden-ungeprueft"
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
 *
 * P3 / #7 (Mark D1, EC-10 hart — **kein Auto-Grün**): `isChecked` = wurde der
 * vorhandene Nachweis von einem Menschen auf „geprüft" gesetzt?
 *  - Nachweis vorhanden + geprüft  → `nachweis-vorhanden` (erfüllt/grün).
 *  - Nachweis vorhanden + ungeprüft → `vorhanden-ungeprueft` (in-Arbeit/gelb).
 *  - kein Nachweis                  → geplant / überfällig / ohne-datum.
 * `isChecked` ist optional und defaultet auf `false` → bestehende Aufrufer ohne
 * Prüf-Verdrahtung bleiben EC-10-konform (Upload allein wird nie grün).
 */
export function derivePlanItemStatus(
  item: TrainingPlanItem,
  hasProof: boolean,
  referenceDate?: string,
  isChecked = false,
): PlanItemStatus {
  if (hasProof) {
    return isChecked ? "nachweis-vorhanden" : "vorhanden-ungeprueft";
  }
  if (!item.plannedDate) return "ohne-datum";
  const today = referenceDate ?? todayIso();
  if (item.plannedDate < today) return "ueberfaellig";
  return "geplant";
}

/**
 * P3 / #7 — ist der Nachweis-Slot `evidenceId` (menschlich) „geprüft"? Tolerant:
 * fehlende Map/fehlender Eintrag/`geprueft !== true` → `false` (ungeprüft).
 * Reine Lese-Hilfe; setzt keinen Status (EC-10).
 */
export function isEvidenceChecked(
  evidenceChecks: EvidenceChecks | undefined,
  evidenceId: string,
): boolean {
  return evidenceChecks?.[evidenceId]?.geprueft === true;
}

/**
 * P3 / #7 — tolerante Read-Normalisierung einer roh persistierten Prüf-Map
 * (`evidenceChecks Json?`). Reine, abhängigkeitsfreie Funktion (für die
 * Repository-Read-Norm + Unit-Tests, Lane-J-Muster). **EC-10:** nur Einträge mit
 * `geprueft === true` werden übernommen (ein fehlender/`false`-Eintrag bleibt
 * ungeprüft — kein Auto-Status). Müll/Legacy/null/`{}` → `undefined`. Idempotent.
 */
export function normalizeEvidenceChecks(
  value: unknown,
): EvidenceChecks | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const out: EvidenceChecks = {};
  for (const [evidenceId, raw] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (!evidenceId || !raw || typeof raw !== "object" || Array.isArray(raw)) {
      continue;
    }
    const r = raw as Record<string, unknown>;
    if (r.geprueft !== true) continue;
    out[evidenceId] = {
      geprueft: true,
      am: typeof r.am === "string" && r.am.length > 0 ? r.am : undefined,
      von: typeof r.von === "string" && r.von.length > 0 ? r.von : undefined,
    };
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Mapping Plan-Status → `WorkingItemStatus` (für die Ampel via
 * `compliance-status.ts`). Nutzt ausschließlich bestehende Stati/`severityOf`-
 * Buckets — KEINE neuen Stati:
 *  - geplant              → "beantragt"   (offen)
 *  - ueberfaellig         → "abgelaufen"  (kritisch)
 *  - vorhanden-ungeprueft → "beantragt"   (offen/gelb — #7: kein Auto-Grün)
 *  - nachweis-vorhanden   → "vorhanden"   (erfüllt — #7: nur nach „geprüft")
 *  - ohne-datum           → "offen"       (offen)
 */
export function planStatusToWorkingItemStatus(
  status: PlanItemStatus,
): WorkingItemStatus {
  switch (status) {
    case "geplant":
      return "beantragt";
    case "ueberfaellig":
      return "abgelaufen";
    case "vorhanden-ungeprueft":
      // #7 (EC-10): vorhanden, aber ungeprüft → in-Arbeit/gelb, NICHT erfüllt.
      return "beantragt";
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
 * Umkehrung von `planEvidenceId`: aus einer `training-plan:{id}`-evidenceId die
 * Plan-Item-Id ziehen. Liefert `null`, wenn die evidenceId nicht der
 * Schulungs-/Plan-Konvention folgt (z. B. Dokument-Slots wie `arbeitsvertrag`).
 */
export function trainingItemIdFromEvidenceId(
  evidenceId: string,
): string | null {
  const prefix = "training-plan:";
  if (!evidenceId.startsWith(prefix)) return null;
  const id = evidenceId.slice(prefix.length).trim();
  return id.length > 0 ? id : null;
}

// --- P4 (b) Tally-Durchführungsdatum → Plan-Eintrag ------------------------
//
// Mark D4 (b): je Schulungsnachweis kommt aus der Tally-Submission ein
// **Durchführungs-/Zertifikatsdatum** mit. Es setzt das `plannedDate` des
// zugeordneten Plan-Eintrags `training-plan:{id}` (gleiche evidenceId wie der
// importierte Nachweis). Leitplanken:
//  - **Kein erfundenes Datum:** kommt kein/ein leeres Datum mit → kein Plan-
//    Eintrag wird angelegt/geändert (No-op).
//  - **EC-10:** der importierte Nachweis bleibt separat `unchecked` (Prüfstatus
//    #7). Das Datum ist nur das Durchführungsdatum, KEINE Freigabe/Anerkennung.
//  - **Kein Auto-Ist:** ein so erzeugter Eintrag trägt KEINE `ueAnerkennung` →
//    `recognizedUe` = 0 (Engine/Ist unberührt).
//  - CL-Snapshot (informativ): Ersthelfer CL-08, Brandschutz CL-23 (bekannte
//    Tally-Schulungs-Slots); sonst `null` (kein erfundener CL).

/** Bekannte CL-Snapshots der Tally-Schulungs-Slots (informativ, kein Norm-Soll). */
const TALLY_TRAINING_CLAUSE: Readonly<Record<string, string>> = {
  "erste-hilfe": "CL-08",
  brandschutz: "CL-23",
};

/** Anzeige-Label-Snapshot für die bekannten Tally-Schulungs-Slots. */
const TALLY_TRAINING_LABEL: Readonly<Record<string, string>> = {
  "erste-hilfe": "Ersthelfer / Erste Hilfe",
  brandschutz: "Brandschutz",
};

/**
 * P4 (b) — setzt das Durchführungs-/Zertifikatsdatum (`date`, ISO) als
 * `plannedDate` des Plan-Eintrags, der zu `evidenceId` (`training-plan:{id}`)
 * gehört. Existiert noch kein passender Eintrag, wird ein minimaler Plan-Eintrag
 * angelegt (operativ, OHNE `ueAnerkennung` → kein Auto-Ist). Reine, seiteneffekt-
 * freie Funktion (idempotent) — testbar + im Tally-Service nutzbar.
 *
 * No-op (Plan unverändert), wenn `date` leer/kein `YYYY-MM-DD` ist oder
 * `evidenceId` nicht der Schulungs-Konvention folgt → **kein erfundenes Datum**.
 */
export function applyTrainingDateFromEvidence(
  plan: TrainingPlanItem[],
  evidenceId: string,
  date: string,
): TrainingPlanItem[] {
  const itemId = trainingItemIdFromEvidenceId(evidenceId);
  if (!itemId) return plan;
  const iso = typeof date === "string" ? date.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return plan;

  const existingIndex = plan.findIndex((p) => p.id === itemId);
  if (existingIndex >= 0) {
    const existing = plan[existingIndex];
    if (existing.plannedDate === iso) return plan; // idempotent
    const next = plan.slice();
    next[existingIndex] = { ...existing, plannedDate: iso };
    return next;
  }

  const newItem: TrainingPlanItem = {
    id: itemId,
    source: "katalog",
    refId: itemId,
    label: TALLY_TRAINING_LABEL[itemId] ?? itemId,
    ue: null,
    clauseId: TALLY_TRAINING_CLAUSE[itemId] ?? null,
    plannedDate: iso,
    // EC-10 / kein Auto-Ist: KEINE ueAnerkennung — der Eintrag trägt nur das
    // Durchführungsdatum, der Nachweis bleibt separat `unchecked` (#7).
  };
  return [...plan, newItem];
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
 *
 * P3 / #7 (Mark D1): `isChecked(evidenceId)` liefert, ob der vorhandene Nachweis
 * (menschlich) auf „geprüft" gesetzt wurde. Default = nie geprüft → ein bloß
 * hochgeladener Nachweis bleibt „vorhanden, ungeprüft" = in-Arbeit/gelb (kein
 * Auto-Grün). Bestehende Aufrufer ohne `isChecked` bleiben EC-10-konform.
 */
export function buildPlanDeadlineRows(
  plan: TrainingPlanItem[],
  hasProof: (evidenceId: string) => boolean,
  referenceDate?: string,
  isChecked: (evidenceId: string) => boolean = () => false,
): RequirementRow[] {
  return plan.map((item) => {
    const evidenceId = planEvidenceId(item.id);
    const status = derivePlanItemStatus(
      item,
      hasProof(evidenceId),
      referenceDate,
      isChecked(evidenceId),
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

// --- Lane S: zugewiesene DIN-1-Schulungen → generierbare Vorlagen -----------
//
// Ziel (Mark 2026-06-10): Für jeden **zugewiesenen** Schulungs-Plan-Eintrag
// (`source:"katalog"`, refId = Katalog-Modul-Id `din1-modul-N`) das zugehörige
// `appointments/schulungen/`-`.docx` mit in den Generator-ZIP nehmen. Reine,
// seiteneffektfreie Auflösung (unit-bar; der Generator macht das S3-Fetch).
//
// Leitplanken:
//  - **Single source:** der Vorlagen-Pfad kommt aus dem Katalog
//    (`schulungTemplateLogicalPath`, Modul-Nummer → Dateiname). Kein erfundener Pfad.
//  - **Datum:** `plannedDate` (Durchführung von) des Plan-Eintrags treibt das
//    Ausgabedatum; fehlt es, fällt der Generator auf seinen Default zurück.
//  - **CL-11 (informativ):** Module = Lehrbausteine; KEIN neues Norm-Soll,
//    kein Auto-Ist. Hier wird nur ein Dokument erzeugt, nichts angerechnet.
//  - **EC-09:** fehlt eine Vorlage in S3, überspringt der Generator den Eintrag
//    (kein ZIP-Bruch). Diese Funktion liefert nur Kandidaten.

/** Ein zugewiesenes Schulungs-Modul, das als Doc generiert werden soll. */
export interface AssignedSchulungDoc {
  /** Plan-Item-Id (stabile UID des Eintrags). */
  itemId: string;
  /** Katalog-Modul-Id (`din1-modul-N`). */
  moduleId: string;
  /** Anzeige-Label (Katalog-Snapshot bzw. Plan-Label). */
  label: string;
  /** Reiner Dateiname der Vorlage (`NN_….docx`) — auch ZIP-Dateiname. */
  fileName: string;
  /** Logischer S3-Pfad (`appointments/schulungen/<file>`) für den Key-Lookup. */
  logicalPath: string;
  /** Durchführung von (`plannedDate`, ISO) bzw. `undefined`. */
  plannedDate?: string;
}

/**
 * Lane S — bestimmt aus dem `trainingPlan` die zugewiesenen DIN-1-Schulungen, die
 * als `.docx` generiert werden sollen. Nur `source:"katalog"`-Einträge, deren
 * `refId` ein bekanntes Katalog-Modul ist (Modul → Dateiname über den Katalog).
 * Unbekannte/foreign Einträge (z. B. Tally-Snapshots `erste-hilfe`) werden
 * übersprungen → kein erfundener Pfad. Reine Funktion (kein S3-Zugriff).
 */
export function resolveAssignedSchulungDocs(
  plan: TrainingPlanItem[] | undefined,
): AssignedSchulungDoc[] {
  if (!Array.isArray(plan) || plan.length === 0) return [];
  const out: AssignedSchulungDoc[] = [];
  for (const item of plan) {
    if (item.source !== "katalog") continue;
    const module = findCatalogModule(item.refId);
    if (!module) continue; // kein erfundener Pfad für Nicht-Katalog-refIds
    const logicalPath = schulungTemplateLogicalPath(module.id);
    if (!logicalPath) continue;
    out.push({
      itemId: item.id,
      moduleId: module.id,
      label: item.label || module.label,
      fileName: module.templateFileName,
      logicalPath,
      plannedDate: item.plannedDate,
    });
  }
  return out;
}
