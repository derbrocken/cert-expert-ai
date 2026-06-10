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
} from "./training-plan";
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

test("derivePlanItemStatus: Nachweis vorhanden gewinnt immer", () => {
  const item = planItem({ plannedDate: "2020-01-01" }); // in der Vergangenheit
  assert.equal(derivePlanItemStatus(item, true, REF), "nachweis-vorhanden");
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

test("planStatusToWorkingItemStatus: alle vier Stati gemappt", () => {
  assert.equal(planStatusToWorkingItemStatus("geplant"), "beantragt");
  assert.equal(planStatusToWorkingItemStatus("ueberfaellig"), "abgelaufen");
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
