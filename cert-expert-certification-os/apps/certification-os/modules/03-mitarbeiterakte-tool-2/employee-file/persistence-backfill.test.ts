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

test("A1: persistiertes bestelltAls hat Vorrang vor appointmentIds", () => {
  const emp = baseEmployee({
    bestelltAls: ["sibe"],
    // appointmentIds widersprechen bewusst → persistiertes Feld gewinnt.
    appointmentIds: ["safety-training"],
  });
  assert.deepEqual(getBestelltAls(emp), ["sibe"]);
});

test("A1: fehlendes bestelltAls → Legacy-Backfill aus appointmentIds", () => {
  const emp = baseEmployee({
    appointmentIds: ["fire-safety", "safety-training"],
  });
  // Katalog-Reihenfolge: ersthelfer (safety-training) vor brandschutzhelfer (fire-safety).
  assert.deepEqual(getBestelltAls(emp), ["ersthelfer", "brandschutzhelfer"]);
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
    appointmentIds: ["safety-training"],
  });
  assert.deepEqual(res, []);
});

test("A1: setBestelltAlsPatch hält appointmentIds synchron (Generator-Pfad/EC-09)", () => {
  const emp = baseEmployee({ appointmentIds: ["onboarding"] });
  const patched = setBestelltAlsPatch(emp, ["brandschutzhelfer"]);
  // Nicht-Bestell-appointmentIds bleiben; Bestell-ID wird gesetzt.
  assert.ok(patched.includes("onboarding"));
  assert.ok(patched.includes("fire-safety"));
  assert.ok(!patched.includes("safety-training"));
});

// ── A2: setKategorie ─────────────────────────────────────────────────────────

test("A2: persistiertes setKategorie hat Vorrang (von Rolle entkoppelt)", () => {
  const emp = baseEmployee({
    setKategorie: "fuehrungskraft",
    // roleId würde sicherheitsmitarbeiter ableiten → persistiertes Feld gewinnt.
    roleId: "software-engineer",
  });
  assert.equal(resolveSetKategorie(emp), "fuehrungskraft");
});

test("A2: fehlendes setKategorie → Default aus roleId ableiten (Backfill)", () => {
  const emp = baseEmployee({ roleId: "hr-specialist" });
  assert.equal(resolveSetKategorie(emp), "buerokraft");
});

test("A2: unbekannte roleId ohne setKategorie → undefined", () => {
  const emp = baseEmployee({ roleId: "din-77200-allgemeine" });
  assert.equal(resolveSetKategorie(emp), undefined);
});

test("A2: ungültiges persistiertes setKategorie → Fallback auf roleId-Backfill", () => {
  const emp = baseEmployee({
    // @ts-expect-error — ungültiger Wert simulieren.
    setKategorie: "garbage",
    roleId: "software-engineer",
  });
  assert.equal(resolveSetKategorie(emp), "sicherheitsmitarbeiter");
});
