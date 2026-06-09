/**
 * Q8 — Auflösungs-Tests für die Generator-Datum-Granularität (Override-Ebenen).
 * Reihenfolge (spezifischer sticht): perDocument (Person+Doc) → perDocType
 * (Doc-Typ) → global → heute. Reines Ausgabedatum, kein Engine-/Norm-Eingriff.
 * Lauffähig ohne Test-Framework via Node-Builtin:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/date.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  documentDateKey,
  documentTypeKey,
  resolveDocDateOverride,
} from "./utils/date";

const EMP = "emp-1";
const DOC = "din1-allgemeine";

test("documentTypeKey ist die docId (cross-person, gleicher Typ)", () => {
  // Gleiches Dokument bei mehreren Personen → derselbe Typ-Schlüssel.
  assert.equal(documentTypeKey(DOC), DOC);
  assert.equal(documentTypeKey("appt-ersthelfer"), "appt-ersthelfer");
  // documentDateKey bleibt person-spezifisch.
  assert.equal(documentDateKey(EMP, DOC), `${EMP}::${DOC}`);
});

test("perDocument (Person+Doc) sticht über perDocType und global", () => {
  const perDocument = { [documentDateKey(EMP, DOC)]: "2026-01-01" };
  const perDocType = { [documentTypeKey(DOC)]: "2026-02-02" };
  const result = resolveDocDateOverride(perDocument, perDocType, EMP, DOC);
  assert.equal(result, "2026-01-01");
});

test("perDocType (Doc-Typ) sticht, wenn kein Person+Doc-Override", () => {
  const perDocument = {};
  const perDocType = { [documentTypeKey(DOC)]: "2026-02-02" };
  const result = resolveDocDateOverride(perDocument, perDocType, EMP, DOC);
  assert.equal(result, "2026-02-02");
});

test("perDocType gilt für ALLE Personen desselben Dokument-Typs", () => {
  const perDocType = { [documentTypeKey(DOC)]: "2026-03-03" };
  // Verschiedene Personen, gleicher Doc-Typ → gleicher Typ-Override.
  assert.equal(
    resolveDocDateOverride({}, perDocType, "emp-A", DOC),
    "2026-03-03",
  );
  assert.equal(
    resolveDocDateOverride({}, perDocType, "emp-B", DOC),
    "2026-03-03",
  );
});

test("keine Ebene gesetzt → undefined (Aufrufer fällt auf global/heute)", () => {
  const result = resolveDocDateOverride({}, {}, EMP, DOC);
  assert.equal(result, undefined);
});

test("leerer Person+Doc-Wert wird übersprungen → perDocType greift", () => {
  // Leere Strings dürfen nicht stechen (Map-Sanitizing hält sie eigentlich raus,
  // hier defensiv geprüft): leerer perDocument-Wert fällt auf perDocType.
  const perDocument = { [documentDateKey(EMP, DOC)]: "" };
  const perDocType = { [documentTypeKey(DOC)]: "2026-04-04" };
  const result = resolveDocDateOverride(perDocument, perDocType, EMP, DOC);
  assert.equal(result, "2026-04-04");
});

test("perDocType eines anderen Typs greift nicht für diesen Doc-Typ", () => {
  const perDocType = { [documentTypeKey("anderer-typ")]: "2026-05-05" };
  const result = resolveDocDateOverride({}, perDocType, EMP, DOC);
  assert.equal(result, undefined);
});
