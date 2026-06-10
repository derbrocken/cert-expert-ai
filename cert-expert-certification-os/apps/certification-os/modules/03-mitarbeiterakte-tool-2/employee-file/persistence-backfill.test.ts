/**
 * Lane J (A1+A2) — Unit-Tests für die Persistenz-Backfill-Logik: `bestelltAls`
 * und `setKategorie` sind echte persistierte Felder; die Read-/Projektions-
 * Helfer bevorzugen das persistierte Feld und leiten sonst tolerant aus den
 * bisherigen Projektionen (`appointmentIds` bzw. `roleId`) ab (Legacy-Backfill).
 * Lauffähig ohne Framework:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/persistence-backfill.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Employee } from "@/lib/types/employee";
import {
  getBestelltAls,
  backfillBestelltAls,
  setBestelltAlsPatch,
  bestellungDocId,
} from "./employee-display-labels";
import { resolveSetKategorie } from "./vorlagen-set-catalog";

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

// ── A1: bestelltAls ──────────────────────────────────────────────────────────

test("A1: persistiertes bestelltAls hat Vorrang vor abgeleiteten Quellen", () => {
  const emp = baseEmployee({
    bestelltAls: ["sibe"],
    // Bestell-Doc-Chip widerspricht bewusst → persistiertes Feld gewinnt.
    selectedAppointmentDocIds: [bestellungDocId("ersthelfer")],
  });
  assert.deepEqual(getBestelltAls(emp), ["sibe"]);
});

test("A1 (Lane N P1): fehlendes bestelltAls → Backfill aus realen Bestell-Doc-Chips", () => {
  const emp = baseEmployee({
    selectedAppointmentDocIds: [
      bestellungDocId("brandschutzhelfer"),
      bestellungDocId("ersthelfer"),
    ],
  });
  // Katalog-Reihenfolge: ersthelfer vor brandschutzhelfer.
  assert.deepEqual(getBestelltAls(emp), ["ersthelfer", "brandschutzhelfer"]);
});

test("A1 (Lane N P1): nicht-existente Legacy-appointmentIds liefern KEINE Bestellung", () => {
  // Diagnose #1: safety-training/fire-safety existierten nie im Bucket.
  const emp = baseEmployee({
    appointmentIds: ["safety-training", "fire-safety"],
  });
  assert.deepEqual(getBestelltAls(emp), []);
});

test("A1: bestelltAls wird in Katalog-Reihenfolge normalisiert + dedupliziert", () => {
  const emp = baseEmployee({
    bestelltAls: ["sibe", "ersthelfer", "ersthelfer"],
  });
  assert.deepEqual(getBestelltAls(emp), ["ersthelfer", "sibe"]);
});

test("A1: unbekannte Werte im persistierten bestelltAls werden verworfen", () => {
  const emp = baseEmployee({
    // @ts-expect-error — Müll-/Legacy-Wert simulieren.
    bestelltAls: ["ersthelfer", "garbage", 42],
  });
  assert.deepEqual(getBestelltAls(emp), ["ersthelfer"]);
});

test("A1: backfillBestelltAls — leeres persistiertes Array bleibt leer (kein Backfill)", () => {
  // Leeres Array = bewusst „nichts bestellt", NICHT „Feld fehlt".
  const res = backfillBestelltAls({
    bestelltAls: [],
    selectedAppointmentDocIds: [bestellungDocId("ersthelfer")],
  });
  assert.deepEqual(res, []);
});

test("A1 (Lane N P1): setBestelltAlsPatch — Ordner + Doc-Chips synchron (Generator/EC-09)", () => {
  const emp = baseEmployee({
    appointmentIds: ["onboarding"],
    selectedAppointmentDocIds: ["onboarding-Welcome"],
  });
  const patch = setBestelltAlsPatch(emp, ["brandschutzhelfer"]);
  // Nicht-Bestell-Termine bleiben; realer Bestellungen-Ordner kommt dazu.
  assert.ok(patch.appointmentIds.includes("onboarding"));
  assert.ok(patch.appointmentIds.includes("bestellungen"));
  // Genau der gewählte Bestell-Doc-Chip; übrige Auswahl bleibt erhalten.
  assert.ok(patch.selectedAppointmentDocIds.includes("onboarding-Welcome"));
  assert.ok(
    patch.selectedAppointmentDocIds.includes(
      bestellungDocId("brandschutzhelfer"),
    ),
  );
  assert.ok(
    !patch.selectedAppointmentDocIds.includes(bestellungDocId("ersthelfer")),
  );
});

test("A1 (Lane N P1): leere Bestell-Auswahl entfernt Ordner + Bestell-Doc-Chips", () => {
  const emp = baseEmployee({
    appointmentIds: ["bestellungen", "onboarding"],
    selectedAppointmentDocIds: [
      bestellungDocId("sibe"),
      "onboarding-Welcome",
    ],
  });
  const patch = setBestelltAlsPatch(emp, []);
  assert.ok(!patch.appointmentIds.includes("bestellungen"));
  assert.ok(patch.appointmentIds.includes("onboarding"));
  assert.ok(!patch.selectedAppointmentDocIds.includes(bestellungDocId("sibe")));
  assert.ok(patch.selectedAppointmentDocIds.includes("onboarding-Welcome"));
});

test("A1 (Lane N P1): bestellungDocId entspricht dem /api/templates-Schema", () => {
  // /api/templates: doc.id = `${folderName}-${fileName ohne .docx}`.
  assert.equal(
    bestellungDocId("ersthelfer"),
    "bestellungen-Bestellungsurkunde_Ersthelfer",
  );
  assert.equal(
    bestellungDocId("sibe"),
    "bestellungen-Bestellungsurkunde_Sicherheitsbeauftragter",
  );
});

// ── A2: setKategorie ─────────────────────────────────────────────────────────

test("A2: persistiertes setKategorie hat Vorrang (von Rolle entkoppelt)", () => {
  const emp = baseEmployee({
    setKategorie: "fuehrungskraft",
    // roleId würde sicherheitsmitarbeiter ableiten → persistiertes Feld gewinnt.
    roleId: "sicherheitsmitarbeiter",
  });
  assert.equal(resolveSetKategorie(emp), "fuehrungskraft");
});

test("A2: fehlendes setKategorie → Default aus roleId ableiten (Backfill)", () => {
  const emp = baseEmployee({ roleId: "buerokraft" });
  assert.equal(resolveSetKategorie(emp), "buerokraft");
});

test("A2: Basis-Rolle ohne setKategorie → undefined (keine eindeutige Set-Zuordnung)", () => {
  const emp = baseEmployee({ roleId: "din-77200-1-allgemeine" });
  assert.equal(resolveSetKategorie(emp), undefined);
});

test("A2: ungültiges persistiertes setKategorie → Fallback auf roleId-Backfill", () => {
  const emp = baseEmployee({
    // @ts-expect-error — ungültiger Wert simulieren.
    setKategorie: "garbage",
    roleId: "sicherheitsmitarbeiter",
  });
  assert.equal(resolveSetKategorie(emp), "sicherheitsmitarbeiter");
});
