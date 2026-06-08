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
} from "./training-plan";

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
