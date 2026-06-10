/**
 * Unit-Tests für die Queue-C Gap-Logik + Plan-Status (`training-plan.ts`).
 * Lauffähig ohne Test-Framework via Node-Builtin:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/training-plan.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Employee, TrainingPlanItem } from "@/lib/types/employee";
import type { TrainingTarget } from "./requirement-engine";
import {
  computeTrainingGaps,
  derivePlanItemStatus,
  planStatusToWorkingItemStatus,
  planEvidenceId,
  recognizedUe,
  computeRecognizedIstContribution,
  effectiveIstForTarget,
  markEigenKatalogAnerkennung,
  attachExternerUeVorschlag,
  setUeBestaetigt,
  isErstStandardGruppe1,
  defaultPlannedDateForNewItem,
  isEvidenceChecked,
  buildPlanDeadlineRows,
  normalizeEvidenceChecks,
  trainingItemIdFromEvidenceId,
  applyTrainingDateFromEvidence,
} from "./training-plan";
import { severityOf } from "./compliance-status";
import { extractUeFromText } from "./training-catalog";

const REF = "2026-06-08";

function baseEmployee(partial: Partial<Employee> = {}): Employee {
  return {
    id: "emp-1",
    fullName: "Test Person",
    birthday: "",
    startDate: "",
    roleId: "",
    appointmentIds: [],
    selectedRoleDocIds: [],
    selectedAppointmentDocIds: [],
    ...partial,
  };
}

function target(partial: Partial<TrainingTarget>): TrainingTarget {
  return {
    id: "jahres-weiterbildung",
    label: "Jahres-Weiterbildung",
    clauseId: "CL-11",
    ue: 40,
    period: "jaehrlich",
    trigger: "Bewachung",
    status: "offen",
    ...partial,
  };
}

function planItem(partial: Partial<TrainingPlanItem>): TrainingPlanItem {
  return {
    id: "tp-1",
    source: "katalog",
    refId: "din1-modul-1",
    label: "Dokumentation/Wachbuch/Meldewesen",
    ue: 4,
    clauseId: "CL-11",
    ...partial,
  };
}

// --- Gap-Rechnung ---------------------------------------------------------

test("computeTrainingGaps: Jahres-Weiterbildung Soll−Ist=Rest", () => {
  const employee = baseEmployee({ weiterbildungIstUE: 30 });
  const gaps = computeTrainingGaps([target({ ue: 40 })], employee);
  assert.equal(gaps.length, 1);
  assert.equal(gaps[0]!.soll, 40);
  assert.equal(gaps[0]!.ist, 30);
  assert.equal(gaps[0]!.rest, 10);
});

test("computeTrainingGaps: Rest nie negativ (Ist > Soll → 0)", () => {
  const employee = baseEmployee({ weiterbildungIstUE: 50 });
  const gaps = computeTrainingGaps([target({ ue: 40 })], employee);
  assert.equal(gaps[0]!.rest, 0);
});

test("computeTrainingGaps: Ist fehlt → 0, Rest = Soll", () => {
  const gaps = computeTrainingGaps([target({ ue: 40 })], baseEmployee());
  assert.equal(gaps[0]!.ist, 0);
  assert.equal(gaps[0]!.rest, 40);
});

test("computeTrainingGaps: einmaliger Posten zieht Ist aus einmaligIstUE[id]", () => {
  const employee = baseEmployee({ einmaligIstUE: { "sdl-asyl-base": 25 } });
  const gaps = computeTrainingGaps(
    [target({ id: "sdl-asyl-base", ue: 40, period: "einmalig" })],
    employee,
  );
  assert.equal(gaps[0]!.ist, 25);
  assert.equal(gaps[0]!.rest, 15);
});

test("computeTrainingGaps: soll===null → rest===null (fachlich prüfen)", () => {
  const gaps = computeTrainingGaps(
    [target({ id: "oepv", ue: null })],
    baseEmployee(),
  );
  assert.equal(gaps[0]!.soll, null);
  assert.equal(gaps[0]!.rest, null);
});

// --- Plan-Status (deterministisch via referenceDate) ----------------------

test("#7 derivePlanItemStatus: Nachweis vorhanden + UNGEPRÜFT → vorhanden-ungeprueft (kein Auto-Grün)", () => {
  const item = planItem({ plannedDate: "2020-01-01" }); // in der Vergangenheit
  // EC-10: Default isChecked=false → bloßer Upload macht nicht grün.
  assert.equal(derivePlanItemStatus(item, true, REF), "vorhanden-ungeprueft");
  assert.equal(
    derivePlanItemStatus(item, true, REF, false),
    "vorhanden-ungeprueft",
  );
});

test("#7 derivePlanItemStatus: Nachweis vorhanden + GEPRÜFT → nachweis-vorhanden (erfüllt)", () => {
  const item = planItem({ plannedDate: "2020-01-01" });
  assert.equal(
    derivePlanItemStatus(item, true, REF, true),
    "nachweis-vorhanden",
  );
});

test("#7 derivePlanItemStatus: kein Nachweis → geprüft-Flag irrelevant (überfällig)", () => {
  const item = planItem({ plannedDate: "2026-06-07" });
  // Ohne Datei darf isChecked nichts ändern (kein Nachweis = nichts zu prüfen).
  assert.equal(derivePlanItemStatus(item, false, REF, true), "ueberfaellig");
});

test("derivePlanItemStatus: kein Datum → ohne-datum", () => {
  const item = planItem({ plannedDate: undefined });
  assert.equal(derivePlanItemStatus(item, false, REF), "ohne-datum");
});

test("derivePlanItemStatus: Datum in der Vergangenheit, kein Nachweis → ueberfaellig", () => {
  const item = planItem({ plannedDate: "2026-06-07" });
  assert.equal(derivePlanItemStatus(item, false, REF), "ueberfaellig");
});

test("derivePlanItemStatus: Datum in der Zukunft → geplant", () => {
  const item = planItem({ plannedDate: "2026-12-31" });
  assert.equal(derivePlanItemStatus(item, false, REF), "geplant");
});

test("derivePlanItemStatus: Datum == heute → geplant (nicht überfällig)", () => {
  const item = planItem({ plannedDate: REF });
  assert.equal(derivePlanItemStatus(item, false, REF), "geplant");
});

// --- Status → WorkingItemStatus-Mapping -----------------------------------

test("planStatusToWorkingItemStatus: alle Stati gemappt (#7: ungeprüft = gelb/offen, geprüft = erfüllt)", () => {
  assert.equal(planStatusToWorkingItemStatus("geplant"), "beantragt");
  assert.equal(planStatusToWorkingItemStatus("ueberfaellig"), "abgelaufen");
  // #7: vorhanden, aber ungeprüft → in-Arbeit/gelb (beantragt = severity „offen"),
  // NICHT „vorhanden"/erfüllt → kein Auto-Grün.
  assert.equal(
    planStatusToWorkingItemStatus("vorhanden-ungeprueft"),
    "beantragt",
  );
  assert.equal(
    planStatusToWorkingItemStatus("nachweis-vorhanden"),
    "vorhanden",
  );
  assert.equal(planStatusToWorkingItemStatus("ohne-datum"), "offen");
});

// --- Evidence-Slot-Konvention ---------------------------------------------

test("planEvidenceId: Konvention training-plan:{id}", () => {
  assert.equal(planEvidenceId("tp-42"), "training-plan:tp-42");
});

// --- #5 UE-Anerkennung (Variante C) ---------------------------------------

test("#5 recognizedUe: eigen-katalog → Katalog-UE zählt sofort (keine Unterschrift)", () => {
  const item = markEigenKatalogAnerkennung(planItem({ ue: 4 }));
  assert.equal(item.ueAnerkennung, "eigen-katalog");
  assert.equal(recognizedUe(item), 4);
});

test("#5 recognizedUe: extern OHNE Bestätigung → 0 (unchecked, EC-10)", () => {
  const item = attachExternerUeVorschlag(
    planItem({ ue: null }),
    16,
    "Nachweis_16UE.pdf",
  );
  assert.equal(item.ueAnerkennung, "extern");
  assert.equal(item.ueVorschlag, 16);
  assert.equal(item.ueBestaetigt, false);
  assert.equal(recognizedUe(item), 0); // Vorschlag zählt NICHT vor Bestätigung
});

test("#5 recognizedUe: extern MIT fachlicher Bestätigung → Vorschlag zählt", () => {
  const proposed = attachExternerUeVorschlag(planItem({ ue: null }), 16, "x.pdf");
  const confirmed = setUeBestaetigt(proposed, true);
  assert.equal(recognizedUe(confirmed), 16);
});

test("#5 recognizedUe: Bestätigung zurückgenommen → wieder 0", () => {
  const proposed = attachExternerUeVorschlag(planItem({ ue: null }), 16, "x.pdf");
  const back = setUeBestaetigt(setUeBestaetigt(proposed, true), false);
  assert.equal(recognizedUe(back), 0);
});

test("#5 recognizedUe: ohne Anerkennung (Default) → 0 (kein Auto-Ist)", () => {
  assert.equal(recognizedUe(planItem({ ue: 4 })), 0);
});

test("#5 CL-27: eigen-katalog fließt in die Jahres-Weiterbildung (weiterbildung-Bucket)", () => {
  const plan = [markEigenKatalogAnerkennung(planItem({ id: "tp-1", ue: 4 }))];
  const contrib = computeRecognizedIstContribution(plan);
  assert.equal(contrib.weiterbildung, 4);
  assert.deepEqual(contrib.einmalig, {});
});

test("#5 CL-27: soll-posten-Anerkennung zählt für Posten UND Jahres-Weiterbildung", () => {
  const plan = [
    markEigenKatalogAnerkennung(
      planItem({
        id: "tp-2",
        source: "soll-posten",
        refId: "sdl-asyl-base",
        ue: 40,
      }),
    ),
  ];
  const contrib = computeRecognizedIstContribution(plan);
  assert.equal(contrib.weiterbildung, 40); // CL-27-Anrechnung auf §4.19.2
  assert.equal(contrib.einmalig["sdl-asyl-base"], 40); // eigener Einmal-Posten
});

test("#5 effectiveIstForTarget: manuelles Ist + anerkannter Plan-Beitrag", () => {
  const employee = baseEmployee({
    weiterbildungIstUE: 10,
    trainingPlan: [
      markEigenKatalogAnerkennung(planItem({ id: "tp-1", ue: 4 })),
      markEigenKatalogAnerkennung(planItem({ id: "tp-2", ue: 4 })),
    ],
  });
  const ist = effectiveIstForTarget(target({ ue: 40 }), employee);
  assert.equal(ist, 18); // 10 manuell + 4 + 4 anerkannt
});

test("#5 computeTrainingGaps: anerkannte Schulung verkleinert die Lücke", () => {
  const employee = baseEmployee({
    weiterbildungIstUE: 30,
    trainingPlan: [markEigenKatalogAnerkennung(planItem({ id: "tp-1", ue: 4 }))],
  });
  const gaps = computeTrainingGaps([target({ ue: 40 })], employee);
  assert.equal(gaps[0]!.ist, 34); // 30 + 4 anerkannt
  assert.equal(gaps[0]!.rest, 6);
});

test("#5 computeTrainingGaps: unbestätigter externer Vorschlag verkleinert die Lücke NICHT (EC-10)", () => {
  const employee = baseEmployee({
    weiterbildungIstUE: 30,
    trainingPlan: [
      attachExternerUeVorschlag(planItem({ id: "tp-1", ue: null }), 16, "x.pdf"),
    ],
  });
  const gaps = computeTrainingGaps([target({ ue: 40 })], employee);
  assert.equal(gaps[0]!.ist, 30); // Vorschlag zählt nicht
  assert.equal(gaps[0]!.rest, 10);
});

// --- #5 Best-Effort-Extraktion (Heuristik, Vorschlag) ---------------------

test("#5 extractUeFromText: '40 UE' erkannt", () => {
  assert.equal(extractUeFromText("Weiterbildung 40 UE absolviert"), 40);
});

test("#5 extractUeFromText: 'Unterrichtseinheiten' erkannt", () => {
  assert.equal(extractUeFromText("24 Unterrichtseinheiten"), 24);
});

test("#5 extractUeFromText: mehrere Treffer → größter plausibler Wert", () => {
  assert.equal(extractUeFromText("Modul 4 UE, gesamt 16 UE"), 16);
});

test("#5 extractUeFromText: kein Muster → null (kein Auto-Ist)", () => {
  assert.equal(extractUeFromText("Teilnahmebescheinigung.pdf"), null);
  assert.equal(extractUeFromText(""), null);
  assert.equal(extractUeFromText(undefined), null);
});

// --- #3 Datum-Default Gruppe 1 (Mark D3) ----------------------------------

test("#3 isErstStandardGruppe1: Soll-Posten = Gruppe 1", () => {
  assert.equal(
    isErstStandardGruppe1(planItem({ source: "soll-posten" })),
    true,
  );
});

test("#3 isErstStandardGruppe1: Katalog-Modul (Einzelschulung) = NICHT Gruppe 1", () => {
  assert.equal(isErstStandardGruppe1(planItem({ source: "katalog" })), false);
});

test("#3 defaultPlannedDateForNewItem: Gruppe-1-Posten → Default = startDate", () => {
  const employee = baseEmployee({ startDate: "2026-03-01" });
  const item = planItem({ source: "soll-posten" });
  assert.equal(defaultPlannedDateForNewItem(item, employee), "2026-03-01");
});

test("#3 defaultPlannedDateForNewItem: Einzelschulung (Katalog) → kein Default (manuell)", () => {
  const employee = baseEmployee({ startDate: "2026-03-01" });
  const item = planItem({ source: "katalog" });
  assert.equal(defaultPlannedDateForNewItem(item, employee), undefined);
});

test("#3 defaultPlannedDateForNewItem: Gruppe 1 ohne startDate → undefined (kein erfundenes Datum)", () => {
  const employee = baseEmployee({ startDate: "" });
  const item = planItem({ source: "soll-posten" });
  assert.equal(defaultPlannedDateForNewItem(item, employee), undefined);
});

test("#3 defaultPlannedDateForNewItem: Default ist nur Default — bleibt überschreibbar", () => {
  // Der Default verändert ein bereits gesetztes plannedDate NICHT; die Funktion
  // liefert nur den Vorschlag für einen NEU erzeugten Eintrag.
  const employee = baseEmployee({ startDate: "2026-03-01" });
  const withOwnDate = planItem({
    source: "soll-posten",
    plannedDate: "2026-09-09",
  });
  // Aufrufer setzt den Default nur, wenn noch kein Datum vorliegt; die Helper-
  // Funktion selbst kennt den aktuellen plannedDate nicht und schlägt startDate
  // vor — die Überschreibbarkeit liegt beim editierbaren Datum-Feld.
  assert.equal(
    defaultPlannedDateForNewItem(withOwnDate, employee),
    "2026-03-01",
  );
});

// --- #7 Prüf-/„geschlossen"-Status (Mark D1, EC-10: kein Auto-Grün) --------

test("#7 isEvidenceChecked: fehlende Map / fehlender Eintrag → false (ungeprüft)", () => {
  assert.equal(isEvidenceChecked(undefined, "training-plan:tp-1"), false);
  assert.equal(isEvidenceChecked({}, "training-plan:tp-1"), false);
});

test("#7 isEvidenceChecked: geprueft:true → true; geprueft:false → false", () => {
  const checks = {
    "training-plan:tp-1": { geprueft: true, am: "2026-06-10", von: "Admin" },
    "training-plan:tp-2": { geprueft: false },
  };
  assert.equal(isEvidenceChecked(checks, "training-plan:tp-1"), true);
  assert.equal(isEvidenceChecked(checks, "training-plan:tp-2"), false);
  assert.equal(isEvidenceChecked(checks, "training-plan:tp-9"), false);
});

test("#7 buildPlanDeadlineRows: Nachweis vorhanden + ungeprüft → in-Arbeit/gelb (severity offen)", () => {
  const item = planItem({ id: "tp-1", plannedDate: "2026-12-31" });
  const rows = buildPlanDeadlineRows(
    [item],
    () => true, // Nachweis vorhanden
    REF,
    () => false, // aber ungeprüft (EC-10)
  );
  assert.equal(rows.length, 1);
  // beantragt → severity „offen" (in-Arbeit/gelb), NICHT „erfuellt".
  assert.equal(rows[0]!.status, "beantragt");
  assert.equal(severityOf(rows[0]!.status), "offen");
});

test("#7 buildPlanDeadlineRows: Nachweis vorhanden + geprüft → erfüllt/grün (severity erfuellt)", () => {
  const item = planItem({ id: "tp-1", plannedDate: "2026-12-31" });
  const rows = buildPlanDeadlineRows(
    [item],
    () => true, // Nachweis vorhanden
    REF,
    (evidenceId) => evidenceId === planEvidenceId("tp-1"), // geprüft
  );
  assert.equal(rows[0]!.status, "vorhanden");
  assert.equal(severityOf(rows[0]!.status), "erfuellt");
});

test("#7 buildPlanDeadlineRows: Default ohne isChecked-Predicate bleibt EC-10-konform (kein Auto-Grün)", () => {
  const item = planItem({ id: "tp-1", plannedDate: "2026-12-31" });
  // Aufrufer ohne Prüf-Verdrahtung → vorhandener Nachweis NICHT automatisch grün.
  const rows = buildPlanDeadlineRows([item], () => true, REF);
  assert.equal(rows[0]!.status, "beantragt");
  assert.notEqual(severityOf(rows[0]!.status), "erfuellt");
});

// --- #7 Read-Normalisierung / Backfill (Repository-Lese-Logik) ------------

test("#7 normalizeEvidenceChecks: Backfill — fehlend/null/Array/{} → undefined (ungeprüft)", () => {
  assert.equal(normalizeEvidenceChecks(undefined), undefined);
  assert.equal(normalizeEvidenceChecks(null), undefined);
  assert.equal(normalizeEvidenceChecks([]), undefined);
  assert.equal(normalizeEvidenceChecks({}), undefined);
});

test("#7 normalizeEvidenceChecks: nur geprueft===true wird übernommen (EC-10)", () => {
  const raw = {
    "training-plan:tp-1": { geprueft: true, am: "2026-06-10", von: "Admin" },
    "training-plan:tp-2": { geprueft: false },
    "training-plan:tp-3": { am: "2026-06-10" }, // kein geprueft → verworfen
    "training-plan:tp-4": "müll", // kein Objekt → verworfen
  };
  const out = normalizeEvidenceChecks(raw);
  assert.deepEqual(out, {
    "training-plan:tp-1": { geprueft: true, am: "2026-06-10", von: "Admin" },
  });
});

test("#7 normalizeEvidenceChecks: tolerante am/von (nur Strings) + Idempotenz", () => {
  const raw = { "u34a": { geprueft: true, am: 123, von: "" } };
  const out = normalizeEvidenceChecks(raw);
  assert.deepEqual(out, { u34a: { geprueft: true, am: undefined, von: undefined } });
  // Idempotent: erneutes Normalisieren ändert nichts.
  assert.deepEqual(normalizeEvidenceChecks(out), {
    u34a: { geprueft: true, am: undefined, von: undefined },
  });
});

// --- P4 (b) Tally-Durchführungsdatum → Plan-Eintrag -----------------------

test("P4 trainingItemIdFromEvidenceId: training-plan:{id} → id, sonst null", () => {
  assert.equal(trainingItemIdFromEvidenceId("training-plan:erste-hilfe"), "erste-hilfe");
  assert.equal(trainingItemIdFromEvidenceId("arbeitsvertrag"), null);
  assert.equal(trainingItemIdFromEvidenceId("training-plan:"), null);
});

test("P4 (b) Tally-Datum übernommen: neuer Plan-Eintrag mit plannedDate + stabiler Id", () => {
  const next = applyTrainingDateFromEvidence([], "training-plan:erste-hilfe", "2026-05-20");
  assert.equal(next.length, 1);
  const item = next[0]!;
  assert.equal(item.id, "erste-hilfe");
  assert.equal(item.plannedDate, "2026-05-20");
  assert.equal(item.clauseId, "CL-08");
  // EC-10 / kein Auto-Ist: keine UE-Anerkennung → recognizedUe = 0.
  assert.equal(item.ueAnerkennung, undefined);
  assert.equal(recognizedUe(item), 0);
});

test("P4 (b) Tally-Datum übernommen: bestehender Eintrag bekommt plannedDate (Id-Match)", () => {
  const plan = [planItem({ id: "brandschutz", refId: "brandschutz", plannedDate: undefined })];
  const next = applyTrainingDateFromEvidence(plan, "training-plan:brandschutz", "2026-04-01");
  assert.equal(next.length, 1);
  assert.equal(next[0]!.plannedDate, "2026-04-01");
  // Andere Felder unberührt (nur plannedDate gesetzt).
  assert.equal(next[0]!.label, "Dokumentation/Wachbuch/Meldewesen");
});

test("P4 (b) fehlend → leer: kein/leeres/ungültiges Datum = No-op (kein erfundenes Datum)", () => {
  const plan = [planItem({ id: "erste-hilfe", refId: "erste-hilfe" })];
  assert.deepEqual(applyTrainingDateFromEvidence(plan, "training-plan:erste-hilfe", ""), plan);
  assert.deepEqual(applyTrainingDateFromEvidence(plan, "training-plan:erste-hilfe", "  "), plan);
  assert.deepEqual(applyTrainingDateFromEvidence(plan, "training-plan:erste-hilfe", "20.05.2026"), plan);
  // Leerer Plan + kein Datum → bleibt leer (kein Eintrag erfunden).
  assert.deepEqual(applyTrainingDateFromEvidence([], "training-plan:erste-hilfe", ""), []);
});

test("P4 (b) Nicht-Schulungs-evidenceId → No-op (Dokument-Slot ohne Plan-Datum)", () => {
  const plan = [planItem({ id: "x" })];
  assert.deepEqual(applyTrainingDateFromEvidence(plan, "arbeitsvertrag", "2026-05-20"), plan);
});

test("P4 (b) idempotent: gleiches Datum erneut anwenden ändert nichts (Referenz stabil)", () => {
  const once = applyTrainingDateFromEvidence([], "training-plan:erste-hilfe", "2026-05-20");
  const twice = applyTrainingDateFromEvidence(once, "training-plan:erste-hilfe", "2026-05-20");
  assert.equal(twice, once); // identische Referenz (No-op-Pfad)
});
