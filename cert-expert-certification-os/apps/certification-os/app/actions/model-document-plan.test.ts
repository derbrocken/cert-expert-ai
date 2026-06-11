/**
 * Unit-Tests für die Tool-1-Plan-Logik (Document Creator).
 * Lauffähig ohne Browser/S3:
 *   npx tsx --test app/actions/model-document-plan.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildDocId,
  formatFolderName,
  planDocuments,
} from "./model-document-plan";

/** Doc-ID-Formel exakt wie in app/api/standard-models/route.ts (Parität-Referenz). */
function apiRouteDocId(folder: string, fileName: string): string {
  return `${folder}-${fileName.replace(".docx", "")}`;
}

function keyMap(
  pairs: Array<[string, string]>,
): Map<string, string> {
  return new Map(pairs);
}

test("buildDocId ist byte-identisch zur API-Route (sonst greift Excluded-Filter nicht)", () => {
  for (const [folder, file] of [
    ["objekt", "Dienstanweisung.docx"],
    ["a-b", "Datei_mit-Sonderzeichen.docx"],
    ["x", "report.docx_v2.docx"], // erste .docx-Ersetzung, nicht $-Anker
  ] as Array<[string, string]>) {
    assert.equal(buildDocId(folder, file), apiRouteDocId(folder, file));
  }
});

test("formatFolderName: Slug → Anzeigename", () => {
  assert.equal(formatFolderName("objekt-leitung"), "Objekt Leitung");
  assert.equal(formatFolderName("qm_handbuch"), "Qm Handbuch");
});

test("planDocuments: alle Docs eines gewählten Ordners werden geplant", () => {
  const map = keyMap([
    ["standard-models/objekt/A.docx", "k1"],
    ["standard-models/objekt/B.docx", "k2"],
    ["standard-models/anderer/C.docx", "k3"], // nicht gewählt
  ]);
  const plan = planDocuments(map.entries(), ["objekt"], new Set());
  assert.equal(plan.missingFolders.length, 0);
  assert.deepEqual(
    plan.items.map((i) => i.fileName).sort(),
    ["A.docx", "B.docx"],
  );
  assert.equal(plan.items[0].folderName, "Objekt");
  assert.equal(plan.items[0].key === "k1" || plan.items[0].key === "k2", true);
});

test("planDocuments: Excluded-Filter entfernt genau das passende Dokument", () => {
  const map = keyMap([
    ["standard-models/objekt/A.docx", "k1"],
    ["standard-models/objekt/B.docx", "k2"],
  ]);
  const excluded = new Set([buildDocId("objekt", "A.docx")]);
  const plan = planDocuments(map.entries(), ["objekt"], excluded);
  assert.deepEqual(
    plan.items.map((i) => i.fileName),
    ["B.docx"],
  );
});

test("planDocuments: gewählter Ordner ohne .docx → missingFolders (harter Fehler)", () => {
  const map = keyMap([["standard-models/objekt/A.docx", "k1"]]);
  const plan = planDocuments(map.entries(), ["leer"], new Set());
  assert.deepEqual(plan.missingFolders, ["leer"]);
  assert.equal(plan.items.length, 0);
});

test("planDocuments: alles abgewählt → leere items (Action erzeugt dann KEIN leeres ZIP)", () => {
  const map = keyMap([
    ["standard-models/objekt/A.docx", "k1"],
    ["standard-models/objekt/B.docx", "k2"],
  ]);
  const excluded = new Set([
    buildDocId("objekt", "A.docx"),
    buildDocId("objekt", "B.docx"),
  ]);
  const plan = planDocuments(map.entries(), ["objekt"], excluded);
  assert.equal(plan.missingFolders.length, 0); // Ordner existiert
  assert.equal(plan.items.length, 0); // aber nichts zu generieren
});

test("planDocuments: Nicht-.docx in der Map wird ignoriert", () => {
  const map = keyMap([
    ["standard-models/objekt/A.docx", "k1"],
    ["standard-models/objekt/notiz.txt", "k2"],
  ]);
  const plan = planDocuments(map.entries(), ["objekt"], new Set());
  assert.deepEqual(
    plan.items.map((i) => i.fileName),
    ["A.docx"],
  );
});

test("planDocuments: mehrere Ordner, ein fehlender → items + missingFolders gemischt", () => {
  const map = keyMap([
    ["standard-models/objekt/A.docx", "k1"],
    ["standard-models/qm/B.docx", "k2"],
  ]);
  const plan = planDocuments(map.entries(), ["objekt", "leer", "qm"], new Set());
  assert.deepEqual(plan.missingFolders, ["leer"]);
  assert.deepEqual(
    plan.items.map((i) => i.fileName).sort(),
    ["A.docx", "B.docx"],
  );
});
