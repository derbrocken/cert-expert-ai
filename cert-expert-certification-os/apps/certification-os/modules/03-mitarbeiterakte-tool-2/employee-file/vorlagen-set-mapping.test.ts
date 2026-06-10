/**
 * Lane K (Batch-2 B + #7) — Unit-Tests für das Set→Dokument-Mapping, die
 * positionsunabhängigen Overlays (inkl. Mutterschutz CL-77) und das
 * Org-Titel-FK-Gating (#7). Lauffähig ohne Framework:
 *   npx tsx --test modules/03-mitarbeiterakte-tool-2/employee-file/vorlagen-set-mapping.test.ts
 *
 * Norm-Leitplanken: Set-Kategorie = Doku-Steuerung (keine Norm-Pflicht); die
 * einzelnen Dokumente tragen ihre CL aus dem Register; legal-input-Posten
 * (CL-73/CL-75/CL-77) sind „fachlich prüfen". Keine erfundenen Werte, EC-10.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  coreDocsForSetKategorie,
  overlayDocsForEmployee,
  buildSetDocumentPlan,
} from "./vorlagen-set-catalog";
import {
  visibleOrgTitleOptions,
  isOrgTitleGatedOut,
  FK_ONLY_ORG_TITLE_IDS,
} from "./employee-stammdaten-options";

// ── B: Core-Set je Set-Kategorie ─────────────────────────────────────────────

test("B: Sicherheitsmitarbeiter = Basis + Stellenbeschreibung SMA", () => {
  const ids = coreDocsForSetKategorie("sicherheitsmitarbeiter").map((d) => d.id);
  assert.deepEqual(ids, [
    "basis-arbeitsschutz-unterweisung",
    "basis-datenschutz-verschwiegenheit",
    "stellenbeschreibung-sma",
  ]);
});

test("B: Führungskraft = Basis + Stellenbeschreibung FK", () => {
  const ids = coreDocsForSetKategorie("fuehrungskraft").map((d) => d.id);
  // FK bekommt zusätzlich Bildschirmarbeitsplatz (PC-Arbeit, Mark 2026-06-10).
  assert.deepEqual(ids, [
    "basis-arbeitsschutz-unterweisung",
    "basis-datenschutz-verschwiegenheit",
    "buero-bildschirmarbeitsplatz-unterweisung",
    "stellenbeschreibung-fk",
  ]);
});

test("B: Bürokraft = Bildschirmarbeitsplatz + Datenschutz/Verschwiegenheit, KEINE SR-DA", () => {
  const docs = coreDocsForSetKategorie("buerokraft");
  const ids = docs.map((d) => d.id);
  assert.deepEqual(ids, [
    "buero-bildschirmarbeitsplatz-unterweisung",
    "basis-datenschutz-verschwiegenheit",
  ]);
  // Keine sicherheitsrelevante Dienstanweisung / Stellenbeschreibung SMA/FK.
  assert.ok(!ids.includes("stellenbeschreibung-sma"));
  assert.ok(!ids.includes("stellenbeschreibung-fk"));
});

test("B: keine Set-Kategorie → nur allgemeine Basis (jeder MA)", () => {
  const ids = coreDocsForSetKategorie(undefined).map((d) => d.id);
  assert.deepEqual(ids, [
    "basis-arbeitsschutz-unterweisung",
    "basis-datenschutz-verschwiegenheit",
  ]);
});

test("B: Arbeitsschutz/Datenschutz tragen die korrekten CL", () => {
  const docs = coreDocsForSetKategorie("sicherheitsmitarbeiter");
  const arbeitsschutz = docs.find(
    (d) => d.id === "basis-arbeitsschutz-unterweisung",
  );
  const datenschutz = docs.find(
    (d) => d.id === "basis-datenschutz-verschwiegenheit",
  );
  assert.equal(arbeitsschutz?.clauseId, "CL-75");
  // CL-75 jetzt belegt + Vorlage eingespielt → kein fachlichPruefen/templateMissing mehr.
  assert.ok(!arbeitsschutz?.templateMissing);
  assert.equal(datenschutz?.clauseId, "CL-04/CL-05");
});

test("B: Standarddokumente defaulten auf startDate (Arbeitsvertrag)", () => {
  for (const k of [
    "sicherheitsmitarbeiter",
    "fuehrungskraft",
    "buerokraft",
  ] as const) {
    for (const d of coreDocsForSetKategorie(k)) {
      assert.equal(d.dateSource, "startDate", `${k}/${d.id}`);
    }
  }
});

// ── Overlays (positionsunabhängig, bedingt) ──────────────────────────────────

test("Overlay: Bestellungen aus bestelltAls (CL-08/CL-23/CL-74), Reihenfolge stabil", () => {
  const docs = overlayDocsForEmployee({
    bestelltAls: ["sibe", "ersthelfer"],
  });
  const ids = docs.map((d) => d.id);
  // Katalog-Reihenfolge: ersthelfer vor sibe.
  assert.deepEqual(ids, [
    "overlay-bestellung-ersthelfer",
    "overlay-bestellung-sibe",
  ]);
  assert.equal(docs[0].clauseId, "CL-08");
  assert.equal(docs[1].clauseId, "CL-74");
});

test("Overlay (Lane N P1): Bestell-Overlays zeigen auf reale appointments/bestellungen/-Vorlagen", () => {
  const docs = overlayDocsForEmployee({
    bestelltAls: ["ersthelfer", "brandschutzhelfer", "sibe"],
  });
  const byId = Object.fromEntries(docs.map((d) => [d.id, d]));
  assert.equal(
    byId["overlay-bestellung-ersthelfer"].templateLogicalPath,
    "appointments/bestellungen/Bestellungsurkunde_Ersthelfer.docx",
  );
  assert.equal(
    byId["overlay-bestellung-brandschutzhelfer"].templateLogicalPath,
    "appointments/bestellungen/Bestellungsurkunde_Brandschutzhelfer.docx",
  );
  assert.equal(
    byId["overlay-bestellung-sibe"].templateLogicalPath,
    "appointments/bestellungen/Bestellungsurkunde_Sicherheitsbeauftragter.docx",
  );
  // Reale Vorlagen liegen vor → kein templateMissing.
  for (const d of docs) assert.ok(!d.templateMissing, d.id);
});

test("Overlay: Fahrtätigkeit → Kfz-/Fahr-Anweisung (CL-73, fachlich prüfen, Vorlage fehlt)", () => {
  const docs = overlayDocsForEmployee({ drivesServiceVehicle: true });
  const fahr = docs.find((d) => d.id === "overlay-fahranweisung");
  assert.ok(fahr);
  assert.equal(fahr?.clauseId, "CL-73");
  assert.equal(fahr?.fachlichPruefen, true);
  assert.equal(fahr?.templateMissing, true);
  // Ohne Fahrtätigkeit → kein Overlay.
  assert.equal(
    overlayDocsForEmployee({ drivesServiceVehicle: false }).length,
    0,
  );
});

test("Overlay: objektbezogene DA (CL-22) bei Objekt — Datum manuell", () => {
  const docs = overlayDocsForEmployee({ sdlScopes: ["objekt-x"] });
  const obj = docs.find((d) => d.id === "overlay-objektbezogene-da");
  assert.ok(obj);
  assert.equal(obj?.clauseId, "CL-22");
  assert.equal(obj?.dateSource, "manual");
  assert.equal(overlayDocsForEmployee({ sdlScopes: [] }).length, 0);
});

test("Overlay: Mutterschutz (CL-77) NUR für weiblich, alle Sets", () => {
  assert.equal(
    overlayDocsForEmployee({ gender: "weiblich" }).some(
      (d) => d.id === "overlay-mutterschutz-hinweis",
    ),
    true,
  );
  for (const g of ["maennlich", "divers", undefined] as const) {
    assert.equal(
      overlayDocsForEmployee({ gender: g }).some(
        (d) => d.id === "overlay-mutterschutz-hinweis",
      ),
      false,
      `gender=${g} darf kein Mutterschutz-Overlay haben`,
    );
  }
  const m = overlayDocsForEmployee({ gender: "weiblich" })[0];
  assert.equal(m.clauseId, "CL-77");
  assert.equal(m.fachlichPruefen, true);
  assert.equal(m.templateMissing, true);
});

test("Mutterschutz ist set-unabhängig (auch Bürokraft, weiblich)", () => {
  const plan = buildSetDocumentPlan({
    setKategorie: "buerokraft",
    gender: "weiblich",
  });
  assert.ok(plan.some((d) => d.id === "overlay-mutterschutz-hinweis"));
});

test("buildSetDocumentPlan: Core + alle Overlays kombiniert", () => {
  const plan = buildSetDocumentPlan({
    setKategorie: "fuehrungskraft",
    bestelltAls: ["ersthelfer"],
    drivesServiceVehicle: true,
    sdlScopes: ["objekt-1"],
    gender: "weiblich",
  });
  const ids = plan.map((d) => d.id);
  assert.deepEqual(ids, [
    "basis-arbeitsschutz-unterweisung",
    "basis-datenschutz-verschwiegenheit",
    "buero-bildschirmarbeitsplatz-unterweisung",
    "stellenbeschreibung-fk",
    "overlay-bestellung-ersthelfer",
    "overlay-fahranweisung",
    "overlay-objektbezogene-da",
    "overlay-mutterschutz-hinweis",
  ]);
});

// ── #7: Org-Titel FK-Gating ──────────────────────────────────────────────────

test("#7: Schichtleitung/Objektleitung sind FK-Unter-Titel", () => {
  assert.deepEqual([...FK_ONLY_ORG_TITLE_IDS].sort(), [
    "Objektleitung",
    "Schichtleitung",
  ]);
});

test("#7: FK-Unter-Titel nur sichtbar, wenn fk gewählt", () => {
  const withoutFk = visibleOrgTitleOptions(["ek"]).map((o) => o.id);
  assert.ok(!withoutFk.includes("Schichtleitung"));
  assert.ok(!withoutFk.includes("Objektleitung"));
  // andere Titel bleiben sichtbar
  assert.ok(withoutFk.includes("Sicherheitsmitarbeiter"));

  const withFk = visibleOrgTitleOptions(["ek", "fk"]).map((o) => o.id);
  assert.ok(withFk.includes("Schichtleitung"));
  assert.ok(withFk.includes("Objektleitung"));
});

test("#7: leere/undefined Norm-Klasse → keine FK-Unter-Titel", () => {
  assert.ok(
    !visibleOrgTitleOptions(undefined)
      .map((o) => o.id)
      .includes("Schichtleitung"),
  );
  assert.ok(
    !visibleOrgTitleOptions([])
      .map((o) => o.id)
      .includes("Objektleitung"),
  );
});

test("#7: isOrgTitleGatedOut — FK-Titel ohne fk = gated out", () => {
  assert.equal(isOrgTitleGatedOut("Schichtleitung", ["ek"]), true);
  assert.equal(isOrgTitleGatedOut("Schichtleitung", ["fk"]), false);
  // Nicht-FK-Titel sind nie gated.
  assert.equal(isOrgTitleGatedOut("Sicherheitsmitarbeiter", ["ek"]), false);
  assert.equal(isOrgTitleGatedOut(undefined, ["ek"]), false);
});
