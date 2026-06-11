/**
 * Unit-Tests P3a — pure Sammlungs-Model/Validierung.
 *   npx tsx --test lib/document-collection-model.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCollectionInput,
  assertEditable,
  cloneCollectionData,
  isInclusionLevel,
  isCollectionDateSource,
  type CollectionInput,
} from "./document-collection-model";

function baseItem(over = {}) {
  return {
    templateLogicalPath: "roles/sicherheitsmitarbeiter/Stellenbeschreibung.docx",
    label: "Stellenbeschreibung",
    inclusion: "mandatory",
    dateSource: "startDate",
    ...over,
  };
}

test("Whitelists", () => {
  assert.equal(isInclusionLevel("mandatory"), true);
  assert.equal(isInclusionLevel("optional-on"), true);
  assert.equal(isInclusionLevel("optional-off"), true);
  assert.equal(isInclusionLevel("pflicht"), false);
  assert.equal(isCollectionDateSource("startDate"), true);
  assert.equal(isCollectionDateSource("manual"), true);
  assert.equal(isCollectionDateSource("heute"), false);
});

test("normalize: gültiger Input → getrimmt + stabiler sortOrder", () => {
  const input: CollectionInput = {
    name: "  SMA-Standard  ",
    description: "  Basispaket  ",
    items: [baseItem({ label: " A " }), baseItem({ label: "B", inclusion: "optional-on" })],
  };
  const out = normalizeCollectionInput(input);
  assert.equal(out.name, "SMA-Standard");
  assert.equal(out.description, "Basispaket");
  assert.equal(out.items[0].label, "A");
  assert.equal(out.items[0].sortOrder, 0);
  assert.equal(out.items[1].sortOrder, 1);
  assert.equal(out.items[1].inclusion, "optional-on");
});

test("normalize: leere Beschreibung/optionale Felder → null", () => {
  const out = normalizeCollectionInput({
    name: "X",
    items: [baseItem({ templateLogicalPath: "  ", clauseId: "" })],
  });
  assert.equal(out.description, null);
  assert.equal(out.items[0].templateLogicalPath, null);
  assert.equal(out.items[0].clauseId, null);
  assert.equal(out.items[0].templateMissing, false);
});

test("normalize: leerer Name → wirft", () => {
  assert.throws(
    () => normalizeCollectionInput({ name: "   ", items: [] }),
    /Name der Sammlung/,
  );
});

test("normalize: Posten ohne Label → wirft mit Index", () => {
  assert.throws(
    () => normalizeCollectionInput({ name: "X", items: [baseItem({ label: "" })] }),
    /Posten 1: Bezeichnung/,
  );
});

test("normalize: ungültige inclusion/dateSource → wirft", () => {
  assert.throws(
    () =>
      normalizeCollectionInput({ name: "X", items: [baseItem({ inclusion: "pflicht" })] }),
    /ungültige Einstufung/,
  );
  assert.throws(
    () =>
      normalizeCollectionInput({ name: "X", items: [baseItem({ dateSource: "heute" })] }),
    /ungültige Datumsquelle/,
  );
});

test("assertEditable: Seed wirft, Custom nicht", () => {
  assert.throws(() => assertEditable({ isSeed: true }), /schreibgeschützt/);
  assert.doesNotThrow(() => assertEditable({ isSeed: false }));
});

test("cloneCollectionData: (Kopie)-Suffix + Items 1:1", () => {
  const clone = cloneCollectionData({
    name: "Sicherheitsmitarbeiter",
    description: "Seed",
    items: [baseItem(), baseItem({ label: "B" })],
  });
  assert.equal(clone.name, "Sicherheitsmitarbeiter (Kopie)");
  assert.equal(clone.description, "Seed");
  assert.equal(clone.items.length, 2);
  assert.equal(clone.items[0].label, "Stellenbeschreibung");
  // unabhängige Kopie (kein geteilter Referenz-State)
  clone.items[0].label = "geändert";
  assert.notEqual(clone.items[1].label, "geändert");
});
